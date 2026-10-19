// Субтитри WebVTT і розділи ролика уроку (бриф 6–7) з фактичних тривалостей сцен.
// Таймінг — за вирівняними словами голосу (public/voiceover/<урок>/<id>.words.json).
// Правила: не більше 2 рядків по 42 символи, кадр субтитру 1–6 с, цифри цифрами.
// Запуск: npx tsx scripts/captions.ts <урок> → out/<outName>.uk.vtt, out/<outName>.chapters.json

import { bundle } from "@remotion/bundler";
import { selectComposition } from "@remotion/renderer";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { lessonFromArgs } from "../src/lessons/registry";
import { type AlignedWord, FPS, type SceneTiming, sceneStarts, splitWords, wordsPath } from "../src/shared/timing";

// Скрипт працює з будь-якої теки: усі шляхи — від кореня Remotion-проєкту.
process.chdir(path.resolve(__dirname, ".."));

const OUT_DIR = path.join(process.cwd(), "out");
const MAX_LINE = 42;
const MAX_LINES = 2;
const MIN_MS = 1000;
const MAX_MS = 6000;
// Короткі слова, які не лишаємо в кінці рядка.
const CLINGY = /^(і|й|в|у|з|а|та|до|на|не|що|за|по|із|зі)$/iu;

type Word = { text: string; startMs: number; endMs: number };
type Cue = { words: Word[]; startMs: number; endMs: number };

const join = (ws: Word[]) => ws.map((w) => w.text).join(" ");

/**
 * Рівномірний перенос на ≤ 2 рядки; null — не вміщується. У строгому режимі
 * не дозволяє лишити коротке слово («не», «і», «з»…) в кінці першого рядка.
 */
const wrap = (text: string, strict = false): string[] | null => {
  if (text.length <= MAX_LINE) return [text];
  const words = text.split(" ");
  let best: string[] | null = null;
  let bestScore = Infinity;
  for (let k = 1; k < words.length; k++) {
    const a = words.slice(0, k).join(" ");
    const b = words.slice(k).join(" ");
    if (a.length > MAX_LINE || b.length > MAX_LINE || words[k] === "—") continue;
    if (strict && CLINGY.test(words[k - 1])) continue;
    const score = Math.abs(a.length - b.length) + (CLINGY.test(words[k - 1]) ? 30 : 0);
    if (score < bestScore) {
      bestScore = score;
      best = [a, b];
    }
  }
  return best && best.length <= MAX_LINES ? best : null;
};

const fits = (ws: Word[]) => wrap(join(ws), true) !== null && ws[ws.length - 1].endMs - ws[0].startMs <= MAX_MS;

/** Ділить фрагмент речення там, де пауза природна: після коми, двокрапки, тире. */
const split = (ws: Word[]): Word[][] => {
  if (ws.length < 2 || fits(ws)) return [ws];
  const total = join(ws).length;
  let bestK = 1;
  let bestScore = Infinity;
  for (let k = 1; k < ws.length; k++) {
    const left = join(ws.slice(0, k)).length;
    const prev = ws[k - 1].text;
    const penalty = /[,:;]$/.test(prev) ? 0 : prev === "—" ? 0.15 : ws[k].text === "—" ? 0.6 : CLINGY.test(prev) ? 2 : 0.5;
    const score = Math.abs(left - (total - left)) / total + penalty;
    if (score < bestScore) {
      bestScore = score;
      bestK = k;
    }
  }
  return [...split(ws.slice(0, bestK)), ...split(ws.slice(bestK))];
};

