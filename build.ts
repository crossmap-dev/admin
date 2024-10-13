console.log('Building...');

const result = await Bun.build({
  entrypoints: ["./client.ts", "./worker.ts"],
  outdir: "./dist",
})

console.log('result:', result);

const indexHtml = await Bun.file("./public/index.html");
const styleCss = await Bun.file("./public/style.css");

console.log('Copying files...');

Bun.write("./dist/index.html", indexHtml);
Bun.write("./dist/style.css", styleCss);

console.log('Built!');
