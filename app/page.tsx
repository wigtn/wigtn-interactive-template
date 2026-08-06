"use client";

import { ChangeEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThreeCastingRoom from "./three-casting-room";

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
  chapterImages: [string, string, string];
  detailImage: string;
  previewCue: number;
};

const talents: Talent[] = [
  { name: "NOAH KIM", role: "Model", location: "Seoul", image: "/talent-noah-v3.png", stats: ["187 CM", "SUIT 48", "SHOES 280"], note: "A quiet presence built for long takes, tailored campaigns and precise movement direction.", reelImages: ["/talent-noah-v2.jpg", "/motion-study-v1.png"], reelLabel: "WALK / TURN / STILL", credits: ["Automotive film · 2026", "Maison menswear · 2025", "Available worldwide"] },
  { name: "SOYEON HAN", role: "Actor · Model", location: "Seoul / Tokyo", image: "/talent-soyeon-v3.png", stats: ["174 CM", "KOR · ENG", "FILM · BEAUTY"], note: "A subtle shift in expression carries her from exacting beauty frames into narrative film.", reelImages: ["/soft-focus-beauty-v1.png", "/editorial-backstage-v2.jpg"], reelLabel: "FACE / PROFILE / VOICE", credits: ["Nocturne film · 2026", "Soft Focus beauty · 2026", "Available APAC / EU"] },
  { name: "MIRA SEO", role: "Actor", location: "Seoul", image: "/talent-mira-v3.png", stats: ["170 CM", "KOR · ENG", "FILM · EDITORIAL"], note: "A grounded screen presence with the restraint to hold a narrative frame and the range to shift it.", reelImages: ["/editorial-backstage-v1.png", "/talent-mira-v3.png"], reelLabel: "VOICE / PROFILE / SCENE", credits: ["Field Note 07 · 2026", "Independent film · 2025", "Available worldwide"] },
];

const projects: Project[] = [
  { id: "01", title: "NOCTURNE", type: "Film", year: "2026", image: "/nocturne-film-still-v3.png", detailImage: "/talent-noah-v3.png", previewCue: 0, chapterImages: ["/nocturne-film-still-v3.png", "/talent-soyeon-v3.png", "/talent-noah-v3.png"], statement: "Two figures hold the distance after the light goes out.", delivery: "FILM / 00:42 / 16:9", credits: ["Director — Mira Seo", "Cast — Soyeon Han · Noah Kim", "DOP — Hyun Park", "Run time — 00:42"], chapters: [{ time: "00:00", label: "Arrival", note: "A restrained entrance establishes the distance before either face is fully revealed." }, { time: "00:14", label: "Contact", note: "A single red line joins two performances without turning the frame into spectacle." }, { time: "00:31", label: "Afterimage", note: "The edit slows, leaving posture and eye-line to carry the final beat." }] },
  { id: "02", title: "SOFT FOCUS", type: "Campaign", year: "2026", image: "/soft-focus-beauty-v1.png", detailImage: "/talent-soyeon-v3.png", previewCue: 3.4, chapterImages: ["/soft-focus-beauty-v1.png", "/talent-soyeon-v3.png", "/editorial-backstage-v2.jpg"], statement: "Skin, reflection and one direct gaze form a modular beauty system.", delivery: "KEY VISUAL / MOTION / SOCIAL", credits: ["Client — Nineteen", "Talent — Soyeon Han", "Photo — Jun Lee", "Usage — APAC / 12M"], chapters: [{ time: "01", label: "Key visual", note: "The cobalt field gives product, portrait and copy enough space to work at every ratio." }, { time: "02", label: "Motion cut", note: "Acrylic reflections become transitions for six and fifteen-second campaign edits." }, { time: "03", label: "Social set", note: "Portrait crops are directed for vertical placements instead of adapted after the shoot." }] },
  { id: "03", title: "FIELD NOTE 07", type: "Editorial", year: "2026", image: "/motion-study-v1.png", detailImage: "/talent-mira-v3.png", previewCue: 6.8, chapterImages: ["/motion-study-v1.png", "/editorial-backstage-v1.png", "/talent-mira-v3.png"], statement: "Fifteen minutes of tension before the first frame, kept as an editorial record.", delivery: "STORY / 18 FRAMES / WEB", credits: ["Words — Haeun Cho", "Images — Yuri Lim", "Featuring — Mira Seo", "Published — 18 Mar"], chapters: [{ time: "A", label: "Before set", note: "The room is documented before marks, props and people settle into their final positions." }, { time: "B", label: "The fitting", note: "Small wardrobe decisions explain more about the character than a polished final still." }, { time: "C", label: "First frame", note: "The article ends where the campaign begins: the first deliberate look into camera." }] },
];

const projectPreviewVideos: Record<string, string> = { "01": "/assembly-film-v1.mp4", "02": "/soft-focus-preview-v1.mp4", "03": "/field-note-preview-v1.mp4" };
const projectPreviewWindows: Record<string, number> = { "01": 3.2, "02": 4.7, "03": 4.7 };
const projectPreviewRates: Record<string, number> = { "01": .62, "02": .82, "03": 1 };

