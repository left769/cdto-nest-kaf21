import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import React from "react";
import { AbsoluteFill, CalculateMetadataFunction } from "remotion";
import type { LessonMeta } from "./lesson";
import type { SceneProps } from "./LessonFrame";
import { C } from "./theme";
import { computeSceneTiming, loadTimings, SceneTiming, totalFrames, TRANSITION } from "./timing";

export type VideoProps = { timings: SceneTiming[] };

/**
 * Ролик уроку: сцени в TransitionSeries з fade між ними, тривалість — з голосу
 * (calculateMetadata) або оцінка, поки голосу немає. Компоненти сцен ті самі,
 * що й в окремих композиціях сцен (connected compositions).
 */
export const makeLessonVideo = (lesson: LessonMeta, components: Record<string, React.FC<SceneProps>>) => {
  const { id, scenes } = lesson;
  for (const s of scenes) {
    if (!components[s.id]) throw new Error(`${id}: немає компонента сцени ${s.id}`);
  }

  const Video: React.FC<VideoProps> = ({ timings }) => (
    <AbsoluteFill style={{ background: C.black }}>
      <TransitionSeries>
        {timings.flatMap((timing, i) => {
          const Scene = components[timing.id];
          const items = [
            <TransitionSeries.Sequence key={timing.id} name={scenes[i].title} durationInFrames={timing.durationInFrames}>
              <Scene timing={timing} />
            </TransitionSeries.Sequence>,
          ];
          if (i > 0) {
            items.unshift(
              <TransitionSeries.Transition
                key={`${timing.id}-in`}
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANSITION })}
              />,
            );
          }
          return items;
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );

  /** Тривалість сцен: є MP3 — голос + 0,6 с; немає — оцінка за кількістю слів. */
  const calculateMetadata: CalculateMetadataFunction<VideoProps> = async () => {
    const timings = await loadTimings(id, scenes);
    return { durationInFrames: totalFrames(timings), props: { timings } };
  };

  /** Таймінг сцени без голосу — початкові props окремої композиції сцени. */
  const fallbackTiming = (index: number) => computeSceneTiming(id, scenes[index], null, index === scenes.length - 1);

  /** Окрема сцена в Studio: та сама тривалість і якорі, що й у ролику. */
  const sceneMetadata =
    (index: number): CalculateMetadataFunction<SceneProps> =>
    async () => {
      const timing = (await loadTimings(id, scenes))[index];
      return { durationInFrames: timing.durationInFrames, props: { timing } };
    };

  return { Video, calculateMetadata, fallbackTiming, sceneMetadata, components };
};
