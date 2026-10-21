import React from "react";
import { useCurrentFrame } from "remotion";
import { EASE_IN_OUT, fadeUp, inOut, lerp, prog } from "../../../shared/anim";
import { Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z6Frame } from "../frame";
import { GLOSSARY } from "../script";

// Матриця завантаження BA — розділ 3.2 заняття; розв’язання — розділ 3.3 і приклад після 3.4.
// Після рішення стройова записка зсувається на два місяці (старт з місяця 3), а опис процесів СЕДО
// іде до Technical Writer; числа «після» в занятті не наведено, тому їх і не показуємо.
const SERIES = [
  { name: "Облік майна", color: C.gold, values: [40, 40, 10, 0] },
  { name: "Документообіг у СЕДО", color: C.graphite, values: [30, 20, 0, 0] },
  { name: "Стройова записка", color: C.dim, values: [30, 30, 40, 30] },
] as const;
const [OBL, SED, ROLL] = SERIES;
const TOTALS = [100, 90, 50, 30];
const LIMIT = 70;
const WAYS = [
  { at: "w1", text: "зсунути в часі", used: "shift" },
  { at: "w2", text: "зменшити обсяг" },
  { at: "w3", text: "перерозподілити роботу", used: "writer" },
  { at: "w4", text: "залучити ресурс" },
  { at: "w5", text: "ескалювати командиру" },
];

// Що змінили два кроки — під сходинками, кольором відповідного стовпця.
const RESULTS = [
  { at: "shift", color: C.dim, text: "Стройова записка — з міс. 3" },
  { at: "writer", color: C.graphite, text: "СЕДО → Technical Writer" },
];

const BASE_Y = 850;
const PX = 4.6; // пікселів на 1%
const BAR_W = 110;
const barX = (m: number) => 260 + m * 150;
const LINE = { left: 250, width: 580 };
const PANEL = 900;
const yOf = (pct: number) => BASE_Y - pct * PX;

