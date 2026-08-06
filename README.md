# ASSEMBLY — Interactive Casting Office

An interactive portfolio concept for a Seoul casting and production office. The site combines editorial art direction with a scroll-driven Three.js casting room, GSAP transitions, project case studies, talent profiles, and a functional CMS interface demonstration.

## Stack

- Next.js 16 App Router
- React 19
- Three.js
- GSAP + ScrollTrigger
- Tailwind CSS 4

## Local development

Node.js 22.13 or newer is required.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

```bash
npm run lint
npm test
```

`npm test` runs a production Next.js build before checking the rendered site contract and required media assets.

## Vercel deployment

The repository is a standard Next.js project. Import it in Vercel with the framework preset set to **Next.js** and leave the build command and output directory on their defaults.

- Build command: `npm run build`
- Output: managed automatically by Next.js
- Production branch: `main`

No environment variables are required for the portfolio demo.
