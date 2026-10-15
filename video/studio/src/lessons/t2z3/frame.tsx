import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { fadeOut } from "../../shared/anim";
import { SceneFrame } from "../../shared/SceneFrame";
import { SceneTiming, TAIL } from "../../shared/timing";
import { GLOSSARY } from "./script";

export type SceneProps = { timing: SceneTiming };

export const LESSON_LABEL = "Тема 2 · Заняття 3";

/** Рамка сцени Т2·З3: мітка заняття, смуга глосарію й голос сцени (якщо MP3 уже є). */
export const T2Z3Frame: React.FC<{
  timing: SceneTiming;
  current: number | null;
  done: number;
  dark?: boolean;
  glossaryStyle?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ timing, current, done, dark, glossaryStyle, children }) => {
  const frame = useCurrentFrame();
  // Після голосу вміст зникає, і перехід до наступної сцени йде по чистому тлу.
  const content = timing.exitAt === null ? 1 : fadeOut(frame, timing.exitAt, TAIL);
  return (
    <SceneFrame
      dark={dark}
      lessonLabel={LESSON_LABEL}
      glossary={{ labels: GLOSSARY, current, done }}
      glossaryStyle={glossaryStyle}
    >
      <AbsoluteFill style={{ opacity: content }}>{children}</AbsoluteFill>
      {timing.audioSrc ? <Audio src={timing.audioSrc} from={timing.speechStart} /> : null}
    </SceneFrame>
  );
};
