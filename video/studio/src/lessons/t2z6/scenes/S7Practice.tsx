import React from "react";
import { useCurrentFrame } from "remotion";
import { Practice, PracticeItem } from "../../../shared/Practice";
import { cueOf } from "../../../shared/timing";
import { LESSON_LABEL, SceneProps, T2Z6Frame } from "../frame";
import { T2Z6 } from "../meta";
import { GLOSSARY } from "../script";

// Чек-лист — бриф, сцена 7.
const ITEMS: PracticeItem[] = [
  { cue: "baskets", title: "Кошики", detail: "обов’язкові поза конкурсом" },
  { cue: "wsjf", title: "Шкала з якорями", detail: "WSJF · MVP" },
  { cue: "matrix", title: "Матриця завантаження", detail: "конфлікти за пріоритетом" },
  { cue: "roadmap", title: "WIP-ліміт", detail: "дорожня карта «зараз / далі / пізніше»" },
  { cue: "own", title: "Ваш проєкт", detail: "трудовитрати й контрольна точка з числами" },
];

export const S7Practice: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);

  return (
    <T2Z6Frame timing={timing} current={null} done={GLOSSARY.length}>
      <Practice frame={frame} cue={cue} items={ITEMS} step={T2Z6.step} lessonLabel={LESSON_LABEL} compact />
    </T2Z6Frame>
  );
};
