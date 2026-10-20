import React from "react";
import { useCurrentFrame } from "remotion";
import { EASE_IN_OUT, fadeUp, inOut, lerp, prog, typed } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z6Frame } from "../frame";
import { GLOSSARY } from "../script";

// Критерії й якорі — розділ 2.3 заняття (критерій «внесок»); таблиця — розділ 2.4.
const CRITERIA = ["внесок у цілі", "терміновість", "зниження ризику"];
const ANCHORS = [
  { score: "1", unit: "бал", text: "опосередкований" },
  { score: "3", unit: "бали", text: "прискорює процес одного підрозділу" },
  { score: "5", unit: "балів", text: "впливає на рішення командира щодо всієї частини" },
];
const NUMERATOR = "цінність + терміновість + зниження ризику";
const DENOMINATOR = "зусилля, ×100 год";

// Рядки таблиці: місце до й після появи MVP.
const ROWS = [
  { id: "mvp", name: "Облік майна · MVP", calc: "(5 + 3 + 3) / 3,0", wsjf: "3,7", before: 4, after: 0 },
  { id: "roll", name: "Стройова записка", calc: "(4 + 5 + 2) / 3,2", wsjf: "3,4", before: 0, after: 1 },
  { id: "dash", name: "Дашборд командира", calc: "(4 + 2 + 1) / 2,4", wsjf: "2,9", before: 1, after: 2 },
  { id: "repair", name: "Заявки на ремонт", calc: "(3 + 3 + 2) / 4,0", wsjf: "2,0", before: 2, after: 3 },
  { id: "full", name: "Облік майна повністю", calc: "(5 + 3 + 3) / 6,0", wsjf: "1,8", before: 3, after: 4 },
];
const COLS = [640, 500, 540];
const TABLE_TOP = 380;
const ROW_H = 90;

