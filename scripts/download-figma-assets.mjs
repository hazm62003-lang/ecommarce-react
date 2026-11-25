import { mkdir, writeFile } from "node:fs/promises";

let FILE_KEY = "dYyB19IXvbx9En8Ufkk5Se";
let HERO_NODE = "16:7214";
let token = process.env.FIGMA_TOKEN;
if (!token) { console.error("Set FIGMA_TOKEN first."); process.exit(1); }
let headers = { "X-Figma-Token": token };

let api = async (path) => {
  let res = await fetch(`https://api.figma.com/v1${path}`, { headers });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
};

let nodes = await api(`/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(HERO_NODE)}`);
let refs = new Set();
(function walk(n) {
  for (let f of n.fills ?? []) if (f.type === "IMAGE" && f.imageRef) refs.add(f.imageRef);
  (n.children ?? []).forEach(walk);
})(nodes.nodes[HERO_NODE].document);

let { meta } = await api(`/files/${FILE_KEY}/images`);
await mkdir("public/images", { recursive: true });
let i = 0;
for (let ref of refs) {
  let url = meta.images[ref];
  if (!url) continue;
  let buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  let name = i === 0 ? "hero-groceries.png" : `hero-${i + 1}.png`;
  await writeFile(`public/images/${name}`, buf);
  console.log("saved public/images/" + name, `${(buf.length / 1024).toFixed(0)} KB`);
  i++;
}
if (!i) console.log("No image fills found in the hero node.");
