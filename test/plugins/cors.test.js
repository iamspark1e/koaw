const testSuite = require("../bootstrap");
const Miniflare = require("miniflare").Miniflare;

describe("Testing Helpers - cors works when ", () => {
  test("request method is 'OPTIONS' which should be bypass", async () => {
    const mf = new Miniflare({
      script: testSuite(`
            app.use(cors(true))
            `),
    });
    const res = await mf.dispatchFetch(
      "http://localhost:8787/helpers/cors/test-option",
      {
        method: "OPTIONS",
      }
    );
    expect(res.status).toBe(204);
  });
  test("request method is 'OPTIONS' with custom headers", async () => {
    const mf = new Miniflare({
      script: testSuite(`
            app.use(cors({'allowedHeaders': 'Test-Header'}))
            `),
    });
    const res = await mf.dispatchFetch(
      "http://localhost:8787/helpers/cors/test-option",
      {
        method: "OPTIONS",
        headers: {
          "Test-Header": "this-is-a-test-header",
        },
      }
    );
    expect(res.headers.get("Access-Control-Allow-Headers")).toBe("Test-Header");
  });
});
