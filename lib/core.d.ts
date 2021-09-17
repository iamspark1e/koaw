import type { ApplicationContextRequest, ApplicationContextResponse, HashMap } from "./types";
interface ApplicationContext {
    finished: Boolean;
    req: ApplicationContextRequest;
    res: ApplicationContextResponse | HashMap;
    tailHandlers: Array<Function>;
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
export default ApplicationContext;
