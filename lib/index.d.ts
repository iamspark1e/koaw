import * as PathToRegexp from "path-to-regexp";
export declare type HttpMethod = "get" | "post" | "put" | "patch" | "delete" | "head" | "options" | "trace";
export declare type ExtendedHttpMethod = HttpMethod | "copy" | "link" | "unlink" | "purge" | "lock" | "unlock";
interface ApplicationInternalMiddleware {
    path: string;
    fn: Function;
    match: PathToRegexp.Match;
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
    status?: number;
    statusText?: string;
    headers?: HashMap;
}
interface ApplicationContext {
    finished: Boolean;
    req: ApplicationContextRequest;
    res: ApplicationContextResponse | HashMap;
    match?: PathToRegexp.Match;
    tailHandlers: Array<Function>;
}
interface Koaw {
    middleware: Array<ApplicationInternalMiddleware>;
    ctx: ApplicationContext;
    options: ApplicationOptions;
}
declare class ApplicationContext {
    constructor(event: FetchEvent);
    end(): this;
    tail(fn: Function): this;
    json(data: HashMap): this;
    text(data: string): this;
    html(data: string): this;
    error(status?: number, data?: any): this;
    redirect(url: string, status?: number): this;
}
declare class Koaw {
    private contextToResponse;
    private log;
    constructor(event: FetchEvent, options: ApplicationOptions);
    use(fn: Function): Koaw;
    run(): Promise<Response>;
}
export default Koaw;
