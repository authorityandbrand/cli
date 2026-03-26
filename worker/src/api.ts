/**
 * Google Workspace API proxy routes.
 *
 * Maps Worker endpoints to Google REST APIs, equivalent to gws CLI commands:
 *   GET  /api/gmail/threads      → gws gmail threads list
 *   GET  /api/gmail/messages/:id → gws gmail messages get --id <id>
 *   POST /api/gmail/messages/send → gws gmail +send
 *   GET  /api/drive/files        → gws drive files list
 *   GET  /api/calendar/events    → gws calendar events list
 *   GET  /api/sheets/:id/values  → gws sheets +read
 *   POST /api/sheets/:id/append  → gws sheets +append
 *   ... extensible for all Discovery-based APIs
 */

import { Router } from "./router";
import { getValidToken, type OAuthEnv } from "./oauth";

/** Percent-encode a user-supplied value before embedding in a URL path segment. */
function encodePathSegment(value: string): string {
  return encodeURIComponent(value);
}

const GOOGLE_APIS: Record<string, string> = {
  gmail: "https://gmail.googleapis.com/gmail/v1",
  drive: "https://www.googleapis.com/drive/v3",
  calendar: "https://www.googleapis.com/calendar/v3",
  sheets: "https://sheets.googleapis.com/v4/spreadsheets",
  docs: "https://docs.googleapis.com/v1/documents",
  chat: "https://chat.googleapis.com/v1",
  admin: "https://admin.googleapis.com/admin/directory/v1",
};

/** Extract user ID from request (header-based for now). */
function getUserId(request: Request): string {
  return request.headers.get("X-GWS-User") || "default";
}

