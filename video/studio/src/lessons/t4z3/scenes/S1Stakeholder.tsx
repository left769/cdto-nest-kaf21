import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, inOut, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { StruckPill } from "../../../shared/StruckPill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T4Z3Frame } from "../frame";
import { GLOSSARY } from "../script";

// Хто такі стейкхолдери й питання для їх виявлення — розділ 1.1 лекції; помилка — «Типові помилки» розділу 1.
const KINDS = ["користувачі", "командування", "суміжні підрозділи", "орган ЗІ", "підрядники"];
const QUESTIONS = [
  { at: "q1", text: "Хто користуватиметься рішенням?" },
  { at: "q2", text: "Хто ухвалює про нього рішення?" },
  { at: "q3", text: "Хто погоджує — ЗІ, юрслужба?" },
  { at: "q4", text: "На кого вплине зміна процесу?" },
  { at: "q5", text: "Хто забезпечує ресурси?" },
];

export const S1Stakeholder: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);

  return (
    <T4Z3Frame timing={timing} current={0} done={0}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("kinds") - 22}
        index={0}
        count={GLOSSARY.length}
        title="Стейкхолдер"
        uk="зацікавлений у проєкті або здатний на нього впливати"
      />

      {/* Хто це */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 200, opacity: inOut(frame, cue("kinds") - 4, cue("five") - 10) }}>
        <Label>Хто це буває</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginTop: 24, width: 1300 }}>
          {KINDS.map((k, i) => (
            <div key={k} style={fadeUp(frame, cue("kinds") + i * 10)}>
              <Pill tone={k === "орган ЗІ" ? "gold" : "ghost"} size={F.body}>
                {k}
              </Pill>
            </div>
          ))}
        </div>
      </div>

      {/* П’ять питань на старті */}
      <div style={{ position: "absolute", inset: 0, opacity: prog(frame, cue("five") - 4, 12) }}>
        <div style={{ position: "absolute", left: 120, top: 150 }}>
          <Label>П’ять питань на старті</Label>
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 220, display: "flex", flexDirection: "column", gap: 12 }}>
          {QUESTIONS.map((q, i) => (
            <div key={q.at} style={fadeUp(frame, cue(q.at) - 4, { dx: -24, dy: 0 })}>
              <Card accent={C.gold} style={{ height: 88, boxSizing: "border-box", padding: "0 32px 0 28px", display: "flex", alignItems: "center", gap: 28 }}>
                <div style={{ width: 40, fontSize: F.small, fontWeight: 700, color: C.gold }}>{i + 1}</div>
                <div style={{ fontSize: F.body, fontWeight: 700 }}>{q.text}</div>
              </Card>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 770, display: "flex", alignItems: "center", gap: 28 }}>
          <div style={fadeUp(frame, cue("missed") - 4)}>
            <Pill tone="bad" size={F.small}>
              пропущений на старті → раптовий опір
            </Pill>
          </div>
          <div style={fadeUp(frame, cue("error") - 4)}>
            <StruckPill strike={prog(frame, cue("error") + 16, 14)}>лише «замовник»</StruckPill>
          </div>
        </div>
      </div>
    </T4Z3Frame>
  );
};
