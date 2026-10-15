import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, inOut, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z3Frame } from "../frame";
import { GLOSSARY } from "../script";

// Приклади з еталонного проходження заняття (розділ 8).
const COLUMNS = [
  { title: "Leading", tone: "gold" as const, items: ["Навчено користувачів", "Темп усунення дефектів"] },
  { title: "Lagging", tone: "dark" as const, items: ["Adoption", "Час інвентаризації"] },
];

const AXIS_Y = 500;
const LEAD_X = 420;
const LAG_X = 1500;

/** Чип над шкалою часу: мітка типу, сам показник і точка на осі. */
const Marker: React.FC<{ x: number; label: string; color: string; style: React.CSSProperties; children: React.ReactNode }> = ({
  x,
  label,
  color,
  style,
  children,
}) => (
  <div style={{ position: "absolute", left: x, top: AXIS_Y - 250, ...style }}>
    <div style={{ translate: "-50% 0px", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <Label color={color}>{label}</Label>
      {children}
      <div style={{ width: 4, height: 46, background: color }} />
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: color, marginTop: -14 }} />
    </div>
  </div>
);

export const S2LeadingLagging: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const partOne = inOut(frame, cue("lagging") - 8, cue("practice") - 8);
  const bracket = prog(frame, cue("reaction") - 4, 18);

  return (
    <T2Z3Frame timing={timing} current={1} done={1}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("lagging") - 24}
        index={1}
        count={GLOSSARY.length}
        title="Leading / Lagging"
        uk="випереджальні / запізнілі"
      />

      <div style={{ position: "absolute", inset: 0, opacity: partOne }}>
        {/* Шкала часу */}
        <div style={{ position: "absolute", left: 120, right: 140, top: AXIS_Y - 3, height: 6, background: C.ink }} />
        <svg width={40} height={40} style={{ position: "absolute", right: 116, top: AXIS_Y - 20 }}>
          <path d="M4 4 L34 20 L4 36" fill="none" stroke={C.ink} strokeWidth={6} />
        </svg>
        <div style={{ position: "absolute", left: 120, top: AXIS_Y + 24, fontSize: F.small, color: C.muted }}>рано</div>
        <div style={{ position: "absolute", right: 120, top: AXIS_Y + 24, fontSize: F.small, color: C.muted }}>пізніше</div>

        <Marker x={LAG_X} label="Lagging" color={C.graphite} style={fadeUp(frame, cue("lagging"))}>
          <Pill tone="dark" size={F.body}>
            Adoption 40%
          </Pill>
        </Marker>
        <Marker x={LEAD_X} label="Leading" color={C.gold} style={fadeUp(frame, cue("leading"))}>
          <Pill tone="gold" size={F.body}>
            Навчено 15 з 50
          </Pill>
        </Marker>

        {/* Дужка «час на реакцію» між ними */}
        <div style={{ position: "absolute", left: LEAD_X, width: LAG_X - LEAD_X, top: AXIS_Y + 40, opacity: bracket }}>
          <div
            style={{
              height: 40,
              borderLeft: `6px solid ${C.gold}`,
              borderRight: `6px solid ${C.gold}`,
              borderBottom: `6px solid ${C.gold}`,
              scale: `${bracket} 1`,
            }}
          />
          <div style={{ textAlign: "center", fontSize: F.body, fontWeight: 500, marginTop: 16 }}>час на реакцію</div>
        </div>

        {/* Правило */}
        <div
          style={{
            position: "absolute",
            left: 120,
            right: 120,
            top: 790,
            display: "flex",
            gap: 80,
            justifyContent: "center",
            fontSize: F.body,
            fontWeight: 500,
          }}
        >
          <div style={fadeUp(frame, cue("ruleLead") - 4)}>
            <span style={{ color: C.gold, fontWeight: 700 }}>Leading</span> — щоб діяти
          </div>
          <div style={fadeUp(frame, cue("ruleLag") - 4)}>
            <span style={{ fontWeight: 700 }}>Lagging</span> — щоб оцінити
          </div>
        </div>
      </div>

      {/* Дві колонки: щонайменше по два кожного типу */}
      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          top: 160,
          display: "flex",
          gap: 64,
          opacity: prog(frame, cue("practice"), 12),
        }}
      >
        {COLUMNS.map((col, ci) => (
          <div key={col.title} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
            <Pill tone={col.tone} size={F.body} style={{ alignSelf: "flex-start" }}>
              {col.title}
            </Pill>
            {col.items.map((item, ii) => (
              <div key={item} style={fadeUp(frame, cue("practice") + 10 + (ii * 2 + ci) * 8, { dy: -60 })}>
                <Card accent={col.tone === "gold" ? C.gold : C.graphite} style={{ padding: "26px 36px" }}>
                  <div style={{ fontSize: 56, fontWeight: 500, whiteSpace: "nowrap" }}>{item}</div>
                </Card>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 700,
          textAlign: "center",
          fontSize: F.title,
          fontWeight: 700,
          ...fadeUp(frame, cue("practice") + 45),
        }}
      >
        <span style={{ color: C.gold }}>≥ 2</span> + <span>≥ 2</span>
      </div>
    </T2Z3Frame>
  );
};
