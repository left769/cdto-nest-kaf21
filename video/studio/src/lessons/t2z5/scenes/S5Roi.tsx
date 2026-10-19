import React from "react";
import { useCurrentFrame } from "remotion";
import { EASE_IN_OUT, fadeUp, prog, typed } from "../../../shared/anim";
import { Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z5Frame } from "../frame";
import { GLOSSARY } from "../script";

// Приклад оцінки через проксі-показник — розділ 6 заняття (значення умовні).
const NON_MONEY = [
  ["n1", "час особового складу"],
  ["n2", "точність рішень"],
  ["n3", "боєздатність"],
] as const;
const PX_PER_HOUR = 1;
const COST = 600;
const WEEK = 500;

export const S5Roi: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const week1 = prog(frame, cue("weekly") - 4, 18, EASE_IN_OUT);
  const week2 = prog(frame, cue("payback") - 10, 18, EASE_IN_OUT);

  return (
    <T2Z5Frame timing={timing} current={4} done={4}>
      <TermCard frame={frame} at={0} outAt={cue("formula") - 22} index={4} count={GLOSSARY.length} title="ROI" uk="окупність інвестицій" />

      <div style={{ position: "absolute", left: 120, top: 150, fontSize: F.big, fontWeight: 700, minHeight: 94, opacity: prog(frame, cue("formula") - 4, 4) }}>
        {typed("ROI = (вигода − витрати) / витрати", frame, cue("formula") - 4, 30)}
      </div>

      <div style={{ position: "absolute", left: 120, top: 270, display: "flex", alignItems: "center", gap: 24, ...fadeUp(frame, cue("nonMoney") - 4) }}>
        <Label>Негрошовий ефект</Label>
        <div style={fadeUp(frame, cue("proxy") - 4, { dx: -16, dy: 0 })}>
          <Pill tone="gold" size={F.small}>
            → виражають через проксі-показники
          </Pill>
        </div>
      </div>
      <div style={{ position: "absolute", left: 120, top: 355, display: "flex", gap: 20 }}>
        {NON_MONEY.map(([at, label]) => (
          <div key={at} style={fadeUp(frame, cue(at) - 4, { dx: -16, dy: 0 })}>
            <Pill tone="dark" size={F.small}>
              {label}
            </Pill>
          </div>
        ))}
      </div>

      {/* Витрати й економія в людино-годинах */}
      <div style={{ position: "absolute", left: 120, top: 470, ...fadeUp(frame, cue("example") - 4) }}>
        <Label>Приклад із заняття</Label>
      </div>
      <div style={{ position: "absolute", left: 120, top: 525, ...fadeUp(frame, cue("cost") - 4) }}>
        <div style={{ fontSize: F.small, fontWeight: 700 }}>Витрати: 600 людино-годин</div>
        <div style={{ width: COST * PX_PER_HOUR, height: 36, background: C.graphite, marginTop: 8 }} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 640, opacity: prog(frame, cue("saving") - 4, 10) }}>
        <div style={{ fontSize: F.small, fontWeight: 700, minHeight: 58, whiteSpace: "nowrap" }}>
          {typed("Економія: 10 год/тиждень × 50 частин = 500 год/тиждень", frame, cue("saving") - 4, 30)}
        </div>
        <div style={{ display: "flex", marginTop: 8, height: 36 }}>
          <div style={{ width: WEEK * PX_PER_HOUR * week1, background: C.gold, borderRight: `4px solid ${C.warm}` }} />
          <div style={{ width: WEEK * PX_PER_HOUR * week2, background: C.gold }} />
        </div>
        <div style={{ display: "flex", fontSize: F.small, color: C.muted, marginTop: 4 }}>
          <div style={{ width: WEEK * PX_PER_HOUR, opacity: week1 }}>тиждень 1</div>
          <div style={{ opacity: week2 }}>тиждень 2</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 120 + 2 * WEEK * PX_PER_HOUR + 60, top: 700, ...fadeUp(frame, cue("payback") - 4, { dx: -24, dy: 0 }) }}>
        <Pill tone="gold" size={F.small}>
          окупність ≈ 2 тижні
        </Pill>
      </div>

      {/* Контроль витрат */}
      <div style={{ position: "absolute", left: 120, top: 845, display: "flex", alignItems: "center", gap: 24, ...fadeUp(frame, cue("cpi") - 4) }}>
        <Pill tone="bad" size={F.small}>
          CPI &lt; 1 → перевитрата
        </Pill>
        <div style={{ fontSize: F.small, ...fadeUp(frame, cue("cpiLess") + 10, { dx: -16, dy: 0 }) }}>реагуємо до вичерпання бюджету</div>
      </div>
    </T2Z5Frame>
  );
};