function Intro() {
  return <div className="intro" aria-hidden="true">
    <div className="intro-meta"><span>ASSEMBLY / SEOUL</span><span>TALENT MANAGEMENT</span></div>
    <div className="intro-frames"><figure><img src="/talent-noah-v3.png" alt="" /></figure><figure><img src="/talent-soyeon-v3.png" alt="" /></figure><figure><img src="/talent-mira-v3.png" alt="" /></figure></div>
    <div className="intro-word"><span>ASSEMBLY</span></div>
    <div className="intro-count"><b>03</b><span>REPRESENTED / SEOUL</span></div>
    <div className="intro-foot"><span>MODELS · ACTORS · BOOKINGS</span><b>EST. 2026</b></div>
    <div className="intro-panels">{Array.from({ length: 8 }, (_, index) => <i key={index} />)}</div>
  </div>;
}

function Header() {
  const [open, setOpen] = useState(false);
  return <>
    <header className="header">
      <a className="brand" href="#top" aria-label="Assembly home"><i />ASSEMBLY</a>
      <nav aria-label="Primary navigation"><a href="#talent">Talent</a><a href="#work">Work</a><a href="#journal">Journal</a><a href="#office">Management</a></nav>
      <button className="menu-toggle" onClick={() => setOpen(value => !value)} aria-expanded={open}>{open ? "Close" : "Menu"}</button>
      <a className="book-link" href="mailto:book@assembly-seoul.com">Book talent ↗</a>
    </header>
    <div className={`mobile-menu ${open ? "open" : ""}`}>{[["Talent", "#talent"], ["Work", "#work"], ["Journal", "#journal"], ["Management", "#office"]].map(([label, href], index) => <a href={href} key={label} onClick={() => setOpen(false)}><small>0{index + 1}</small>{label}</a>)}</div>
  </>;
}

function Hero() {
  return <section className="hero" id="top">
    <div className="hero-stage">
      <video className="hero-film" autoPlay muted loop playsInline preload="auto" poster="/nocturne-film-still-v3.png" onLoadedMetadata={event => { event.currentTarget.playbackRate = 0.42; }}><source src="/assembly-film-v1.mp4" type="video/mp4" /></video>
      <ThreeCastingRoom />
      <div className="hero-shade" />
      <div className="hero-frame" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="hero-topline"><span>Independent talent management agency</span><span>Seoul / Worldwide</span></div>
      <div className="hero-title"><p>MODELS · ACTORS · BOOKINGS</p><div className="hero-word"><h1>ASSEMBLY</h1><div className="hero-title-slices" aria-hidden="true"><span>ASSEMBLY</span><span>ASSEMBLY</span><span>ASSEMBLY</span></div><i className="hero-title-gate" aria-hidden="true" /></div></div>
      <div className="hero-copy"><p>We represent distinctive models and actors for film, fashion and beauty.</p><a href="#talent">Meet our talent <span>↓</span></a></div>
      <div className="hero-focus"><small>NOW BOOKING</small><strong>Q3 / 2026</strong><span>FILM · FASHION · BEAUTY</span></div>
      <div className="hero-sequence" aria-hidden="true"><span><i>01</i>ENTER</span><span><i>02</i>SELECT</span><span><i>03</i>ASSEMBLE</span></div>
      <div className="hero-readout" aria-hidden="true"><span>CAMERA / Z</span><b>+07.8</b><i /></div>
      <div className="hero-resolve" aria-hidden="true"><span>ASSEMBLY / REPRESENTED</span><i /><b>03 TALENTS</b></div>
      <div className="hero-final"><span>REPRESENTED TALENT / SEOUL</span><strong><i>SELECTED.</i><i>IN MOTION.</i></strong><p>Talent management and casting for film, fashion and beauty.</p></div>
      <div className="hero-runner" aria-hidden="true"><span>TALENT MANAGEMENT</span><i /><span>CASTING</span><i /><span>BOOKINGS</span><i /><span>SEOUL / WORLDWIDE</span></div>
    </div>
  </section>;
}

function OrbitRoster({ onSelect }: { onSelect: (talent: Talent) => void }) {
  return <section className="orbit" id="talent">
    <div className="orbit-sticky">
      <div className="static-cast-collage" aria-hidden="true">{talents.map((talent, index) => <figure key={talent.name}><img className="cast-primary" src={talent.image} alt="" loading="eager" decoding="async" /><div className="cast-strips">{Array.from({ length: 6 }, (_, strip) => <i key={strip} style={{ backgroundImage: `url(${talent.image})` }} />)}</div><img className="cast-echo" src={talent.image} alt="" loading="eager" decoding="async" /><figcaption><span>0{index + 1}</span><strong>{talent.name}</strong></figcaption></figure>)}</div>
      <div className="orbit-serial" aria-hidden="true"><span>01</span><span>02</span><span>03</span></div>
      <div className="orbit-scan" aria-hidden="true" />
      <div className="orbit-index"><span>REPRESENTED / 2026</span><span>03 TALENTS</span></div>
      <div className="orbit-stages">
        <article><small>01 / NOAH KIM</small><h2>A quiet presence built for long takes.</h2><p>Menswear, automotive and narrative film. He knows when to hold a frame and when to move through it.</p></article>
        <article><small>02 / SOYEON HAN</small><h2>One expression can turn the scene.</h2><p>Beauty precision with the emotional range to carry narrative work in Seoul and Tokyo.</p></article>
        <article><small>03 / MIRA SEO</small><h2>A performance that holds before it speaks.</h2><p>Narrative instinct and measured movement for film, editorial and character-led campaigns.</p></article>
      </div>
      <div className="orbit-meter"><i><b /></i><span>SCROLL TO SHIFT THE CAST</span></div>
    </div>
    <div className="talent-list">
      <div className="talent-list-head"><span>REPRESENTED TALENT / 03</span><strong>SELECT A PROFILE</strong></div>
      {talents.map((talent, index) => <button className="talent-row" key={talent.name} onClick={() => onSelect(talent)} aria-label={`Open ${talent.name} profile`}>
        <span className="talent-no">0{index + 1}</span><span className="talent-thumb"><img src={talent.image} alt="" /></span><strong>{talent.name}</strong><span>{talent.role}</span><span>{talent.location}</span><i>↗</i>
      </button>)}
    </div>
  </section>;
}

