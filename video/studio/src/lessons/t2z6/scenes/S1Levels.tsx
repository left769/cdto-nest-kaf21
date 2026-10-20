import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, inOut } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z6Frame } from "../frame";
import { GLOSSARY } from "../script";

// Три рівні й їхні питання — розділ 1 заняття. Рамки вкладені: проєкт ⊂ програма ⊂ портфель.
// Кожна рамка тримає свій текст у власній правій частині, тож читання йде зліва направо,
// як в озвучці. У DOM зовнішня рамка перша, щоб внутрішні лежали поверх.
const LEVELS = [
  {
    name: "Портфель",
    note: "усі ініціативи підрозділу разом",
    question: "Чи робимо правильні речі й чи вистачає ресурсу?",
    at: "portfolio",
    qAt: "portfolioQ",
    box: { left: 120, top: 150, width: 1680, height: 750 },
    textLeft: 1270,
    border: C.gold,
    background: C.card,
  },
  {
    name: "Програма",
    note: "пов’язані проєкти заради спільних вигод",
    question: "Чи складаються проєкти в спільний результат?",
    at: "program",
    qAt: "programQ",
    box: { left: 150, top: 180, width: 1090, height: 690 },
    textLeft: 720,
    border: C.graphite,
    background: C.warmLight,
  },
  {
    name: "Проєкт",
    note: "результат у межах обсягу, строків і ресурсів",
    question: "Чи робимо ми це правильно?",
    at: "project",
    qAt: "projectQ",
    box: { left: 180, top: 210, width: 510, height: 630 },
    textLeft: 180,
    border: C.graphite,
    background: C.card,
  },
];
const OWNER = [
  ["o1", "відбирає ініціативи"],
  ["o2", "ставить пріоритети"],
  ["o3", "розподіляє людей"],
  ["o4", "продовжити / призупинити / закрити"],
] as const;

export const S1Levels: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);

  return (
    <T2Z6Frame timing={timing} current={0} done={0}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("project") - 22}
        index={0}
        count={GLOSSARY.length}
        title="Портфель"
        en="проєкт · програма · портфель"
        uk="три рівні управління"
      />

      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("project") - 4, cue("owner") - 8) }}>
        {LEVELS.map((l, i) => {
          const right = l.box.left + l.box.width;
          return (
            <div
              key={l.name}
              style={{
                position: "absolute",
                ...l.box,
                boxSizing: "border-box",
                border: `${i === 0 ? 6 : 4}px solid ${l.border}`,
                background: l.background,
                ...fadeUp(frame, cue(l.at) - 4, { dy: 0 }),
              }}
            >
              <div style={{ position: "absolute", left: l.textLeft - l.box.left + 28, width: right - l.textLeft - 56, top: 22 }}>
                <div style={{ fontSize: F.body, fontWeight: 700 }}>{l.name}</div>
                <div style={{ fontSize: F.small, color: C.muted, lineHeight: 1.2, marginTop: 6 }}>{l.note}</div>
                <div style={{ fontSize: 54, fontWeight: 700, lineHeight: 1.2, marginTop: 28, ...fadeUp(frame, cue(l.qAt) - 6, { dy: 16 }) }}>
                  «{l.question}»
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Власник портфеля */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 170, ...fadeUp(frame, cue("owner") - 4) }}>
        <Card accent={C.gold} style={{ padding: "30px 44px 34px 36px" }}>
          <Label>Власник портфеля</Label>
          <div style={{ fontSize: F.big, fontWeight: 700, marginTop: 8 }}>керівник підрозділу ЦТ · DT Lead</div>
        </Card>
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 410, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
        {OWNER.map(([at, text]) => (
          <div key={at} style={fadeUp(frame, cue(at) - 4, { dx: -24, dy: 0 })}>
            <Pill tone={at === "o4" ? "gold" : "dark"} size={F.body}>
              {text}
            </Pill>
          </div>
        ))}
      </div>
    </T2Z6Frame>
  );
};
