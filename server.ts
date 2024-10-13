import { readdir } from "node:fs/promises";

const distPath = "./dist";
const distFiles = await readdir(distPath);
const distRoutes = {};
for (const file of distFiles) {
  distRoutes[`/${file}`] = true;
}


Bun.serve({
  port: Number(process.env.PORT) || 8080,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    if (distRoutes[path]) {
      const f = await Bun.file(distPath + path);
      return new Response(f, { headers: { "content-type": f.type } });
    }

    return new Response(await Bun.file(distPath + "/index.html"), {
      headers: { "content-type": "text/html" },
    });
  }
});
