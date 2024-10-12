const staticPath = "./dist";


Bun.serve({
  static: {
    "/index.html": new Response(await Bun.file(staticPath + "/index.html"), {
      headers: { "content-type": "text/html" },
    }),
    "/style.css": new Response(await Bun.file(staticPath + "/style.css"), {
      headers: { "content-type": "text/css" },
    }),
    "/client.js": new Response(await Bun.file(staticPath + "/app.js"), {
      headers: { "content-type": "text/javascript" },
    }),
  },
  fetch(req) {
    return new Response('Hello, world!', {
      headers: { 'content-type': 'text/plain' },
    });
  }
});
