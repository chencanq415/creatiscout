import { copyFile, writeFile } from "node:fs/promises";

await copyFile("out/index.html", "out/404.html");
await writeFile("out/.nojekyll", "");
