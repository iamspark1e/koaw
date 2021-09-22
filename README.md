# Koaw

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

A Koa-like web framework designed for Cloudflare Worker.

> If you are using my old package called `cf-worker-gateway` or `worker-scaffold`, I suggest switching to this package. Using `ctx` is more easily to maintain.

## Installation

Install the core first,

```bash
npm install koaw-js
# or
yarn add koaw-js
```

You can add offical plugins, here are some example,

```bash
yarn add koaw-plugin-markdown
```

## Usage

```javascript
import Koaw, { KoawRouter } from "koaw-js";

addEventListener("fetch", (event) => {
  const app = new Koaw(event);
  const router = new KoawRouter();
  router.get("/example", (ctx) => {
    ctx.res.body = "hello example";
    ctx.res.status = 200;
    return ctx.end();
  });

  event.respondWith(app.run());
});

// will return a Response of text "hello example" with status 200
```

## Plugins

Without additional packages, you can use `KoawRouter` & `cors` from the core, just like this,

```javascript
import Koaw, { KoawRouter, cors } from "koaw-js";

addEventListener("fetch", (event) => {
  const app = new Koaw(event);
  const router = new KoawRouter();
  app.use(cors(true));
  router.get("/example", (ctx) => {
    ctx.res.body = "hello example";
    ctx.res.status = 200;
    return ctx.end();
  });

  event.respondWith(app.run());
});
```

## API Reference

## API Reference

#### Constructor

```javascript
const app = new Koaw(event: FetchEvent, options: object)
```

| Params          | Type         | Description                                                |
| :-------------- | :----------- | :--------------------------------------------------------- |
| `event`         | `FetchEvent` | **Required**. The fetch event that Worker recieved         |
| `options`       | `object`     | Config the Koaw runtime, only support `debug` now          |
| `options.debug` | `boolean`    | If set `true`, errors and debug infomation will be printed |

#### Load a middleware

```javascript
app.use(fn);
```

| Method | Params                              | Description                                                                              |
| :----- | :---------------------------------- | :--------------------------------------------------------------------------------------- |
| `use`  | `function(ctx): ApplicationContext` | **Required**. The current `ctx` will be avaliable, must return `ctx`                     |
| `run`  | `function`                          | **Required**. Return the constructed `Response`, must be called in `event.respondWith()` |

#### Context `ctx`

| Property       | Type              | Description                                                                                                                   |
| :------------- | :---------------- | :---------------------------------------------------------------------------------------------------------------------------- |
| `finished`     | `boolean`         | The middleware sequence will stop when `ctx.finished` is equal `true`                                                         |
| `req`          | `object`          | Customized `Request` instance, pre-parsed its properties                                                                      |
| `res`          | `object`          | Customized `Response` instance, will be transformed into the `Response` when `ctx.finished` & `ctx.tailHandlers` are finished |
| `tailHandlers` | `Array<function>` | The sequence of handlers after `ctx.finished`                                                                                 |
| `end`          | `function`        | The method to set `ctx.finished = true`                                                                                       |
| `tail`         | `function`        | Add handlers to the `ctx.tailHandlers`                                                                                        |
| `json`         | `function`        | Return the `ctx.res.body` as JSON, if could not parse, will be downgrade to `text/plain`                                      |
| `text`         | `function`        | Return the `ctx.res.body` as text                                                                                             |
| `html`         | `function`        | Return the `ctx.res.body` as html                                                                                             |
| `error`        | `function`        | Return the `ctx.res` as a server error, will return detail error when `options.debug === true`                                |
| `redirect`     | `function`        | Return a redirected response, with any 3xx code                                                                               |

#### The ApplicationContextRequest

| Property  | Type     | Description                                                                             |
| :-------- | :------- | :-------------------------------------------------------------------------------------- |
| `headers` | `object` | Request.headers                                                                         |
| `cookie`  | `object` | Request.cookie, parsed to object                                                        |
| `body`    | `any`    | Request.body, will be parsed with different "Content-Type", object normally             |
| `url`     | `URL`    | Request.url, not only a string, it's a URL instance, so you can get any property in URL |
| `query`   | `object` | Parse from the URL.searchParams                                                         |
| `method`  | `string` | The lower case of HTTP methods                                                          |

#### The ApplicationContextResponse

| Property     | Type     | Description                                                           |
| :----------- | :------- | :-------------------------------------------------------------------- |
| `body`       | `any`    | Response.body, could be any legel type, will be sent in different way |
| `redirect`   | `string` | The redirect target url                                               |
| `status`     | `number` | HTTP status code                                                      |
| `statusText` | `string` | Customize HTTP status text                                            |
| `headers`    | `object` | Set Response headers using object                                     |

### KoawRouter

The `KoawRouter` is an middleware which manage handlers with path and method.

> The `match` result is generated from package `path-to-regexp`, you can make a more complicate use.

```javascript
const router = new KoawRouter();
router.get("/a/:id", (ctx, match) => {
  // Router's handler has additional param `match` for dynamic route.
  ctx.res.body = match.params.id;
  ctx.res.status = 200;
  return ctx;
});
// other routes
app.use(router.route());

event.respondWith(app.run());
```

### cors

The function `cors` is just so simple, you can pass only `true`, and all CORS configuration will work as default. If you want additional config, you can refer [cors in express.js](https://www.npmjs.com/package/cors)
