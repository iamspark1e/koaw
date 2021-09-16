export type HttpMethod =
  | "get"
  | "post"
  | "put"
  | "patch"
  | "delete"
  | "head"
  | "options"
  | "trace";
export type ExtendedHttpMethod =
  | HttpMethod
  | "copy"
  | "link"
  | "unlink"
  | "purge"
  | "lock"
  | "unlock";
export interface ApplicationContextRequest {
  headers?: HashMap;
  cookie?: HashMap;
  body?: any;
  url: URL;
  query?: HashMap;
  method: string;
}
export interface ApplicationContextResponse {
  body?: any;
  redirect?: string;
  status?: number;
  statusText?: string;
  headers?: HashMap;
}
