import type { LessonMeta } from "../../shared/lesson";
import { PRONUNCIATION, toVoice } from "./pronunciation";
import { GLOSSARY, LESSON, SCENES } from "./script";

export const T2Z7: LessonMeta = {
  id: LESSON,
  // Лише для службових файлів (voiceover/*.md); у кадр і голос номери не потрапляють.
  label: "Тема 2 · Заняття 7",
  composition: "T2-Z7-Dependencies",
  outName: "t2z7-dependencies",
  videoTitle: "Залежності та інтеграція: 6 понять · озвучення: elevenlabs.io",
  glossary: GLOSSARY,
  scenes: SCENES,
  toVoice,
  pronunciation: PRONUNCIATION,
  step: "«Dependency map»",
  site: {
    doc: "CDTO_Meth_T2_Z7_Practical.md",
    version: "v1",
    caption: "Відеобрифінг до практичної вправи · 6 понять про залежності та інтеграцію",
  },
  keyframes: [
    { scene: "s0-intro", name: "a-blocked", anchor: "depends", offset: -6 },
    { scene: "s0-intro", name: "b-title", anchor: "end", offset: -20 },
    { scene: "s1-map", name: "a-term", anchor: "start", offset: 30 },
    { scene: "s1-map", name: "b-dependency", anchor: "types", offset: -12 },
    { scene: "s1-map", name: "c-types", anchor: "critical", offset: -6 },
    { scene: "s1-map", name: "d-critical", anchor: "end", offset: -20 },
    { scene: "s2-interagency", name: "a-who", anchor: "three", offset: -12 },
    { scene: "s2-interagency", name: "b-find", anchor: "plan", offset: -12 },
    { scene: "s2-interagency", name: "c-written", anchor: "monitor", offset: -10 },
    { scene: "s2-interagency", name: "d-monitor", anchor: "end", offset: -20 },
    { scene: "s3-interface", name: "a-seams", anchor: "reduce", offset: -12 },
    { scene: "s3-interface", name: "b-actions", anchor: "truth", offset: -12 },
    { scene: "s3-interface", name: "c-truth", anchor: "end", offset: -20 },
    { scene: "s4-planb", name: "a-options", anchor: "example", offset: -12 },
    { scene: "s4-planb", name: "b-cases", anchor: "end", offset: -20 },
    { scene: "s5-constraints", name: "a-rows", anchor: "early", offset: -6 },
    { scene: "s5-constraints", name: "b-early", anchor: "end", offset: -20 },
    { scene: "s6-prereq", name: "a-gates", anchor: "fail", offset: -10 },
    { scene: "s6-prereq", name: "b-blocked", anchor: "end", offset: -20 },
    { scene: "s7-practice", name: "a-rule", anchor: "pairs", offset: -12 },
    { scene: "s7-practice", name: "b-checklist", anchor: "template", offset: -8 },
    { scene: "s7-practice", name: "c-final", anchor: "end", offset: -1 },
  ],
};
