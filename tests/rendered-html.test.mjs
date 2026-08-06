import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import { createServer } from "node:net";
import test from "node:test";
import { fileURLToPath } from "node:url";

async function render() {
  const port = await new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") return reject(new Error("Could not allocate a test port"));
      server.close(() => resolve(address.port));
    });
  });
  const root = fileURLToPath(new URL("..", import.meta.url));
  const next = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
  const server = spawn(process.execPath, [next, "start", "-H", "127.0.0.1", "-p", String(port)], { cwd: root, stdio: "ignore" });
  const url = `http://127.0.0.1:${port}`;

  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`Next.js exited before serving HTML (${server.exitCode})`);
    try {
      const response = await fetch(url, { headers: { accept: "text/html" } });
      if (response.ok) return { response, stop: () => server.kill("SIGTERM") };
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  server.kill("SIGTERM");
  throw new Error("Next.js did not become ready in time");
}

test("server-renders the ASSEMBLY talent management site", async () => {
  const { response, stop } = await render();
  const html = await response.text();
  stop();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  assert.match(html, /<title>ASSEMBLY — Talent Management, Seoul<\/title>/i);
  assert.match(html, /TALENT MANAGEMENT/);
  assert.match(html, /NOAH KIM/);
  assert.match(html, /SOYEON HAN/);
  assert.match(html, /MIRA SEO/);
  assert.match(html, /NOCTURNE/);
  assert.match(html, /AGENCY JOURNAL \/ 07/);
  assert.match(html, /MANAGEMENT DESK \/ LIVE/);
  assert.match(html, /Our roster, on screen\./);
  assert.match(html, /One desk for every profile and placement\./);
  assert.doesNotMatch(html, /[가-힣]|PROPOSAL|WHAT THIS SITE PROVES/);
});

test("uses GSAP, video, Three.js and interactive content tools", async () => {
  const [page, threeRoom, css, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/three-casting-room.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(packageJson, /"three"/);
  assert.match(page, /ThreeCastingRoom/);
  assert.match(page, /static-cast-collage/);
  assert.match(page, /ScrollTrigger/);
  assert.match(page, /assembly-static-14/);
  assert.doesNotMatch(page, /header-place/);
  assert.match(page, /ScrollTrigger\.refresh/);
  assert.match(page, /assembly-film-v1\.mp4/);
  assert.match(page, /soft-focus-preview-v1\.mp4/);
  assert.match(page, /field-note-preview-v1\.mp4/);
  assert.match(page, /data-project={project\.id}/);
  assert.match(page, /autoPlay muted loop playsInline/);
  assert.match(page, /work-filters/);
  assert.match(page, /project-preview-video/);
  assert.match(page, /MOTION PREVIEW/);
  assert.match(page, /onMouseEnter={startPreview}/);
  assert.match(page, /aria-pressed/);
  assert.match(page, /type="file"/);
  assert.match(page, /reelImages/);
  assert.doesNotMatch(page, /className="project-layer"/);
  assert.match(page, /soft-focus-beauty-v1\.png/);
  assert.match(threeRoom, /data-webgl="casting-room"/);
  assert.match(threeRoom, /WebGLRenderer/);
  assert.match(threeRoom, /ShaderMaterial/);
  assert.match(threeRoom, /IntersectionObserver/);
  assert.match(threeRoom, /renderer\.dispose/);
  assert.match(page, /orbit-serial/);
  assert.match(page, /cast-echo/);
  assert.match(page, /hero-stage/);
  assert.match(page, /hero-title-slices/);
  assert.match(page, /SELECTED\./);
  assert.doesNotMatch(page, /gsap\.to\("\.footer > strong"/);
  assert.match(page, /ADDED TO SHORTLIST/);
  assert.match(page, /BACK TO ROSTER/);
  assert.match(page, /BACK TO WORK/);
  assert.match(page, /PUBLISH CHANGES/);
  assert.doesNotMatch(page, /[가-힣]/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /word-break:\s*keep-all/);
  assert.doesNotMatch(page, /<br\s*\/?\s*>/i);
  assert.match(layout, /og-assembly-v1\.png/);

  await Promise.all([
    access(new URL("../public/assembly-film-v1.mp4", import.meta.url)),
    access(new URL("../public/soft-focus-preview-v1.mp4", import.meta.url)),
    access(new URL("../public/field-note-preview-v1.mp4", import.meta.url)),
    access(new URL("../public/nocturne-film-still-v3.png", import.meta.url)),
    access(new URL("../public/og-assembly-v1.png", import.meta.url)),
    access(new URL("../public/talent-noah-v2.jpg", import.meta.url)),
    access(new URL("../public/cast-hero-v2.jpg", import.meta.url)),
    access(new URL("../public/editorial-backstage-v2.jpg", import.meta.url)),
    access(new URL("../public/soft-focus-beauty-v1.png", import.meta.url)),
    access(new URL("../public/talent-noah-v3.png", import.meta.url)),
    access(new URL("../public/talent-soyeon-v3.png", import.meta.url)),
    access(new URL("../public/talent-mira-v3.png", import.meta.url)),
  ]);
});
