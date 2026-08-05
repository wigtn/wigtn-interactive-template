import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the ASSEMBLY casting office site", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();

  assert.match(html, /<title>ASSEMBLY — Casting Office, Seoul<\/title>/i);
  assert.match(html, /CASTING OFFICE/);
  assert.match(html, /NOAH KIM/);
  assert.match(html, /SOYEON HAN/);
  assert.match(html, /MIRA SEO/);
  assert.match(html, /NOCTURNE/);
  assert.match(html, /FIELD NOTES \/ 07/);
  assert.match(html, /CONTENT DESK \/ LIVE/);
  assert.doesNotMatch(html, /공고|포트폴리오|PROPOSAL|WHAT THIS SITE PROVES/);
});

test("uses GSAP, video and interactive content tools without Three.js", async () => {
  const [page, css, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(packageJson, /"three"/);
  assert.doesNotMatch(page, /AssemblyScene/);
  assert.match(page, /static-cast-collage/);
  assert.match(page, /ScrollTrigger/);
  assert.match(page, /assembly-static-03/);
  assert.match(page, /ScrollTrigger\.refresh/);
  assert.match(page, /assembly-film-v1\.mp4/);
  assert.match(page, /autoPlay muted loop playsInline/);
  assert.match(page, /work-filters/);
  assert.match(page, /aria-pressed/);
  assert.match(page, /type="file"/);
  assert.match(page, /reelImages/);
  assert.match(page, /project-layer/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /word-break:\s*keep-all/);
  assert.doesNotMatch(page, /<br\s*\/?\s*>/i);
  assert.match(layout, /og-assembly-v1\.png/);

  await Promise.all([
    access(new URL("../public/assembly-film-v1.mp4", import.meta.url)),
    access(new URL("../public/og-assembly-v1.png", import.meta.url)),
    access(new URL("../public/talent-noah-v2.jpg", import.meta.url)),
    access(new URL("../public/cast-hero-v2.jpg", import.meta.url)),
    access(new URL("../public/editorial-backstage-v2.jpg", import.meta.url)),
  ]);
});
