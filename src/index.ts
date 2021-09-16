import { ApplicationContextRequest, ApplicationContextResponse } from "./types";
import KoawRouter from "./plugins/koaw-router";

interface ApplicationOptions {
  debug?: Boolean;
}
interface HashMap {
  [propName: string]: any;
}
interface ApplicationContext {
  finished: Boolean;
  req: ApplicationContextRequest;
  res: ApplicationContextResponse | HashMap;
  tailHandlers: Array<Function>;
}
interface Koaw {
  middleware: Array<Function>;
  ctx: ApplicationContext;
  options: ApplicationOptions;
}

class ApplicationContext {
  constructor(event: FetchEvent) {
    this.finished = false;
    let url = new URL(event.request.url);
    this.req = {
      url,
      method: event.request.method.toLowerCase() || "get",
      // @ts-ignore
      headers: Object.fromEntries(event.request.headers.entries()),
      // @ts-ignore
      query: Object.fromEntries(url.searchParams),
    };
    this.res = { status: 200, headers: {} };
    this.tailHandlers = [];
  }
  end() {
    this.finished = true;
    return this;
  }
  tail(fn: Function) {
    this.tailHandlers.push(fn);
    return this;
  }
  // Extend ctx.end
  json(data: HashMap) {
    let body;
    try {
      body = JSON.stringify(data);
    } catch (e) {
      throw new TypeError("`koaw` ctx.json cannot stringify provided data");
    }
    this.res.body = body;
    this.res.headers["Content-Type"] = "application/json";
    this.finished = true;
    return this;
  }
  text(data: string) {
    if (typeof data !== "string")
      throw new TypeError("`koaw` ctx.text only recieve 'string' type");
    this.res.headers["Content-Type"] = "text/plain";
    this.finished = true;
    return this;
  }
  html(data: string) {
    if (typeof data !== "string")
      throw new TypeError("`koaw` ctx.text only recieve 'string' type");
    this.res.headers["Content-Type"] = "text/html";
    this.finished = true;
    return this;
  }
  error(status: number = 500, data?: any) {
    this.res.status = status;
    if (data) {
      switch (typeof data) {
        case "object":
          this.res.body = JSON.stringify(data);
          this.res.headers["Content-Type"] = "application/json";
          break;
        case "string":
          this.res.body = data;
          this.res.headers["Content-Type"] = "text/plain";
          break;
        default:
          this.res.body = data.toString();
      }
      this.finished = true;
    }
    return this;
  }
  redirect(url: string, status?: number) {
    try {
      new URL(url);
    } catch (e) {
      throw new Error("`koaw` cannot parse url in ctx.redirect");
    }
    this.res.redirect = url;
    this.res.status = status || 302;
    this.finished = true;
    return this;
  }
}

class Koaw {
  private contextToResponse(ctx: ApplicationContext): Response {
    if (!ctx.finished) ctx.finished = true; // force finish ApplicationContext
    const resp: ApplicationContextResponse = {
      body: ctx.res?.body || null,
      redirect: ctx.res?.redirect || "",
      status: ctx.res?.status || 404,
      statusText: ctx.res?.statusText || "",
      headers: ctx.res?.headers || {},
    };
    const respInit = {
      status: resp.status,
      headers: new Headers(
        resp.redirect
          ? { ...resp.headers, Location: resp.redirect }
          : resp.headers
      ),
    };
    return new Response(resp.body, respInit);
  }

  constructor(event: FetchEvent, options: ApplicationOptions) {
    this.middleware = [];
    this.ctx = new ApplicationContext(event);
    this.options = options;
    return this;
  }

  use(fn: Function): Koaw {
    if (typeof fn !== "function")
      throw new Error(
        "`koaw` middleware should be an Object with `object.fn` handler"
      );
    this.middleware.push(fn);
    return this;
  }

  async run() {
    if (!this.ctx.req) throw new Error("`koaw` didn't recieve any request");
    const handlersCount = this.middleware.length;
    if (handlersCount === 0)
      return new Response("Not Found by `koaw`", { status: 404 });
    // Request bypass all middlewares, until ctx.finished
    for (let i = 0; i < handlersCount; i++) {
      if (this.ctx.finished) break;
      let middlewareRes = await this.middleware[i](this.ctx);
      this.ctx.res = middlewareRes.res;
    }
    // Consume all handlers in ctx.tailHandlers
    for (let j = 0; j < this.ctx.tailHandlers.length; j++) {
      this.ctx.res = await this.ctx.tailHandlers[j](this.ctx).res;
    }

    return this.contextToResponse(this.ctx);
  }
}

export default Koaw;
export { KoawRouter };
// types
export type Context = ApplicationContext;