export const S4Load: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const grow = (m: number) => prog(frame, cue("three") + m * 6, 18);
  const shift = prog(frame, cue("shift"), 26, EASE_IN_OUT);
  const writer = prog(frame, cue("writer"), 22, EASE_IN_OUT);
  const overload = inOut(frame, cue("overload") - 4, cue("shift") - 6);
  const totals = inOut(frame, cue("three") + 20, cue("shift") - 6);
  // Висота стосу під стройовою запискою в місяці m (поза графіком — нуль).
  const base = (m: number) => (m < 4 ? OBL.values[m] + SED.values[m] * (1 - writer) : 0);

  return (
    <T2Z6Frame timing={timing} current={3} done={3}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("shows") - 22}
        index={3}
        count={GLOSSARY.length}
        title="Матриця завантаження"
        titleSize={F.head}
        uk="частка часу ключової людини по місяцях"
      />

      <div style={{ position: "absolute", inset: 0, ...fadeUp(frame, cue("shows") - 4) }}>
        {/* Заголовок графіка */}
        <div style={{ position: "absolute", left: 120, top: 150 }}>
          <div style={{ fontSize: F.body, fontWeight: 700 }}>BA підрозділу</div>
          <div style={{ fontSize: F.small, color: C.muted, marginTop: 4 }}>частка часу по місяцях</div>
        </div>

        <div style={{ position: "absolute", left: 100, top: BASE_Y + 12, width: 130, textAlign: "right", fontSize: F.small, color: C.muted }}>міс.</div>

        {/* Лінії 100% і 70% */}
        <div style={{ position: "absolute", left: 100, top: yOf(100) - 30, width: 130, textAlign: "right", fontSize: F.small, color: C.muted, opacity: prog(frame, cue("real") - 4, 12) }}>
          100%
        </div>
        <div style={{ position: "absolute", left: LINE.left, width: LINE.width, top: yOf(100), borderTop: `4px dashed ${C.dim}`, opacity: prog(frame, cue("real") - 4, 12) }} />
        <div style={{ position: "absolute", left: 100, top: yOf(LIMIT) - 30, width: 130, textAlign: "right", fontSize: F.small, fontWeight: 700, opacity: prog(frame, cue("ba70") - 4, 12) }}>
          70%
        </div>

        {/* Стовпці: облік і СЕДО стоять, стройова записка зсувається на два місяці */}
        {[0, 1, 2, 3].map((m) => {
          const g = grow(m);
          const obl = OBL.values[m] * PX * g;
          const sed = SED.values[m] * PX * g;
          return (
            <React.Fragment key={m}>
              <div style={{ position: "absolute", left: barX(m), width: BAR_W, top: BASE_Y - obl, height: obl, background: OBL.color }} />
              <div
                style={{
                  position: "absolute",
                  left: barX(m),
                  width: BAR_W,
                  top: BASE_Y - obl - sed * (1 - writer),
                  height: sed * (1 - writer),
                  background: SED.color,
                }}
              />
              <div style={{ position: "absolute", left: barX(m) - 20, width: BAR_W + 40, top: BASE_Y + 12, textAlign: "center", fontSize: F.small, color: C.muted }}>
                {m + 1}
              </div>
            </React.Fragment>
          );
        })}
        {ROLL.values.map((v, k) => {
          const g = grow(k);
          const pos = k + 2 * shift;
          const bottom = lerp(shift, base(k), base(k + 2)) * g;
          const gone = k + 2 >= 4 ? 1 - Math.min(1, shift * 2) : 1;
          return (
            <div
              key={k}
              style={{
                position: "absolute",
                left: barX(pos),
                width: BAR_W,
                top: BASE_Y - bottom * PX - v * PX * g,
                height: v * PX * g,
                background: ROLL.color,
                opacity: gone,
              }}
            />
          );
        })}

        {/* Перевантаження над лінією доступності */}
        {[0, 1].map((m) => (
          <div
            key={m}
            style={{
              position: "absolute",
              left: barX(m) - 6,
              width: BAR_W + 12,
              top: yOf(TOTALS[m]),
              height: (TOTALS[m] - LIMIT) * PX,
              boxSizing: "border-box",
              border: `6px solid ${C.bad}`,
              background: "rgba(184, 68, 44, 0.35)",
              opacity: overload,
            }}
          />
        ))}
        {TOTALS.map((t, m) => (
          <div
            key={m}
            style={{
              position: "absolute",
              left: barX(m) - 25,
              width: BAR_W + 50,
              top: yOf(t) - 62,
              textAlign: "center",
              fontSize: F.small,
              fontWeight: 700,
              color: t > LIMIT && overload > 0.5 ? C.bad : C.ink,
              opacity: totals,
            }}
          >
            {t}%
          </div>
        ))}
        <div style={{ position: "absolute", left: LINE.left, width: LINE.width, top: yOf(LIMIT) - 3, height: 6, background: C.gold, opacity: prog(frame, cue("ba70") - 4, 12) }} />
      </div>

      {/* Права колонка: легенда й перевантаження, потім сходинки розв’язання та їхній результат */}
      <div style={{ position: "absolute", left: PANEL, right: 120, top: 150, opacity: 1 - prog(frame, cue("solve") - 10, 10) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, ...fadeUp(frame, cue("ba70") - 4) }}>
          <div style={{ width: 48, height: 8, background: C.gold, flexShrink: 0 }} />
          <div style={{ fontSize: F.small }}>реальна доступність — 70%</div>
        </div>
        {SERIES.map((s, i) => (
          <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 10, ...fadeUp(frame, cue("three") + i * 6) }}>
            <div style={{ width: 48, height: 40, background: s.color, flexShrink: 0 }} />
            <div style={{ fontSize: F.small }}>{s.name}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: PANEL, top: 470, opacity: inOut(frame, cue("overload") - 4, cue("solve") - 10, 10) }}>
        <Pill tone="bad" size={F.body}>
          перевантаження
        </Pill>
        <div style={{ fontSize: F.small, color: C.muted, marginTop: 14 }}>місяці 1 і 2 — понад 70%</div>
      </div>
      <div style={{ position: "absolute", left: PANEL, right: 120, top: 150, ...fadeUp(frame, cue("solve") - 2) }}>
        <Label>Від найдешевшого</Label>
        {WAYS.map((w, i) => {
          const chosen = prog(frame, cue("two") - 4, 12);
          const isUsed = Boolean(w.used);
          const done = w.used ? prog(frame, cue(w.used) + 6, 12) : 0;
          const appear = fadeUp(frame, cue(w.at) - 4, { dx: -24, dy: 0 });
          return (
            <div
              key={w.at}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                marginTop: 10,
                marginLeft: i * 24,
                ...appear,
                opacity: appear.opacity * (isUsed ? 1 : 1 - 0.6 * chosen),
              }}
            >
              <Pill tone={isUsed && chosen > 0.5 ? "gold" : "dark"} size={F.small} style={{ minWidth: 40, justifyContent: "center" }}>
                {done > 0.5 ? "✓" : i + 1}
              </Pill>
              <div style={{ fontSize: F.small, fontWeight: isUsed && chosen > 0.5 ? 700 : 500 }}>{w.text}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: PANEL, top: 700 }}>
        {RESULTS.map((r) => (
          <div key={r.at} style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 10, ...fadeUp(frame, cue(r.at) + 8) }}>
            <div style={{ width: 48, height: 40, background: r.color, flexShrink: 0 }} />
            <div style={{ fontSize: F.small, fontWeight: 700 }}>{r.text}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: LINE.left + 10, top: 412, ...fadeUp(frame, cue("writer") + 24) }}>
        <Pill tone="ok" size={F.small}>
          усі місяці ≤ 70%
        </Pill>
      </div>
    </T2Z6Frame>
  );
};
