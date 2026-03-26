/**
 * Lightweight request router for the Worker.
 *
 * Matches METHOD + path pattern and extracts path parameters.
 */

type Handler = (
  request: Request,
  env: any,
  params: Record<string, string>,
) => Promise<Response>;

interface Route {
  method: string;
  pattern: URLPattern;
  handler: Handler;
}

export class Router {
  private routes: Route[] = [];

  on(method: string, pathname: string, handler: Handler): this {
    this.routes.push({
      method: method.toUpperCase(),
      pattern: new URLPattern({ pathname }),
      handler,
    });
    return this;
  }

  get(pathname: string, handler: Handler): this {
    return this.on("GET", pathname, handler);
  }

  post(pathname: string, handler: Handler): this {
    return this.on("POST", pathname, handler);
  }

  delete(pathname: string, handler: Handler): this {
    return this.on("DELETE", pathname, handler);
  }

  async handle(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);

    for (const route of this.routes) {
      if (route.method !== request.method && route.method !== "ALL") continue;
      const match = route.pattern.exec(url);
      if (match) {
        const params = match.pathname.groups as Record<string, string>;
        return route.handler(request, env, params);
      }
    }

    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
}
