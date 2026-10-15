import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, inOut, prog } from "../../../shared/anim";
import { Card } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { Letter, RaidType } from "../../../shared/RiskLetter";
import { StruckCard } from "../../../shared/StruckCard";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z4Frame } from "../frame";
import { GLOSSARY } from "../script";

// Таблиця «Risk vs issue» і приклад із розділу 3 заняття.
const COLUMNS: { letter: RaidType; word: string; state: string; action: string; example: string; at: string; exAt: string }[] = [
  { letter: "R", word: "Risk", state: "ще не настав", action: "готуємось", example: "«Підрядник може не встигнути»", at: "riskDef", exAt: "exRisk" },
  { letter: "I", word: "Issue", state: "уже настав", action: "реагуємо негайно", example: "«Підрядник не надав систему вчора»", at: "issueDef", exAt: "exIssue" },
];

const CATEGORIES = [
  ["c1", "Технічні"],
  ["c2", "Організаційні"],
  ["c3", "Нормативні"],
  ["c4", "Ресурсні"],
  ["c5", "Безпекові"],
] as const;

const Tick: React.FC = () => (
  <svg width={56} height={56} viewBox="0 0 56 56" style={{ flexShrink: 0 }}>
    <path d="M10 29 L23 42 L46 15" fill="none" stroke={C.ok} strokeWidth={9} strokeLinecap="square" />
  </svg>
);

export const S1RiskIssue: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);

  return (
    <T2Z4Frame timing={timing} current={0} done={0}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("riskDef") - 22}
        index={0}
        count={GLOSSARY.length}
        title="Risk / Issue"
        uk="ризик / проблема"
      />

      {/* Ризик і проблема: стан, дія, приклад */}
      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          top: 150,
          display: "flex",
          gap: 40,
          opacity: inOut(frame, cue("riskDef"), cue("concrete") - 8),
        }}
      >
        {COLUMNS.map((col) => (
          <div key={col.word} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28, ...fadeUp(frame, cue(col.at) - 4) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
              <Letter letter={col.letter} size={110} />
              <div>
                <div style={{ fontSize: F.big, fontWeight: 700, lineHeight: 1.05 }}>{col.word}</div>
                <div style={{ fontSize: F.small, color: C.muted }}>{col.letter === "R" ? "ризик" : "проблема"}</div>
              </div>
            </div>
            <Card style={{ padding: "26px 36px" }}>
              <div style={{ fontSize: F.body, fontWeight: 700 }}>{col.state}</div>
              <div style={{ fontSize: F.small, color: C.muted, marginTop: 6 }}>{col.action}</div>
            </Card>
            <div style={fadeUp(frame, cue(col.exAt) - 4, { dy: -40 })}>
              <Card accent={col.letter === "R" ? C.yellow : C.bad} style={{ padding: "24px 36px" }}>
                <div style={{ fontSize: 56, fontWeight: 500, lineHeight: 1.2 }}>{col.example}</div>
              </Card>
            </div>
          </div>
        ))}
      </div>

      {/* Формулювання: конкретно, а не загально */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 170, display: "flex", flexDirection: "column", gap: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 40, ...fadeUp(frame, cue("vague") - 4) }}>
          <StruckCard strike={prog(frame, cue("vague") + 12, 14)}>«Щось піде не так»</StruckCard>
          <div style={fadeUp(frame, cue("vague") + 16, { dx: -24, dy: 0 })}>
            <Pill tone="dim" size={F.small}>
              загально
            </Pill>
          </div>
        </div>
        <div style={fadeUp(frame, cue("good") - 4)}>
          <Card accent={C.ok} style={{ padding: "28px 48px 28px 32px", display: "inline-flex", alignItems: "center", gap: 24 }}>
            <Tick />
            <div style={{ fontSize: F.body, fontWeight: 700 }}>«Затримка погодження ТЗ органом ЗІ»</div>
          </Card>
        </div>
      </div>

      {/* Категорії */}
      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          top: 590,
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          opacity: prog(frame, cue("categories") - 4, 10),
        }}
      >
        {CATEGORIES.map(([at, label]) => (
          <div key={at} style={fadeUp(frame, cue(at) - 4, { dy: 24 })}>
            <Pill tone="dark" size={F.body}>
              {label}
            </Pill>
          </div>
        ))}
      </div>
    </T2Z4Frame>
  );
};
