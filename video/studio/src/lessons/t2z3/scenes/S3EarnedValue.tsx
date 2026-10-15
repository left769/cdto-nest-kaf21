import React from "react";
import { useCurrentFrame } from "remotion";
import { EASE_IN_OUT, fadeUp, inOut, prog, typed } from "../../../shared/anim";
import { BarChart } from "../../../shared/BarChart";
import { BurnDown } from "../../../shared/BurnDown";
import { Card } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z3Frame } from "../frame";
import { GLOSSARY } from "../script";

// Приклад розрахунку EV із заняття (розділ 5.3).
const Formula: React.FC<{
  frame: number;
  head: string;
  tail: string;
  headAt: number;
  tailAt: number;
  chipAt: number;
  chip: string;
}> = ({ frame, head, tail, headAt, tailAt, chipAt, chip }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10, opacity: prog(frame, headAt - 2, 4) }}>
    <div style={{ fontSize: 60, fontWeight: 700, minHeight: 72 }}>{typed(head, frame, headAt, 24)}</div>
    <div style={{ fontSize: 60, fontWeight: 500, minHeight: 72 }}>{typed(tail, frame, tailAt, 24)}</div>
    <div style={{ ...fadeUp(frame, chipAt - 4, { dx: -24, dy: 0 }), marginTop: 6 }}>
      <Pill tone="bad" size={F.small}>
        {chip}
      </Pill>
    </div>
  </div>
);

export const S3EarnedValue: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const grow = (at: string) => prog(frame, cue(at) - 4, 24, EASE_IN_OUT);

  return (
    <T2Z3Frame timing={timing} current={2} done={2}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("plan") - 24}
        index={2}
        count={GLOSSARY.length}
        title="Earned Value"
        uk="освоєний обсяг"
      />

      {/* Earned Value: три величини й два індекси */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("plan"), cue("burndown") - 8) }}>
        <div style={{ position: "absolute", left: 120, top: 150, fontSize: F.body, fontWeight: 500, ...fadeUp(frame, cue("plan")) }}>
          План: 100 од. обсягу = 100 тис. грн
        </div>
        <div style={{ position: "absolute", left: 120, top: 270 }}>
          <BarChart
            width={1060}
            height={600}
            pxPerUnit={6.4}
            bars={[
              { code: "PV", label: "Заплановано", value: 50, valueText: "50", color: C.graphite, grow: grow("pv") },
              { code: "EV", label: "Виконано", value: 40, valueText: "40", color: C.gold, grow: grow("ev") },
              { code: "AC", label: "Витрачено", value: 55, valueText: "55", unit: "тис. грн", color: C.bad, grow: grow("ac") },
            ]}
          />
        </div>
        <div style={{ position: "absolute", left: 1250, top: 290, display: "flex", flexDirection: "column", gap: 48 }}>
          <Formula
            frame={frame}
            head="SPI = EV / PV"
            tail="= 40 / 50 = 0,8"
            headAt={cue("spi")}
            tailAt={cue("spiValue") - 18}
            chipAt={cue("spiLess")}
            chip="< 1 · відставання"
          />
          <Formula
            frame={frame}
            head="CPI = EV / AC"
            tail="= 40 / 55 = 0,73"
            headAt={cue("cpi")}
            tailAt={cue("cpiValue") - 18}
            chipAt={cue("cpiLess")}
            chip="< 1 · перевитрата"
          />
        </div>
      </div>

      {/* Burn-down */}
      <div style={{ position: "absolute", left: 120, top: 150, ...fadeUp(frame, cue("burndown")) }}>
        <Card accent={C.gold} style={{ padding: "20px 48px 24px 40px", display: "flex", alignItems: "baseline", gap: 32 }}>
          <div style={{ fontSize: F.big, fontWeight: 700 }}>Burn-down</div>
          <div style={{ fontSize: F.body, color: C.muted }}>графік залишку робіт</div>
        </Card>
      </div>
      <div style={{ position: "absolute", left: 120, top: 330, opacity: prog(frame, cue("burndown") + 8, 10) }}>
        <BurnDown
          width={1680}
          height={590}
          axes={prog(frame, cue("burndown") + 8, 12)}
          plan={prog(frame, cue("bdTerm"), 20, EASE_IN_OUT)}
          actual={prog(frame, cue("bdTerm") + 24, cue("actual") - cue("bdTerm"), EASE_IN_OUT)}
          gap={prog(frame, cue("lag") - 10, 12)}
          axisY="залишок робіт"
          axisX="дні спринту"
          planLabel="план"
          actualLabel="факт"
          gapLabel={
            <Pill tone="bad" size={F.small}>
              відставання
            </Pill>
          }
        />
      </div>
    </T2Z3Frame>
  );
};
