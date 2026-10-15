import React from "react";
import { useCurrentFrame } from "remotion";
import { Practice } from "../../../shared/Practice";
import { cueOf } from "../../../shared/timing";
import { LESSON_LABEL, SceneProps, T2Z3Frame } from "../frame";
import { GLOSSARY } from "../script";

// Чек-лист вправи (бриф 4, сцена 7; зошит крок 3, чек-лист самоперевірки).
const ITEMS = [
  { cue: "kpi", title: "4–6 KPI", detail: "≥ 2 leading і ≥ 2 lagging · база, ціль, джерело, рішення" },
  { cue: "dashboard", title: "Дашборд", detail: "4 блоки · кожен веде до дії" },
  { cue: "raid", title: "RAID-log", detail: "≥ 2 записи R, A, I, D · у кожного власник" },
  { cue: "logs", title: "Decision / action log", detail: "відповідальний і строк" },
];

export const S7Practice: React.FC<SceneProps> = ({ timing }) => (
  <T2Z3Frame timing={timing} current={null} done={GLOSSARY.length}>
    <Practice frame={useCurrentFrame()} cue={cueOf(timing)} items={ITEMS} step="Крок 3" lessonLabel={LESSON_LABEL} />
  </T2Z3Frame>
);
