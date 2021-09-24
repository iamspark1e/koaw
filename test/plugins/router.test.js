const Miniflare = require("miniflare").Miniflare;
const testSuite = require("../bootstrap");

describe("Testing Koaw's Router Features ", () => {
  test("sync `KoawRouter` static route works", async () => {
    const mf = new Miniflare({
      script: testSuite(`
            const router = new KoawRouter();
            router.get("/base/sync", (ctx, match) => {
              ctx.res.body = "Sync middleware works well"
              ctx.end();
            })
            app.use(router.route())
            `),
    });
    const res = await mf.dispatchFetch("http://localhost:8787/base/sync");
    let body = await res.text();
    expect(body).toBe("Sync middleware works well");
  });
  test("sync `KoawRouter` has correct match result", async () => {
    const mf = new Miniflare({
      script: testSuite(`
            const router = new KoawRouter();
            router.get("/base/:id", (ctx, match) => {
              ctx.res.body = match.params.id || "Not found";
              ctx.end();
            })
            app.use(router.route())
            `),
    });
    const res = await mf.dispatchFetch("http://localhost:8787/base/sync");
    let body = await res.text();
    expect(body).toBe("sync");
  });

  test("async middleware works well", async () => {
    const mf = new Miniflare({
      script: testSuite(`
            const router = new KoawRouter();
            router.get("/base/async", async ctx => {
              const resp = await fetch("https://github.com");
              if(resp.ok) {
                ctx.res.body = "Async middleware works well"
              } else {
                ctx.res.body = "Async middleware meet some problem"
                ctx.res.status = 500
              }
              ctx.end();
            })
            app.use(router.route())
            `),
    });
    const res = await mf.dispatchFetch("http://localhost:8787/base/async");
    let body = await res.text();
    expect(body).toBe("Async middleware works well");
  });

  test("multi middlewares works well", async () => {
    const mf = new Miniflare({
      script: testSuite(`
            const router = new KoawRouter();
            router.get("/base/multi", ctx => {
              ctx.req.headers.processor = "first"
            })
            router.get("/base/multi", async ctx => {
              if(ctx.req.headers.processor === "first") {
                ctx.res.body = "Response body is from processor Second."
              } else {
                ctx.res.body = "Response body is Only from processor Second, which is not correct."
                ctx.res.status = 500
              }
              ctx.end();
            })
            app.use(router.route())
            `),
    });
    const res = await mf.dispatchFetch("http://localhost:8787/base/multi");
    const finalRes = await res.text();
    expect(finalRes).toBe("Response body is from processor Second.");
  });

  test("tail process middlewares works well", async () => {
    const mf = new Miniflare({
      script: testSuite(`
            const router = new KoawRouter();
            app.use(ctx => {
              ctx.res.headers["Test-Header"] = "Pre"
            })
            router.get("/base/tail-process", ctx => {
              ctx.end().tail(ctx => {
                ctx.res.headers["Test-Header"] = "Success"
              })
            })
            app.use(router.route())
            `),
    });
    const res = await mf.dispatchFetch(
      "http://localhost:8787/base/tail-process"
    );
    expect(res.headers.get("Test-Header")).toBe("Success");
  });
  test("`KoawRouter` can be rewrite", async () => {
    const mf = new Miniflare({
      script: testSuite(
        `
            const router = new KoawRouter();
            router.rewriteTo('/base/sync', '/base/not-sync')
            router.get('/base/not-sync', (ctx, match) => {
              ctx.res.body = 'not-sync'
              ctx.end();
            })
            app.use(router.route())
            `,
        true
      ),
    });
    const res = await mf.dispatchFetch("http://localhost:8787/base/sync");
    let body = await res.text();
    expect(body).toBe("not-sync");
  });
  test("`KoawRouter` works in chain usage", async () => {
    const mf = new Miniflare({
      script: testSuite(
        `
          const router = new KoawRouter();
          router.rewriteTo('/base/sync', '/base/not-sync').get('/base/not-sync', (ctx, match) => {
            ctx.res.body = 'not-sync'
            ctx.end();
          })
          app.use(router.route())
        `,
        true
      ),
    });
    const res = await mf.dispatchFetch("http://localhost:8787/base/sync");
    let body = await res.text();
    expect(body).toBe("not-sync");
  });
});
