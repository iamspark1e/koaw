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
declare class Koaw {
    finished: boolean;
    private contextToResponse;
    constructor(event: FetchEvent, options: ApplicationOptions);
    use(fn: Function): Koaw;
    private selfReturn;
    run(): Promise<Response>;
}
export default Koaw;
export { KoawRouter, cors as KoawCORS };
