import * as PathToRegexp from "path-to-regexp";
import ApplicationContext from "../core";
const { match } = PathToRegexp;

interface KoawRoute {
  path: string;
  handler: Function;
  method: Array<string> | string;
  rewrite?: string;
}
interface KoawRouter {
  stack: Array<KoawRoute>;
  rewrite: Array<string>;
}
interface KoawRouterComposedMiddleware {
  handler: Function;
  match: PathToRegexp.Match;
}

class KoawRouter {
  stack: Array<KoawRoute> = [];
  rewrite: Array<string> = [];
  constructor() {
    this.stack = [];
    this.rewrite = [];
  }
  // HTTP method for single route
  get(path: string, handler: Function) {
    return this.verb("get", path, handler);
  }
  post(path: string, handler: Function) {
    return this.verb("post", path, handler);
  }
  delete(path: string, handler: Function) {
    return this.verb("delete", path, handler);
  }
  put(path: string, handler: Function) {
    return this.verb("put", path, handler);
  }
  patch(path: string, handler: Function) {
    return this.verb("patch", path, handler);
  }
  connect(path: string, handler: Function) {
    return this.verb("connect", path, handler);
  }
  trace(path: string, handler: Function) {
    return this.verb("trace", path, handler);
  }
  options(path: string, handler: Function) {
    return this.verb("options", path, handler);
  }
  // Catch all method
  all(path: string, handler: Function) {
    return this.verb("all", path, handler);
  }
  // TODO: add an rewrite method for `compose` to another path
  rewriteTo(origin: string, to: string, method: string = "all") {
    this.stack.push({
      path: origin,
      rewrite: to,
      method,
      handler: () => {},
    });
    return this;
  }
  // Handler of single method
  private verb(method: string, path: string, handler: Function) {
    this.stack.push({
      path,
      handler,
      method,
    });
    return this;
  }

  private compose(
    routes: Array<KoawRoute>,
    path: string,
    ctx: ApplicationContext
  ): Array<KoawRouterComposedMiddleware> {
    let needReRoute: string = "";
    let finalHandlers = [];
    for (let i = 0; i < routes.length; i++) {
      let matcher = match(routes[i].path, {
        encode: encodeURI,
        decode: decodeURIComponent,
      });
      let isMatched = matcher(path);
      if (isMatched) {
        if (this.rewrite.includes(path))
          throw new Error(
            "`KoawRouter` detect loop rewrite, cannot make a correct response"
          );
        if (
          routes[i].rewrite !== undefined &&
          routes[i].rewrite &&
          !this.rewrite.includes(path) &&
          routes[i].rewrite !== path
        ) {
          this.rewrite.push(path);
          needReRoute = routes[i].rewrite || "";
          break;
        }
        finalHandlers.push({ handler: routes[i].handler, match: isMatched });
      }
    }
    if (needReRoute) {
      finalHandlers = this.compose(routes, needReRoute, ctx);
    }
    return finalHandlers;
  }

  // bootstrap
  route(): Function {
    return async (ctx: ApplicationContext) => {
      let pathname = ctx.req.url.pathname;
      let properRoutes = this.stack.filter(
        (r: KoawRoute) =>
          r.method === "all" || r.method === ctx.req.method.toLowerCase()
      );
      let tasks = this.compose(properRoutes, pathname, ctx);
      for (let i = 0; i < tasks.length; i++) {
        await tasks[i].handler(ctx, tasks[i].match);
        if (ctx.finished) break;
      }
    };
  }
}

export default KoawRouter;
