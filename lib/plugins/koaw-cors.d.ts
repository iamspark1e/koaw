import type ApplicationContext from "../core";
interface CORSOption {
    origin?: boolean | string | RegExp | Array<string | RegExp> | Function;
    methods?: string | Array<string>;
    allowedHeaders?: string | Array<string>;
    exposedHeaders?: string | Array<string>;
    credentials?: boolean;
    maxAge?: string | number;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
}
export default function cors(options: boolean | CORSOption): (ctx: ApplicationContext) => ApplicationContext | undefined;
export {};
