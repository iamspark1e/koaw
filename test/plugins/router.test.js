const Miniflare = require("miniflare").Miniflare;
const testSuite = require("../bootstrap");

describe("Testing Koaw's Router Features ", () => {
  test("`KoawRouter` can be rewrite", async () => {
    const mf = new Miniflare({
      script: testSuite(
        `
            const router = new KoawRouter();
            router.rewriteTo('/base/sync', '/base/not-sync')
            router.get('/base/not-sync', (ctx, match) => {
              ctx.res.body = 'not-sync'
              return ctx.end();
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
