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
};

type Project = {
  id: string;
  title: string;
  type: "Film" | "Campaign" | "Editorial";
  year: string;
  image: string;
  statement: string;
  credits: string[];
  chapters: { time: string; label: string }[];
};

const talents: Talent[] = [
  { name: "NOAH KIM", role: "Model", location: "Seoul", image: "/talent-noah-v2.jpg", stats: ["187 CM", "SUIT 48", "SHOES 280"], note: "정적인 프레임과 긴 호흡의 필름에서 선명한 인상을 남깁니다." },
  { name: "SOYEON HAN", role: "Actor · Model", location: "Seoul / Tokyo", image: "/cast-hero-v2.jpg", stats: ["174 CM", "KOR · ENG", "FILM · BEAUTY"], note: "절제된 표정과 움직임으로 뷰티, 패션, 내러티브 캠페인을 오갑니다." },
  { name: "MIRA SEO", role: "Film Director", location: "Seoul", image: "/editorial-backstage-v2.jpg", stats: ["COMMERCIAL", "MUSIC FILM", "EDITORIAL"], note: "인물의 작은 움직임을 중심으로 광고와 에디토리얼 필름을 연출합니다." },
];

const projects: Project[] = [
  { id: "01", title: "NOCTURNE", type: "Film", year: "2026", image: "/cast-hero-v2.jpg", statement: "빛이 꺼진 뒤에도 남는 두 사람의 거리.", credits: ["Director — Mira Seo", "Cast — Soyeon Han · Noah Kim", "DOP — Hyun Park", "Run time — 00:42"], chapters: [{ time: "00:00", label: "Arrival" }, { time: "00:14", label: "Contact" }, { time: "00:31", label: "Afterimage" }] },
  { id: "02", title: "SOFT FOCUS", type: "Campaign", year: "2026", image: "/campaign-nocturne-v1.png", statement: "피부의 질감과 시선만 남긴 뷰티 캠페인.", credits: ["Client — Nineteen", "Talent — Soyeon Han", "Photo — Jun Lee", "Usage — APAC / 12M"], chapters: [{ time: "01", label: "Key visual" }, { time: "02", label: "Motion cut" }, { time: "03", label: "Social set" }] },
  { id: "03", title: "FIELD NOTE 07", type: "Editorial", year: "2026", image: "/editorial-backstage-v2.jpg", statement: "촬영 전 열다섯 분, 현장에 흐르는 긴장을 기록했습니다.", credits: ["Words — Haeun Cho", "Images — Yuri Lim", "Featuring — Mira Seo", "Published — 18 Mar"], chapters: [{ time: "A", label: "Before set" }, { time: "B", label: "The fitting" }, { time: "C", label: "First frame" }] },
];

function Intro() {
  return <div className="intro" aria-hidden="true">
    <div className="intro-meta"><span>ASSEMBLY / SEOUL</span><span>CASTING OFFICE</span></div>
    <div className="intro-word"><span>ASSEMBLY</span></div>
    <div className="intro-foot"><span>MODEL · ACTOR · CASTING PRODUCTION</span><b>EST. 2026</b></div>
    <div className="intro-panels">{Array.from({ length: 8 }, (_, index) => <i key={index} />)}</div>
  </div>;
}

function Header() {
  const [open, setOpen] = useState(false);
  return <>
    <header className="header">
      <a className="brand" href="#top" aria-label="Assembly 홈"><i />ASSEMBLY</a>
      <nav aria-label="주요 메뉴"><a href="#talent">Talent</a><a href="#work">Campaigns</a><a href="#journal">Journal</a><a href="#office">Office</a></nav>
      <div className="header-place"><i /> SEOUL <span>00:00</span></div>
      <button className="menu-toggle" onClick={() => setOpen(value => !value)} aria-expanded={open}>{open ? "Close" : "Menu"}</button>
      <a className="book-link" href="mailto:book@assembly-seoul.com">Book talent ↗</a>
    </header>
    <div className={`mobile-menu ${open ? "open" : ""}`}>{[["Talent", "#talent"], ["Campaigns", "#work"], ["Journal", "#journal"], ["Office", "#office"]].map(([label, href], index) => <a href={href} key={label} onClick={() => setOpen(false)}><small>0{index + 1}</small>{label}</a>)}</div>
  </>;
}

