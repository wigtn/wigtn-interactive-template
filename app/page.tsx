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
  detailImage: string;
};

const talents: Talent[] = [
  { name: "NOAH KIM", role: "Model", location: "Seoul", image: "/talent-noah-v2.jpg", stats: ["187 CM", "SUIT 48", "SHOES 280"], note: "긴 호흡의 필름과 절제된 남성복 캠페인에서 강한 잔상을 남깁니다.", reelImages: ["/talent-noah-v1.png", "/motion-study-v1.png"], reelLabel: "WALK / TURN / STILL" },
  { name: "SOYEON HAN", role: "Actor · Model", location: "Seoul / Tokyo", image: "/cast-hero-v2.jpg", stats: ["174 CM", "KOR · ENG", "FILM · BEAUTY"], note: "표정의 작은 변화로 뷰티와 내러티브 캠페인 사이를 자연스럽게 오갑니다.", reelImages: ["/hero-campaign.png", "/campaign-nocturne-v1.png"], reelLabel: "FACE / PROFILE / VOICE" },
  { name: "MIRA SEO", role: "Film Director", location: "Seoul", image: "/editorial-backstage-v2.jpg", stats: ["COMMERCIAL", "MUSIC FILM", "EDITORIAL"], note: "인물의 움직임과 현장의 공기를 짧고 선명한 장면으로 설계합니다.", reelImages: ["/editorial-backstage-v1.png", "/editorial-backstage-v2.jpg"], reelLabel: "FRAME / LIGHT / DIRECTION" },
];

const projects: Project[] = [
  { id: "01", title: "NOCTURNE", type: "Film", year: "2026", image: "/cast-hero-v2.jpg", detailImage: "/hero-campaign.png", statement: "빛이 꺼진 뒤에도 남는 두 사람의 거리.", credits: ["Director — Mira Seo", "Cast — Soyeon Han · Noah Kim", "DOP — Hyun Park", "Run time — 00:42"], chapters: [{ time: "00:00", label: "Arrival" }, { time: "00:14", label: "Contact" }, { time: "00:31", label: "Afterimage" }] },
  { id: "02", title: "SOFT FOCUS", type: "Campaign", year: "2026", image: "/campaign-nocturne-v1.png", detailImage: "/talent-noah-v1.png", statement: "피부의 질감과 시선만 남긴 뷰티 캠페인.", credits: ["Client — Nineteen", "Talent — Soyeon Han", "Photo — Jun Lee", "Usage — APAC / 12M"], chapters: [{ time: "01", label: "Key visual" }, { time: "02", label: "Motion cut" }, { time: "03", label: "Social set" }] },
  { id: "03", title: "FIELD NOTE 07", type: "Editorial", year: "2026", image: "/editorial-backstage-v2.jpg", detailImage: "/editorial-backstage-v1.png", statement: "촬영 전 열다섯 분, 현장에 흐르는 긴장을 기록했습니다.", credits: ["Words — Haeun Cho", "Images — Yuri Lim", "Featuring — Mira Seo", "Published — 18 Mar"], chapters: [{ time: "A", label: "Before set" }, { time: "B", label: "The fitting" }, { time: "C", label: "First frame" }] },
];

function Intro() {
  return <div className="intro" aria-hidden="true">
    <div className="intro-meta"><span>ASSEMBLY / SEOUL</span><span>CASTING OFFICE</span></div>
    <div className="intro-frames"><figure><img src="/talent-noah-v2.jpg" alt="" /></figure><figure><img src="/cast-hero-v2.jpg" alt="" /></figure><figure><img src="/editorial-backstage-v2.jpg" alt="" /></figure></div>
    <div className="intro-word"><span>ASSEM</span><span>BLY</span></div>
    <div className="intro-count"><b>03</b><span>FACES · ONE FRAME</span></div>
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
    <div className="hero-panels" aria-hidden="true"><figure><img src="/talent-noah-v2.jpg" alt="" /><span>01 / MODEL</span></figure><figure><img src="/cast-hero-v2.jpg" alt="" /><span>02 / ACTOR</span></figure><figure><img src="/editorial-backstage-v2.jpg" alt="" /><span>03 / DIRECTOR</span></figure></div>
    <div className="hero-topline"><span>Casting office for film &amp; campaign</span><span>Seoul, Korea</span></div>
    <div className="hero-title"><p>MODEL · ACTOR · PRODUCTION</p><h1><span>ASSEM</span><span>BLY</span></h1></div>
    <div className="hero-copy"><p>필름과 캠페인에 맞는 얼굴을 고르고, 캐스팅부터 납품까지 한 팀으로 움직입니다.</p><a href="#talent">Meet the roster <span>↓</span></a></div>
    <div className="hero-focus"><small>IN FOCUS</small><strong>{focus.name}</strong><span>{focus.role} · {focus.location}</span></div>
    <div className="hero-coordinate"><span>37° 33′ N</span><i /><span>126° 58′ E</span></div>
  </section>;
}

