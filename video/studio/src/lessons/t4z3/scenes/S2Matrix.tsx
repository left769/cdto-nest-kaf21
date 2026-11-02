import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, prog } from "../../../shared/anim";
import { Pill } from "../../../shared/Pill";
import { StruckPill } from "../../../shared/StruckPill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T4Z3Frame } from "../frame";
import { GLOSSARY } from "../script";

// Матриця й приклади — розділ 1.2 і Додаток 1 лекції; начальник складу — Додаток 3 (рішення автора: «йдемо по лекції»).
const GRID = { left: 440, top: 196, cellW: 680, cellH: 316 };
const COLS = ["Низький інтерес", "Високий інтерес"];
const ROWS = ["Високий вплив", "Низький вплив"];
const QUADRANTS: { at: string; row: number; col: number; title: string; color: string; examples: { at: string; text: string }[] }[] = [
  {
    at: "q1",
    row: 0,
    col: 1,
    title: "Керувати тісно",
    color: C.gold,
    examples: [
      { at: "e1", text: "командування" },
      { at: "e1", text: "начальник складу" },
    ],
  },
  { at: "q2", row: 0, col: 0, title: "Тримати задоволеними", color: C.graphite, examples: [{ at: "e2", text: "орган ЗІ" }] },
  { at: "q3", row: 1, col: 1, title: "Інформувати", color: C.ok, examples: [{ at: "e3", text: "користувач" }] },
  { at: "q4", row: 1, col: 0, title: "Моніторити", color: C.dim, examples: [] },
];

export const S2Matrix: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const grid = prog(frame, cue("dims") - 4, 14);
  const quiet = prog(frame, cue("quiet") + 6, 10);

  return (
    <T4Z3Frame timing={timing} current={1} done={1}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("dims") - 22}
        index={1}
        count={GLOSSARY.length}
        title="Матриця сили/інтересу"
        titleSize={F.head}
        uk="вплив × інтерес → стратегія роботи"
      />

      <div style={{ position: "absolute", inset: 0, opacity: grid }}>
        {COLS.map((c, i) => (
          <div
            key={c}
            style={{
              position: "absolute",
              left: GRID.left + i * GRID.cellW,
              width: GRID.cellW,
              top: 132,
              textAlign: "center",
              fontSize: F.small,
              fontWeight: 700,
            }}
          >
            {c} {i === 1 ? <span style={{ color: C.gold }}>→</span> : null}
          </div>
        ))}
        {ROWS.map((r, i) => (
          <div
            key={r}
            style={{
              position: "absolute",
              left: 120,
              width: GRID.left - 150,
              top: GRID.top + i * GRID.cellH,
              height: GRID.cellH,
              display: "flex",
              alignItems: "center",
              fontSize: F.small,
              fontWeight: 700,
              lineHeight: 1.15,
            }}
          >
            {r}
            {i === 0 ? <span style={{ color: C.gold, marginLeft: 12 }}>↑</span> : null}
          </div>
        ))}
        {QUADRANTS.map((q) => (
          <div
            key={q.at}
            style={{
              position: "absolute",
              left: GRID.left + q.col * GRID.cellW,
              top: GRID.top + q.row * GRID.cellH,
              width: GRID.cellW,
              height: GRID.cellH,
              boxSizing: "border-box",
              background: C.card,
              border: `2px solid ${C.line}`,
              borderTop: `14px solid ${q.color}`,
              padding: "18px 28px",
            }}
          >
            <div style={{ fontSize: F.body, fontWeight: 700, lineHeight: 1.2, ...fadeUp(frame, cue(q.at) - 4) }}>{q.title}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 16 }}>
              {q.examples.map((e) => {
                const isZi = e.text === "орган ЗІ";
                return (
                  <div
                    key={e.text}
                    style={{
                      ...fadeUp(frame, cue(e.at) - 4 + (e.text === "начальник складу" ? 14 : 0)),
                      outline: isZi ? `6px solid rgba(243, 146, 0, ${quiet})` : undefined,
                      outlineOffset: 6,
                      borderRadius: 999,
                    }}
                  >
                    <Pill tone="dark" size={F.small}>
                      {e.text}
                    </Pill>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Типові помилки */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 846, display: "flex", alignItems: "center", gap: 28 }}>
        <div style={fadeUp(frame, cue("errors") - 4)}>
          <StruckPill strike={prog(frame, cue("errors") + 16, 14)}>однакова увага до всіх</StruckPill>
        </div>
        <div style={fadeUp(frame, cue("quiet") - 2)}>
          <Pill tone="gold" size={F.small}>
            «тихі», але впливові
          </Pill>
        </div>
      </div>
    </T4Z3Frame>
  );
};
