"use client";

import { ChangeEvent, useState } from "react";
import Link from "next/link";

type OfficeItem = { title: string; type: string; live: boolean; image: string; updated: string };

export default function ManagementStudio() {
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

  return <main className="studio-page">
    <header className="studio-topbar"><Link href="/">← ASSEMBLY</Link><span>MANAGEMENT STUDIO / INTERACTIVE DEMO</span><b>LIVE</b></header>
    <section className="office" id="studio">
      <header className="office-head"><div><span>MANAGEMENT DESK / LIVE</span><h1>One desk for every profile and placement.</h1></div><p>Talent profiles, recent work and agency journal entries share one editing flow. Update media, availability and visibility without a developer.</p><ul><li><b>03</b> content types</li><li><b>01</b> live preview</li><li><b>500</b> MB upload</li></ul></header>
      <div className="office-console">
        <aside><header><strong>CONTENT</strong><button onClick={addItem}>+ NEW</button></header>{items.map((entry, index) => <button key={`${entry.title}-${index}`} className={selected === index ? "active" : ""} onClick={() => setSelected(index)}><i>{entry.live ? "LIVE" : "DRAFT"}</i><span><strong>{entry.title}</strong><small>{entry.type} · {entry.updated}</small></span></button>)}</aside>
        <div className="office-editor"><div className="editor-bar"><span>EDITING / {item.type.toUpperCase()}</span><b>{saved ? "ALL CHANGES SAVED" : "UNSAVED CHANGES"}</b></div><label>Title<input value={item.title} onChange={event => updateItems(items.map((entry, index) => index === selected ? { ...entry, title: event.target.value } : entry))} /></label><label>Visibility<button className={`visibility ${item.live ? "live" : ""}`} onClick={toggle} aria-pressed={item.live}><i />{item.live ? "PUBLIC" : "DRAFT"}</button></label><label className="upload">Media<input type="file" accept="video/mp4,video/quicktime,image/*" onChange={upload} /><span>DROP OR SELECT FILE</span><small>{uploadNote}</small></label><div className="editor-actions"><button onClick={removeItem} disabled={items.length === 1}>DELETE</button><button onClick={publish}>{saved && item.live ? "PUBLISHED" : "PUBLISH CHANGES"}</button></div></div>
        <div className="office-preview"><header><span>LIVE PREVIEW</span><b>↗</b></header><div className="preview-frame"><img src={item.image} alt="" /><div><small>{item.type}</small><strong>{item.title}</strong><span>{item.live ? "PUBLIC" : "NOT PUBLISHED"}</span></div></div></div>
      </div>
    </section>
  </main>;
}
