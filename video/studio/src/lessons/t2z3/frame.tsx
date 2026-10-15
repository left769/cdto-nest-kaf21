import React from "react";
import { LessonFrame, SceneProps } from "../../shared/LessonFrame";
import { SceneTiming } from "../../shared/timing";
import { GLOSSARY } from "./script";

export type { SceneProps };

export const LESSON_LABEL = "Тема 2 · Заняття 3";

/** Рамка сцени Т2·З3: мітка заняття, смуга глосарію й голос сцени. */
export const T2Z3Frame: React.FC<{
  timing: SceneTiming;
  current: number | null;
  done: number;
  dark?: boolean;
  glossaryStyle?: React.CSSProperties;
  children: React.ReactNode;
}> = (props) => <LessonFrame label={LESSON_LABEL} glossary={GLOSSARY} {...props} />;