export const S3Wsjf: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const up = prog(frame, cue("up"), 24, EASE_IN_OUT);
  const low = prog(frame, cue("low"), 12);

  return (
    <T2Z6Frame timing={timing} current={2} done={2}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("criteria") - 22}
        index={2}
        count={GLOSSARY.length}
        title="WSJF"
        en="Weighted Shortest Job First"
        uk="пріоритет = цінність / зусилля"
      />

      {/* Критерії й якорі шкали */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("criteria") - 4, cue("formula") - 10) }}>
        <div style={{ position: "absolute", left: 120, top: 150 }}>
          <Label>Кошик «ефект» · три критерії</Label>
          <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
            {CRITERIA.map((c, i) => (
              <div key={c} style={fadeUp(frame, cue("criteria") + i * 8)}>
                <Pill tone={i === 0 ? "gold" : "ghost"} size={F.small}>
                  {c}
                </Pill>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 370, ...fadeUp(frame, cue("anchor") - 4) }}>
          <Label>Якорі шкали · внесок у цілі</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
            {ANCHORS.map((a, i) => (
              <div key={a.score} style={fadeUp(frame, cue("anchor") + 6 + i * 10, { dx: -24, dy: 0 })}>
                <Card accent={i === 2 ? C.gold : C.graphite} style={{ padding: "14px 30px 16px 26px", display: "flex", alignItems: "baseline", gap: 32 }}>
                  <div style={{ width: 230, flexShrink: 0, fontSize: F.big, fontWeight: 700 }}>
                    {a.score} <span style={{ fontSize: F.small, fontWeight: 500, color: C.muted }}>{a.unit}</span>
                  </div>
                  <div style={{ fontSize: F.small, fontWeight: 500 }}>{a.text}</div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Верхній рядок: формула → MVP → висновок */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 150,
          display: "flex",
          alignItems: "center",
          gap: 36,
          opacity: inOut(frame, cue("formula") - 4, cue("mvp") - 10),
        }}
      >
        <div style={{ fontSize: F.body, fontWeight: 700 }}>WSJF =</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 56, minHeight: 67 }}>{typed(NUMERATOR, frame, cue("formula") + 4, 40)}</div>
          <div style={{ height: 6, width: 1380, background: C.ink, margin: "8px 0" }} />
          <div style={{ fontSize: 56, minHeight: 67 }}>{typed(DENOMINATOR, frame, cue("formula") + 34, 40)}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 150, opacity: inOut(frame, cue("mvp") - 4, cue("decomp") - 10) }}>
        <Card accent={C.gold} style={{ padding: "22px 40px 26px 32px" }}>
          <Label>MVP обліку майна</Label>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, marginTop: 8 }}>
            <div style={{ fontSize: 56, fontWeight: 700 }}>реєстр та інвентаризація з авто-звірянням</div>
          </div>
        </Card>
      </div>
      <div style={{ position: "absolute", right: 160, top: 166, ...fadeUp(frame, cue("mvpHours") - 4), opacity: inOut(frame, cue("mvpHours") - 4, cue("decomp") - 10) }}>
        <Pill tone="black" size={F.small}>
          ≈ 300 год замість 605
        </Pill>
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 150, ...fadeUp(frame, cue("decomp") - 4) }}>
        <Card accent={C.gold} style={{ padding: "26px 40px 30px 32px" }}>
          <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.2 }}>Декомпозиція змінює пріоритет сильніше, ніж переоцінка цінності</div>
        </Card>
      </div>

      {/* Таблиця WSJF */}
      <div style={{ position: "absolute", left: 120, top: TABLE_TOP, display: "flex", ...fadeUp(frame, cue("full") - 8) }}>
        {["Ініціатива", "Розрахунок", "WSJF"].map((h, i) => (
          <div key={h} style={{ width: COLS[i], paddingLeft: 30, boxSizing: "border-box" }}>
            <Label>{h}</Label>
          </div>
        ))}
      </div>
      {ROWS.map((r) => {
        const isMvp = r.id === "mvp";
        const isFull = r.id === "full";
        const slot = lerp(up, r.before, r.after);
        const appear = isMvp ? fadeUp(frame, cue("mvp") - 2) : fadeUp(frame, cue("full") + r.before * 5);
        return (
          <div
            key={r.id}
            style={{
              position: "absolute",
              left: 120,
              top: TABLE_TOP + 70 + slot * ROW_H,
              width: 1680,
              height: ROW_H - 12,
              display: "flex",
              alignItems: "center",
              boxSizing: "border-box",
              background: C.card,
              border: `2px solid ${isFull && low > 0 ? C.bad : C.line}`,
              borderLeft: `14px solid ${isMvp ? C.gold : isFull ? C.bad : C.line}`,
              opacity: appear.opacity * (isFull ? 1 - 0.45 * up : 1),
              translate: isMvp ? `${Math.sin(Math.PI * up) * -40}px 0px` : appear.translate,
              zIndex: isMvp ? 2 : 1,
            }}
          >
            {/* Ширини колонок збігаються із заголовком: рамка ліворуч (14 + 2 px) входить у першу колонку. */}
            <div style={{ width: COLS[0] - 16, flexShrink: 0, paddingLeft: 14, boxSizing: "border-box", fontSize: F.small, fontWeight: 700 }}>{r.name}</div>
            <div style={{ width: COLS[1], flexShrink: 0, paddingLeft: 30, boxSizing: "border-box", fontSize: F.small, color: C.muted }}>{r.calc}</div>
            <div style={{ width: 140, flexShrink: 0, paddingLeft: 30, boxSizing: "border-box", fontSize: F.body, fontWeight: 700, color: isFull && low > 0.5 ? C.bad : C.ink }}>
              {r.wsjf}
            </div>
            {isMvp ? (
              <div style={{ flexShrink: 0, opacity: prog(frame, cue("up") + 20, 10) }}>
                <Pill tone="gold" size={F.small}>
                  перше місце
                </Pill>
              </div>
            ) : null}
          </div>
        );
      })}
    </T2Z6Frame>
  );
};