const stamp = (ms: number) => {
  const t = Math.max(0, Math.round(ms));
  const h = Math.floor(t / 3_600_000);
  const m = Math.floor((t % 3_600_000) / 60_000);
  const s = Math.floor((t % 60_000) / 1000);
  const pad = (n: number, l = 2) => String(n).padStart(l, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(t % 1000, 3)}`;
};

const main = async () => {
  const { lesson } = lessonFromArgs();
  const { id: LESSON, scenes: SCENES, toVoice } = lesson;
  const serveUrl = await bundle({ entryPoint: path.join(process.cwd(), "src", "index.ts") });
  const composition = await selectComposition({ serveUrl, id: lesson.composition, inputProps: {} });
  const timings = (composition.props as { timings: SceneTiming[] }).timings;
  const starts = sceneStarts(timings);

  const cues: Cue[] = [];
  SCENES.forEach((scene, i) => {
    const file = path.join("public", wordsPath(LESSON, scene.id));
    if (!existsSync(file)) {
      throw new Error(`Немає вирівнювання ${file}: спершу npx tsx scripts/align.ts`);
    }
    const voice: AlignedWord[] = JSON.parse(readFileSync(file, "utf8"));
    const offsetMs = ((starts[i] + timings[i].speechStart) / FPS) * 1000;
    const lastEnd = voice[voice.length - 1].endMs;

    // Слово субтитрів → слово голосу через ту саму таблицю вимови, що й для якорів.
    const subWords = splitWords(scene.subtitleText);
    const timed: Word[] = subWords.map((w) => {
      const at = toVoice(scene.subtitleText.slice(0, w.start)).length;
      const v = voice.find((x) => x.start >= at);
      return { text: w.text, startMs: offsetMs + (v ? v.startMs : lastEnd), endMs: 0 };
    });
    timed.forEach((w, k) => {
      w.endMs = k + 1 < timed.length ? timed[k + 1].startMs : offsetMs + lastEnd;
    });

    const sentences: Word[][] = [];
    let current: Word[] = [];
    for (const w of timed) {
      current.push(w);
      if (/[.?!…][»"]?$/.test(w.text)) {
        sentences.push(current);
        current = [];
      }
    }
    if (current.length) sentences.push(current);

    for (const sentence of sentences) {
      for (const part of split(sentence)) {
        cues.push({ words: part, startMs: part[0].startMs, endMs: part[part.length - 1].endMs });
      }
    }
  });

  // Мінімум 1 с на екрані, якщо є місце до наступного субтитру.
  cues.forEach((c, k) => {
    const next = k + 1 < cues.length ? cues[k + 1].startMs : Infinity;
    if (c.endMs - c.startMs < MIN_MS) c.endMs = Math.min(c.startMs + MIN_MS, next);
  });

  const vtt = ["WEBVTT", ""];
  cues.forEach((c, k) => {
    vtt.push(String(k + 1), `${stamp(c.startMs)} --> ${stamp(c.endMs)}`, ...(wrap(join(c.words)) ?? [join(c.words)]), "");
  });
  const chapters = SCENES.map((s, i) => ({ title: s.title, start: Math.round((starts[i] / FPS) * 10) / 10 }));

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(path.join(OUT_DIR, `${lesson.outName}.uk.vtt`), vtt.join("\n"));
  writeFileSync(path.join(OUT_DIR, `${lesson.outName}.chapters.json`), JSON.stringify(chapters, null, 2) + "\n");

  const durations = cues.map((c) => c.endMs - c.startMs);
  const lines = cues.flatMap((c) => wrap(join(c.words)) ?? [join(c.words)]);
  console.log(`Субтитрів: ${cues.length}; тривалість ${Math.min(...durations)}–${Math.max(...durations)} мс; найдовший рядок ${Math.max(...lines.map((l) => l.length))} симв.`);
  const bad = cues.filter((c) => !wrap(join(c.words)) || c.endMs - c.startMs > MAX_MS || c.endMs - c.startMs < MIN_MS);
  bad.forEach((c) => console.log(`  поза правилами: ${stamp(c.startMs)} «${join(c.words)}» (${c.endMs - c.startMs} мс)`));
  console.log("Розділи:", chapters.map((c) => `${c.title} ${Math.floor(c.start / 60)}:${String(Math.floor(c.start % 60)).padStart(2, "0")}`).join(" · "));
  console.log(`Тривалість ролика: ${(composition.durationInFrames / FPS).toFixed(1)} с`);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
