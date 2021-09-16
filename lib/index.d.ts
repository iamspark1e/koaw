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
    constructor(event: FetchEvent, options: ApplicationOptions);
    use(fn: Function): Koaw;
    run(): Promise<Response>;
}
export default Koaw;
export { KoawRouter };
export declare type Context = ApplicationContext;