function Hero() {
  const focus = talents[0];
  return <section className="hero" id="top">
    <video className="hero-film" autoPlay muted loop playsInline preload="metadata" poster="/cast-hero-v2.jpg" onLoadedMetadata={event => { event.currentTarget.playbackRate = 0.55; }}><source src="/assembly-film-v1.mp4" type="video/mp4" /></video>
    <div className="hero-shade" />
    <div className="hero-topline"><span>Casting office for film &amp; campaign</span><span>Seoul, Korea</span></div>
    <div className="hero-title"><p>MODEL · ACTOR · PRODUCTION</p><h1>ASSEMBLY</h1></div>
    <div className="hero-copy"><p>광고와 필름에 맞는 모델·배우를 캐스팅합니다. 프로필, 무빙 테스트, 일정과 사용 범위를 한 번에 정리합니다.</p><a href="#talent">Open casting board <span>↓</span></a></div>
    <div className="hero-focus"><small>IN FOCUS</small><strong>{focus.name}</strong><span>{focus.role} · {focus.location}</span></div>
    <div className="hero-coordinate"><span>37° 33′ N</span><i /><span>126° 58′ E</span></div>
  </section>;
}

function OrbitRoster({ onSelect }: { onSelect: (talent: Talent) => void }) {
  return <section className="orbit" id="talent">
    <div className="orbit-sticky">
      <div className="static-cast-collage" aria-hidden="true">{talents.map((talent, index) => <figure key={talent.name}><img src={talent.image} alt="" /><span>0{index + 1}</span></figure>)}</div>
      <div className="orbit-index"><span>ROSTER / 2026</span><span>03 ACTIVE</span></div>
      <div className="orbit-stages">
        <article><small>CAST</small><h2>브리프에 맞는 얼굴을 찾습니다.</h2><p>브랜드, 매체, 사용 지역과 촬영 일정을 먼저 읽고 후보를 좁힙니다.</p></article>
        <article><small>TEST</small><h2>사진 밖의 움직임을 확인합니다.</h2><p>워킹, 표정, 보이스 클립과 최근 필름을 한 화면에서 검토합니다.</p></article>
        <article><small>BOOK</small><h2>선택부터 일정 확정까지 이어갑니다.</h2><p>쇼트리스트를 공유하고 사용 범위와 촬영 일정을 에이전트에게 바로 보냅니다.</p></article>
      </div>
      <div className="orbit-meter"><i /><span>SCROLL TO ASSEMBLE</span></div>
    </div>
    <div className="talent-list">
      {talents.map((talent, index) => <button className="talent-row" key={talent.name} onClick={() => onSelect(talent)} aria-label={`${talent.name} 프로필 열기`}>
        <span className="talent-no">0{index + 1}</span>
        <span className="talent-thumb"><img src={talent.image} alt="" /></span>
        <strong>{talent.name}</strong>
        <span>{talent.role}</span><span>{talent.location}</span><i>↗</i>
      </button>)}
    </div>
  </section>;
}

