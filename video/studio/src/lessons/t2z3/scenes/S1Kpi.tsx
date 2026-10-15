import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, inOut, prog, typed } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z3Frame } from "../frame";
import { GLOSSARY } from "../script";

// Поля картки KPI (бриф 2, зошит крок 3, зразок № 1).
const FIELDS = [
  { label: "Показник", value: "Час інвентаризації", labelCue: "metric", valueCue: "example" },
  { label: "Джерело", value: "Журнал інвентаризації", labelCue: "source", valueCue: "exSource" },
  { label: "База", value: "3 дні", labelCue: "base", valueCue: "exBase" },
  { label: "Ціль", value: "≤ 1 дня", labelCue: "target", valueCue: "exTarget" },
  { label: "Рішення", value: "Доопрацювати авто-звіряння", labelCue: "decision", valueCue: "exDecision" },
];

export const S1Kpi: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);

  return (
    <T2Z3Frame timing={timing} current={0} done={0}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("five") - 20}
        index={0}
        count={GLOSSARY.length}
        title="KPI"
        en="Key Performance Indicator"
        uk="ключовий показник ефективності"
      />

      {/* Картка KPI: п’ять складників */}
      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          top: 150,
          opacity: inOut(frame, cue("five"), cue("test") - 6),
        }}
      >
        <Card style={{ padding: "28px 48px" }}>
          <Label style={{ marginBottom: 12 }}>5 складників KPI</Label>
          {FIELDS.map((f) => {
            const isDecision = f.label === "Рішення";
            const lit = isDecision ? prog(frame, cue("decision"), 12) : 0;
            return (
              <div
                key={f.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  minHeight: 116,
                  borderTop: `2px solid ${C.line}`,
                  marginLeft: -48,
                  marginRight: -48,
                  paddingLeft: 48 - 14 * lit,
                  paddingRight: 48,
                  borderLeft: `${14 * lit}px solid ${C.gold}`,
                  background: `rgba(243, 146, 0, ${0.16 * lit})`,
                  ...fadeUp(frame, cue(f.labelCue) - 4, { dy: 24 }),
                }}
              >
                <div style={{ width: 380, fontSize: F.small, fontWeight: 500, color: isDecision ? C.ink : C.muted }}>
                  {f.label}
                </div>
                <div style={{ flex: 1, position: "relative", fontSize: F.body, fontWeight: 500 }}>
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      bottom: -6,
                      width: 420,
                      borderBottom: `4px dashed ${C.line}`,
                      opacity: 1 - prog(frame, cue(f.valueCue), 6),
                    }}
                  />
                  <span>{typed(f.value, frame, cue(f.valueCue), 40)}</span>
                  &nbsp;
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Тест для кожного KPI */}
      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          top: 170,
          ...fadeUp(frame, cue("question") - 10),
        }}
      >
        <Label style={{ marginBottom: 20 }}>Тест для кожного KPI</Label>
        <div style={{ fontSize: F.head, fontWeight: 700, lineHeight: 1.12 }}>
          Що я зроблю,
          <br />
          якщо він <span style={{ color: C.gold }}>відхилиться?</span>
        </div>
      </div>

      {/* Антиприклад: показник «для звіту» */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 600,
          display: "flex",
          alignItems: "center",
          gap: 48,
          ...fadeUp(frame, cue("noAnswer") - 4),
        }}
      >
        <Card muted style={{ padding: "32px 56px", position: "relative" }}>
          <div style={{ fontSize: F.body, fontWeight: 500, color: C.dim }}>Кількість проведених нарад</div>
          <div
            style={{
              position: "absolute",
              left: 40,
              top: "50%",
              height: 8,
              width: `calc((100% - 80px) * ${prog(frame, cue("noAnswer") + 10, 14)})`,
              background: C.muted,
            }}
          />
        </Card>
        <div style={fadeUp(frame, cue("forReport") - 4, { dx: -24, dy: 0 })}>
          <Pill tone="dim" size={F.small}>
            для звіту
          </Pill>
        </div>
      </div>
    </T2Z3Frame>
  );
};
