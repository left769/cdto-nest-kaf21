import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeOut, fadeUp, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z6Frame } from "../frame";
import { INITIATIVES } from "../initiatives";

// Шість ініціатив розкидано по кадру; «терміново» — на тих, про які говорить озвучка.
const CARDS = [
  { name: INITIATIVES.sed, at: "sed", x: 120, y: 160, urgent: true },
  { name: INITIATIVES.roll, at: "staff", x: 900, y: 150, urgent: true },
  { name: INITIATIVES.property, at: "property", x: 300, y: 400 },
  { name: INITIATIVES.dashboard, at: "six", x: 960, y: 380 },
  { name: INITIATIVES.chatbot, at: "chatbot", x: 160, y: 570 },
  { name: INITIATIVES.repair, at: "six", x: 940, y: 560 },
];

const Person: React.FC = () => (
  <svg width={70} height={90} viewBox="0 0 70 90">
    <circle cx={35} cy={22} r={18} fill={C.onDarkMuted} />
    <path d="M6 88 C6 58 64 58 64 88 Z" fill={C.onDarkMuted} />
  </svg>
);

export const S0Intro: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const strip = prog(frame, cue("concepts"), 18);

  return (
    <T2Z6Frame timing={timing} dark current={null} done={0} glossaryStyle={{ opacity: strip, translate: `0px ${(1 - strip) * 140}px` }}>
      {/* Шість ініціатив і чотири людини */}
      <div style={{ position: "absolute", inset: 0, opacity: fadeOut(frame, cue("title") - 12) }}>
        {CARDS.map((c, i) => (
          <div key={c.name} style={{ position: "absolute", left: c.x, top: c.y, ...fadeUp(frame, cue(c.at) + (c.at === "six" ? i * 6 : 0)) }}>
            <Card style={{ padding: "22px 34px" }}>
              <div style={{ fontSize: F.small, fontWeight: 700, whiteSpace: "nowrap" }}>{c.name}</div>
            </Card>
            {c.urgent ? (
              <div style={{ marginTop: 12, ...fadeUp(frame, cue("urgent") - 4, { dy: -12 }) }}>
                <Pill tone="bad" size={F.small}>
                  терміново
                </Pill>
              </div>
            ) : null}
          </div>
        ))}
        <div style={{ position: "absolute", left: 120, top: 760, display: "flex", alignItems: "flex-end", gap: 20, ...fadeUp(frame, cue("four") - 4) }}>
          {[0, 1, 2, 3].map((k) => (
            <Person key={k} />
          ))}
          <div style={{ fontSize: F.body, color: C.onDark, marginLeft: 16 }}>команда — 4 особи</div>
        </div>
        <div style={{ position: "absolute", right: 140, top: 640, fontSize: 220, fontWeight: 700, color: C.gold, lineHeight: 1, ...fadeUp(frame, cue("question") - 4) }}>
          ?
        </div>
      </div>

      {/* Назва ролика */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 170, ...fadeUp(frame, cue("title")) }}>
        <div style={{ fontSize: F.head, fontWeight: 700, lineHeight: 1.1 }}>Управління портфелем:</div>
        <div style={{ fontSize: F.big, fontWeight: 400, marginTop: 24, color: C.onDark }}>
          <span style={{ color: C.gold, fontWeight: 700 }}>6 понять</span> для практичного заняття
        </div>
      </div>
      <div style={{ position: "absolute", left: 120, top: 520, ...fadeUp(frame, cue("title") + 24) }}>
        <Card accent={C.gold} style={{ padding: "40px 64px 48px 56px", width: 1400 }}>
          <Label>Приклад</Label>
          <div style={{ fontSize: F.big, fontWeight: 700, marginTop: 12 }}>Портфель підрозділу</div>
          <div style={{ fontSize: F.small, color: C.muted, marginTop: 16 }}>6 ініціатив · команда 4 особи · серед них «Система обліку майна»</div>
        </Card>
      </div>
    </T2Z6Frame>
  );
};
