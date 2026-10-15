// Ключові кадри ролика у PNG для перевірки візуалу (бриф, етап 2).
// Запуск: npx tsx scripts/keyframes.ts <урок> [фільтр-сцени]
// Кадри обираються за якорями тексту, тож після появи голосу вони самі зсуваються.

import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { lessonFromArgs } from "../src/lessons/registry";
import type { SceneTiming } from "../src/shared/timing";
import { sceneStarts } from "../src/shared/timing";

const main = async () => {
  const { lesson, rest } = lessonFromArgs();
  const filter = rest[0];
  const outDir = path.join(process.cwd(), "out", "keyframes", lesson.id);
  const serveUrl = await bundle({ entryPoint: path.join(process.cwd(), "src", "index.ts") });
  const composition = await selectComposition({ serveUrl, id: lesson.composition, inputProps: {} });
  const timings = (composition.props as { timings: SceneTiming[] }).timings;
  const starts = sceneStarts(timings);
  mkdirSync(outDir, { recursive: true });

  for (const { scene, name, anchor, offset } of lesson.keyframes) {
    if (filter && !scene.includes(filter)) {
      continue;
    }
    const i = timings.findIndex((t) => t.id === scene);
    const t = timings[i];
    const local = anchor === "start" ? 0 : anchor === "end" ? (t.exitAt ?? t.durationInFrames) : t.cues[anchor];
    if (local === undefined) {
      throw new Error(`${scene}: немає якоря ${anchor}`);
    }
    const frame = starts[i] + local + offset;
    const output = path.join(outDir, `${scene}-${name}.png`);
    await renderStill({ composition, serveUrl, output, frame, imageFormat: "png" });
    console.log(`${path.relative(process.cwd(), output)}  кадр ${frame} (${(frame / composition.fps).toFixed(1)} с)`);
  }
  console.log(`Тривалість: ${(composition.durationInFrames / composition.fps).toFixed(1)} с`);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
