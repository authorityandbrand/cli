/**
 * GWS Worker — Google Workspace API proxy on Cloudflare Workers.
 *
 * Edge-native equivalent of the gws CLI. Provides:
 *   - OAuth2 login flow with Google
 *   - Token storage in Cloudflare KV (auto-refresh)
 *   - REST proxy to all Google Workspace APIs
 *   - Health check and service discovery
 */

import { Router } from "./router";
import {
  buildAuthUrl,
  exchangeCode,
  storeTokens,
  getValidToken,
  type OAuthEnv,
} from "./oauth";
import { registerApiRoutes } from "./api";

export interface Env extends OAuthEnv {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  OAUTH_SCOPES: string;
  TOKEN_STORE: KVNamespace;
}

const router = new Router();

// ── Health & Discovery ─────────────────────────────────────────

router.get("/", async () => {
  return Response.json({
    name: "gws-worker",
    version: "0.1.0",
    description: "Google Workspace API proxy on Cloudflare Workers",
    endpoints: {
      auth: {
        login: "GET /auth/login",
        callback: "GET /auth/callback",
        status: "GET /auth/status",
      },
      apis: {
        gmail: [
          "GET /api/gmail/threads",
          "GET /api/gmail/messages",
          "GET /api/gmail/messages/:id",
          "POST /api/gmail/messages/send",
          "GET /api/gmail/labels",
        ],
        drive: [
          "GET /api/drive/files",
          "GET /api/drive/files/:id",
          "POST /api/drive/files",
          "DELETE /api/drive/files/:id",
        ],
        calendar: [
          "GET /api/calendar/events",
          "GET /api/calendar/events/:id",
          "POST /api/calendar/events",
        ],
        sheets: [
          "GET /api/sheets/:id",
          "GET /api/sheets/:id/values/:range",
          "POST /api/sheets/:id/values/:range",
        ],
        docs: [
          "GET /api/docs/:id",
          "POST /api/docs/:id/batchUpdate",
        ],
        chat: [
          "GET /api/chat/spaces",
          "POST /api/chat/spaces/:space/messages",
        ],
        admin: ["GET /api/admin/users"],
        proxy: [
          "GET /api/proxy?url=<google-api-url>",
          "POST /api/proxy?url=<google-api-url>",
        ],
      },
    },
  });
});

// ── OAuth2 Flow ────────────────────────────────────────────────

router.get("/auth/login", async (request, env) => {
  const url = new URL(request.url);
  const redirectUri = `${url.origin}/auth/callback`;
  const userId = request.headers.get("X-GWS-User") || "default";

  // State parameter to prevent CSRF
  const state = btoa(JSON.stringify({ userId, ts: Date.now() }));
  const authUrl = buildAuthUrl(env, redirectUri, state);

  return Response.redirect(authUrl, 302);
});

router.get("/auth/callback", async (request, env) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const stateParam = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return Response.json({ error: `OAuth error: ${error}` }, { status: 400 });
  }

  if (!code || !stateParam) {
    return Response.json(
      { error: "Missing code or state parameter" },
      { status: 400 },
    );
  }

  let userId = "default";
  try {
    const state = JSON.parse(atob(stateParam));
    userId = state.userId || "default";
  } catch {
    // Use default userId if state is malformed
  }

  const redirectUri = `${url.origin}/auth/callback`;
  const tokens = await exchangeCode(env, code, redirectUri);
  await storeTokens(env.TOKEN_STORE, userId, tokens);

  return Response.json({
    message: "Authentication successful",
    userId,
    scopes: tokens.scope,
  });
});

router.get("/auth/status", async (request, env) => {
  const userId = request.headers.get("X-GWS-User") || "default";
  const token = await getValidToken(env, userId);

  return Response.json({
    authenticated: token !== null,
    userId,
  });
});

// ── API Routes ─────────────────────────────────────────────────

registerApiRoutes(router);

// ── Worker Entry Point ─────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      return await router.handle(request, env);
    } catch (err: any) {
      console.error("Worker error:", err);
      return Response.json(
        { error: "Internal Server Error", message: err.message },
        { status: 500 },
      );
    }
  },
} satisfies ExportedHandler<Env>;
