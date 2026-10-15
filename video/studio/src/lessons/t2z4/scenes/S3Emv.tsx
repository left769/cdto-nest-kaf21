import React from "react";
import { interpolateColors, useCurrentFrame } from "remotion";
import { EASE_IN_OUT, fadeUp, prog, typed } from "../../../shared/anim";
import { HBar } from "../../../shared/HBar";
import { Pill } from "../../../shared/Pill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z4Frame } from "../frame";
import { GLOSSARY } from "../script";

// EMV зі зразка кроку 4 зошита. Літер Н / С / В тут немає (бриф, розділ 2).
const ROWS = [
  { label: "Затримка погодження ТЗ", formula: "50% × 20 дн = 10 дн", value: 10, valueText: "10 дн", at: "e1", barAt: "e1v" },
  { label: "Несумісність форматів", formula: "30% × 15 дн = 4,5 дн", value: 4.5, valueText: "4,5 дн", at: "e2", barAt: "e2v" },
  { label: "Ротація PM", formula: "20% × 10 дн = 2 дн", value: 2, valueText: "2 дн", at: "e3", barAt: "e3v" },
];

export const S3Emv: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const focus = prog(frame, cue("biggest"), 14);

  return (
    <T2Z4Frame timing={timing} current={2} done={2}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("formula") - 22}
        index={2}
        count={GLOSSARY.length}
        title="EMV"
        en="Expected Monetary Value"
        uk="очікувані втрати"
      />

      <div style={{ position: "absolute", left: 120, top: 150, fontSize: F.big, fontWeight: 700, minHeight: 94, opacity: prog(frame, cue("formula") - 2, 4) }}>
        {typed("EMV = ймовірність × вплив", frame, cue("formula"), 30)}
      </div>

      <div style={{ position: "absolute", left: 120, right: 120, top: 290, display: "flex", flexDirection: "column", gap: 36 }}>
        {ROWS.map((r, i) => (
          <div key={r.label} style={{ ...fadeUp(frame, cue(r.at) - 4), opacity: prog(frame, cue(r.at) - 4, 14) * (i === 0 ? 1 : 1 - 0.5 * focus) }}>
            <HBar
              label={r.label}
              formula={typed(r.formula, frame, cue(r.at) + 10, 22)}
              value={r.value}
              max={10}
              width={600}
              grow={prog(frame, cue(r.barAt) - 6, 20, EASE_IN_OUT)}
              color={i === 0 ? interpolateColors(focus, [0, 1], [C.graphite, C.gold]) : C.graphite}
              valueText={r.valueText}
              extra={
                i === 0 ? (
                  <div style={fadeUp(frame, cue("target") - 6, { dx: -24, dy: 0 })}>
                    <Pill tone="dark" size={F.small}>
                      основний ресурс реагування
                    </Pill>
                  </div>
                ) : null
              }
            />
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", left: 120, top: 760, display: "flex", alignItems: "center", gap: 32, ...fadeUp(frame, cue("sum") - 4) }}>
        <Pill tone="gold" size={F.body}>
          Резерв часу ≈ 16,5 дня
        </Pill>
        <div style={{ fontSize: F.small, color: C.muted, lineHeight: 1.15, ...fadeUp(frame, cue("reserve"), { dx: -24, dy: 0 }) }}>
          під конкретні ризики,
          <br />а не «на око»
        </div>
      </div>

    </T2Z4Frame>
  );
};
