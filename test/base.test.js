const Miniflare = require("miniflare").Miniflare;
const testSuite = require("./bootstrap");

describe("Testing Koaw's Basic Features ", () => {
  test("use Koaw without any plugin can fulfill basic usage", async () => {
    const mf = new Miniflare({
      script: testSuite(`
            app.use(ctx => {
              if(ctx.req.url.pathname === '/base/sync') ctx.res.body = 'sync'
              ctx.end()
            })
            `),
    });
    const res = await mf.dispatchFetch("http://localhost:8787/base/sync");
    let body = await res.text();
    expect(body).toBe("sync");
  });
  test("not found resources will return 404", async () => {
    const mf = new Miniflare({
      script: testSuite(`
            app.use(ctx => {
              if(ctx.req.url.pathname === '/base/sync') {
                ctx.res.body = 'sync'
                ctx.end()
              }
            })
            `),
    });
    const res = await mf.dispatchFetch("http://localhost:8787/favicon.ico");
    expect(res.status).toBe(404);
  });
});
