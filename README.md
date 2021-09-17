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

### Core

`Koaw` is a "middleware loader", any function (no matter sync or async) that return `ctx` will be added into the stack, when `.run()` is called,
