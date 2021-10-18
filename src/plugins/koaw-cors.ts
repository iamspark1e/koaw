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

function isOriginAllowed(
  origin: string,
  allowedOrigin: boolean | string | RegExp | Array<string | RegExp> | Function
) {
  if (Array.isArray(allowedOrigin)) {
    for (let i = 0; i < allowedOrigin.length; i += 1) {
      if (isOriginAllowed(origin, allowedOrigin[i])) {
        return true;
      }
    }
    return false;
  }
  if (typeof allowedOrigin === "string") {
    return origin === allowedOrigin;
  }
  if (allowedOrigin instanceof RegExp) {
    return allowedOrigin.test(origin);
  }
  return !!allowedOrigin;
}

// inject custom header functions for CORS
function configureOrigin(ctx: ApplicationContext, options: CORSOption) {
  const requestOrigin = ctx.req?.headers ? ctx.req.headers["Origin"] : "";

  if (!options.origin || options.origin === "*") {
    return {
      key: "Access-Control-Allow-Origin",
      value: "*",
    };
  }
  if (typeof options.origin === "string") {
    return {
      key: "Access-Control-Allow-Origin",
      value: options.origin,
    };
  }
  const isAllowed = isOriginAllowed(requestOrigin, options.origin);
  // reflect origin
  return {
    key: "Access-Control-Allow-Origin",
    value: isAllowed ? requestOrigin : false,
  };
}
function configureMethods(options: CORSOption) {
  if (Array.isArray(options.methods) && options.methods.join) {
    options.methods = options.methods.join(","); // .methods is an array, so turn it into a string
  }
  return {
    key: "Access-Control-Allow-Methods",
    value: options.methods,
  };
}
function configureExposeHeaders(options: CORSOption) {
  if (Array.isArray(options.exposedHeaders) && options.exposedHeaders.join) {
    options.exposedHeaders = options.exposedHeaders.join(","); // .headers is an array, so turn it into a string
  }
  return {
    key: "Access-Control-Expose-Headers",
    value: options.exposedHeaders,
  };
}
function configureAllowedHeaders(options: CORSOption) {
  if (Array.isArray(options.allowedHeaders) && options.allowedHeaders.join) {
    options.allowedHeaders = options.allowedHeaders.join(","); // .headers is an array, so turn it into a string
  }
  return {
    key: "Access-Control-Allow-Headers",
    value: options.allowedHeaders,
  };
}
function configureMaxAge(options: CORSOption) {
  const maxAge =
    (typeof options.maxAge === "number" || options.maxAge) &&
    options.maxAge.toString();
  if (maxAge && maxAge.length) {
    return {
      key: "Access-Control-Max-Age",
      value: maxAge,
    };
  }
}
function configureCredentials(options: CORSOption) {
  if (options.credentials === true) {
    return {
      key: "Access-Control-Allow-Credentials",
      value: "true",
    };
  }
}

const defaultOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

export default function cors(options: boolean | CORSOption) {
  return (ctx: ApplicationContext) => {
    if (!options) return;
    if (options === true) {
      options = defaultOptions;
    }

    if (typeof options === "object" && options.preflightContinue) return;
    ctx.tail((ctx: ApplicationContext) => {
      if (!options) return;
      if (options === true) options = defaultOptions;
      if (ctx.req.method === "OPTIONS") {
        ctx.res.status = options.optionsSuccessStatus || 204;
        ctx.res.body = null;
      }
      const clonedResponse = ctx.res;
      const headers = [];
      headers.push(configureAllowedHeaders(options));
      headers.push(configureCredentials(options));
      headers.push(configureExposeHeaders(options));
      headers.push(configureMaxAge(options));
      headers.push(configureMethods(options));
      headers.push(configureOrigin(ctx, options));
      headers.forEach((header) => {
        if (typeof header === "object" && header.key && header.value)
          clonedResponse.headers[header.key] = header.value.toString();
      });
      ctx.res = clonedResponse;
    });
  };
}
