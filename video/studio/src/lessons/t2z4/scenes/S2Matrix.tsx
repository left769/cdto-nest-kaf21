import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { RiskMatrix } from "../../../shared/RiskMatrix";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z4Frame } from "../frame";
import { GLOSSARY } from "../script";

const PANEL_X = 1370;

// Легенда зон (Додаток 1 заняття).
const LEGEND = [
  { at: "red", color: C.bad, text: "реагування з власником і планом" },
  { at: "yellow", color: C.yellow, text: "моніторинг" },
  { at: "green", color: C.ok, text: "прийняти" },
];

// Оцінка зі зразка кроку 4 зошита.
const RISKS = [
  { n: 1, at: "r1", zoneAt: "r1zone", name: "Затримка погодження ТЗ", score: "В × В", row: 0, col: 2, top: 270 },
  { n: 2, at: "r2", zoneAt: "r2zone", name: "Надмірний доступ до даних", score: "С × В", row: 1, col: 2, top: 567 },
];

export const S2Matrix: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);

  return (
    <T2Z4Frame timing={timing} current={1} done={1}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("dims") - 22}
        index={1}
        count={GLOSSARY.length}
        title="Ризик-матриця"
        uk="ймовірність × вплив"
      />

      <RiskMatrix
        frame={frame}
        appearAt={cue("dims")}
        colorAt={cue("zone")}
        emphasis={[
          { zone: "red", at: cue("red") },
          { zone: "yellow", at: cue("yellow") },
          { zone: "green", at: cue("green") },
        ]}
        emphasisEnd={cue("r1") - 6}
        markers={RISKS.map((r) => ({ row: r.row, col: r.col, n: r.n, at: cue(r.zoneAt) - 10, from: { x: PANEL_X + 58, y: r.top + 54 } }))}
      />

      {/* Легенда зон */}
      <div style={{ position: "absolute", left: 120, width: 1190, top: 760, display: "flex", flexWrap: "wrap", columnGap: 48, rowGap: 14 }}>
        {LEGEND.map((l) => (
          <div key={l.at} style={{ display: "flex", alignItems: "center", gap: 16, ...fadeUp(frame, cue(l.at) - 4, { dy: 16 }) }}>
            <div style={{ width: 36, height: 36, background: l.color, flexShrink: 0 }} />
            <div style={{ fontSize: F.small, whiteSpace: "nowrap" }}>{l.text}</div>
          </div>
        ))}
      </div>

      {/* Ризики зі зразка */}
      <div style={{ position: "absolute", left: PANEL_X, top: 215, ...fadeUp(frame, cue("r1") - 6) }}>
        <Label>Ризики</Label>
      </div>
      {RISKS.map((r) => (
        <div key={r.n} style={{ position: "absolute", left: PANEL_X, top: r.top, width: 1800 - PANEL_X, ...fadeUp(frame, cue(r.at) - 4) }}>
          <Card style={{ padding: "18px 22px 22px" }}>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <div
                style={{
                  width: 72,
                  height: 72,
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
                {r.n}
              </div>
              <div style={{ fontSize: F.small, fontWeight: 700, opacity: prog(frame, cue(r.zoneAt) - 30, 10) }}>{r.score}</div>
            </div>
            <div style={{ fontSize: F.small, fontWeight: 500, lineHeight: 1.15, marginTop: 14 }}>{r.name}</div>
          </Card>
        </div>
      ))}
    </T2Z4Frame>
  );
};
