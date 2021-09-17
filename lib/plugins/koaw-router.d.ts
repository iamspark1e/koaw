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
    get(path: string, handler: Function): void;
    post(path: string, handler: Function): void;
    delete(path: string, handler: Function): void;
    put(path: string, handler: Function): void;
    patch(path: string, handler: Function): void;
    connect(path: string, handler: Function): void;
    trace(path: string, handler: Function): void;
    options(path: string, handler: Function): void;
    all(path: string, handler: Function): void;
    rewriteTo(origin: string, to: string, method?: string): void;
    private verb;
    private compose;
    route(): Function;
}
export default KoawRouter;