function OrbitRoster({ onSelect }: { onSelect: (talent: Talent) => void }) {
  return <section className="orbit" id="talent">
    <div className="orbit-sticky">
      <div className="static-cast-collage" aria-hidden="true">{talents.map((talent, index) => <figure key={talent.name}><img src={talent.image} alt="" /><figcaption><span>0{index + 1}</span><strong>{talent.name}</strong></figcaption></figure>)}</div>
      <div className="orbit-index"><span>ROSTER / 2026</span><span>03 ACTIVE</span></div>
      <div className="orbit-stages">
        <article><small>01 / NOAH KIM</small><h2>한 컷보다 긴 인상.</h2><p>남성복, 오토모티브, 내러티브 필름. 카메라 앞에서 속도를 조절할 줄 아는 모델.</p></article>
        <article><small>02 / SOYEON HAN</small><h2>표정이 장면을 바꿉니다.</h2><p>뷰티의 정교함과 필름의 감정을 함께 가져가는 배우이자 모델.</p></article>
        <article><small>03 / MIRA SEO</small><h2>인물을 먼저 보는 연출.</h2><p>광고와 에디토리얼 사이에서 사람의 움직임을 중심으로 장면을 설계합니다.</p></article>
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
    <header className="section-head reveal"><div><span>SELECTED WORK</span><span>2025—2026</span></div><h2>얼굴이 장면이 된 순간들.</h2><p>캐스팅 결과만 보여주지 않습니다. 필름, 키 비주얼, 현장 기록까지 한 케이스로 엮었습니다.</p></header>
    <div className="work-filters" aria-label="작업 필터">{(["All", "Film", "Campaign", "Editorial"] as const).map(item => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>
    <div className="project-list">
      {filtered.map(project => <article className="project" key={project.id}>
        <button className="project-media" onClick={() => onSelect(project)} aria-label={`${project.title} 프로젝트 보기`}><img className="project-main-image" src={project.image} alt={`${project.title} 대표 장면`} /><span className="project-layer"><img src={project.detailImage} alt="" /><b>{project.id}</b></span><span className="project-open">VIEW CASE ↗</span></button>
        <div className="project-info"><span>{project.id} / {project.type}</span><h3>{project.title}</h3><p>{project.statement}</p><small>{project.year}</small></div>
      </article>)}
    </div>
  </section>;
}

function Journal() {
  return <section className="journal" id="journal">
    <header className="journal-head reveal"><div><span>FIELD NOTES / 07</span><h2>촬영이 끝난 뒤에도 남는 것.</h2><p>캐스팅 노트, 피팅의 판단, 공개되지 않은 테스트 컷을 편집해 남깁니다.</p></div><div className="journal-head-media"><img src="/editorial-backstage-v1.png" alt="촬영 현장 테스트 컷" /><img src="/motion-study-v1.png" alt="움직임 테스트 프레임" /></div></header>
    <article className="journal-lead reveal"><img src="/editorial-backstage-v2.jpg" alt="촬영 현장에서 의상을 정리하는 장면" /><div><span>ON SET / 18 MAR</span><h3>첫 프레임 전의 열다섯 분</h3><p>피팅이 끝나고 조명이 켜지기 전, 출연자와 스태프가 같은 장면을 상상하기 시작한 시간.</p><a href="#journal">Read the field note ↗</a></div></article>
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
    <header className="office-head reveal"><div><span>CONTENT DESK / LIVE</span><h2>올리고, 확인하고, 공개합니다.</h2></div><p>인물·캠페인·기사를 같은 편집 흐름에서 관리합니다. 개발자 없이 상태와 대표 미디어를 바로 바꿉니다.</p><ul><li><b>03</b> content types</li><li><b>01</b> live preview</li><li><b>500</b> MB upload</li></ul></header>
    <div className="office-console reveal">
      <aside><header><strong>CONTENT</strong><button>+ NEW</button></header>{items.map((entry, index) => <button key={entry.title} className={selected === index ? "active" : ""} onClick={() => setSelected(index)}><i>{entry.live ? "LIVE" : "DRAFT"}</i><span><strong>{entry.title}</strong><small>{entry.type} · {entry.updated}</small></span></button>)}</aside>
      <div className="office-editor"><div className="editor-bar"><span>EDITING / {item.type.toUpperCase()}</span><b>ALL CHANGES SAVED</b></div><label>Title<input value={item.title} onChange={event => setItems(current => current.map((entry, index) => index === selected ? { ...entry, title: event.target.value } : entry))} /></label><label>Visibility<button className={`visibility ${item.live ? "live" : ""}`} onClick={toggle} aria-pressed={item.live}><i />{item.live ? "PUBLIC" : "DRAFT"}</button></label><label className="upload">Media<input type="file" accept="video/mp4,video/quicktime,image/*" onChange={upload} /><span>DROP OR SELECT FILE</span><small>{uploadNote}</small></label><div className="editor-actions"><button>DELETE</button><button>PUBLISH CHANGES</button></div></div>
      <div className="office-preview"><header><span>LIVE PREVIEW</span><b>↗</b></header><div className="preview-frame"><img src={item.image} alt="" /><div><small>{item.type}</small><strong>{item.title}</strong><span>{item.live ? "PUBLIC" : "NOT PUBLISHED"}</span></div></div></div>
    </div>
  </section>;
}

function TalentProfile({ talent, onClose }: { talent: Talent; onClose: () => void }) {
  return <div className="overlay" role="dialog" aria-modal="true" aria-label={`${talent.name} 프로필`}><button className="overlay-close" onClick={onClose}>Close ×</button><div className="talent-profile"><figure><img src={talent.image} alt={`${talent.name} 프로필`} decoding="sync" fetchPriority="high" /></figure><div className="profile-copy"><span>{talent.role} / {talent.location}</span><h2>{talent.name}</h2><p>{talent.note}</p><dl>{talent.stats.map((stat, index) => <div key={stat}><dt>0{index + 1}</dt><dd>{stat}</dd></div>)}</dl><div className="profile-links"><button>ADD TO CAST</button><a href="mailto:book@assembly-seoul.com">REQUEST BOOKING ↗</a></div></div><div className="profile-reel"><span>MOVING PORTRAIT / {talent.reelLabel}</span><div className="profile-reel-stage"><img src={talent.reelImages[0]} alt={`${talent.name} 무빙 테스트 1`} /><img src={talent.reelImages[1]} alt={`${talent.name} 무빙 테스트 2`} /><i /></div></div></div></div>;
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
  return <footer className="footer"><div className="footer-call"><span>BOOKING / NEW BUSINESS</span><h2>다음 장면의 얼굴을 찾고 있나요?</h2><a href="mailto:hello@assembly-seoul.com">Start a casting request ↗</a></div><div className="footer-reel" aria-hidden="true"><img src="/talent-noah-v2.jpg" alt="" /><img src="/cast-hero-v2.jpg" alt="" /><img src="/editorial-backstage-v2.jpg" alt="" /></div><strong>ASSEMBLY</strong><div className="footer-bottom"><span>SEOUL · 37° 33′ N</span><span>MODEL · ACTOR · PRODUCTION</span><span>© 2026 ASSEMBLY</span><a href="#top">Back to top ↑</a></div></footer>;
}

export default function Home() {
  const rootRef = useRef<HTMLElement>(null);
  const [profile, setProfile] = useState<Talent | null>(null);
  const [project, setProject] = useState<Project | null>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.timeline().from(".intro-meta span,.intro-foot>*", { y: 12, opacity: 0, duration: 0.3, stagger: 0.05 }).fromTo(".intro-frames figure", { clipPath: "inset(100% 0 0 0)", yPercent: 16 }, { clipPath: "inset(0% 0 0 0)", yPercent: 0, duration: 0.7, stagger: 0.09, ease: "power4.out" }, 0.05).from(".intro-word span", { yPercent: 125, rotate: 3, duration: 0.75, stagger: 0.06, ease: "power4.out" }, 0.18).from(".intro-count", { scale: .7, opacity: 0, duration: .45, ease: "power3.out" }, .42).to(".intro-frames figure", { xPercent: index => (index - 1) * 9, duration: .6, ease: "power3.inOut" }, .95).to(".intro-panels i", { scaleY: 1, duration: 0.46, stagger: 0.035, ease: "power3.inOut" }, 1.22).to(".intro", { yPercent: -100, duration: 0.78, ease: "power4.inOut" }, 1.72).from(".hero-title span,.hero-copy,.hero-focus,.hero-topline", { y: 50, opacity: 0, duration: 0.8, stagger: 0.06, ease: "power3.out" }, 1.82).from(".hero-panels figure", { xPercent: 80, clipPath: "inset(0 0 0 100%)", duration: .9, stagger: .08, ease: "power4.out" }, 1.9);
      gsap.utils.toArray<HTMLElement>(".reveal").forEach(element => gsap.from(element, { y: 70, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 84%" } }));
      gsap.to(".hero-panels figure:nth-child(1)", { yPercent: -24, rotate: -3, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .7 } });
      gsap.to(".hero-panels figure:nth-child(3)", { yPercent: 30, rotate: 4, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .7 } });
      const rosterCards = gsap.utils.toArray<HTMLElement>(".static-cast-collage figure");
      const rosterCopy = gsap.utils.toArray<HTMLElement>(".orbit-stages article");
      gsap.set(rosterCards, { xPercent: index => index === 0 ? -50 : index === 1 ? 45 : 115, scale: index => index === 0 ? 1 : .74, opacity: index => index === 2 ? 0 : 1 });
      gsap.set(rosterCopy, { autoAlpha: index => index === 0 ? 1 : 0, y: index => index === 0 ? 0 : 32 });
      gsap.timeline({ scrollTrigger: { trigger: ".orbit", start: "top top", end: "bottom bottom", scrub: .7 } })
        .to(rosterCards[0], { xPercent: -145, scale: .72, opacity: .42, duration: .28 }, .18)
        .to(rosterCards[1], { xPercent: -50, scale: 1, opacity: 1, duration: .3 }, .18)
        .set(rosterCopy[0], { autoAlpha: 0 }, .28).fromTo(rosterCopy[1], { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: .16 }, .3)
        .to(rosterCards[1], { xPercent: -145, scale: .72, opacity: .42, duration: .28 }, .55)
        .to(rosterCards[2], { xPercent: -50, scale: 1, opacity: 1, duration: .3 }, .55)
        .set(rosterCopy[1], { autoAlpha: 0 }, .65).fromTo(rosterCopy[2], { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: .16 }, .67);
      gsap.utils.toArray<HTMLElement>(".project").forEach((projectElement, index) => {
        const mainImage = projectElement.querySelector(".project-main-image");
        const layer = projectElement.querySelector(".project-layer");
        gsap.fromTo(mainImage, { scale: 1.13, clipPath: index % 2 ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)" }, { scale: 1, clipPath: "inset(0% 0 0 0)", duration: 1.25, ease: "power4.out", scrollTrigger: { trigger: projectElement, start: "top 76%" } });
        gsap.from(layer, { xPercent: index % 2 ? -55 : 55, yPercent: 25, rotate: index % 2 ? -6 : 6, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: projectElement, start: "top 64%" } });
      });
      gsap.to(".journal-head-media img:first-child", { yPercent: -18, rotate: -3, ease: "none", scrollTrigger: { trigger: ".journal", start: "top bottom", end: "bottom top", scrub: .7 } });
      gsap.to(".journal-head-media img:last-child", { yPercent: 22, rotate: 4, ease: "none", scrollTrigger: { trigger: ".journal", start: "top bottom", end: "bottom top", scrub: .7 } });
      gsap.from(".office-console", { clipPath: "inset(0 0 100% 0)", y: 45, duration: 1.1, ease: "power4.out", scrollTrigger: { trigger: ".office-console", start: "top 82%" } });
      gsap.from(".footer-reel img", { yPercent: 85, rotate: index => (index - 1) * 7, duration: 1, stagger: .08, ease: "power4.out", scrollTrigger: { trigger: ".footer", start: "top 72%" } });
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

  return <main ref={rootRef} data-release="assembly-static-02"><Intro /><div className="page-progress" /><Header /><Hero /><OrbitRoster onSelect={setProfile} /><Work onSelect={setProject} /><Journal /><Office /><Footer />{profile ? <TalentProfile talent={profile} onClose={() => setProfile(null)} /> : null}{project ? <ProjectCase project={project} onClose={() => setProject(null)} /> : null}</main>;
}
