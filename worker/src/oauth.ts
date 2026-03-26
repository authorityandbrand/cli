/**
 * OAuth2 helpers for Google Workspace authentication.
 *
 * Handles the Authorization Code flow:
 *   1. /auth/login  → redirect user to Google consent screen
 *   2. /auth/callback → exchange code for tokens, store in KV
 *   3. Token refresh  → transparently refresh expired access tokens
 */

export interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_at: number; // epoch ms
  scope: string;
}

export interface OAuthEnv {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  OAUTH_SCOPES: string;
  TOKEN_STORE: KVNamespace;
}

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

/** Build the Google OAuth authorization URL. */
export function buildAuthUrl(env: OAuthEnv, redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: env.OAUTH_SCOPES,
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

/** Exchange an authorization code for access + refresh tokens. */
export async function exchangeCode(
  env: OAuthEnv,
  code: string,
  redirectUri: string,
): Promise<TokenData> {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Token exchange failed (${response.status}): ${err}`);
  }

  const data: any = await response.json();
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
    scope: data.scope,
  };
}

/** Refresh an expired access token using the refresh token. */
export async function refreshAccessToken(
  env: OAuthEnv,
  refreshToken: string,
): Promise<{ access_token: string; expires_at: number }> {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Token refresh failed (${response.status}): ${err}`);
  }

  const data: any = await response.json();
  return {
    access_token: data.access_token,
    expires_at: Date.now() + data.expires_in * 1000,
  };
}

/** KV key for a user's token data. */
function tokenKey(userId: string): string {
  return `tokens:${userId}`;
}

/** Store tokens in KV. */
export async function storeTokens(
  kv: KVNamespace,
  userId: string,
  tokens: TokenData,
): Promise<void> {
  await kv.put(tokenKey(userId), JSON.stringify(tokens));
}

/**
 * Get a valid access token for a user.
 * Automatically refreshes if expired (with 60s buffer).
 */
export async function getValidToken(
  env: OAuthEnv,
  userId: string,
): Promise<string | null> {
  const raw = await env.TOKEN_STORE.get(tokenKey(userId));
  if (!raw) return null;

  const tokens: TokenData = JSON.parse(raw);

  // Refresh if expiring within 60 seconds
  if (Date.now() > tokens.expires_at - 60_000) {
    const refreshed = await refreshAccessToken(env, tokens.refresh_token);
    tokens.access_token = refreshed.access_token;
    tokens.expires_at = refreshed.expires_at;
    await storeTokens(env.TOKEN_STORE, userId, tokens);
  }

  return tokens.access_token;
}
