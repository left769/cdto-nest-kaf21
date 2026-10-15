import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { fadeOut } from "./anim";
import { SceneFrame } from "./SceneFrame";
import { SceneTiming, TAIL } from "./timing";

export type SceneProps = { timing: SceneTiming };

/** Рамка сцени уроку: мітка, смуга глосарію й голос сцени (якщо MP3 уже є). */
export const LessonFrame: React.FC<{
  timing: SceneTiming;
  label: string;
  glossary: readonly string[];
  current: number | null;
  done: number;
  dark?: boolean;
  glossaryStyle?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ timing, label, glossary, current, done, dark, glossaryStyle, children }) => {
  const frame = useCurrentFrame();
  // Після голосу вміст зникає, і перехід до наступної сцени йде по чистому тлу.
  const content = timing.exitAt === null ? 1 : fadeOut(frame, timing.exitAt, TAIL);
  return (
    <SceneFrame dark={dark} lessonLabel={label} glossary={{ labels: glossary, current, done }} glossaryStyle={glossaryStyle}>
      <AbsoluteFill style={{ opacity: content }}>{children}</AbsoluteFill>
      {timing.audioSrc ? <Audio src={timing.audioSrc} from={timing.speechStart} /> : null}
    </SceneFrame>
  );
};
