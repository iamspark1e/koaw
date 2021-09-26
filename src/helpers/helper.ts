/**
 * @method proxyGetHeader Add a proxy when get value from headers object.
 * @param headers FetchEvent.Response/Request.headers
 * @returns {ProxyConstructor} headers object with proxied getter
 */
export function proxyGetHeader(headers: Headers) {
  // @ts-ignore
  let headersObj = Object.fromEntries(headers.entries());
  let proxiedHeaders = new Proxy(headersObj, {
    get: function (target, property) {
      if (typeof property === "symbol") return;
      const lowerCaseProp = property.toLowerCase();
      return target[property] || target[lowerCaseProp] || undefined;
    },
  });
  return proxiedHeaders;
}
