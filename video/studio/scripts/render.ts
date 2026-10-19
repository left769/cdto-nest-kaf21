// Рендер ролика уроку за брифом (розділ 8): MP4 H.264, faststart і атрибуція в метаданих,
// постер JPEG ≤ 200 KB, звіт (розмір, тривалість, бітрейт, CRF, розділи).
// Запуск: npx tsx scripts/render.ts <урок> [версія=v1] [crf=18]

import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { execFileSync, spawnSync } from "node:child_process";
import { rmSync, statSync } from "node:fs";
import path from "node:path";
import { FPS, type SceneTiming, sceneStarts } from "../src/shared/timing";
import { lessonFromArgs } from "../src/lessons/registry";

// Скрипт працює з будь-якої теки: усі шляхи — від кореня Remotion-проєкту.
process.chdir(path.resolve(__dirname, ".."));

const OUT = path.join(process.cwd(), "out");
const POSTER_MAX_BYTES = 200 * 1024;

const { lesson, rest } = lessonFromArgs();
const version = rest[0] ?? "v1";
const crf = Number(rest[1] ?? 18);
const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

const main = async () => {
  const serveUrl = await bundle({ entryPoint: path.join(process.cwd(), "src", "index.ts") });
  const composition = await selectComposition({ serveUrl, id: lesson.composition, inputProps: {} });
  const timings = (composition.props as { timings: SceneTiming[] }).timings;
  if (timings.some((t) => t.audioSrc === null)) {
    console.warn("Увага: не для всіх сцен є голос — тривалість частини сцен оціночна.");
  }

  const raw = path.join(OUT, `${lesson.outName}-${version}.raw.mp4`);
  const final = path.join(OUT, `${lesson.outName}-${version}.mp4`);
  let lastPct = -10;
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    crf,
    audioBitrate: "128k",
    outputLocation: raw,
    onProgress: ({ progress }) => {
      const pct = Math.floor(progress * 100);
      if (pct >= lastPct + 10) {
        lastPct = pct;
        console.log(`рендер ${pct}%`);
      }
    },
  });

  // Індекс на початок файлу (відтворення до повного завантаження) і назва з атрибуцією.
  execFileSync("npx", [
    "remotion", "ffmpeg", "-loglevel", "error", "-y", "-i", raw,
    "-c", "copy", "-movflags", "+faststart", "-metadata", `title=${lesson.videoTitle}`, final,
  ]);
  rmSync(raw);

  // Постер — кадр із назвою ролика наприкінці вступу.
  const intro = timings[0];
  const posterFrame = (intro.exitAt ?? intro.durationInFrames) - 20;
  const poster = path.join(OUT, `${lesson.outName}-poster.jpg`);
  for (const quality of [85, 75, 65, 55]) {
    await renderStill({ composition, serveUrl, output: poster, frame: posterFrame, imageFormat: "jpeg", jpegQuality: quality });
    if (statSync(poster).size <= POSTER_MAX_BYTES) break;
  }

  // ffprobe друкує опис потоків у stderr.
  const probe = spawnSync("npx", ["remotion", "ffprobe", "-hide_banner", final], { encoding: "utf8" }).stderr;
  const info = (probe.match(/Duration: [^\n]+/) ?? [""])[0].trim();
  const starts = sceneStarts(timings);
  console.log("");
  console.log(`Файл:      ${path.relative(process.cwd(), final)} — ${mb(statSync(final).size)}`);
  console.log(`Потік:     ${info}`);
  console.log(`Кодек:     H.264, CRF ${crf}, аудіо AAC 128 кбіт/с, 1920×1080, ${FPS} fps`);
  console.log(`Постер:    ${path.relative(process.cwd(), poster)} — ${(statSync(poster).size / 1024).toFixed(0)} KB (кадр ${posterFrame})`);
  console.log("Розділи:");
  lesson.scenes.forEach((s, i) => console.log(`  ${clock(starts[i] / FPS)}  ${s.title}`));
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
