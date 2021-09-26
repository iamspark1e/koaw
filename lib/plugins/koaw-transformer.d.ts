import type { ApplicationContextResponse } from "../types";
declare function responseToCtx(response: Response): Promise<ApplicationContextResponse>;
declare const Transformer: {
    responseToCtx: typeof responseToCtx;
};
export default Transformer;
