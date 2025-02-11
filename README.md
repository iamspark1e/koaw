> This project is marked as deprecated since 2025, today I recommend [Hono](https://github.com/honojs/hono), blazing fast and build for edge runtimes.

# Koaw (Deprecated)

[![NPM latest version](https://badgen.net/npm/v/koaw-js)](https://www.npmjs.com/package/koaw-js)
[![Minified Gzip](https://badgen.net/bundlephobia/minzip/koaw-js)](https://bundlephobia.com/package/koaw-js)
![Github Action Test](https://github.com/arctome/koaw/actions/workflows/test.yml/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/arctome/koaw/badge.svg?branch=main)](https://coveralls.io/github/arctome/koaw?branch=main)

A Koa-like web framework designed for Cloudflare Worker.

> If you are using my old package called `cf-worker-gateway` or `worker-scaffold`, I suggest switching to this package. Using `ctx` is more easily to maintain.

> English is not my native language; please forgive my typing errors. Improvement about documents is also welcomed!

## Installation

Install the core first,

```bash
npm install koaw-js
# or
yarn add koaw-js
```

## Usage

> `Koaw` core and `KoawRouter` all support "Chaining".

Without additional packages, you can use some internal plugins, just like this,

```javascript
import Koaw, { KoawRouter, cors } from "koaw-js";

addEventListener("fetch", (event) => {
  const app = new Koaw(event);
  const router = new KoawRouter();
  // KoawRouter's handlers
  router.get("/example", (ctx) => {
    ctx.res.body = "hello example";
    ctx.res.status = 200;
    ctx.end(); // The `ctx` must call `.end()` to stop middlewares' execution.
    // If not called at last, the `ctx.res` will be an `unfinished` response.
  });
  // Actually inject middlewares in `Koaw` core
  app.use(cors(true));
  app.use(router.route());

  event.respondWith(app.run());
});
```

## Constructor

```javascript
const app = new Koaw(event: FetchEvent, options?: object)
```

The `options` accept these configurations,

| Params  | Type      | Description                                                |
| :------ | :-------- | :--------------------------------------------------------- |
| `debug` | `boolean` | If set `true`, errors and debug infomation will be printed |

## Plugins (Internal)

### KoawRouter

The `KoawRouter` is an middleware which manage handlers with path and method.

> The `match` result is generated from package `path-to-regexp`, you can make a more complicate use.

```javascript
const router = new KoawRouter();
router.get("/a/:id", (ctx, match) => {
  // Router's handler has additional param `match` for dynamic route.
  ctx.res.body = match.params.id;
  ctx.res.status = 200;
  ctx.end();
});
// other routes
app.use(router.route());

event.respondWith(app.run());
```

### cors

The function `cors` is just so simple, you can pass only `true`, and all CORS configuration will work as default. If you want additional config, you can refer [cors in express.js](https://www.npmjs.com/package/cors)

### Transformer

#### `Transformer.responseToCtx`

Convert an exist `Response` to `ctx.res`

```javascript
app.use(async (ctx) => {
  let response = await fetch("https://github.com");
  ctx.res = await Transformer.responseToCtx(response);
});
```

## Plugin Packages

| Package | Description |
| :------ | :---------- |
| -       | -           |

## Q & A

### Q: Why not continuous maintain `@arctome/worker-scaffold` ?

A: The reason is very simple. `WorkerScaffold` is based on `Response` type detection, every step you need construct a new `Response`, which needs a lot of code. Also, construct a `Response` is not an easy way for a Router package, plenty of detection, plenty of clone and re-construction, made the code of core very difficult to maintain. Therefore, I create this package to replace the "old way".

> Another reason is that I want to extract the plugins not indispensable. That will allow more plugins developed by community.

### Q: Performance ?

A: Not test for now. Will be added soon.
