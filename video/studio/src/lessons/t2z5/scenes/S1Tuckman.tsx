import React from "react";
import { interpolateColors, useCurrentFrame } from "remotion";
import { fadeUp, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z5Frame } from "../frame";
import { GLOSSARY } from "../script";

// Етапи й дії керівника — розділ 1 заняття.
const STAGES = [
  { name: "Формування", note: "знайомство й невизначеність", lead: "задає цілі й ролі", at: "forming", leadAt: "formingLead" },
  { name: "Конфлікт · storming", note: "зіткнення підходів", lead: "модерує розбіжності, не уникає їх", at: "storming", leadAt: "stormingLead" },
  { name: "Нормалізація", note: "вироблення правил", lead: "закріплює правила", at: "norming", leadAt: "normingLead" },
  { name: "Результативність", note: "злагоджена робота", lead: "делегує, підтримує ритм", at: "performing", leadAt: "performingLead" },
];

const KNOWLEDGE = [
  ["docs", "документація"],
  ["mentor", "наставництво"],
  ["onboarding", "онбординг"],
] as const;

export const S1Tuckman: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const normal = prog(frame, cue("normal") - 4, 12);

  return (
    <T2Z5Frame timing={timing} current={0} done={0}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("forming") - 22}
        index={0}
        count={GLOSSARY.length}
        title="Модель Такмана"
        uk="етапи розвитку команди"
      />

      {/* Чотири етапи */}
      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          top: 150,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "repeat(2, 300px)",
          gap: 24,
        }}
      >
        {STAGES.map((s, i) => {
          const storming = i === 1;
          return (
            <div key={s.name} style={fadeUp(frame, cue(s.at) - 4)}>
              <Card
                accent={storming ? interpolateColors(normal, [0, 1], [C.bad, C.gold]) : C.graphite}
                style={{ height: 300, boxSizing: "border-box", padding: "20px 24px 20px 22px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      flexShrink: 0,
                      borderRadius: "50%",
                      background: C.ink,
                      color: C.onDark,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: F.small,
                      fontWeight: 700,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1 }}>{s.name}</div>
                </div>
                <div style={{ position: "relative", marginTop: 10, minHeight: 72 }}>
                  <div style={{ fontSize: F.small, color: C.muted, opacity: storming ? 1 - normal : 1 }}>{s.note}</div>
                  {storming ? (
                    <div style={{ position: "absolute", left: 0, top: -4, opacity: normal }}>
                      <Pill tone="gold" size={F.small}>
                        норма розвитку
                      </Pill>
                    </div>
                  ) : null}
                </div>
                <div style={{ fontSize: F.small, lineHeight: 1.15, marginTop: 8, ...fadeUp(frame, cue(s.leadAt) - 4, { dx: -24, dy: 0 }) }}>
                  <span style={{ color: C.muted }}>керівник: </span>
                  {s.lead}
                </div>
              </Card>
            </div>
          );
        })}
      </div>


      {/* Розподіл знань проти ротації */}
      <div style={{ position: "absolute", left: 120, top: 800, display: "flex", alignItems: "center", gap: 24, ...fadeUp(frame, cue("rotation") - 4) }}>
        <Label style={{ whiteSpace: "nowrap" }}>Проти ротації</Label>
        {KNOWLEDGE.map(([at, label]) => (
          <div key={at} style={fadeUp(frame, cue(at) - 4, { dx: -16, dy: 0 })}>
            <Pill tone="dark" size={F.small}>
              {label}
            </Pill>
          </div>
        ))}
      </div>
    </T2Z5Frame>
  );
};
