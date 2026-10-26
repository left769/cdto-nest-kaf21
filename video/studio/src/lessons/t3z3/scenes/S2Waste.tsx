import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, prog } from "../../../shared/anim";
import { Pill } from "../../../shared/Pill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T3Z3Frame } from "../frame";
import { GLOSSARY } from "../script";

// Втрати lean і приклади в підрозділі — Додаток 4; ті, що є в інвентаризації, — еталонне проходження (розділ 5).
const LOSSES = [
  { at: "l1", name: "Очікування", example: "простій в очікуванні погодження", ours: false },
  { at: "l2", name: "Зайва обробка", example: "дублювання даних у кількох журналах", ours: true },
  { at: "l3", name: "Переробки", example: "виправлення помилок обліку", ours: true },
  { at: "l4", name: "Зайвий рух", example: "передавання паперів між кабінетами", ours: false },
  { at: "l5", name: "Ручна праця", example: "звіряння вручну замість автоматичного", ours: true },
  { at: "l6", name: "Надлишок інформації", example: "звіти, які ніхто не читає", ours: false },
];

export const S2Waste: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const mark = prog(frame, cue("ours") - 2, 12);

  return (
    <T3Z3Frame timing={timing} current={1} done={1}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("lean") - 22}
        index={1}
        count={GLOSSARY.length}
        title="Втрати"
        en="lean"
        uk="споживають ресурс, але не додають цінності"
      />

      <div style={{ position: "absolute", left: 120, right: 120, top: 160, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {LOSSES.map((l) => {
          const hot = l.ours ? mark : 0;
          const appear = fadeUp(frame, cue(l.at) - 4);
          return (
            <div key={l.at} style={{ position: "relative", ...appear, opacity: appear.opacity * (l.ours ? 1 : 1 - 0.55 * mark) }}>
              <div
                style={{
                  background: C.card,
                  border: `${hot > 0.5 ? 5 : 2}px solid ${hot > 0.5 ? C.gold : C.line}`,
                  borderLeft: `14px solid ${C.bad}`,
                  padding: "14px 28px 16px 24px",
                  height: 200,
                  boxSizing: "border-box",
                }}
              >
                <div style={{ fontSize: 54, fontWeight: 700 }}>{l.name}</div>
                <div style={{ fontSize: F.small, color: C.muted, lineHeight: 1.15, marginTop: 4 }}>{l.example}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 120, top: 830, ...fadeUp(frame, cue("ours") - 2) }}>
        <Pill tone="gold" size={F.small}>
          в інвентаризації майна — три з шести
        </Pill>
      </div>
    </T3Z3Frame>
  );
};
