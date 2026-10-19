import React from "react";
import { useCurrentFrame } from "remotion";
import { EASE_IN_OUT, fadeUp, prog } from "../../../shared/anim";
import { Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { StruckPill } from "../../../shared/StruckPill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z5Frame } from "../frame";
import { GLOSSARY } from "../script";

// Розділ 2 заняття. Відрахування — без чисел: заняття називає лише підсумок 60–80% номіналу.
const DEDUCTIONS = [
  ["d1", "наряди"],
  ["d2", "відпустки"],
  ["d3", "навчання"],
  ["d4", "ротація"],
  ["d5", "паралельні задачі"],
] as const;
const SIGNS = [
  ["s1", "зростання строків"],
  ["s2", "вигорання"],
  ["s3", "падіння якості"],
] as const;
const REACTIONS = [
  ["r1", "перепріоритезувати"],
  ["r2", "залучити ресурс"],
  ["r3", "переглянути обсяг"],
] as const;

const BAR_W = 1680;
// Схематично: кожне відрахування забирає 6%, лишається 70% — середина діапазону 60–80%.
const CUT = 0.06;

export const S2Capacity: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const cut = DEDUCTIONS.reduce((sum, [at]) => sum + CUT * prog(frame, cue(at) - 2, 12, EASE_IN_OUT), 0);
  const real = prog(frame, cue("real") - 4, 12);
  const reserve = prog(frame, cue("reserve") - 4, 12);

  return (
    <T2Z5Frame timing={timing} current={1} done={1}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("nominal") - 22}
        index={1}
        count={GLOSSARY.length}
        title="Capacity planning"
        uk="планування реальної доступності"
      />

      {/* Номінал → реальна доступність */}
      <div style={{ position: "absolute", left: 120, top: 150, opacity: prog(frame, cue("nominal") - 4, 12) }}>
        <Label>Номінал — 100%</Label>
      </div>
      <div style={{ position: "absolute", left: 700, top: 148, fontSize: F.small, fontWeight: 700, ...fadeUp(frame, cue("band") - 4, { dy: -12 }) }}>
        → реальна: зазвичай 60–80% номіналу
      </div>
      <div style={{ position: "absolute", left: 120, top: 215, width: BAR_W, height: 90, opacity: prog(frame, cue("nominal") - 4, 12) }}>
        <div style={{ position: "absolute", inset: 0, background: C.line }} />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: BAR_W * (1 - cut), background: real > 0.5 ? C.gold : C.graphite }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: BAR_W * (1 - cut) * (1 - 0.12 * reserve),
            width: BAR_W * (1 - cut) * 0.12 * reserve,
            background: `repeating-linear-gradient(135deg, ${C.warmLight} 0 14px, ${C.yellow} 14px 28px)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 24,
            top: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            fontSize: F.small,
            fontWeight: 700,
            color: C.ink,
            opacity: real,
          }}
        >
          реальна доступність
        </div>
      </div>
      <div style={{ position: "absolute", left: 120 + BAR_W * 0.6, top: 320, opacity: reserve }}>
        <Pill tone="yellow" size={F.small}>
          резерв на непередбачене
        </Pill>
      </div>
      <div style={{ position: "absolute", left: 120, top: 330, display: "flex", gap: 16, opacity: 1 - reserve }}>
        {DEDUCTIONS.map(([at, label]) => (
          <div key={at} style={fadeUp(frame, cue(at) - 4, { dy: -16 })}>
            <Pill tone="ghost" size={F.small}>
              − {label}
            </Pill>
          </div>
        ))}
      </div>

      {/* Ознаки перевантаження */}
      <div style={{ position: "absolute", left: 120, top: 440, ...fadeUp(frame, cue("signs") - 4) }}>
        <Label>Ознаки перевантаження</Label>
      </div>
      <div style={{ position: "absolute", left: 120, top: 500, display: "flex", alignItems: "center", gap: 20 }}>
        {SIGNS.map(([at, label]) => (
          <div key={at} style={fadeUp(frame, cue(at) - 4, { dx: -16, dy: 0 })}>
            <Pill tone="bad" size={F.small}>
              {label}
            </Pill>
          </div>
        ))}
      </div>

      {/* Реакція */}
      <div style={{ position: "absolute", left: 120, top: 610, display: "flex", alignItems: "center", gap: 24, ...fadeUp(frame, cue("reaction") - 4) }}>
        <Label>Реакція</Label>
        <StruckPill strike={prog(frame, cue("notPush") + 8, 12)}>«гнати» команду</StruckPill>
      </div>
      <div style={{ position: "absolute", left: 120, top: 715, display: "flex", gap: 24 }}>
        {REACTIONS.map(([at, label]) => (
          <div key={at} style={fadeUp(frame, cue(at) - 4)}>
            <Pill tone="gold" size={F.small}>
              {label}
            </Pill>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 120, top: 835, fontSize: F.small, fontWeight: 700, ...fadeUp(frame, cue("managerial") - 4) }}>
        управлінська проблема, а не проблема виконавців
      </div>
    </T2Z5Frame>
  );
};
