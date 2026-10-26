import type { LessonMeta } from "../../shared/lesson";
import { PRONUNCIATION, toVoice } from "./pronunciation";
import { GLOSSARY, LESSON, SCENES } from "./script";

export const T3Z3: LessonMeta = {
  id: LESSON,
  // Лише для службових файлів (voiceover/*.md); у кадр і голос номери не потрапляють.
  label: "Тема 3 · Заняття 3",
  composition: "T3-Z3-AsIsToBe",
  outName: "t3z3-as-is-to-be",
  videoTitle: "Аналіз AS-IS / TO-BE: 6 понять · озвучення: elevenlabs.io",
  glossary: GLOSSARY,
  scenes: SCENES,
  toVoice,
  pronunciation: PRONUNCIATION,
  step: "«AS-IS / TO-BE, gap-аналіз, запит на зміну»",
  site: {
    doc: "CDTO_Meth_T3_Z3_Practical.md",
    version: "v1",
    caption: "Відеобрифінг до практичної вправи · 6 понять аналізу AS-IS / TO-BE",
  },
  keyframes: [
    { scene: "s0-intro", name: "a-as-is", anchor: "copy", offset: -10 },
    { scene: "s0-intro", name: "b-same", anchor: "title", offset: -14 },
    { scene: "s0-intro", name: "c-title", anchor: "end", offset: -20 },
    { scene: "s1-as-is", name: "a-term", anchor: "start", offset: 30 },
    { scene: "s1-as-is", name: "b-methods", anchor: "main", offset: -10 },
    { scene: "s1-as-is", name: "c-real", anchor: "metrics", offset: -10 },
    { scene: "s1-as-is", name: "d-metrics", anchor: "end", offset: -20 },
    { scene: "s2-waste", name: "a-losses", anchor: "ours", offset: -6 },
    { scene: "s2-waste", name: "b-ours", anchor: "end", offset: -20 },
    { scene: "s3-value", name: "a-classes", anchor: "end", offset: -20 },
    { scene: "s4-bottleneck", name: "a-queue", anchor: "why", offset: -10 },
    { scene: "s4-bottleneck", name: "b-root", anchor: "end", offset: -20 },
    { scene: "s5-to-be", name: "a-principles", anchor: "ours", offset: -10 },
    { scene: "s5-to-be", name: "b-flow", anchor: "reeng", offset: -10 },
    { scene: "s5-to-be", name: "c-scale", anchor: "end", offset: -20 },
    { scene: "s6-gap", name: "a-aspects", anchor: "result", offset: -8 },
    { scene: "s6-gap", name: "b-result", anchor: "end", offset: -20 },
    { scene: "s7-practice", name: "a-checklist", anchor: "template", offset: -8 },
    { scene: "s7-practice", name: "b-final", anchor: "end", offset: -1 },
  ],
};
