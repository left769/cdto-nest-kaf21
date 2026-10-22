import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { StruckPill } from "../../../shared/StruckPill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z7Frame } from "../frame";
import { GLOSSARY } from "../script";

// Внутрішні обмеження й планування — розділ 5 заняття.
const KINDS = ["захист інформації та ДСК", "доступи", "погодження"];
const ROWS = [
  { at: "c1", name: "Класифікація, ДСК", how: "з органом ЗІ — ще на етапі ТЗ" },
  { at: "c2", name: "Доступи", how: "запит завчасно; роботи — лише після отримання" },
  { at: "c3", name: "Погодження", how: "юрслужба, ЗІ, ФЕО — окремі віхи з запасом" },
];

export const S5Constraints: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);

  return (
    <T2Z7Frame timing={timing} current={4} done={4}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("three") - 22}
        index={4}
        count={GLOSSARY.length}
        title="Внутрішні обмеження"
        titleSize={F.head}
        uk="ДСК · доступи · погодження"
      />

      <div style={{ position: "absolute", left: 120, right: 120, top: 150, display: "flex", gap: 16 }}>
        {KINDS.map((k, i) => (
          <div key={k} style={fadeUp(frame, cue("three") - 4 + i * 10)}>
            <Pill tone="dark" size={F.small}>
              {k}
            </Pill>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 120, top: 252, ...fadeUp(frame, cue("hidden") - 4) }}>
        <Label>Приховані залежності · планують як зовнішні</Label>
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 322, display: "flex", flexDirection: "column", gap: 14 }}>
        {ROWS.map((r) => (
          <div key={r.at} style={fadeUp(frame, cue(r.at) - 4)}>
            <Card accent={C.gold} style={{ padding: "16px 36px 18px 28px", display: "flex", alignItems: "baseline", gap: 32, minHeight: 158, boxSizing: "border-box" }}>
              <div style={{ width: 440, flexShrink: 0, fontSize: 52, fontWeight: 700, lineHeight: 1.15 }}>{r.name}</div>
              <div style={{ fontSize: F.small, lineHeight: 1.2 }}>{r.how}</div>
            </Card>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 120, top: 846, display: "flex", alignItems: "center", gap: 28, ...fadeUp(frame, cue("early") - 4) }}>
        <Pill tone="ok" size={F.small}>
          орган ЗІ — на початку
        </Pill>
        <StruckPill strike={prog(frame, cue("early") + 30, 14)}>постфактум</StruckPill>
      </div>
    </T2Z7Frame>
  );
};
