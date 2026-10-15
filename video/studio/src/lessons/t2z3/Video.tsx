import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import React from "react";
import { AbsoluteFill, CalculateMetadataFunction } from "remotion";
import { C } from "../../shared/theme";
import { computeSceneTiming, loadTimings, SceneTiming, totalFrames, TRANSITION } from "../../shared/timing";
import { SceneProps } from "./frame";
import { S0Hook } from "./scenes/S0Hook";
import { S1Kpi } from "./scenes/S1Kpi";
import { S2LeadingLagging } from "./scenes/S2LeadingLagging";
import { S3EarnedValue } from "./scenes/S3EarnedValue";
import { S4Raid } from "./scenes/S4Raid";
import { S5Logs } from "./scenes/S5Logs";
import { S6Dashboard } from "./scenes/S6Dashboard";
import { S7Practice } from "./scenes/S7Practice";
import { LESSON, SCENES } from "./script";

export const SCENE_COMPONENTS: Record<string, React.FC<SceneProps>> = {
  "s0-hook": S0Hook,
  "s1-kpi": S1Kpi,
  "s2-leading-lagging": S2LeadingLagging,
  "s3-earned-value": S3EarnedValue,
  "s4-raid": S4Raid,
  "s5-logs": S5Logs,
  "s6-dashboard": S6Dashboard,
  "s7-practice": S7Practice,
};

export type VideoProps = { timings: SceneTiming[] };

/** Тривалість сцен: є MP3 — голос + 0,6 с; немає — оцінка за кількістю слів. */
export const calculateVideoMetadata: CalculateMetadataFunction<VideoProps> = async () => {
  const timings = await loadTimings(LESSON, SCENES);
  return { durationInFrames: totalFrames(timings), props: { timings } };
};

/** Таймінг сцени без голосу — початкові props окремої композиції сцени. */
export const fallbackTiming = (index: number) =>
  computeSceneTiming(LESSON, SCENES[index], null, index === SCENES.length - 1);

/** Окрема сцена в Studio: та сама тривалість і якорі, що й у ролику. */
export const sceneMetadata =
  (index: number): CalculateMetadataFunction<SceneProps> =>
  async () => {
    const timing = (await loadTimings(LESSON, SCENES))[index];
    return { durationInFrames: timing.durationInFrames, props: { timing } };
  };

export const T2Z3Video: React.FC<VideoProps> = ({ timings }) => (
  <AbsoluteFill style={{ background: C.black }}>
    <TransitionSeries>
      {timings.flatMap((timing, i) => {
        const Scene = SCENE_COMPONENTS[timing.id];
        const items = [
          <TransitionSeries.Sequence key={timing.id} name={SCENES[i].title} durationInFrames={timing.durationInFrames}>
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
