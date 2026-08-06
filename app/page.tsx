"use client";

import { ChangeEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Talent = {
  name: string;
  role: string;
  location: string;
  image: string;
  stats: string[];
  note: string;
  reelImages: [string, string];
  reelLabel: string;
  credits: string[];
};

type Project = {
  id: string;
  title: string;
  type: "Film" | "Campaign" | "Editorial";
  year: string;
  image: string;
  statement: string;
  delivery: string;
  credits: string[];
  chapters: { time: string; label: string; note: string }[];
  detailImage: string;
};

const talents: Talent[] = [
  { name: "NOAH KIM", role: "Model", location: "Seoul", image: "/talent-noah-v2.jpg", stats: ["187 CM", "SUIT 48", "SHOES 280"], note: "A quiet presence built for long takes, tailored campaigns and precise movement direction.", reelImages: ["/talent-noah-v1.png", "/motion-study-v1.png"], reelLabel: "WALK / TURN / STILL", credits: ["Automotive film · 2026", "Maison menswear · 2025", "Available worldwide"] },
  { name: "SOYEON HAN", role: "Actor · Model", location: "Seoul / Tokyo", image: "/editorial-backstage-v2.jpg", stats: ["174 CM", "KOR · ENG", "FILM · BEAUTY"], note: "A subtle shift in expression carries her from exacting beauty frames into narrative film.", reelImages: ["/hero-campaign.png", "/soft-focus-beauty-v1.png"], reelLabel: "FACE / PROFILE / VOICE", credits: ["Nocturne film · 2026", "Soft Focus beauty · 2026", "Available APAC / EU"] },
  { name: "MIRA SEO", role: "Film Director", location: "Seoul", image: "/campaign-nocturne-v1.png", stats: ["COMMERCIAL", "MUSIC FILM", "EDITORIAL"], note: "She starts with the person, then shapes light and movement into a scene that holds.", reelImages: ["/editorial-backstage-v1.png", "/editorial-backstage-v2.jpg"], reelLabel: "FRAME / LIGHT / DIRECTION", credits: ["Nocturne · director", "Field Note 07 · subject", "Based in Seoul"] },
];

const projects: Project[] = [
  { id: "01", title: "NOCTURNE", type: "Film", year: "2026", image: "/cast-hero-v2.jpg", detailImage: "/hero-campaign.png", statement: "Two figures hold the distance after the light goes out.", delivery: "FILM / 00:42 / 16:9", credits: ["Director — Mira Seo", "Cast — Soyeon Han · Noah Kim", "DOP — Hyun Park", "Run time — 00:42"], chapters: [{ time: "00:00", label: "Arrival", note: "A restrained entrance establishes the distance before either face is fully revealed." }, { time: "00:14", label: "Contact", note: "A single red line joins two performances without turning the frame into spectacle." }, { time: "00:31", label: "Afterimage", note: "The edit slows, leaving posture and eye-line to carry the final beat." }] },
  { id: "02", title: "SOFT FOCUS", type: "Campaign", year: "2026", image: "/soft-focus-beauty-v1.png", detailImage: "/soft-focus-beauty-v1.png", statement: "Skin, reflection and one direct gaze form a modular beauty system.", delivery: "KEY VISUAL / MOTION / SOCIAL", credits: ["Client — Nineteen", "Talent — Soyeon Han", "Photo — Jun Lee", "Usage — APAC / 12M"], chapters: [{ time: "01", label: "Key visual", note: "The cobalt field gives product, portrait and copy enough space to work at every ratio." }, { time: "02", label: "Motion cut", note: "Acrylic reflections become transitions for six and fifteen-second campaign edits." }, { time: "03", label: "Social set", note: "Portrait crops are directed for vertical placements instead of adapted after the shoot." }] },
  { id: "03", title: "FIELD NOTE 07", type: "Editorial", year: "2026", image: "/motion-study-v1.png", detailImage: "/editorial-backstage-v1.png", statement: "Fifteen minutes of tension before the first frame, kept as an editorial record.", delivery: "STORY / 18 FRAMES / WEB", credits: ["Words — Haeun Cho", "Images — Yuri Lim", "Featuring — Mira Seo", "Published — 18 Mar"], chapters: [{ time: "A", label: "Before set", note: "The room is documented before marks, props and people settle into their final positions." }, { time: "B", label: "The fitting", note: "Small wardrobe decisions explain more about the character than a polished final still." }, { time: "C", label: "First frame", note: "The article ends where the campaign begins: the first deliberate look into camera." }] },
];

function Intro() {
  return <div className="intro" aria-hidden="true">
    <div className="intro-meta"><span>ASSEMBLY / SEOUL</span><span>CASTING OFFICE</span></div>
    <div className="intro-frames"><figure><img src="/talent-noah-v2.jpg" alt="" /></figure><figure><img src="/soft-focus-beauty-v1.png" alt="" /></figure><figure><img src="/campaign-nocturne-v1.png" alt="" /></figure></div>
    <div className="intro-word"><span>ASSEMBLY</span></div>
    <div className="intro-count"><b>03</b><span>FACES / SEOUL</span></div>
    <div className="intro-foot"><span>MODEL · ACTOR · CASTING PRODUCTION</span><b>EST. 2026</b></div>
    <div className="intro-panels">{Array.from({ length: 8 }, (_, index) => <i key={index} />)}</div>
  </div>;
}

function Header() {
  const [open, setOpen] = useState(false);
  return <>
    <header className="header">
      <a className="brand" href="#top" aria-label="Assembly home"><i />ASSEMBLY</a>
      <nav aria-label="Primary navigation"><a href="#talent">Talent</a><a href="#work">Campaigns</a><a href="#journal">Journal</a><a href="#office">Office</a></nav>
      <div className="header-place"><i /> SEOUL <span>37.5665° N</span></div>
      <button className="menu-toggle" onClick={() => setOpen(value => !value)} aria-expanded={open}>{open ? "Close" : "Menu"}</button>
      <a className="book-link" href="mailto:book@assembly-seoul.com">Book talent ↗</a>
    </header>
    <div className={`mobile-menu ${open ? "open" : ""}`}>{[["Talent", "#talent"], ["Campaigns", "#work"], ["Journal", "#journal"], ["Office", "#office"]].map(([label, href], index) => <a href={href} key={label} onClick={() => setOpen(false)}><small>0{index + 1}</small>{label}</a>)}</div>
  </>;
}

function Hero() {
  return <section className="hero" id="top">
    <video className="hero-film" autoPlay muted loop playsInline preload="metadata" poster="/cast-hero-v2.jpg" onLoadedMetadata={event => { event.currentTarget.playbackRate = 0.55; }}><source src="/assembly-film-v1.mp4" type="video/mp4" /></video>
    <div className="hero-shade" />
    <div className="hero-topline"><span>Casting office for film &amp; campaign</span><span>Seoul, Korea</span></div>
    <div className="hero-title"><p>MODEL · ACTOR · PRODUCTION</p><h1>ASSEMBLY</h1></div>
    <div className="hero-copy"><p>Casting, motion tests and production for film, fashion and beauty.</p><a href="#talent">Meet the roster <span>↓</span></a></div>
    <div className="hero-focus"><small>NOW CASTING</small><strong>Q3 / 2026</strong><span>FILM · BEAUTY · EDITORIAL</span></div>
    <div className="hero-runner" aria-hidden="true"><span>CASTING / DIRECTION / PRODUCTION / SEOUL /</span><span>CASTING / DIRECTION / PRODUCTION / SEOUL /</span></div>
  </section>;
}

function OrbitRoster({ onSelect }: { onSelect: (talent: Talent) => void }) {
  return <section className="orbit" id="talent">
    <div className="orbit-sticky">
      <div className="static-cast-collage" aria-hidden="true">{talents.map((talent, index) => <figure key={talent.name}><img src={talent.image} alt="" /><figcaption><span>0{index + 1}</span><strong>{talent.name}</strong></figcaption></figure>)}</div>
      <div className="orbit-index"><span>ROSTER / 2026</span><span>03 ACTIVE</span></div>
      <div className="orbit-stages">
        <article><small>01 / NOAH KIM</small><h2>A quiet presence built for long takes.</h2><p>Menswear, automotive and narrative film. He knows when to hold a frame and when to move through it.</p></article>
        <article><small>02 / SOYEON HAN</small><h2>One expression can turn the scene.</h2><p>Beauty precision with the emotional range to carry narrative work in Seoul and Tokyo.</p></article>
        <article><small>03 / MIRA SEO</small><h2>Direction that begins with the person.</h2><p>Commercial and editorial scenes shaped around human movement, not decorative motion.</p></article>
      </div>
      <div className="orbit-meter"><i /><span>SCROLL TO SHIFT THE CAST</span></div>
    </div>
    <div className="talent-list">
      {talents.map((talent, index) => <button className="talent-row" key={talent.name} onClick={() => onSelect(talent)} aria-label={`Open ${talent.name} profile`}>
        <span className="talent-no">0{index + 1}</span><span className="talent-thumb"><img src={talent.image} alt="" /></span><strong>{talent.name}</strong><span>{talent.role}</span><span>{talent.location}</span><i>↗</i>
      </button>)}
    </div>
  </section>;
}

function Work({ onSelect }: { onSelect: (project: Project) => void }) {
  const [filter, setFilter] = useState<"All" | Project["type"]>("All");
  const filtered = filter === "All" ? projects : projects.filter(project => project.type === filter);
  return <section className="work" id="work">
    <header className="section-head reveal"><div><span>SELECTED WORK</span><span>2025—2026</span></div><h2>Faces, placed in motion.</h2><p>Selected casting work across film, beauty and editorial—built from the first shortlist through final delivery.</p></header>
    <div className="work-filters" aria-label="Project filters">{(["All", "Film", "Campaign", "Editorial"] as const).map(item => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>
    <div className="project-list">
      {filtered.map(project => <article className="project" key={project.id}>
        <button className="project-media" onClick={() => onSelect(project)} aria-label={`Open ${project.title} case study`}><img className="project-main-image" src={project.image} alt={`${project.title} campaign still`} /><span className="project-open">VIEW CASE ↗</span><span className="project-delivery">{project.delivery}</span></button>
        <div className="project-info"><span>{project.id} / {project.type}</span><h3>{project.title}</h3><p>{project.statement}</p><small>{project.year}</small></div>
      </article>)}
    </div>
  </section>;
}

function Journal({ onSelect }: { onSelect: (project: Project) => void }) {
  return <section className="journal" id="journal">
    <header className="journal-head reveal"><div><span>FIELD NOTES / 07</span><h2>What remains after the set wraps.</h2><p>Casting notes, fittings, movement tests and the decisions that never make the final cut.</p></div><div className="journal-mark" aria-hidden="true"><b>07</b><span>NOTES / SET / EDIT</span></div></header>
    <article className="journal-lead reveal"><div className="journal-image"><img src="/editorial-backstage-v1.png" alt="Wardrobe fitting before the first frame" /><span>15 MINUTES BEFORE CAMERA</span></div><div><span>ON SET / 18 MAR</span><h3>Before the first frame.</h3><p>The fitting is over and the lights are still down. This is when a cast and crew begin imagining the same scene.</p><button onClick={() => onSelect(projects[2])}>READ FIELD NOTE ↗</button></div></article>
    <div className="journal-grid"><article><span>CASTING / 04</span><h3>What a profile cannot show.</h3><p>Movement, voice and pace—the three checks we make before a final shortlist.</p></article><article><span>PRODUCTION / 11</span><h3>Why the mobile frame is directed separately.</h3><p>A portrait and title need a different rhythm when the screen fits in one hand.</p></article></div>
  </section>;
}

type OfficeItem = { title: string; type: string; live: boolean; image: string; updated: string };

function Office() {
  const [items, setItems] = useState<OfficeItem[]>([
    { title: "Nocturne", type: "Campaign", live: true, image: "/cast-hero-v2.jpg", updated: "2 min ago" },
    { title: "Noah Kim", type: "Talent", live: true, image: "/talent-noah-v2.jpg", updated: "18 min ago" },
    { title: "Field Note 07", type: "Journal", live: false, image: "/editorial-backstage-v1.png", updated: "1 hr ago" },
  ]);
  const [selected, setSelected] = useState(0);
  const [uploadNote, setUploadNote] = useState("MP4 · MOV / MAX 500 MB");
  const [saved, setSaved] = useState(true);
  const item = items[selected];
  const updateItems = (next: OfficeItem[]) => { setItems(next); setSaved(false); };
  const toggle = () => updateItems(items.map((entry, index) => index === selected ? { ...entry, live: !entry.live } : entry));
  const addItem = () => { const next = [...items, { title: `Untitled ${items.length + 1}`, type: "Campaign", live: false, image: "/soft-focus-beauty-v1.png", updated: "now" }]; setItems(next); setSelected(next.length - 1); setSaved(false); };
  const removeItem = () => { if (items.length === 1) return; const next = items.filter((_, index) => index !== selected); setItems(next); setSelected(Math.max(0, selected - 1)); setSaved(false); };
  const publish = () => { setItems(current => current.map((entry, index) => index === selected ? { ...entry, live: true, updated: "now" } : entry)); setSaved(true); };
  const upload = (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; setUploadNote(file.size > 500 * 1024 * 1024 ? "FILE EXCEEDS THE 500 MB LIMIT" : `${file.name} · READY`); setSaved(false); };
  return <section className="office" id="office">
    <header className="office-head reveal"><div><span>CONTENT DESK / LIVE</span><h2>Publish without breaking the frame.</h2></div><p>Talent, campaigns and journal entries share one editing flow. Update media, visibility and titles without a developer.</p><ul><li><b>03</b> content types</li><li><b>01</b> live preview</li><li><b>500</b> MB upload</li></ul></header>
    <div className="office-console reveal">
      <aside><header><strong>CONTENT</strong><button onClick={addItem}>+ NEW</button></header>{items.map((entry, index) => <button key={`${entry.title}-${index}`} className={selected === index ? "active" : ""} onClick={() => setSelected(index)}><i>{entry.live ? "LIVE" : "DRAFT"}</i><span><strong>{entry.title}</strong><small>{entry.type} · {entry.updated}</small></span></button>)}</aside>
      <div className="office-editor"><div className="editor-bar"><span>EDITING / {item.type.toUpperCase()}</span><b>{saved ? "ALL CHANGES SAVED" : "UNSAVED CHANGES"}</b></div><label>Title<input value={item.title} onChange={event => updateItems(items.map((entry, index) => index === selected ? { ...entry, title: event.target.value } : entry))} /></label><label>Visibility<button className={`visibility ${item.live ? "live" : ""}`} onClick={toggle} aria-pressed={item.live}><i />{item.live ? "PUBLIC" : "DRAFT"}</button></label><label className="upload">Media<input type="file" accept="video/mp4,video/quicktime,image/*" onChange={upload} /><span>DROP OR SELECT FILE</span><small>{uploadNote}</small></label><div className="editor-actions"><button onClick={removeItem} disabled={items.length === 1}>DELETE</button><button onClick={publish}>{saved && item.live ? "PUBLISHED" : "PUBLISH CHANGES"}</button></div></div>
      <div className="office-preview"><header><span>LIVE PREVIEW</span><b>↗</b></header><div className="preview-frame"><img src={item.image} alt="" /><div><small>{item.type}</small><strong>{item.title}</strong><span>{item.live ? "PUBLIC" : "NOT PUBLISHED"}</span></div></div></div>
    </div>
  </section>;
}

function TalentProfile({ talent, onClose }: { talent: Talent; onClose: () => void }) {
  const [shortlisted, setShortlisted] = useState(false);
  const slug = talent.name.toLowerCase().replaceAll(" ", "-");
  return <div className="overlay profile-overlay" role="dialog" aria-modal="true" aria-label={`${talent.name} profile`}><div className="overlay-nav"><button onClick={onClose}>← BACK TO ROSTER</button><span>{talent.name} / PROFILE 2026</span></div><div className={`talent-profile talent-${slug}`}>
    <figure className="profile-hero-image"><img src={talent.image} alt={`${talent.name} full portrait`} decoding="sync" fetchPriority="high" /><figcaption>FULL-LENGTH CASTING PORTRAIT / 01</figcaption></figure>
    <div className="profile-copy"><span>{talent.role} / {talent.location}</span><h2>{talent.name}</h2><p>{talent.note}</p><dl>{talent.stats.map((stat, index) => <div key={stat}><dt>0{index + 1}</dt><dd>{stat}</dd></div>)}</dl><div className="profile-links"><button className={shortlisted ? "selected" : ""} onClick={() => setShortlisted(value => !value)}>{shortlisted ? "ADDED TO SHORTLIST ✓" : "ADD TO SHORTLIST"}</button><a href="mailto:book@assembly-seoul.com">REQUEST BOOKING ↗</a></div></div>
    <section className="profile-reel"><header><span>MOVEMENT INDEX</span><strong>{talent.reelLabel}</strong></header><div className="profile-reel-grid"><figure><img src={talent.reelImages[0]} alt={`${talent.name} movement test one`} /><figcaption>01 / CONTROLLED MOVEMENT</figcaption></figure><figure><img src={talent.reelImages[1]} alt={`${talent.name} movement test two`} /><figcaption>02 / CAMERA RESPONSE</figcaption></figure></div></section>
    <section className="profile-record"><span>RECENT RECORD</span>{talent.credits.map((credit, index) => <div key={credit}><b>0{index + 1}</b><strong>{credit}</strong></div>)}</section>
    <div className="overlay-end"><button onClick={onClose}>← BACK TO ROSTER</button><a href="mailto:book@assembly-seoul.com">CHECK AVAILABILITY ↗</a></div>
  </div></div>;
}

function ProjectCase({ project, onClose }: { project: Project; onClose: () => void }) {
  const description = project.type === "Film" ? "Performance, light and edit were developed as one continuous forty-two second arc." : project.type === "Campaign" ? "One image system moves deliberately across key visual, motion and vertical social placements." : "The story pairs close observation with working images from the minutes before production begins.";
  return <div className="overlay case-overlay" role="dialog" aria-modal="true" aria-label={`${project.title} case study`}><div className="overlay-nav"><button onClick={onClose}>← BACK TO WORK</button><span>CASE {project.id} / {project.type.toUpperCase()}</span></div><article className={`case case-${project.type.toLowerCase()}`}>
    <header><span>ASSEMBLY / CASE {project.id}</span><span>{project.type} · {project.year}</span></header>
    <div className="case-hero">{project.type === "Film" ? <video autoPlay muted loop playsInline poster={project.image}><source src="/assembly-film-v1.mp4" type="video/mp4" /></video> : <img src={project.image} alt={`${project.title} campaign still`} />}<div><span>{project.delivery}</span><h2>{project.title}</h2><p>{project.statement}</p></div></div>
    <div className="case-body"><div><span>THE WORK</span><h3>{description}</h3></div><dl>{project.credits.map(item => { const [key, value] = item.split(" — "); return <div key={item}><dt>{key}</dt><dd>{value}</dd></div>; })}</dl></div>
    <section className="case-process"><figure><img src={project.detailImage} alt={`${project.title} process frame`} /><figcaption>PROCESS FRAME / {project.id}</figcaption></figure><div><span>FROM BRIEF TO DELIVERY</span>{project.chapters.map((chapter, index) => <article key={chapter.time}><i>0{index + 1}</i><b>{chapter.time}</b><h4>{chapter.label}</h4><p>{chapter.note}</p></article>)}</div></section>
    <div className="case-end"><span>RELATED CAST</span><strong>{project.id === "03" ? "MIRA SEO" : "SOYEON HAN · NOAH KIM"}</strong><a href="mailto:hello@assembly-seoul.com?subject=Project%20enquiry">START A SIMILAR PROJECT ↗</a></div>
    <div className="overlay-end"><button onClick={onClose}>← BACK TO WORK</button><a href="mailto:hello@assembly-seoul.com">NEW BUSINESS ↗</a></div>
  </article></div>;
}

function Footer() {
  return <footer className="footer"><div className="footer-call"><span>BOOKING / NEW BUSINESS</span><h2>Need the right face for the next frame?</h2><a href="mailto:hello@assembly-seoul.com">Start a casting request ↗</a></div><div className="footer-signal" aria-hidden="true"><i /><span>AVAILABLE FOR Q3 / 2026</span><i /></div><strong>ASSEMBLY</strong><div className="footer-bottom"><span>SEOUL · 37° 33′ N</span><span>MODEL · ACTOR · PRODUCTION</span><span>© 2026 ASSEMBLY</span><a href="#top">Back to top ↑</a></div></footer>;
}

export default function Home() {
  const rootRef = useRef<HTMLElement>(null);
  const [profile, setProfile] = useState<Talent | null>(null);
  const [project, setProject] = useState<Project | null>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.timeline()
        .from(".intro-meta span,.intro-foot>*", { y: 12, opacity: 0, duration: 0.3, stagger: 0.05 })
        .fromTo(".intro-frames figure", { clipPath: "inset(100% 0 0 0)", yPercent: 16 }, { clipPath: "inset(0% 0 0 0)", yPercent: 0, duration: 0.7, stagger: 0.09, ease: "power4.out" }, 0.05)
        .from(".intro-word span", { yPercent: 125, rotate: 2, duration: 0.8, ease: "power4.out" }, 0.18)
        .from(".intro-count", { scale: .7, opacity: 0, duration: .45, ease: "power3.out" }, .42)
        .to(".intro-frames figure", { xPercent: index => (index - 1) * 9, duration: .6, ease: "power3.inOut" }, .95)
        .to(".intro-panels i", { scaleY: 1, duration: 0.46, stagger: 0.035, ease: "power3.inOut" }, 1.22)
        .to(".intro", { yPercent: -100, duration: 0.78, ease: "power4.inOut" }, 1.72)
        .from(".hero-title h1,.hero-copy,.hero-focus,.hero-topline", { y: 50, opacity: 0, duration: 0.8, stagger: 0.06, ease: "power3.out" }, 1.82);

      gsap.fromTo(".hero-film", { clipPath: "inset(0 18% 0 18%)", scale: 1.14 }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1.02, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .7 } });
      gsap.to(".hero-title h1", { xPercent: -9, letterSpacing: "-.09em", ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .65 } });
      gsap.to(".hero-runner", { xPercent: -22, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .6 } });
      gsap.utils.toArray<HTMLElement>(".reveal").forEach(element => gsap.from(element, { y: 70, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 84%" } }));

      const rosterCards = gsap.utils.toArray<HTMLElement>(".static-cast-collage figure");
      const rosterCopy = gsap.utils.toArray<HTMLElement>(".orbit-stages article");
      gsap.set(rosterCards, { xPercent: index => index === 0 ? -50 : index === 1 ? 45 : 115, scale: index => index === 0 ? 1 : .74, opacity: index => index === 2 ? 0 : 1 });
      gsap.set(rosterCopy, { autoAlpha: index => index === 0 ? 1 : 0, y: index => index === 0 ? 0 : 32 });
      gsap.timeline({ scrollTrigger: { trigger: ".orbit", start: "top top", end: "bottom bottom", scrub: .7 } })
        .to(rosterCards[0], { xPercent: -145, scale: .72, opacity: .42, duration: .28 }, .18).to(rosterCards[1], { xPercent: -50, scale: 1, opacity: 1, duration: .3 }, .18)
        .set(rosterCopy[0], { autoAlpha: 0 }, .28).fromTo(rosterCopy[1], { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: .16 }, .3)
        .to(rosterCards[1], { xPercent: -145, scale: .72, opacity: .42, duration: .28 }, .55).to(rosterCards[2], { xPercent: -50, scale: 1, opacity: 1, duration: .3 }, .55)
        .set(rosterCopy[1], { autoAlpha: 0 }, .65).fromTo(rosterCopy[2], { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: .16 }, .67);

      gsap.from(".section-head h2", { clipPath: "inset(0 0 100% 0)", yPercent: 24, duration: 1.15, ease: "power4.out", scrollTrigger: { trigger: ".section-head", start: "top 76%" } });
      gsap.from(".work-filters button", { y: 18, opacity: 0, stagger: .07, duration: .55, scrollTrigger: { trigger: ".work-filters", start: "top 88%" } });
      gsap.utils.toArray<HTMLElement>(".project").forEach((projectElement, index) => {
        const mainImage = projectElement.querySelector(".project-main-image");
        const info = projectElement.querySelector(".project-info");
        gsap.fromTo(mainImage, { scale: 1.15, clipPath: index % 2 ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)" }, { scale: 1, clipPath: "inset(0% 0 0 0)", duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: projectElement, start: "top 78%" } });
        gsap.from(info, { x: index % 2 ? 70 : -70, opacity: 0, duration: .9, ease: "power3.out", scrollTrigger: { trigger: projectElement, start: "top 72%" } });
        gsap.to(mainImage, { yPercent: index % 2 ? 7 : -7, ease: "none", scrollTrigger: { trigger: projectElement, start: "top bottom", end: "bottom top", scrub: .7 } });
      });
      gsap.from(".journal-mark", { rotate: -16, scale: .7, opacity: 0, duration: 1, ease: "back.out(1.4)", scrollTrigger: { trigger: ".journal-head", start: "top 70%" } });
      gsap.from(".journal-image img", { clipPath: "inset(0 100% 0 0)", scale: 1.12, duration: 1.25, ease: "power4.out", scrollTrigger: { trigger: ".journal-lead", start: "top 78%" } });
      gsap.from(".journal-grid article", { y: 60, opacity: 0, stagger: .14, duration: .8, scrollTrigger: { trigger: ".journal-grid", start: "top 82%" } });
      gsap.from(".office-head li", { y: 25, opacity: 0, stagger: .1, duration: .55, scrollTrigger: { trigger: ".office-head", start: "top 76%" } });
      gsap.from(".office-console", { clipPath: "inset(0 0 100% 0)", y: 45, duration: 1.1, ease: "power4.out", scrollTrigger: { trigger: ".office-console", start: "top 82%" } });
      gsap.to(".footer > strong", { xPercent: -10, ease: "none", scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: .6 } });
      gsap.from(".footer-signal i", { scaleX: 0, duration: 1, transformOrigin: "center", scrollTrigger: { trigger: ".footer", start: "top 72%" } });
      ScrollTrigger.create({ start: 0, end: "max", onUpdate: self => document.documentElement.style.setProperty("--progress", `${self.progress * 100}%`) });
    }, rootRef);
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 900);
    const refreshOnLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", refreshOnLoad, { once: true });
    return () => { window.clearTimeout(refreshTimer); window.removeEventListener("load", refreshOnLoad); context.revert(); };
  }, []);

  useEffect(() => {
    const locked = Boolean(profile || project);
    document.documentElement.style.overflow = locked ? "hidden" : "";
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") { setProfile(null); setProject(null); } };
    window.addEventListener("keydown", close);
    return () => { document.documentElement.style.overflow = ""; window.removeEventListener("keydown", close); };
  }, [profile, project]);

  return <main ref={rootRef} data-release="assembly-static-05"><Intro /><div className="page-progress" /><Header /><Hero /><OrbitRoster onSelect={setProfile} /><Work onSelect={setProject} /><Journal onSelect={setProject} /><Office /><Footer />{profile ? <TalentProfile talent={profile} onClose={() => setProfile(null)} /> : null}{project ? <ProjectCase project={project} onClose={() => setProject(null)} /> : null}</main>;
}
