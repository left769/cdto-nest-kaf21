import React from "react";
import { useCurrentFrame } from "remotion";
import { Practice } from "../../../shared/Practice";
import { cueOf } from "../../../shared/timing";
import { LESSON_LABEL, SceneProps, T2Z4Frame } from "../frame";
import { GLOSSARY } from "../script";

// Чек-лист вправи (бриф Т2·З4, сцена 7; зошит крок 4, чек-лист самоперевірки).
const ITEMS = [
  { cue: "six", title: "≥ 6 ризиків", detail: "різні категорії · сформульовані конкретно" },
  { cue: "matrix", title: "Матриця", detail: "ймовірність × вплив для кожного" },
  { cue: "owner", title: "Owner — кожному", detail: "mitigation і contingency — обов’язково для червоної зони" },
  { cue: "emv", title: "EMV · резерв часу", detail: "для трьох найкритичніших" },
  { cue: "esc", title: "Ескалація", detail: "критерії й одне ескалаційне повідомлення" },
];

export const S7Practice: React.FC<SceneProps> = ({ timing }) => (
  <T2Z4Frame timing={timing} current={null} done={GLOSSARY.length}>
    <Practice frame={useCurrentFrame()} cue={cueOf(timing)} items={ITEMS} step="Крок 4" lessonLabel={LESSON_LABEL} compact />
  </T2Z4Frame>
);
