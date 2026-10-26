import React from "react";
import { useCurrentFrame } from "remotion";
import { Practice, PracticeItem } from "../../../shared/Practice";
import { cueOf } from "../../../shared/timing";
import { LESSON_LABEL, SceneProps, T3Z3Frame } from "../frame";
import { T3Z3 } from "../meta";
import { GLOSSARY } from "../script";

// Чек-лист — бриф, сцена 7.
const ITEMS: PracticeItem[] = [
  { cue: "asis", title: "AS-IS", detail: "як є насправді, з метриками" },
  { cue: "waste", title: "Втрати й вузьке місце", detail: "першопричина" },
  { cue: "tobe", title: "TO-BE", detail: "усуває проблеми, а не автоматизує" },
  { cue: "gap", title: "Gap-аналіз", detail: "п’ять аспектів і масштаб" },
  { cue: "own", title: "Ваш проєкт", detail: "той самий аналіз у зошиті" },
];

export const S7Practice: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);

  return (
    <T3Z3Frame timing={timing} current={null} done={GLOSSARY.length}>
      <Practice frame={frame} cue={cue} items={ITEMS} step={T3Z3.step} lessonLabel={LESSON_LABEL} compact />
    </T3Z3Frame>
  );
};
