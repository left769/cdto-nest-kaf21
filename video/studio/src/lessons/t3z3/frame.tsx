import React from "react";
import { LessonFrame, SceneProps } from "../../shared/LessonFrame";
import { SceneTiming } from "../../shared/timing";
import { GLOSSARY } from "./script";

export type { SceneProps };

// Без номерів теми й заняття: курс переставлятиметься (рішення автора).
export const LESSON_LABEL = "Аналіз AS-IS / TO-BE";

/** Рамка сцени: мітка теми відео, смуга глосарію й голос сцени. */
export const T3Z3Frame: React.FC<{
  timing: SceneTiming;
  current: number | null;
  done: number;
  dark?: boolean;
  glossaryStyle?: React.CSSProperties;
  children: React.ReactNode;
}> = (props) => <LessonFrame label={LESSON_LABEL} glossary={GLOSSARY} {...props} />;
