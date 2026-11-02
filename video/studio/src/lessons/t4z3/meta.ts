import type { LessonMeta } from "../../shared/lesson";
import { PRONUNCIATION, toVoice } from "./pronunciation";
import { GLOSSARY, LESSON, SCENES } from "./script";

export const T4Z3: LessonMeta = {
  id: LESSON,
  // Лише для службових файлів (voiceover/*.md); у кадр і голос номери не потрапляють.
  label: "Тема 4 · Заняття 3",
  composition: "T4-Z3-Stakeholders",
  outName: "t4z3-stakeholders",
  videoTitle: "Управління стейкхолдерами: 6 понять · озвучення: elevenlabs.io",
  glossary: GLOSSARY,
  scenes: SCENES,
  toVoice,
  pronunciation: PRONUNCIATION,
  step: "«Стейкхолдери й переговори»",
  site: {
    doc: "CDTO_Meth_T4_Z3_Lecture.md",
    version: "v1",
    caption: "Відеоконспект лекції · 6 понять управління стейкхолдерами",
  },
  keyframes: [
    { scene: "s0-intro", name: "a-chief", anchor: "people", offset: -10 },
    { scene: "s0-intro", name: "b-people", anchor: "title", offset: -14 },
    { scene: "s0-intro", name: "c-title", anchor: "end", offset: -20 },
    { scene: "s1-stakeholder", name: "a-term", anchor: "start", offset: 30 },
    { scene: "s1-stakeholder", name: "b-kinds", anchor: "five", offset: -10 },
    { scene: "s1-stakeholder", name: "c-questions", anchor: "end", offset: -20 },
    { scene: "s2-matrix", name: "a-quadrants", anchor: "e1", offset: -6 },
    { scene: "s2-matrix", name: "b-examples", anchor: "errors", offset: -6 },
    { scene: "s2-matrix", name: "c-quiet", anchor: "end", offset: -20 },
    { scene: "s3-plan", name: "a-fields", anchor: "r1", offset: -10 },
    { scene: "s3-plan", name: "b-rows", anchor: "errors", offset: -8 },
    { scene: "s3-plan", name: "c-errors", anchor: "end", offset: -20 },
    { scene: "s4-trust", name: "a-high-low", anchor: "actions", offset: -10 },
    { scene: "s4-trust", name: "b-stairs", anchor: "slow", offset: -6 },
    { scene: "s4-trust", name: "c-drop", anchor: "lost", offset: -10 },
    { scene: "s4-trust", name: "d-recover", anchor: "end", offset: -20 },
    { scene: "s5-concerns", name: "a-three", anchor: "key", offset: -10 },
    { scene: "s5-concerns", name: "b-chief", anchor: "trap", offset: -10 },
    { scene: "s5-concerns", name: "c-gap", anchor: "early", offset: -6 },
    { scene: "s5-concerns", name: "d-early", anchor: "end", offset: -20 },
    { scene: "s6-audience", name: "a-anti", anchor: "a1", offset: -8 },
    { scene: "s6-audience", name: "b-quotes", anchor: "error", offset: -10 },
    { scene: "s6-audience", name: "c-principles", anchor: "end", offset: -20 },
    { scene: "s7-next", name: "a-checklist", anchor: "template", offset: -8 },
    { scene: "s7-next", name: "b-final", anchor: "end", offset: -1 },
  ],
};
