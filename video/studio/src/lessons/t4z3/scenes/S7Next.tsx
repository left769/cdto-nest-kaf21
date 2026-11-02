import React from "react";
import { useCurrentFrame } from "remotion";
import { Practice, PracticeItem } from "../../../shared/Practice";
import { cueOf } from "../../../shared/timing";
import { LESSON_LABEL, SceneProps, T4Z3Frame } from "../frame";
import { T4Z3 } from "../meta";
import { GLOSSARY } from "../script";

// Чек-лист — бриф, сцена 7: завдання на самостійну підготовку з лекції й крок зошита.
const ITEMS: PracticeItem[] = [
  { cue: "difficult", title: "Складні стейкхолдери", detail: "робота із запереченнями" },
  { cue: "crisis", title: "Криза довіри", detail: "алгоритм для інцидентів в ІКС" },
  { cue: "build", title: "Матриця й план", detail: "для реального проєкту свого підрозділу" },
  { cue: "workbook", title: "Робочий зошит", detail: "щонайменше 6 сторін, зокрема орган ЗІ" },
  { cue: "practical", title: "Практичне заняття", detail: "підготовка до переговорів" },
];

export const S7Next: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);

  return (
    <T4Z3Frame timing={timing} current={null} done={GLOSSARY.length}>
      <Practice frame={frame} cue={cue} items={ITEMS} step={T4Z3.step} lessonLabel={LESSON_LABEL} title="Після лекції" compact />
    </T4Z3Frame>
  );
};
