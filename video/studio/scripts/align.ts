// Вирівнювання голосу з відомим текстом (бриф 6): whisper.cpp розпізнає MP3 сцени,
// розпізнані слова зіставляються зі словами voiceText, і кожне слово тексту
// отримує час початку й кінця. Результат — public/voiceover/<урок>/<id>.words.json,
// з нього беруться якорі анімації та таймінг субтитрів.
// Запуск: npx tsx scripts/align.ts <урок> [id сцени …]   (без id — усі сцени з MP3)

import { toCaptions, downloadWhisperModel, installWhisperCpp, transcribe } from "@remotion/install-whisper-cpp";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { lessonFromArgs } from "../src/lessons/registry";
import { audioPath, type AlignedWord, splitWords } from "../src/shared/timing";

const WHISPER_DIR = path.join(process.cwd(), "whisper.cpp");
// 1.5.5 збирається простим make; новіші версії потребують cmake.
const WHISPER_VERSION = "1.5.5";
// Багатомовна модель (не .en), мова — українська.
const MODEL = "medium" as const;
const TMP = path.join(process.cwd(), "out", "whisper");

const normalize = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

const similarity = (a: string, b: string) => {
  if (!a.length || !b.length) {
    return 0;
  }
  const d: number[] = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = d[0];
    d[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = d[j];
      d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return 1 - d[b.length] / Math.max(a.length, b.length);
};

type Heard = { text: string; startMs: number; endMs: number };

/** Needleman–Wunsch по словах: пари «слово тексту → розпізнане слово» з достатньою схожістю. */
const alignWords = (expected: string[], heard: Heard[]) => {
  const a = expected.map(normalize);
  const b = heard.map((h) => normalize(h.text));
  const GAP = 0.7;
  const n = a.length;
  const m = b.length;
  const cost = Array.from({ length: n + 1 }, () => new Float64Array(m + 1));
  for (let i = 1; i <= n; i++) cost[i][0] = i * GAP;
  for (let j = 1; j <= m; j++) cost[0][j] = j * GAP;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      cost[i][j] = Math.min(
        cost[i - 1][j - 1] + (1 - similarity(a[i - 1], b[j - 1])),
        cost[i - 1][j] + GAP,
        cost[i][j - 1] + GAP,
      );
    }
  }
  const pairs = new Map<number, number>();
  let i = n;
  let j = m;
  while (i > 0 && j > 0) {
    const sim = similarity(a[i - 1], b[j - 1]);
    if (Math.abs(cost[i][j] - (cost[i - 1][j - 1] + (1 - sim))) < 1e-9) {
      if (sim >= 0.5) pairs.set(i - 1, j - 1);
      i--;
      j--;
    } else if (Math.abs(cost[i][j] - (cost[i - 1][j] + GAP)) < 1e-9) {
      i--;
    } else {
      j--;
    }
  }
  return pairs;
};

const main = async () => {
  const { lesson, rest: wanted } = lessonFromArgs();
  const LESSON = lesson.id;
  const SCENES = lesson.scenes;
  const scenes = SCENES.filter(
    (s) => (!wanted.length || wanted.includes(s.id)) && existsSync(path.join("public", audioPath(LESSON, s.id))),
  );
  if (!scenes.length) {
    throw new Error("Немає MP3 для вирівнювання");
  }

  await installWhisperCpp({ to: WHISPER_DIR, version: WHISPER_VERSION, printOutput: false });
  await downloadWhisperModel({ model: MODEL, folder: WHISPER_DIR, printOutput: false });
  mkdirSync(TMP, { recursive: true });

  for (const scene of scenes) {
    const mp3 = path.join("public", audioPath(LESSON, scene.id));
    const wav = path.join(TMP, `${scene.id}.wav`);
    execFileSync("npx", ["remotion", "ffmpeg", "-loglevel", "error", "-y", "-i", mp3, "-ar", "16000", "-ac", "1", wav]);

    const output = await transcribe({
      inputPath: wav,
      whisperPath: WHISPER_DIR,
      whisperCppVersion: WHISPER_VERSION,
      model: MODEL,
      language: "uk",
      tokenLevelTimestamps: true,
      printOutput: false,
    });
    const { captions } = toCaptions({ whisperCppOutput: output });
    // Токени whisper — шматки слів; нове слово починається з пробілу.
    const heard: Heard[] = [];
    for (const c of captions) {
      const last = heard[heard.length - 1];
      if (last && !c.text.startsWith(" ")) {
        last.text += c.text;
        last.endMs = c.endMs;
      } else {
        heard.push({ text: c.text.trim(), startMs: c.startMs, endMs: c.endMs });
      }
    }
    for (let k = heard.length - 1; k >= 0; k--) {
      if (!normalize(heard[k].text)) heard.splice(k, 1);
    }
    writeFileSync(path.join(TMP, `${scene.id}.heard.json`), JSON.stringify(heard, null, 2));

    const words = splitWords(scene.voiceText);
    const pairs = alignWords(
      words.map((w) => w.text),
      heard,
    );

    // Слова без пари отримують час інтерполяцією між сусідніми впізнаними словами.
    const anchors = [...pairs.entries()].sort((x, y) => x[0] - y[0]);
    const totalMs = heard.length ? heard[heard.length - 1].endMs : 0;
    const timeAt = (wi: number) => {
      const exact = pairs.get(wi);
      if (exact !== undefined) return heard[exact].startMs;
      const before = anchors.filter(([k]) => k < wi).pop();
      const after = anchors.find(([k]) => k > wi);
      const t0 = before ? heard[before[1]].startMs : 0;
      const t1 = after ? heard[after[1]].startMs : totalMs;
      const c0 = before ? words[before[0]].start : 0;
      const c1 = after ? words[after[0]].start : scene.voiceText.length;
      return t0 + ((t1 - t0) * (words[wi].start - c0)) / Math.max(1, c1 - c0);
    };
    const aligned: AlignedWord[] = words.map((w, wi) => ({
      text: w.text,
      start: w.start,
      startMs: Math.round(timeAt(wi)),
      endMs: Math.round(wi + 1 < words.length ? timeAt(wi + 1) : totalMs),
      matched: pairs.has(wi),
    }));
    const out = path.join("public", audioPath(LESSON, scene.id).replace(/\.mp3$/, ".words.json"));
    writeFileSync(out, JSON.stringify(aligned, null, 1));

    const matched = aligned.filter((w) => w.matched).length;
    console.log(`${scene.id}: ${matched}/${aligned.length} слів зіставлено → ${out}`);
    console.log(`  почуто: ${heard.map((h) => h.text).join(" ")}`);
  }
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
