const Miniflare = require("miniflare").Miniflare;
const testSuite = require("./bootstrap");

describe("Testing Koaw's Basic Features ", () => {
  test("sync middleware works well", async () => {
    const mf = new Miniflare({
      script: testSuite(`
            app.use("/base/sync", ctx => {
              ctx.res.body = "Sync middleware works well";
              return ctx.end();
            })
            `),
    });
    const res = await mf.dispatchFetch("http://localhost:8787/base/sync");
    let body = await res.text();
    expect(body).toBe("Sync middleware works well");
  });

  test("async middleware works well", async () => {
    const mf = new Miniflare({
      script: testSuite(`
            app.use("/base/async", async ctx => {
              const resp = await fetch("https://github.com");
              if(resp.ok) {
                ctx.res.body = "Async middleware works well"
              } else {
                ctx.res.body = "Async middleware meet some problem"
                ctx.res.status = 500
              }
              return ctx.end();
            })
            `),
    });
    const res = await mf.dispatchFetch("http://localhost:8787/base/async");
    let body = await res.text();
    expect(body).toBe("Async middleware works well");
  });

  test("multi middlewares works well", async () => {
    const mf = new Miniflare({
      script: testSuite(`
            app.use("/base/multi", ctx => {
              ctx.req.headers.processor = "first"
              return ctx;
            })
            app.use("/base/multi", async ctx => {
              if(ctx.req.headers.processor === "first") {
                ctx.res.body = "Response body is from processor Second."
              } else {
                ctx.res.body = "Response body is Only from processor Second, which is not correct."
                ctx.res.status = 500
              }
              return ctx.end();
            })
            `),
    });
    const res = await mf.dispatchFetch("http://localhost:8787/base/multi");
    const finalRes = await res.text();
    expect(finalRes).toBe("Response body is from processor Second.");
  });

  test("tail process middlewares works well", async () => {
    const mf = new Miniflare({
      script: testSuite(`
            app.use("/base/tail-process", ctx => {
              return ctx.end().tail(ctx => {
                ctx.res.headers["Test-Header"] = "Success"
                return ctx;
              })
            })`),
    });
    const res = await mf.dispatchFetch(
      "http://localhost:8787/base/tail-process"
    );
    expect(res.headers.get("Test-Header")).toBe("Success");
  });
});
