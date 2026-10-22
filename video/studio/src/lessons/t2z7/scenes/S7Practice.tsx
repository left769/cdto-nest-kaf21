import React from "react";
import { useCurrentFrame } from "remotion";
import { inOut } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Practice, PracticeItem } from "../../../shared/Practice";
import { C } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { LESSON_LABEL, SceneProps, T2Z7Frame } from "../frame";
import { T2Z7 } from "../meta";
import { GLOSSARY } from "../script";

// Головне правило — Додаток 7 заняття; чек-лист — бриф, сцена 7.
const ITEMS: PracticeItem[] = [
  { cue: "deps", title: "Залежності", detail: "≥ 6, усі чотири типи" },
  { cue: "owners", title: "Напрям", detail: "власники з обох боків · строк" },
  { cue: "crit", title: "Критичність", detail: "критичний шлях" },
  { cue: "planb", title: "План дій", detail: "для 2–3 критичних" },
  { cue: "own", title: "Ваш проєкт", detail: "обмеження й передумови етапів" },
];

export const S7Practice: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);

  return (
    <T2Z7Frame timing={timing} current={null} done={GLOSSARY.length}>
      <div style={{ position: "absolute", left: 120, right: 120, top: 220, opacity: inOut(frame, cue("rule") - 4, cue("pairs") - 10) }}>
        <Card accent={C.gold} style={{ padding: "40px 56px 48px 44px" }}>
          <Label>Головне правило</Label>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.2, marginTop: 16 }}>
            Залежність без власника, строку й плану дій — <span style={{ color: C.bad }}>прихований ризик зриву</span>
          </div>
        </Card>
      </div>
      <Practice frame={frame} cue={cue} items={ITEMS} step={T2Z7.step} lessonLabel={LESSON_LABEL} compact introAt={cue("pairs") - 4} />
    </T2Z7Frame>
  );
};
