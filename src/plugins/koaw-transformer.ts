/**
 * Transform exist Response to Koaw's Context
 */
import type { ApplicationContextResponse } from "../types";
import { proxyGetHeader } from "../helpers/helper";

async function responseToCtx(response: Response) {
  if (!response || !(response instanceof Response))
    throw new TypeError("`responseToCtx` recieved a non-Response");
  let res: ApplicationContextResponse = {};
  res.status = response.status;
  res.statusText = response.statusText;
  // @ts-ignore
  res.headers = proxyGetHeader(response.headers);
  if (res.headers["content-type"]) {
    if (res.headers["content-type"].includes("application/json")) {
      res.body = await response.json();
    } else if (
      res.headers["content-type"].includes("application/x-www-form-urlencoded")
    ) {
      let urlSearch = await response.text();
      // @ts-ignore
      res.body = Object.fromEntries(new URLSearchParams(urlSearch).entries());
    } else if (res.headers["content-type"].includes("text/")) {
      // Just match all types with 'text/' prefix
      res.body = await response.text();
    } else {
      res.body = await response.blob();
    }
  } else {
    res.body = await response.blob();
  }
  return res;
}

const Transformer = { responseToCtx };

export default Transformer;
