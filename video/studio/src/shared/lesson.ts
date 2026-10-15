// Опис уроку без React-компонентів: його читають і Remotion, і скрипти в Node
// (keyframes, voiceover-md, align, captions, render).

import type { PronunciationTable } from "./pronunciation";
import type { SceneDef } from "./timing";

export type Keyframe = {
  scene: string;
  name: string;
  /** Назва якоря, "start" або "end" (кінець голосу сцени). */
  anchor: string;
  offset: number;
};

export type LessonMeta = {
  /** Ідентифікатор уроку: тека голосу public/voiceover/<id>/, voiceover/<id>.md. */
  id: string;
  /** Мітка в кадрі й на фінальній картці. */
  label: string;
  /** Композиція ролика в Studio. */
  composition: string;
  /** Префікс файлів у out/: <outName>-v1.mp4, <outName>.uk.vtt … */
  outName: string;
  /** Назва в метаданих MP4 з атрибуцією голосу. */
  videoTitle: string;
  glossary: readonly string[];
  scenes: SceneDef[];
  toVoice: (text: string) => string;
  pronunciation: PronunciationTable;
  /** Крок робочого зошита з шаблоном вправи. */
  step: string;
  keyframes: Keyframe[];
};
