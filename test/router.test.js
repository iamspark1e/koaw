const Miniflare = require("miniflare").Miniflare;
const testSuite = require("./bootstrap");

describe("Testing Koaw's Router Features ", () => {
  test("`KoawRouter` can be rewrite", async () => {
    const mf = new Miniflare({
      script: testSuite(`
            const router = new KoawRouter();
            router.get("/base/sync", (ctx, match) => {
              
            })
            app.use(router.route())
            `),
    });
    const res = await mf.dispatchFetch("http://localhost:8787/base/sync");
    let body = await res.text();
    expect(body).toBe("Sync middleware works well");
  });
});
