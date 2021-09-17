import { ApplicationContextResponse } from "./types";
import KoawRouter from "./plugins/koaw-router";
import cors from "./plugins/koaw-cors";
import ApplicationContext from "./core";

interface ApplicationOptions {
  debug?: Boolean;
}

interface Koaw {
  middleware: Array<Function>;
  ctx: ApplicationContext;
  options: ApplicationOptions;
}

class Koaw {
  finished: boolean = false;
  private contextToResponse(ctx: ApplicationContext): Response {
    if (!ctx || !(ctx instanceof ApplicationContext))
      throw new TypeError(
        "`Koaw` context has been modified and cannot make it a response"
      );
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
    try {
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
        let handlerRes = await this.ctx.tailHandlers[j](this.ctx).res;
        this.ctx.res = handlerRes;
      }

      return this.contextToResponse(this.ctx);
    } catch (e: unknown) {
      if (e instanceof Error) throw e;
      this.ctx.res.body =
        "Server Crashed, please try later or contact the admin of the website!";
      if (this.options.debug && e instanceof Error) {
        this.ctx.res.body = e.message;
      }
      this.ctx.res.status = 500;
      return this.contextToResponse(this.ctx);
    }
  }
}

export default Koaw;
export { KoawRouter, cors };