function ProjectPreview({ project, index, onSelect }: { project: Project; index: number; onSelect: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [previewing, setPreviewing] = useState(false);
  const cueStart = project.id === "01" ? project.previewCue : 0;

  const setPreviewCue = (video: HTMLVideoElement) => {
    if (!Number.isFinite(video.duration)) return;
    video.currentTime = Math.min(cueStart, Math.max(0, video.duration - .35));
  };
  const startPreview = () => {
    if (window.matchMedia("(hover: none), (prefers-reduced-motion: reduce)").matches) return;
    const video = videoRef.current;
    if (!video) return;
    setPreviewing(true);
    if (video.readyState >= 1) setPreviewCue(video);
    void video.play().catch(() => setPreviewing(false));
  };
  const stopPreview = () => {
    setPreviewing(false);
    videoRef.current?.pause();
  };
  const keepPreviewLoop = (video: HTMLVideoElement) => {
    if (!previewing || !Number.isFinite(video.duration)) return;
    const cue = Math.min(cueStart, Math.max(0, video.duration - .35));
    const end = Math.min(video.duration - .05, cue + projectPreviewWindows[project.id]);
    if (video.currentTime >= end) video.currentTime = cue;
  };

  return <button className={`project-media ${previewing ? "is-previewing" : ""}`} onClick={onSelect} onMouseEnter={startPreview} onMouseLeave={stopPreview} onFocus={startPreview} onBlur={stopPreview} aria-label={`Open ${project.title} case study`}>
    <img className="project-main-image" src={project.image} alt={`${project.title} campaign still`} loading="eager" decoding="async" fetchPriority={index < 2 ? "high" : "auto"} />
    <video ref={videoRef} className="project-preview-video" muted playsInline preload="metadata" poster={project.image} aria-hidden="true" onLoadedMetadata={event => { event.currentTarget.playbackRate = projectPreviewRates[project.id]; if (previewing) { setPreviewCue(event.currentTarget); void event.currentTarget.play(); } }} onTimeUpdate={event => keepPreviewLoop(event.currentTarget)}><source src={projectPreviewVideos[project.id]} type="video/mp4" /></video>
    <span className="project-preview-state" aria-hidden="true">MOTION PREVIEW</span><span className="project-open">VIEW CASE ↗</span><span className="project-delivery">{project.delivery}</span><i className="project-scan" aria-hidden="true" />
  </button>;
}

function Work({ onSelect }: { onSelect: (project: Project) => void }) {
  const [filter, setFilter] = useState<"All" | Project["type"]>("All");
  const listRef = useRef<HTMLDivElement>(null);
  const filtered = filter === "All" ? projects : projects.filter(project => project.type === filter);
  useLayoutEffect(() => {
    if (!listRef.current) return;
    const cards = listRef.current.querySelectorAll(".project");
    gsap.fromTo(cards, { autoAlpha: 0, y: 34, clipPath: "inset(0 0 8% 0)" }, { autoAlpha: 1, y: 0, clipPath: "inset(0% 0 0 0)", duration: .72, stagger: .08, ease: "power3.out", clearProps: "transform,clipPath" });
  }, [filter]);
  return <section className="work" id="work">
    <header className="section-head reveal"><div><span>TALENT IN WORK</span><span>2025—2026</span></div><h2>Our roster, on screen.</h2><p>Recent film, fashion and beauty work featuring talent represented by Assembly.</p></header>
    <div className="work-filters" aria-label="Project filters">{(["All", "Film", "Campaign", "Editorial"] as const).map(item => <button key={item} className={filter === item ? "active" : ""} aria-pressed={filter === item} onClick={() => setFilter(item)}><span>{item}</span></button>)}</div>
    <div className="project-list" ref={listRef}>
      {filtered.map((project, index) => <article className="project" data-project={project.id} key={project.id}>
        <ProjectPreview project={project} index={index} onSelect={() => onSelect(project)} />
        <div className="project-info"><span>{project.id} / {project.type}</span><h3>{project.title}</h3><p>{project.statement}</p><small>{project.year}</small></div>
      </article>)}
    </div>
  </section>;
}

function useOverlayExperience(identity: string, onClose: () => void) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    gsap.registerPlugin(ScrollTrigger);
    overlay.scrollTop = 0;
    overlay.style.setProperty("--overlay-progress", "0%");
    overlay.focus({ preventScroll: true });

    const context = gsap.context(() => {
      gsap.fromTo(overlay, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: .72, ease: "power4.inOut" });
      gsap.from(".overlay-nav > *", { y: 16, opacity: 0, stagger: .06, duration: .55, delay: .45, ease: "power3.out" });
      gsap.utils.toArray<HTMLElement>(".overlay-reveal").forEach((element, index) => {
        gsap.from(element, { y: 54, opacity: 0, duration: .85, delay: index === 0 ? .3 : 0, ease: "power3.out", scrollTrigger: { trigger: element, scroller: overlay, start: "top 86%" } });
      });
    }, overlay);

    const syncProgress = () => {
      const range = Math.max(1, overlay.scrollHeight - overlay.clientHeight);
      overlay.style.setProperty("--overlay-progress", `${Math.min(100, overlay.scrollTop / range * 100)}%`);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        const closeButton = overlay.querySelector<HTMLButtonElement>("[data-overlay-close]");
        closeButton?.click();
      }
    };
    overlay.addEventListener("scroll", syncProgress, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => {
      window.clearTimeout(refresh);
      overlay.removeEventListener("scroll", syncProgress);
      window.removeEventListener("keydown", onKeyDown);
      context.revert();
    };
  }, [identity]);

  const closeOverlay = () => {
    const overlay = overlayRef.current;
    if (!overlay || overlay.dataset.closing === "true") return;
    overlay.dataset.closing = "true";
    gsap.timeline({ onComplete: () => closeRef.current() })
      .to(overlay.querySelectorAll(".overlay-nav,.overlay-reveal"), { y: -16, opacity: 0, duration: .22, stagger: .018, ease: "power2.in" })
      .to(overlay, { clipPath: "inset(0 0 100% 0)", duration: .48, ease: "power4.inOut" }, .12);
  };

  return { overlayRef, closeOverlay };
}

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return "00:00";
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
};

