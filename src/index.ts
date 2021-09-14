import * as PathToRegexp from "path-to-regexp";
import { Match } from "path-to-regexp";
const { match } = PathToRegexp;

// interface FetchEvent extends Event {
//   request: Request;
//   // eslint-disable-next-line
//   respondWith(response: Promise<Response> | Response): Promise<Response>;
//   match?: Match;
// }
// interface MiddlewareHandlerBundle {
//   default: Function | Promise<Function>;
//   callback?: Function | Promise<Function>;
// }
export type HttpMethod =
  | "get"
  | "post"
  | "put"
  | "patch"
  | "delete"
  | "head"
  | "options"
  | "trace";
export type ExtendedHttpMethod =
  | HttpMethod
  | "copy"
  | "link"
  | "unlink"
  | "purge"
  | "lock"
  | "unlock";
interface ApplicationInternalMiddleware {
  path: string;
  fn: Function;
}
interface ApplicationOptions {
  debug?: Boolean;
}
interface HashMap {
  [propName: string]: any;
}
interface ApplicationContextRequest {
  headers?: HashMap;
  cookie?: HashMap;
  body?: any;
  url: URL;
  query?: HashMap;
  method: string;
}
interface ApplicationContextResponse {
  body?: any;
  redirect?: string;
  status?: Number;
  statusText?: string;
  headers?: HashMap;
}
interface ApplicationContext {
  finished: Boolean;
  req: ApplicationContextRequest | null;
  res?: ApplicationContextResponse;
  match?: Match;
}
interface Application {
  middleware: Array<ApplicationInternalMiddleware>;
  ctx: ApplicationContext;
  options: ApplicationOptions;
}

class Application {
  private handleRequestEvent(event: FetchEvent): ApplicationContext {
    let context: ApplicationContext = { finished: false, req: null };
    let url = new URL(event.request.url);
    context.req = {
      url,
      // @ts-ignore
      headers: Object.fromEntries(event.request.headers.entries()),
      method: event.request.method.toLowerCase(),
      // @ts-ignore
      query: Object.fromEntries(url.searchParams),
    };
    // initialize context.res
    context.res = {
      status: 200, // use 200 as default
    };
    return context;
  }
  private log(message: string): void {
    this.options.debug ? console.log(message) : undefined;
  }

  constructor(event: FetchEvent, options: ApplicationOptions) {
    this.middleware = [];
    this.ctx = this.handleRequestEvent(event);
    this.options = options;
  }

  use(fn: Function): Application;
  use(path: Function | string, fn?: Function): Application {
    let _path: string;
    let _fn: Function;
    if (typeof path === "function") {
      _path = "";
      _fn = path;
    } else {
      if (typeof fn !== "function")
        throw new TypeError("`koaw` only accept functions as middleware");
      _path = path;
      _fn = fn;
    }
    this.middleware.push({ path: _path, fn: _fn });
    return this;
  }

  run() {
    if (!this.ctx.req) throw new Error("`koaw` didn't recieve any request");
    const url = this.ctx.req.url.href;
    // Pick all middlewares matched
    const matchedMiddlewareQuene = this.middleware.filter(
      (w: ApplicationInternalMiddleware) => {
        const matcher: PathToRegexp.MatchFunction = match(w.path, {
          decode: decodeURIComponent,
        });
        const isMatched = matcher(url);
        if (isMatched) return w;
      }
    );
    if (matchedMiddlewareQuene.length === 0)
      return new Response("Not Found by `koaw`", { status: 404 });
  }
}

export default Application;
