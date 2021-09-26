const Miniflare = require("miniflare").Miniflare;
const testSuite = require("../bootstrap");

describe("Testing Koaw's Transformer Features ", () => {
  test("fetch `Response` can be transformed into `context`", async () => {
    const mf = new Miniflare({
      script: testSuite(`
              app.use(async ctx => {
                  let response = await fetch("https://github.com");
                  ctx.res = await Transformer.responseToCtx(response);
              })
              app.use(async ctx => {
                if(ctx.res.headers['Content-Type'].includes('text/html') && typeof ctx.res.body === 'string') ctx.res.body = 'correct';
                ctx.end()
              })
              `),
    });
    const res = await mf.dispatchFetch("http://localhost:8787/transformer");
    let body = await res.text();
    expect(body).toBe("correct");
  });
});
