const staticPath = "./dist";


Bun.serve({
  port: Number(process.env.PORT) || 8080,
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/style.css") {
      return new Response(await Bun.file(staticPath + "/style.css"), {
        headers: { "content-type": "text/css" },
      });
    }
    if (url.pathname === "/client.js") {
      return new Response(await Bun.file(staticPath + "/client.js"), {
        headers: { "content-type": "text/javascript" },
      });
    }
    return new Response(await Bun.file(staticPath + "/index.html"), {
      headers: { "content-type": "text/html" },
    });
  }
});