function Work({ onSelect }: { onSelect: (project: Project) => void }) {
  const [filter, setFilter] = useState<"All" | Project["type"]>("All");
  const filtered = filter === "All" ? projects : projects.filter(project => project.type === filter);
  return <section className="work" id="work">
    <header className="section-head reveal"><div><span>CASTING IN FRAME</span><span>2025—2026</span></div><h2>캐스팅에서 시작된 장면.</h2><p>필름, 뷰티 캠페인, 에디토리얼에서 인물과 결과물을 함께 확인합니다.</p></header>
    <div className="work-filters" aria-label="작업 필터">{(["All", "Film", "Campaign", "Editorial"] as const).map(item => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>
    <div className="project-list">
      {filtered.map(project => <article className="project" key={project.id}>
        <button className="project-media" onClick={() => onSelect(project)} aria-label={`${project.title} 프로젝트 보기`}><img src={project.image} alt={`${project.title} 대표 장면`} /><span>VIEW CASE ↗</span></button>
        <div className="project-info"><span>{project.id} / {project.type}</span><h3>{project.title}</h3><p>{project.statement}</p><small>{project.year}</small></div>
      </article>)}
    </div>
  </section>;
}

function Journal() {
  return <section className="journal" id="journal">
    <header className="journal-head reveal"><span>NOTES FROM SET</span><h2>현장에서 가져온 기록.</h2><p>캠페인이 공개된 뒤 사라지는 이름과 선택을 기사로 남깁니다.</p></header>
    <article className="journal-lead reveal"><img src="/editorial-backstage-v2.jpg" alt="촬영 현장에서 의상을 정리하는 장면" /><div><span>FIELD NOTE / 07</span><h3>첫 프레임 전의 열다섯 분</h3><p>촬영은 셔터를 누르기 전에 이미 시작됩니다. 피팅, 조명 테스트, 짧은 대화 사이에서 장면의 방향이 정해집니다.</p><a href="#journal">Read story ↗</a></div></article>
    <div className="journal-grid"><article><span>CASTING / 04</span><h3>프로필에서 보이지 않는 것</h3><p>움직임, 목소리, 현장의 속도. 캐스팅 전에 확인하는 세 가지.</p></article><article><span>PRODUCTION / 11</span><h3>모바일 포스터를 따로 만드는 이유</h3><p>작은 화면에서 인물의 표정과 타이틀이 함께 살아남는 비율을 찾습니다.</p></article></div>
  </section>;
}

type OfficeItem = { title: string; type: string; live: boolean; image: string; updated: string };

function Office() {
  const [items, setItems] = useState<OfficeItem[]>([
    { title: "Nocturne", type: "Campaign", live: true, image: "/cast-hero-v2.jpg", updated: "2 min ago" },
    { title: "Noah Kim", type: "Talent", live: true, image: "/talent-noah-v2.jpg", updated: "18 min ago" },
    { title: "Field Note 07", type: "Journal", live: false, image: "/editorial-backstage-v2.jpg", updated: "1 hr ago" },
  ]);
  const [selected, setSelected] = useState(0);
  const [uploadNote, setUploadNote] = useState("MP4 · MOV / MAX 500 MB");
  const item = items[selected];
  const toggle = () => setItems(current => current.map((entry, index) => index === selected ? { ...entry, live: !entry.live } : entry));
  const upload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadNote(file.size > 500 * 1024 * 1024 ? "용량이 500 MB를 초과했습니다." : `${file.name} · READY`);
  };
  return <section className="office" id="office">
    <header className="office-head reveal"><span>ASSEMBLY OFFICE</span><h2>등록한 정보가 곧 공개 화면이 됩니다.</h2><p>인물과 작업을 등록하고, 실제 화면을 확인한 뒤 공개합니다.</p></header>
    <div className="office-console reveal">
      <aside><header><strong>CONTENT</strong><button>+ NEW</button></header>{items.map((entry, index) => <button key={entry.title} className={selected === index ? "active" : ""} onClick={() => setSelected(index)}><i>{entry.live ? "LIVE" : "DRAFT"}</i><span><strong>{entry.title}</strong><small>{entry.type} · {entry.updated}</small></span></button>)}</aside>
      <div className="office-editor"><div className="editor-bar"><span>EDITING / {item.type.toUpperCase()}</span><b>ALL CHANGES SAVED</b></div><label>Title<input value={item.title} onChange={event => setItems(current => current.map((entry, index) => index === selected ? { ...entry, title: event.target.value } : entry))} /></label><label>Visibility<button className={`visibility ${item.live ? "live" : ""}`} onClick={toggle} aria-pressed={item.live}><i />{item.live ? "PUBLIC" : "DRAFT"}</button></label><label className="upload">Media<input type="file" accept="video/mp4,video/quicktime,image/*" onChange={upload} /><span>DROP OR SELECT FILE</span><small>{uploadNote}</small></label><div className="editor-actions"><button>DELETE</button><button>PUBLISH CHANGES</button></div></div>
      <div className="office-preview"><header><span>LIVE PREVIEW</span><b>↗</b></header><div className="preview-frame"><img src={item.image} alt="" /><div><small>{item.type}</small><strong>{item.title}</strong><span>{item.live ? "PUBLIC" : "NOT PUBLISHED"}</span></div></div></div>
    </div>
  </section>;
}

function TalentProfile({ talent, onClose }: { talent: Talent; onClose: () => void }) {
  return <div className="overlay" role="dialog" aria-modal="true" aria-label={`${talent.name} 프로필`}><button className="overlay-close" onClick={onClose}>Close ×</button><div className="talent-profile"><figure><img src={talent.image} alt={`${talent.name} 프로필`} decoding="sync" fetchPriority="high" /></figure><div className="profile-copy"><span>{talent.role} / {talent.location}</span><h2>{talent.name}</h2><p>{talent.note}</p><dl>{talent.stats.map((stat, index) => <div key={stat}><dt>0{index + 1}</dt><dd>{stat}</dd></div>)}</dl><div className="profile-links"><button>ADD TO CAST</button><a href="mailto:book@assembly-seoul.com">REQUEST BOOKING ↗</a></div></div><div className="profile-reel"><span>MOVING PORTRAIT / 00:12</span><video autoPlay muted loop playsInline poster={talent.image}><source src="/assembly-film-v1.mp4" type="video/mp4" /></video></div></div></div>;
}

function ProjectCase({ project, onClose }: { project: Project; onClose: () => void }) {
  return <div className="overlay case-overlay" role="dialog" aria-modal="true" aria-label={`${project.title} 프로젝트`}><button className="overlay-close" onClick={onClose}>Close ×</button><article className="case">
    <header><span>ASSEMBLY / CASE {project.id}</span><span>{project.type} · {project.year}</span></header>
    <div className="case-hero">{project.type === "Film" ? <video autoPlay muted loop playsInline poster={project.image}><source src="/assembly-film-v1.mp4" type="video/mp4" /></video> : <img src={project.image} alt={`${project.title} 대표 장면`} />}<h2>{project.title}</h2><p>{project.statement}</p></div>
    <div className="case-body"><div><span>THE WORK</span><h3>{project.type === "Film" ? "필름이 먼저 시작되고, 출연진과 크레딧이 뒤따릅니다." : project.type === "Campaign" ? "하나의 키 비주얼을 매체마다 다른 움직임으로 확장했습니다." : "긴 글과 현장 이미지를 한 호흡으로 읽는 에디토리얼입니다."}</h3></div><dl>{project.credits.map(item => { const [key, value] = item.split(" — "); return <div key={item}><dt>{key}</dt><dd>{value}</dd></div>; })}</dl></div>
    <div className="case-timeline">{project.chapters.map(chapter => <div key={chapter.time}><span>{chapter.time}</span><strong>{chapter.label}</strong><i /></div>)}</div>
    <div className="case-end"><span>RELATED TALENT</span><strong>{project.id === "03" ? "MIRA SEO" : "SOYEON HAN · NOAH KIM"}</strong><a href="mailto:book@assembly-seoul.com">Discuss this project ↗</a></div>
  </article></div>;
}

function Footer() {
  return <footer className="footer"><div><span>BOOKING / NEW BUSINESS</span><a href="mailto:hello@assembly-seoul.com">hello@assembly-seoul.com ↗</a></div><strong>ASSEMBLY</strong><div className="footer-bottom"><span>SEOUL · 37° 33′ N</span><span>Studio film: Ron Lach / Pexels</span><span>© 2026 ASSEMBLY</span><a href="#top">Back to top ↑</a></div></footer>;
}

export default function Home() {
  const rootRef = useRef<HTMLElement>(null);
  const [profile, setProfile] = useState<Talent | null>(null);
  const [project, setProject] = useState<Project | null>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.timeline().from(".intro-meta span,.intro-foot>*", { y: 12, opacity: 0, duration: 0.35, stagger: 0.05 }).from(".intro-word span", { yPercent: 120, duration: 0.75, ease: "power4.out" }, 0.08).to(".intro-panels i", { scaleY: 1, duration: 0.48, stagger: 0.035, ease: "power3.inOut" }, 0.9).to(".intro", { yPercent: -100, duration: 0.72, ease: "power4.inOut" }, 1.42).from(".hero-title,.hero-copy,.hero-focus,.hero-topline", { y: 30, opacity: 0, duration: 0.8, stagger: 0.07, ease: "power3.out" }, 1.55);
      gsap.utils.toArray<HTMLElement>(".reveal").forEach(element => gsap.from(element, { y: 70, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 84%" } }));
      gsap.utils.toArray<HTMLElement>(".orbit-stages article").forEach((article, index) => gsap.fromTo(article, { opacity: index === 0 ? 1 : 0.16 }, { opacity: 1, scrollTrigger: { trigger: article, start: "top 58%", end: "bottom 42%", toggleActions: "play reverse play reverse" } }));
      gsap.utils.toArray<HTMLElement>(".project-media img").forEach(image => gsap.fromTo(image, { scale: 1.14, yPercent: -4 }, { scale: 1, yPercent: 4, ease: "none", scrollTrigger: { trigger: image.parentElement, start: "top bottom", end: "bottom top", scrub: 0.7 } }));
      ScrollTrigger.create({ start: 0, end: "max", onUpdate: self => document.documentElement.style.setProperty("--progress", `${self.progress * 100}%`) });
    }, rootRef);
    return () => context.revert();
  }, []);

  useEffect(() => {
    const locked = Boolean(profile || project);
    document.documentElement.style.overflow = locked ? "hidden" : "";
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") { setProfile(null); setProject(null); } };
    window.addEventListener("keydown", close);
    return () => { document.documentElement.style.overflow = ""; window.removeEventListener("keydown", close); };
  }, [profile, project]);

  return <main ref={rootRef} data-release="assembly-static-01"><Intro /><div className="page-progress" /><Header /><Hero /><OrbitRoster onSelect={setProfile} /><Work onSelect={setProject} /><Journal /><Office /><Footer />{profile ? <TalentProfile talent={profile} onClose={() => setProfile(null)} /> : null}{project ? <ProjectCase project={project} onClose={() => setProject(null)} /> : null}</main>;
}