function CaseHeroMedia({ project }: { project: Project }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(project.type === "Film");
  const [muted, setMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  if (project.type !== "Film") return <img src={project.image} alt={`${project.title} campaign still`} />;
  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play(); else video.pause();
  };
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };
  const seek = (value: number) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    video.currentTime = value / 100 * duration;
    setCurrentTime(video.currentTime);
  };
  return <>
    <video ref={videoRef} autoPlay muted loop playsInline poster={project.image} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onLoadedMetadata={event => setDuration(event.currentTarget.duration)} onTimeUpdate={event => setCurrentTime(event.currentTarget.currentTime)}><source src="/assembly-film-v1.mp4" type="video/mp4" /></video>
    <aside className="case-player" aria-label="Film controls">
      <button onClick={togglePlayback} aria-label={playing ? "Pause film" : "Play film"}><i className={playing ? "pause" : "play"} />{playing ? "PAUSE" : "PLAY"}</button>
      <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
      <input type="range" min="0" max="100" step="0.1" value={duration ? currentTime / duration * 100 : 0} onChange={event => seek(Number(event.target.value))} aria-label="Film timeline" style={{ "--media-progress": `${duration ? currentTime / duration * 100 : 0}%` } as CSSProperties} />
      <button onClick={toggleMute} aria-label={muted ? "Unmute film" : "Mute film"}>{muted ? "SOUND OFF" : "SOUND ON"}</button>
    </aside>
  </>;
}

function Journal({ onSelect }: { onSelect: (project: Project) => void }) {
  return <section className="journal" id="journal">
    <header className="journal-head reveal"><div><span>AGENCY JOURNAL / 07</span><h2>What a profile cannot show.</h2><p>Castings, fittings, movement tests and the working notes behind every booking.</p></div><div className="journal-mark" aria-hidden="true"><b>07</b><span>CAST / FIT / BOOK</span></div></header>
    <article className="journal-lead reveal"><div className="journal-image"><img src="/editorial-backstage-v1.png" alt="Wardrobe fitting before the first frame" /><span>15 MINUTES BEFORE CAMERA</span></div><div><span>ON SET / 18 MAR</span><h3>Before the first frame.</h3><p>The fitting is over and the lights are still down. This is when a cast and crew begin imagining the same scene.</p><button onClick={() => onSelect(projects[2])}>READ FIELD NOTE ↗</button></div></article>
    <div className="journal-grid"><article><span>CASTING / 04</span><h3>Inside a movement test.</h3><p>Movement, voice and pace—the three checks we make before a final shortlist.</p></article><article><span>BOOKINGS / 11</span><h3>Preparing talent for the mobile frame.</h3><p>Portrait, movement and expression need a different rhythm when the screen fits in one hand.</p></article></div>
  </section>;
}

type OfficeItem = { title: string; type: string; live: boolean; image: string; updated: string };

