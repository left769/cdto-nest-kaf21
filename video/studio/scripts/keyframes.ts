// Ключові кадри ролика у PNG для перевірки візуалу (бриф 10, етап 2).
// Запуск: npx tsx scripts/keyframes.ts [фільтр-сцени]
// Кадри обираються за якорями тексту, тож після появи голосу вони самі зсуваються.

import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import path from "node:path";
import type { SceneTiming } from "../src/shared/timing";
import { sceneStarts } from "../src/shared/timing";

const COMPOSITION = "T2-Z3-Terms";
const OUT_DIR = path.join(process.cwd(), "out", "keyframes");

// [сцена, назва кадру, якір або "start"/"end", зсув у кадрах]
const KEYFRAMES: [string, string, string, number][] = [
  ["s0-hook", "a-dialogue", "title", -14],
  ["s0-hook", "b-title", "end", -20],
  ["s1-kpi", "a-term", "start", 30],
  ["s1-kpi", "b-card", "test", -12],
  ["s1-kpi", "c-question", "end", -20],
  ["s2-leading-lagging", "a-term", "start", 30],
  ["s2-leading-lagging", "b-timeline", "ruleLag", 30],
  ["s2-leading-lagging", "c-columns", "end", -20],
  ["s3-earned-value", "a-term", "start", 30],
  ["s3-earned-value", "b-ev", "burndown", -10],
  ["s3-earned-value", "c-burndown", "end", -20],
  ["s4-raid", "a-letters", "mistake", -10],
  ["s4-raid", "b-today", "rule", -10],
  ["s4-raid", "c-log", "end", -20],
  ["s5-logs", "a-meeting", "decision", -8],
  ["s5-logs", "b-cards", "wish", -6],
  ["s5-logs", "c-wish", "next", -6],
  ["s5-logs", "d-end", "end", -20],
  ["s6-dashboard", "a-term", "start", 30],
  ["s6-dashboard", "b-grid", "showcase", -8],
  ["s6-dashboard", "c-showcase", "answer", -12],
  ["s6-dashboard", "d-answer", "end", -20],
  ["s7-practice", "a-checklist", "template", -8],
  ["s7-practice", "b-final", "end", -1],
];

const main = async () => {
  const filter = process.argv[2];
  const serveUrl = await bundle({ entryPoint: path.join(process.cwd(), "src", "index.ts") });
  const composition = await selectComposition({ serveUrl, id: COMPOSITION, inputProps: {} });
  const timings = (composition.props as { timings: SceneTiming[] }).timings;
  const starts = sceneStarts(timings);
  mkdirSync(OUT_DIR, { recursive: true });

  for (const [sceneId, name, anchor, offset] of KEYFRAMES) {
    if (filter && !sceneId.includes(filter)) {
      continue;
    }
    const i = timings.findIndex((t) => t.id === sceneId);
    const t = timings[i];
    const local =
      anchor === "start" ? 0 : anchor === "end" ? (t.exitAt ?? t.durationInFrames) : t.cues[anchor];
    if (local === undefined) {
      throw new Error(`${sceneId}: немає якоря ${anchor}`);
    }
    const frame = starts[i] + local + offset;
    const output = path.join(OUT_DIR, `${sceneId}-${name}.png`);
    await renderStill({ composition, serveUrl, output, frame, imageFormat: "png" });
    console.log(`${path.relative(process.cwd(), output)}  кадр ${frame} (${(frame / composition.fps).toFixed(1)} с)`);
  }
  console.log(`Тривалість: ${(composition.durationInFrames / composition.fps).toFixed(1)} с`);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
