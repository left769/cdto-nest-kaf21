import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, inOut, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z6Frame } from "../frame";
import { INITIATIVES } from "../initiatives";
import { GLOSSARY } from "../script";

// «Паралельно vs послідовно» — розділ 4.1; WIP — 4.2; дорожня карта — розділ 5 і еталон.
const MONTH = 128;
const AXIS_X = 520;
const mx = (month: number) => AXIS_X + month * MONTH;
const LANES = [C.gold, C.graphite, C.dim];

const ROADMAP = [
  {
    name: "Зараз",
    note: "зобов’язання на квартал",
    at: "now",
    width: 620,
    items: [`${INITIATIVES.property} · MVP`, INITIATIVES.sed, "Чат-бот · дослідження 16 год"],
  },
  { name: "Далі", note: "план на 1–2 квартали", at: "next", width: 520, items: [INITIATIVES.roll, "Облік майна повністю"] },
  { name: "Пізніше", note: "наміри без дат", at: "later", width: 444, items: [INITIATIVES.dashboard, INITIATIVES.repair] },
];
const ORDER = ["пріоритет", "залежності", "зовнішні строки"];

export const S5Wip: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const par = prog(frame, cue("parallel"), 30);
  const seq = prog(frame, cue("sequential") - 4, 30);

  return (
    <T2Z6Frame timing={timing} current={4} done={4}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("three") - 22}
        index={4}
        count={GLOSSARY.length}
        title="WIP-ліміт"
        en="work in progress"
        uk="скільки ініціатив одночасно в роботі"
      />

      {/* Паралельно чи послідовно */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("three") - 4, cue("wip") - 10) }}>
        <div style={{ position: "absolute", left: 120, top: 150 }}>
          <Label>3 проєкти × 3 місяці роботи всієї команди</Label>
        </div>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: mx(i), width: MONTH, top: 230, textAlign: "center", fontSize: F.small, color: C.muted }}>
            {i + 1}
          </div>
        ))}

        <div style={{ position: "absolute", left: 120, top: 330, fontSize: 56, fontWeight: 700, opacity: prog(frame, cue("parallel") - 6, 12) }}>Паралельно</div>
        {LANES.map((color, k) => (
          <div key={k} style={{ position: "absolute", left: mx(0), top: 310 + k * 48, height: 36, width: 9.5 * MONTH * par, background: color }} />
        ))}
        <div style={{ position: "absolute", left: mx(9.5) - 3, top: 296, width: 6, height: 160, background: C.bad, opacity: prog(frame, cue("parallel") + 30, 10) }} />
        <div style={{ position: "absolute", right: 1920 - mx(9.5) - 3, top: 470, ...fadeUp(frame, cue("parallel") + 30) }}>
          <Pill tone="bad" size={F.small}>
            перший ефект — міс. 9–10
          </Pill>
        </div>

        <div style={{ position: "absolute", left: 120, top: 600, fontSize: 56, fontWeight: 700, opacity: prog(frame, cue("sequential") - 10, 12) }}>Послідовно</div>
        {LANES.map((color, k) => {
          const t = Math.min(1, Math.max(0, seq * 3 - k));
          return <div key={k} style={{ position: "absolute", left: mx(3 * k), top: 580 + k * 48, height: 36, width: 3 * MONTH * t, background: color }} />;
        })}
        <div style={{ position: "absolute", left: mx(3) - 3, top: 566, width: 6, height: 160, background: C.ok, opacity: prog(frame, cue("sequential") + 8, 10) }} />
        <div style={{ position: "absolute", left: mx(3) - 3, top: 740, ...fadeUp(frame, cue("sequential") + 8) }}>
          <Pill tone="ok" size={F.small}>
            перший ефект — міс. 3
          </Pill>
        </div>
      </div>

      {/* WIP-ліміт і правило старту */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("wip") - 4, cue("roadmap") - 10) }}>
        <div style={{ position: "absolute", left: 120, right: 120, top: 160 }}>
          <Card accent={C.gold} style={{ padding: "24px 40px 30px 32px" }}>
            <Label>WIP-ліміт</Label>
            <div style={{ fontSize: F.body, fontWeight: 700, marginTop: 8 }}>скільки ініціатив одночасно в роботі</div>
          </Card>
        </div>
        <div style={{ position: "absolute", left: 120, top: 400, ...fadeUp(frame, cue("limit") - 4) }}>
          <Label>Команда 4–6 осіб</Label>
          <div style={{ marginTop: 14 }}>
            <Pill tone="gold" size={F.body}>
              2 з кошика «ефект» + обов’язкові
            </Pill>
          </div>
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 590, ...fadeUp(frame, cue("start") - 4) }}>
          <Card style={{ padding: "22px 40px 26px 32px" }}>
            <div style={{ fontSize: 56, fontWeight: 500, lineHeight: 1.2 }}>Нова стартує, лише коли попередню завершено або передано у впровадження</div>
          </Card>
        </div>
        <div style={{ position: "absolute", left: 120, top: 810, display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ fontSize: F.small, fontWeight: 700, ...fadeUp(frame, cue("order") - 4) }}>Черговість:</div>
          {ORDER.map((o, i) => (
            <div key={o} style={fadeUp(frame, cue("order") + 6 + i * 8)}>
              <Pill tone="ghost" size={F.small}>
                {o}
              </Pill>
            </div>
          ))}
        </div>
      </div>

      {/* Портфельна дорожня карта */}
      <div style={{ position: "absolute", left: 120, top: 150, display: "flex", gap: 48, ...fadeUp(frame, cue("roadmap") - 4) }}>
        {ROADMAP.map((col, c) => (
          <div key={col.name} style={{ width: col.width, position: "relative" }}>
            {/* Однакова висота заголовків: підписи статусу мають один або два рядки. */}
            <div style={{ borderBottom: `6px solid ${c === 0 ? C.gold : C.graphite}`, paddingBottom: 12, minHeight: 210, boxSizing: "border-box" }}>
              <div style={{ fontSize: F.body, fontWeight: 700 }}>{col.name}</div>
              <div style={{ fontSize: F.small, color: C.muted, marginTop: 2 }}>{col.note}</div>
            </div>
            {col.items.map((item, k) => (
              <div key={item} style={{ marginTop: 16, ...fadeUp(frame, cue(col.at) + 8 + k * 14, { dy: -32 }) }}>
                <Card style={{ padding: "16px 24px 18px" }}>
                  <div style={{ fontSize: F.small, fontWeight: 700, lineHeight: 1.15 }}>{item}</div>
                </Card>
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* Рамка WIP навколо «зараз» */}
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 132,
          width: 668,
          height: 776,
          boxSizing: "border-box",
          border: `6px dashed ${C.gold}`,
          opacity: prog(frame, cue("next") - 10, 12),
        }}
      />
      <div style={{ position: "absolute", left: 120, top: 810, ...fadeUp(frame, cue("next") - 10) }}>
        <Pill tone="gold" size={F.small}>
          WIP: 2 + обов’язкові
        </Pill>
      </div>
    </T2Z6Frame>
  );
};
