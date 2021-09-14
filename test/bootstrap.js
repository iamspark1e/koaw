const fs = require("fs");
let libCode = fs.readFileSync(process.cwd() + "/lib/index.js");
libCode = libCode.toString().replace(/export [\s\S]*;/g, "");

module.exports = function testSuite(code) {
  return `
    ${libCode}
    addEventListener('fetch', event => {
      const app = new WorkerScaffold(event, true);
      ${code}
      app.use(async event => {
        return new Response(event.request.url, {status: 404})
      });
      
      event.respondWith(app.run());
    })
    `;
};
