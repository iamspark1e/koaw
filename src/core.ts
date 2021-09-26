import type {
  ApplicationContextRequest,
  ApplicationContextResponse,
  HashMap,
} from "./types";
import { proxyGetHeader } from "./helpers/helper";

interface ApplicationContext {
  finished: Boolean;
  req: ApplicationContextRequest;
  res: ApplicationContextResponse | HashMap;
  tailHandlers: Array<Function>;
}

class ApplicationContext {
  constructor(event: FetchEvent) {
    this.finished = false;
    let url = new URL(event.request.url);
    this.req = {
      url,
      method: event.request.method.toLowerCase() || "get",
      // @ts-ignore
      headers: proxyGetHeader(event.request.headers),
      // headers: Object.fromEntries(event.request.headers.entries()),
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
    // TODO: allow relative path
    try {
      new URL(url);
    } catch (e) {
      throw new Error("`koaw` cannot parse url in ctx.redirect");
    }
    this.res.location = url;
    this.res.status = status || 302;
    this.finished = true;
    return this;
  }
}

export default ApplicationContext;
