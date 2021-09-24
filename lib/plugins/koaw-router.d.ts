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
declare class KoawRouter {
    stack: Array<KoawRoute>;
    rewrite: Array<string>;
    constructor();
    get(path: string, handler: Function): this;
    post(path: string, handler: Function): this;
    delete(path: string, handler: Function): this;
    put(path: string, handler: Function): this;
    patch(path: string, handler: Function): this;
    connect(path: string, handler: Function): this;
    trace(path: string, handler: Function): this;
    options(path: string, handler: Function): this;
    all(path: string, handler: Function): this;
    rewriteTo(origin: string, to: string, method?: string): this;
    private verb;
    private compose;
    route(): Function;
}
export default KoawRouter;
