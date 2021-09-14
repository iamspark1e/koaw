const Miniflare = require("miniflare").Miniflare;
const testSuite = require("./bootstrap");

describe("Testing WorkerScaffold's Basic Features ", () => {
  test("sync middleware works well", async () => {
    const mf = new Miniflare({
      script: testSuite(`
            app.use("/base/sync", event => {
              return new Response("Sync middleware works well")
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
            app.use("/base/async", async event => {
              const resp = await fetch("https://github.com");
              if(resp.ok) {
                return new Response("Async middleware works well");
              } else {
                return new Response("Async middleware meet some problem", {status: 500})
              }
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
            app.use("/base/multi", event => {
              const testHeader = new Headers();
              testHeader.append("processor", "first");
              const newRequest = new Request(event.request.url, {
                ...event.request,
                headers: testHeader
              })
              event.request = newRequest;
              return event;
            })
            app.use("/base/multi", async event => {
              const testHeader = event.request.headers.get("processor");
              if(testHeader === "first") {
                return new Response("Response body is from processor Second.");
              } else {
                return new Response("Response body is Only from processor Second, which is not correct.", {status: 500})
              }
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
            app.use("/base/tail-process", {
              default: event => {},
              callback: (event, response) => {
                response.headers.set("Test-Header", "Success")
                return response;
              }
            })`),
    });
    const res = await mf.dispatchFetch(
      "http://localhost:8787/base/tail-process"
    );
    expect(res.headers.get("Test-Header")).toBe("Success");
  });
});
