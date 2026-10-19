// Вбудовування відео в сторінку заняття (бриф, розділ 9): постер і субтитри — у docs/assets/video/,
// блок <figure> з розділами — одразу після рядка «*Тема N: … · Заняття M*» (lesson.js бере абзац
// після H1 як метадані шапки, тож між H1 і цим рядком нічого вставляти не можна).
// MP4 лежить у Cloudflare R2; у тексті сторінки лише посилання на нього.
// Повторний запуск замінює блок між маркерами — так оновлюють версію (-v2).
// Запуск: npx tsx scripts/embed.ts <урок>

import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { lessonFromArgs } from "../src/lessons/registry";

// Скрипт працює з будь-якої теки: усі шляхи — від кореня Remotion-проєкту.
process.chdir(path.resolve(__dirname, ".."));

const MEDIA = "https://media.ist.pp.ua/video";
const DOCS = path.resolve("..", "..", "docs");
const ASSETS = path.join(DOCS, "assets", "video");
// Сирий HTML MkDocs не переписує: шляхи рахуються від URL сторінки /<сторінка>/.
const ASSETS_URL = "../assets/video";
const START = "<!-- lesson-video:start -->";
const END = "<!-- lesson-video:end -->";

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const durationOf = (file: string) => {
  // ffprobe друкує опис у stderr: «Duration: 00:05:14.07».
  const probe = spawnSync("npx", ["remotion", "ffprobe", "-hide_banner", file], { encoding: "utf8" }).stderr;
  const m = probe.match(/Duration: (\d+):(\d+):([\d.]+)/);
  if (!m) throw new Error(`Не вдалося визначити тривалість ${file}`);
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
};

const main = () => {
  const { lesson } = lessonFromArgs();
  const { doc, version, caption } = lesson.site;
  const name = lesson.outName;
  const files = {
    mp4: path.join("out", `${name}-${version}.mp4`),
    poster: path.join("out", `${name}-poster.jpg`),
    vtt: path.join("out", `${name}.uk.vtt`),
    chapters: path.join("out", `${name}.chapters.json`),
  };
  for (const file of Object.values(files)) {
    if (!existsSync(file)) throw new Error(`Немає ${file}: спершу scripts/captions.ts і scripts/render.ts`);
  }

  mkdirSync(ASSETS, { recursive: true });
  copyFileSync(files.poster, path.join(ASSETS, `${name}-poster.jpg`));
  copyFileSync(files.vtt, path.join(ASSETS, `${name}.uk.vtt`));

  const seconds = durationOf(files.mp4);
  const minutes = Math.max(1, Math.round(seconds / 60));
  const chapters: { title: string; start: number }[] = JSON.parse(readFileSync(files.chapters, "utf8"));

  const block = [
    START,
    "",
    `<figure class="lesson-video" id="video" data-duration="${Math.round(seconds)}">`,
    `  <video controls preload="metadata" playsinline poster="${ASSETS_URL}/${name}-poster.jpg">`,
    `    <source src="${MEDIA}/${name}-${version}.mp4" type="video/mp4">`,
    `    <track kind="captions" src="${ASSETS_URL}/${name}.uk.vtt" srclang="uk" label="Українська">`,
    "  </video>",
    `  <div class="lesson-video__chapters" aria-label="Розділи відео">`,
    ...chapters.map((c) => `    <button type="button" data-t="${c.start}">${escape(c.title)} <span>${clock(c.start)}</span></button>`),
    "  </div>",
    `  <figcaption>${escape(caption)} · ${minutes} хв · озвучення: elevenlabs.io</figcaption>`,
    "</figure>",
    "",
    END,
  ].join("\n");

  const page = path.join(DOCS, doc);
  const text = readFileSync(page, "utf8");
  let next: string;
  if (text.includes(START)) {
    next = text.slice(0, text.indexOf(START)) + block + text.slice(text.indexOf(END) + END.length);
  } else {
    // H1, порожній рядок, «*Тема …*» — блок іде одразу після метаданих.
    const lines = text.split("\n");
    const meta = lines.findIndex((l, i) => i > 0 && l.trim() !== "");
    if (!lines[0].startsWith("# ") || !/^\*[^*].*·.*\*$/.test(lines[meta].trim())) {
      throw new Error(`${doc}: очікувано H1 і рядок «*Тема … · Заняття …*» одразу за ним`);
    }
    lines.splice(meta + 1, 0, "", block);
    next = lines.join("\n");
  }
  writeFileSync(page, next);
  console.log(`${doc}: відео ${name}-${version}.mp4 (${clock(seconds)}), ${chapters.length} розділів; постер і субтитри → docs/assets/video/`);
};

main();