function Office() {
  const [items, setItems] = useState<OfficeItem[]>([
    { title: "Nocturne", type: "Campaign", live: true, image: "/nocturne-film-still-v3.png", updated: "2 min ago" },
    { title: "Noah Kim", type: "Talent", live: true, image: "/talent-noah-v3.png", updated: "18 min ago" },
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
    <header className="office-head reveal"><div><span>MANAGEMENT DESK / LIVE</span><h2>One desk for every profile and placement.</h2></div><p>Talent profiles, recent work and agency journal entries share one editing flow. Update media, availability and visibility without a developer.</p><ul><li><b>03</b> content types</li><li><b>01</b> live preview</li><li><b>500</b> MB upload</li></ul></header>
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
  const { overlayRef, closeOverlay } = useOverlayExperience(`profile-${slug}`, onClose);
  return <div ref={overlayRef} className="overlay profile-overlay" role="dialog" aria-modal="true" aria-label={`${talent.name} profile`} tabIndex={-1}><div className="overlay-nav"><button data-overlay-close onClick={closeOverlay}>← BACK TO ROSTER</button><span>{talent.name} / PROFILE 2026</span><i className="overlay-progress" aria-hidden="true" /></div><div className={`talent-profile talent-${slug}`}>
    <figure className="profile-hero-image"><img src={talent.image} alt={`${talent.name} full portrait`} decoding="sync" fetchPriority="high" /><figcaption>FULL-LENGTH CASTING PORTRAIT / 01</figcaption></figure>
    <div className="profile-copy"><span>{talent.role} / {talent.location}</span><h2>{talent.name}</h2><p>{talent.note}</p><dl>{talent.stats.map((stat, index) => <div key={stat}><dt>0{index + 1}</dt><dd>{stat}</dd></div>)}</dl><div className="profile-links"><button className={shortlisted ? "selected" : ""} aria-pressed={shortlisted} onClick={() => setShortlisted(value => !value)}>{shortlisted ? "ADDED TO SHORTLIST ✓" : "ADD TO SHORTLIST"}</button><a href="mailto:book@assembly-seoul.com">REQUEST BOOKING ↗</a></div></div>
    <section className="profile-reel overlay-reveal"><header><span>MOVEMENT INDEX</span><strong>{talent.reelLabel}</strong></header><div className="profile-reel-grid"><figure><img src={talent.reelImages[0]} alt={`${talent.name} movement test one`} /><figcaption>01 / CONTROLLED MOVEMENT</figcaption></figure><figure><img src={talent.reelImages[1]} alt={`${talent.name} movement test two`} /><figcaption>02 / CAMERA RESPONSE</figcaption></figure></div></section>
    <section className="profile-record overlay-reveal"><span>RECENT RECORD</span>{talent.credits.map((credit, index) => <div key={credit}><b>0{index + 1}</b><strong>{credit}</strong></div>)}</section>
    <div className="overlay-end overlay-reveal"><button data-overlay-close onClick={closeOverlay}>← BACK TO ROSTER</button><a href="mailto:book@assembly-seoul.com">CHECK AVAILABILITY ↗</a></div>
  </div></div>;
}

function ProjectCase({ project, onClose }: { project: Project; onClose: () => void }) {
  const [activeChapter, setActiveChapter] = useState(0);
  const { overlayRef, closeOverlay } = useOverlayExperience(`case-${project.id}`, onClose);
  const description = project.type === "Film" ? "Performance, light and edit were developed as one continuous forty-two second arc." : project.type === "Campaign" ? "One image system moves deliberately across key visual, motion and vertical social placements." : "The story pairs close observation with working images from the minutes before production begins.";
  const processLabel = project.type === "Film" ? "PERFORMANCE TEST / NOAH KIM" : project.type === "Campaign" ? "BEAUTY TEST / SOYEON HAN" : "ON SET / MIRA SEO";
  return <div ref={overlayRef} className="overlay case-overlay" role="dialog" aria-modal="true" aria-label={`${project.title} case study`} tabIndex={-1}><div className="overlay-nav"><button data-overlay-close onClick={closeOverlay}>← BACK TO WORK</button><span>CASE {project.id} / {project.type.toUpperCase()}</span><i className="overlay-progress" aria-hidden="true" /></div><article className={`case case-${project.type.toLowerCase()}`}>
    <header><span>ASSEMBLY / CASE {project.id}</span><span>{project.type} · {project.year}</span></header>
    <div className="case-hero"><CaseHeroMedia project={project} /><div><span>{project.delivery}</span><h2>{project.title}</h2><p>{project.statement}</p></div></div>
    <div className="case-body overlay-reveal"><div><span>THE WORK</span><h3>{description}</h3></div><dl>{project.credits.map(item => { const [key, value] = item.split(" — "); return <div key={item}><dt>{key}</dt><dd>{value}</dd></div>; })}</dl></div>
    <section className="case-process overlay-reveal"><figure className="case-frame-stack">{project.chapterImages.map((image, index) => <img key={image} className={activeChapter === index ? "active" : ""} src={image} alt={`${project.title} ${project.chapters[index].label} frame`} />)}<div className="case-frame-index"><span>0{activeChapter + 1}</span><i /><span>03</span></div><figcaption>{processLabel} / {project.chapters[activeChapter].label}</figcaption></figure><div><span>SELECT A CHAPTER</span>{project.chapters.map((chapter, index) => <button type="button" className={activeChapter === index ? "active" : ""} aria-pressed={activeChapter === index} key={chapter.time} onClick={() => setActiveChapter(index)} onMouseEnter={() => setActiveChapter(index)} onFocus={() => setActiveChapter(index)}><i>0{index + 1}</i><b>{chapter.time}</b><span><h4>{chapter.label}</h4><p>{chapter.note}</p></span><em>↗</em></button>)}</div></section>
    <div className="case-end overlay-reveal"><span>RELATED CAST</span><strong>{project.id === "03" ? "MIRA SEO" : "SOYEON HAN · NOAH KIM"}</strong><a href="mailto:hello@assembly-seoul.com?subject=Project%20enquiry">START A SIMILAR PROJECT ↗</a></div>
    <div className="overlay-end overlay-reveal"><button data-overlay-close onClick={closeOverlay}>← BACK TO WORK</button><a href="mailto:hello@assembly-seoul.com">NEW BUSINESS ↗</a></div>
  </article></div>;
}

function Footer() {
  return <footer className="footer"><div className="footer-call"><span>BOOKINGS / NEW BUSINESS</span><h2>Need the right talent for your next brief?</h2><a href="mailto:hello@assembly-seoul.com">Send a booking enquiry ↗</a></div><div className="footer-signal" aria-hidden="true"><i /><span>AVAILABLE FOR Q3 / 2026</span><i /></div><strong>ASSEMBLY</strong><div className="footer-bottom"><span>SEOUL · WORLDWIDE</span><span>TALENT MANAGEMENT · CASTING</span><span>© 2026 ASSEMBLY</span><a href="#top">Back to top ↑</a></div></footer>;
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

      const heroSteps = gsap.utils.toArray<HTMLElement>(".hero-sequence span");
      const titleSlices = gsap.utils.toArray<HTMLElement>(".hero-title-slices span");
      gsap.set(heroSteps, { opacity: .24 });
      gsap.set(".hero-final", { autoAlpha: 0, y: 28 });
      gsap.set(titleSlices, { autoAlpha: 0, xPercent: 0 });
      gsap.set(".hero-readout", { autoAlpha: 0 });
      gsap.set(".hero-resolve", { autoAlpha: 0 });
      gsap.set(".hero-resolve i", { scaleX: 0, transformOrigin: "left" });
      gsap.set(".hero-title-gate", { autoAlpha: 0, scaleY: 0, x: 0, force3D: true, transformOrigin: "center" });
      gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom bottom", scrub: 1.05, invalidateOnRefresh: true } })
        .to(".hero-film", { scale: 1.1, opacity: .2, filter: "grayscale(.88) contrast(1.24) brightness(.36)", duration: .42, ease: "none" }, 0)
        .to(".hero-shade", { opacity: .58, duration: .3, ease: "none" }, 0)
        .to(titleSlices, { autoAlpha: .1, duration: .16, stagger: .008, ease: "none" }, .08)
        .to(".hero-readout", { autoAlpha: 1, duration: .08 }, .08)
        .to(".hero-readout b", { textContent: "-01.5", snap: { textContent: .1 }, duration: .22, ease: "none" }, .08)
        .to(heroSteps[0], { opacity: 1, color: "#e44832", duration: .06 }, .08)
        .to(heroSteps[0], { opacity: .24, color: "#f2eee6", duration: .05 }, .29)
        .to(heroSteps[1], { opacity: 1, color: "#e44832", duration: .06 }, .29)
        .to(".hero-readout b", { textContent: "-09.5", snap: { textContent: .1 }, duration: .27, ease: "none" }, .3)
        .to(titleSlices, { autoAlpha: .06, duration: .14, ease: "none" }, .31)
        .to(".hero-copy,.hero-focus,.hero-title p", { autoAlpha: 0, y: -22, duration: .13, ease: "none" }, .38)
        .to(".hero-title-gate", { autoAlpha: 1, scaleY: 1, duration: .06, ease: "power2.out" }, .43)
        .to(".hero-title-gate", { x: () => document.querySelector<HTMLElement>(".hero-word")?.offsetWidth ?? 0, duration: .26, ease: "none", force3D: true, autoRound: false }, .43)
        .to(".hero-title h1", { clipPath: "inset(0 0 0 100%)", duration: .26, ease: "none" }, .43)
        .to(titleSlices, { autoAlpha: 0, xPercent: 0, duration: .1, ease: "none" }, .45)
        .to(".hero-resolve", { autoAlpha: 1, duration: .08, ease: "none" }, .46)
        .to(".hero-resolve i", { scaleX: 1, duration: .18, ease: "power2.inOut" }, .46)
        .to(heroSteps[1], { opacity: .24, color: "#f2eee6", duration: .05 }, .57)
        .to(heroSteps[2], { opacity: 1, color: "#e44832", duration: .06 }, .57)
        .to(".hero-readout b", { textContent: "-17.9", snap: { textContent: .1 }, duration: .2, ease: "none" }, .58)
        .to(".hero-title-gate", { autoAlpha: 0, duration: .05, ease: "none" }, .69)
        .to(".hero-title", { autoAlpha: 0, duration: .06, ease: "none" }, .69)
        .to(".hero-resolve", { autoAlpha: 0, duration: .1, ease: "none" }, .69)
        .to(".hero-final", { autoAlpha: 1, y: 0, duration: .18, ease: "power2.out" }, .72)
        .to(".hero-frame", { opacity: .78, inset: "86px 8vw 92px", duration: .2, ease: "none" }, .74)
        .to(".hero-readout", { autoAlpha: .34, duration: .12 }, .82);
      gsap.utils.toArray<HTMLElement>(".reveal:not(.journal-head):not(.journal-lead):not(.office-head):not(.office-console)").forEach(element => gsap.from(element, { y: 70, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 84%" } }));

      const rosterCards = gsap.utils.toArray<HTMLElement>(".static-cast-collage figure");
      const rosterCopy = gsap.utils.toArray<HTMLElement>(".orbit-stages article");
      const rosterSerials = gsap.utils.toArray<HTMLElement>(".orbit-serial span");
      const rosterEchoes = gsap.utils.toArray<HTMLElement>(".cast-echo");
      const rosterStrips = gsap.utils.toArray<HTMLElement>(".cast-strips");
      gsap.set(rosterCards, { xPercent: index => index === 0 ? -50 : index === 1 ? 45 : 115, scale: index => index === 0 ? 1 : .78, rotateY: index => index === 0 ? 0 : -18, opacity: index => index === 0 ? 1 : 0, clipPath: index => index === 0 ? "inset(0% 0% 0% 0%)" : "inset(0% 100% 0% 0%)", transformPerspective: 1100 });
      gsap.set(rosterCopy, { autoAlpha: index => index === 0 ? 1 : 0, y: index => index === 0 ? 0 : 32 });
      gsap.set(rosterSerials, { autoAlpha: index => index === 0 ? 1 : 0, yPercent: index => index === 0 ? 0 : 35 });
      gsap.set(rosterEchoes, { xPercent: -7, autoAlpha: 0 });
      gsap.set(rosterStrips, { autoAlpha: 0 });
      rosterStrips.forEach(strips => gsap.set(strips.children, { xPercent: 0 }));
      gsap.set(".talent-list-head", { autoAlpha: 0, y: 24 });
      gsap.timeline({ scrollTrigger: { trigger: ".orbit", start: "top top", end: "bottom bottom", scrub: 1.45 } })
        .to(".orbit-scan", { yPercent: 1650, duration: 1, ease: "none" }, 0)
        .to(".orbit-meter b", { scaleX: 1, duration: 1, ease: "none" }, 0)
        .to(rosterCards[0], { xPercent: -138, scale: .84, rotateY: 10, opacity: .16, filter: "blur(2px)", duration: .36, ease: "power2.inOut" }, .12)
        .to(rosterCards[1], { xPercent: -50, scale: 1, rotateY: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: .4, ease: "power2.inOut" }, .13)
        .fromTo(rosterStrips[1], { autoAlpha: 0 }, { autoAlpha: .22, duration: .16, yoyo: true, repeat: 1, ease: "sine.inOut" }, .19)
        .to(rosterStrips[1].children, { xPercent: index => index % 2 ? 3 : -3, duration: .2, stagger: .016, yoyo: true, repeat: 1, ease: "sine.inOut" }, .19)
        .fromTo(rosterEchoes[1], { autoAlpha: 0, xPercent: -3 }, { autoAlpha: .14, xPercent: 3, duration: .18, yoyo: true, repeat: 1, ease: "sine.inOut" }, .19)
        .to(rosterSerials[0], { autoAlpha: 0, yPercent: -18, duration: .16 }, .25).fromTo(rosterSerials[1], { autoAlpha: 0, yPercent: 18 }, { autoAlpha: 1, yPercent: 0, duration: .18 }, .27)
        .to(rosterCopy[0], { autoAlpha: 0, y: -18, duration: .16 }, .24).fromTo(rosterCopy[1], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .2 }, .27)
        .to(rosterCards[1], { xPercent: -138, scale: .84, rotateY: 10, opacity: .16, filter: "blur(2px)", duration: .36, ease: "power2.inOut" }, .51)
        .to(rosterCards[2], { xPercent: -50, scale: 1, rotateY: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: .4, ease: "power2.inOut" }, .52)
        .fromTo(rosterStrips[2], { autoAlpha: 0 }, { autoAlpha: .22, duration: .16, yoyo: true, repeat: 1, ease: "sine.inOut" }, .58)
        .to(rosterStrips[2].children, { xPercent: index => index % 2 ? -3 : 3, duration: .2, stagger: .016, yoyo: true, repeat: 1, ease: "sine.inOut" }, .58)
        .fromTo(rosterEchoes[2], { autoAlpha: 0, xPercent: -3 }, { autoAlpha: .14, xPercent: 3, duration: .18, yoyo: true, repeat: 1, ease: "sine.inOut" }, .58)
        .to(rosterSerials[1], { autoAlpha: 0, yPercent: -18, duration: .16 }, .64).fromTo(rosterSerials[2], { autoAlpha: 0, yPercent: 18 }, { autoAlpha: 1, yPercent: 0, duration: .18 }, .66)
        .to(rosterCopy[1], { autoAlpha: 0, y: -18, duration: .16 }, .63).fromTo(rosterCopy[2], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .2 }, .66)
        .to(".orbit-meter,.static-cast-collage,.orbit-stages,.orbit-serial,.orbit-scan", { autoAlpha: 0, duration: .14 }, .9)
        .to(".talent-list-head", { autoAlpha: 1, y: 0, duration: .12 }, .91);

      gsap.from(".section-head h2", { clipPath: "inset(0 0 100% 0)", yPercent: 24, duration: 1.15, ease: "power4.out", scrollTrigger: { trigger: ".section-head", start: "top 76%" } });
      gsap.from(".work-filters button", { y: 18, opacity: 0, stagger: .07, duration: .55, scrollTrigger: { trigger: ".work-filters", start: "top 88%" } });
      gsap.utils.toArray<HTMLElement>(".project").forEach((projectElement, index) => {
        const mainImage = projectElement.querySelector(".project-main-image");
        const info = projectElement.querySelector(".project-info");
        const scan = projectElement.querySelector(".project-scan");
        gsap.fromTo(mainImage, { scale: 1.035, autoAlpha: .38, filter: "grayscale(.48) brightness(.62)", clipPath: "inset(0%)" }, { scale: 1.005, autoAlpha: 1, filter: "grayscale(0) brightness(1)", duration: 1.05, ease: "power3.out", scrollTrigger: { trigger: projectElement, start: "top 94%" } });
        gsap.from(info, { x: index % 2 ? 34 : -34, opacity: 0, duration: .82, ease: "power3.out", scrollTrigger: { trigger: projectElement, start: "top 88%" } });
        gsap.to(mainImage, { yPercent: index === 0 ? 0 : index % 2 ? 1.2 : -1.2, ease: "none", scrollTrigger: { trigger: projectElement, start: "top bottom", end: "bottom top", scrub: 1.15 } });
        gsap.fromTo(scan, { scaleX: 0, xPercent: -100 }, { scaleX: 1, xPercent: 100, duration: .8, ease: "power3.inOut", scrollTrigger: { trigger: projectElement, start: "top 76%" } });
      });
      gsap.from(".journal-head h2", { clipPath: "inset(0 0 100% 0)", yPercent: 18, duration: 1.05, ease: "power4.out", scrollTrigger: { trigger: ".journal-head", start: "top 82%" } });
      gsap.from(".journal-head p", { y: 28, opacity: 0, duration: .75, ease: "power3.out", scrollTrigger: { trigger: ".journal-head", start: "top 74%" } });
      gsap.fromTo(".journal-mark", { rotate: -8, y: 48, opacity: .18 }, { rotate: 4, y: -18, opacity: 1, ease: "none", scrollTrigger: { trigger: ".journal-head", start: "top 88%", end: "bottom 28%", scrub: 1.35 } });
      gsap.from(".journal-image img", { clipPath: "inset(0 100% 0 0)", scale: 1.1, duration: 1.15, ease: "power4.out", scrollTrigger: { trigger: ".journal-lead", start: "top 88%" } });
      gsap.to(".journal-image img", { yPercent: -5, scale: 1.035, ease: "none", scrollTrigger: { trigger: ".journal-lead", start: "top bottom", end: "bottom top", scrub: 1.4 } });
      gsap.from(".journal-lead > div:last-child > *", { y: 26, opacity: 0, stagger: .09, duration: .68, ease: "power3.out", scrollTrigger: { trigger: ".journal-lead", start: "top 76%" } });
      gsap.from(".journal-grid article", { x: index => index ? 42 : -42, y: 28, opacity: 0, stagger: .12, duration: .88, ease: "power3.out", scrollTrigger: { trigger: ".journal-grid", start: "top 86%" } });
      gsap.from(".office-head h2,.office-head p", { y: 38, opacity: 0, stagger: .11, duration: .82, ease: "power3.out", scrollTrigger: { trigger: ".office-head", start: "top 84%" } });
      gsap.from(".office-head li", { x: 24, opacity: 0, stagger: .09, duration: .6, ease: "power3.out", scrollTrigger: { trigger: ".office-head", start: "top 72%" } });
      gsap.from(".office-console", { clipPath: "inset(0 0 8% 0)", y: 54, opacity: .2, scale: .985, transformOrigin: "top center", duration: 1.05, ease: "power4.out", scrollTrigger: { trigger: ".office-console", start: "top 88%" } });
      gsap.from(".office-console > aside,.office-editor,.office-preview", { y: 30, opacity: 0, stagger: .12, duration: .72, ease: "power3.out", scrollTrigger: { trigger: ".office-console", start: "top 76%" } });
      gsap.to(".preview-frame img", { scale: 1.07, yPercent: -2.5, ease: "none", scrollTrigger: { trigger: ".office-console", start: "top bottom", end: "bottom top", scrub: 1.5 } });
      gsap.from(".footer-call > span,.footer-call > a", { y: 24, opacity: 0, stagger: .12, duration: .68, ease: "power3.out", scrollTrigger: { trigger: ".footer", start: "top 78%" } });
      gsap.from(".footer-call h2", { clipPath: "inset(0 0 100% 0)", yPercent: 20, duration: 1.05, ease: "power4.out", scrollTrigger: { trigger: ".footer", start: "top 78%" } });
      gsap.from(".footer-signal i", { scaleX: 0, duration: 1, transformOrigin: "center", scrollTrigger: { trigger: ".footer", start: "top 64%" } });
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
    return () => { document.documentElement.style.overflow = ""; };
  }, [profile, project]);

  return <main ref={rootRef} data-release="assembly-static-14"><Intro /><div className="page-progress" /><Header /><Hero /><OrbitRoster onSelect={setProfile} /><Work onSelect={setProject} /><Journal onSelect={setProject} /><Office /><Footer />{profile ? <TalentProfile talent={profile} onClose={() => setProfile(null)} /> : null}{project ? <ProjectCase project={project} onClose={() => setProject(null)} /> : null}</main>;
}