/** Forward a request to a Google API with the user's access token. */
async function proxyToGoogle(
  env: OAuthEnv,
  request: Request,
  googleUrl: string,
  method: string = "GET",
  body?: string,
): Promise<Response> {
  const userId = getUserId(request);
  const token = await getValidToken(env, userId);

  if (!token) {
    return Response.json(
      {
        error: "Not authenticated",
        message: "Visit /auth/login to authenticate with Google",
      },
      { status: 401 },
    );
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const googleResponse = await fetch(googleUrl, {
    method,
    headers,
    body: method !== "GET" ? body : undefined,
  });

  const data = await googleResponse.json();
  return Response.json(data, { status: googleResponse.status });
}

/** Build query string from request URL search params. */
function forwardQuery(request: Request): string {
  const url = new URL(request.url);
  const params = new URLSearchParams();
  // Forward all query params except internal ones
  for (const [key, value] of url.searchParams) {
    if (!key.startsWith("_")) {
      params.set(key, value);
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function registerApiRoutes(router: Router): void {
  // ── Gmail ──────────────────────────────────────────────────

  router.get("/api/gmail/threads", async (req, env) => {
    const qs = forwardQuery(req);
    return proxyToGoogle(env, req, `${GOOGLE_APIS.gmail}/users/me/threads${qs}`);
  });

  router.get("/api/gmail/messages", async (req, env) => {
    const qs = forwardQuery(req);
    return proxyToGoogle(env, req, `${GOOGLE_APIS.gmail}/users/me/messages${qs}`);
  });

  router.get("/api/gmail/messages/:id", async (req, env, params) => {
    const qs = forwardQuery(req);
    return proxyToGoogle(env, req, `${GOOGLE_APIS.gmail}/users/me/messages/${encodePathSegment(params.id)}${qs}`);
  });

  router.post("/api/gmail/messages/send", async (req, env) => {
    const body = await req.text();
    return proxyToGoogle(env, req, `${GOOGLE_APIS.gmail}/users/me/messages/send`, "POST", body);
  });

  router.get("/api/gmail/labels", async (req, env) => {
    return proxyToGoogle(env, req, `${GOOGLE_APIS.gmail}/users/me/labels`);
  });

  // ── Drive ──────────────────────────────────────────────────

  router.get("/api/drive/files", async (req, env) => {
    const qs = forwardQuery(req);
    return proxyToGoogle(env, req, `${GOOGLE_APIS.drive}/files${qs}`);
  });

  router.get("/api/drive/files/:id", async (req, env, params) => {
    const qs = forwardQuery(req);
    return proxyToGoogle(env, req, `${GOOGLE_APIS.drive}/files/${encodePathSegment(params.id)}${qs}`);
  });

  router.post("/api/drive/files", async (req, env) => {
    const body = await req.text();
    return proxyToGoogle(env, req, `${GOOGLE_APIS.drive}/files`, "POST", body);
  });

  router.delete("/api/drive/files/:id", async (req, env, params) => {
    return proxyToGoogle(env, req, `${GOOGLE_APIS.drive}/files/${encodePathSegment(params.id)}`, "DELETE");
  });

  // ── Calendar ───────────────────────────────────────────────

  router.get("/api/calendar/events", async (req, env) => {
    const qs = forwardQuery(req);
    return proxyToGoogle(
      env,
      req,
      `${GOOGLE_APIS.calendar}/calendars/primary/events${qs}`,
    );
  });

  router.get("/api/calendar/events/:id", async (req, env, params) => {
    return proxyToGoogle(
      env,
      req,
      `${GOOGLE_APIS.calendar}/calendars/primary/events/${encodePathSegment(params.id)}`,
    );
  });

  router.post("/api/calendar/events", async (req, env) => {
    const body = await req.text();
    return proxyToGoogle(
      env,
      req,
      `${GOOGLE_APIS.calendar}/calendars/primary/events`,
      "POST",
      body,
    );
  });

  // ── Sheets ─────────────────────────────────────────────────

  router.get("/api/sheets/:id", async (req, env, params) => {
    const qs = forwardQuery(req);
    return proxyToGoogle(env, req, `${GOOGLE_APIS.sheets}/${encodePathSegment(params.id)}${qs}`);
  });

  router.get("/api/sheets/:id/values/:range", async (req, env, params) => {
    const qs = forwardQuery(req);
    return proxyToGoogle(
      env,
      req,
      `${GOOGLE_APIS.sheets}/${encodePathSegment(params.id)}/values/${encodePathSegment(params.range)}${qs}`,
    );
  });

  router.post("/api/sheets/:id/values/:range", async (req, env, params) => {
    const qs = forwardQuery(req);
    const body = await req.text();
    return proxyToGoogle(
      env,
      req,
      `${GOOGLE_APIS.sheets}/${encodePathSegment(params.id)}/values/${encodePathSegment(params.range)}:append${qs}`,
      "POST",
      body,
    );
  });

  // ── Docs ───────────────────────────────────────────────────

  router.get("/api/docs/:id", async (req, env, params) => {
    return proxyToGoogle(env, req, `${GOOGLE_APIS.docs}/${encodePathSegment(params.id)}`);
  });

  router.post("/api/docs/:id/batchUpdate", async (req, env, params) => {
    const body = await req.text();
    return proxyToGoogle(
      env,
      req,
      `${GOOGLE_APIS.docs}/${encodePathSegment(params.id)}:batchUpdate`,
      "POST",
      body,
    );
  });

  // ── Chat ───────────────────────────────────────────────────

  router.get("/api/chat/spaces", async (req, env) => {
    return proxyToGoogle(env, req, `${GOOGLE_APIS.chat}/spaces`);
  });

  router.post("/api/chat/spaces/:space/messages", async (req, env, params) => {
    const body = await req.text();
    return proxyToGoogle(
      env,
      req,
      `${GOOGLE_APIS.chat}/spaces/${encodePathSegment(params.space)}/messages`,
      "POST",
      body,
    );
  });

  // ── Admin Directory ────────────────────────────────────────

  router.get("/api/admin/users", async (req, env) => {
    const qs = forwardQuery(req);
    return proxyToGoogle(env, req, `${GOOGLE_APIS.admin}/users${qs}`);
  });

  // ── Generic passthrough for Google APIs only ────────────────
  // Allows: /api/proxy?url=https://gmail.googleapis.com/...
  // Restricted to *.googleapis.com to prevent SSRF.

  const ALLOWED_HOSTS = [".googleapis.com", ".google.com"];

  function isAllowedGoogleUrl(target: string): boolean {
    try {
      const parsed = new URL(target);
      return (
        parsed.protocol === "https:" &&
        ALLOWED_HOSTS.some((suffix) => parsed.hostname.endsWith(suffix))
      );
    } catch {
      return false;
    }
  }

  router.get("/api/proxy", async (req, env) => {
    const url = new URL(req.url);
    const target = url.searchParams.get("url");
    if (!target || !isAllowedGoogleUrl(target)) {
      return Response.json(
        { error: "Missing or invalid ?url= parameter. Only *.googleapis.com URLs are allowed." },
        { status: 400 },
      );
    }
    return proxyToGoogle(env, req, target);
  });

  router.post("/api/proxy", async (req, env) => {
    const url = new URL(req.url);
    const target = url.searchParams.get("url");
    if (!target || !isAllowedGoogleUrl(target)) {
      return Response.json(
        { error: "Missing or invalid ?url= parameter. Only *.googleapis.com URLs are allowed." },
        { status: 400 },
      );
    }
    const body = await req.text();
    return proxyToGoogle(env, req, target, "POST", body);
  });
}
