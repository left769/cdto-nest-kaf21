import type { LessonMeta } from "../../shared/lesson";
import { PRONUNCIATION, toVoice } from "./pronunciation";
import { GLOSSARY, LESSON, SCENES } from "./script";

export const T2Z6: LessonMeta = {
  id: LESSON,
  // Лише для службових файлів (voiceover/*.md); у кадр і голос номери не потрапляють.
  label: "Тема 2 · Заняття 6",
  composition: "T2-Z6-Portfolio",
  outName: "t2z6-portfolio",
  videoTitle: "Управління портфелем: 6 понять · озвучення: elevenlabs.io",
  glossary: GLOSSARY,
  scenes: SCENES,
  toVoice,
  pronunciation: PRONUNCIATION,
  step: "«Проєкт у портфелі підрозділу»",
  site: {
    doc: "CDTO_Meth_T2_Z6_Lecture_Practical.md",
    version: "v1",
    caption: "Відеобрифінг до практичної вправи · 6 понять управління портфелем",
  },
  keyframes: [
    { scene: "s0-intro", name: "a-chaos", anchor: "title", offset: -14 },
    { scene: "s0-intro", name: "b-title", anchor: "end", offset: -20 },
    { scene: "s1-levels", name: "a-term", anchor: "start", offset: 30 },
    { scene: "s1-levels", name: "b-levels", anchor: "owner", offset: -10 },
    { scene: "s1-levels", name: "c-owner", anchor: "end", offset: -20 },
    { scene: "s2-baskets", name: "a-term", anchor: "start", offset: 30 },
    { scene: "s2-baskets", name: "b-baskets", anchor: "end", offset: -2 },
    { scene: "s3-wsjf", name: "a-anchors", anchor: "formula", offset: -12 },
    { scene: "s3-wsjf", name: "b-table", anchor: "mvp", offset: -12 },
    { scene: "s3-wsjf", name: "c-mvp", anchor: "up", offset: -4 },
    { scene: "s3-wsjf", name: "d-decomp", anchor: "end", offset: -20 },
    { scene: "s4-load", name: "a-overload", anchor: "solve", offset: -10 },
    { scene: "s4-load", name: "b-ways", anchor: "shift", offset: -6 },
    { scene: "s4-load", name: "c-resolved", anchor: "end", offset: -20 },
    { scene: "s5-wip", name: "a-timelines", anchor: "wip", offset: -12 },
    { scene: "s5-wip", name: "b-wip", anchor: "roadmap", offset: -12 },
    { scene: "s5-wip", name: "c-roadmap", anchor: "end", offset: -20 },
    { scene: "s6-checkpoint", name: "a-sunk", anchor: "pilot", offset: -12 },
    { scene: "s6-checkpoint", name: "b-cases", anchor: "same", offset: -10 },
    { scene: "s6-checkpoint", name: "c-same", anchor: "end", offset: -20 },
    { scene: "s7-practice", name: "a-checklist", anchor: "template", offset: -8 },
    { scene: "s7-practice", name: "b-final", anchor: "end", offset: -1 },
  ],
};
