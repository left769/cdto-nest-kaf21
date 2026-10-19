import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, inOut, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z5Frame } from "../frame";
import { GLOSSARY } from "../script";

// 8 кроків Коттера — розділ 7 заняття. Кроки 3 і 4 озвучено однією фразою.
const STEPS = [
  { text: "Відчуття терміновості", at: "k1" },
  { text: "Коаліція змін", at: "k2", note: "разом із командуванням" },
  { text: "Сформувати візію", at: "k3" },
  { text: "Донести візію", at: "k3", delay: 24 },
  { text: "Усунути перешкоди", at: "k5" },
  { text: "Короткі перемоги", at: "k6" },
  { text: "Закріпити й нарощувати", at: "k7" },
  { text: "Інституціалізувати", at: "k8", note: "наказ · регламент" },
];

export const S6Kotter: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);

  return (
    <T2Z5Frame timing={timing} current={5} done={5}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("eight") - 22}
        index={5}
        count={GLOSSARY.length}
        title="Kotter"
        uk="8 кроків управління змінами"
      />

      {/* Вісім кроків */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("eight") - 4, cue("paper") - 8) }}>
        <div
          style={{
            position: "absolute",
            left: 120,
            right: 120,
            top: 150,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridAutoFlow: "column",
            gridTemplateRows: "repeat(4, 118px)",
            columnGap: 40,
            rowGap: 14,
          }}
        >
          {STEPS.map((s, i) => {
            const last = i === STEPS.length - 1;
            return (
              <div key={s.text} style={fadeUp(frame, cue(s.at) - 4 + (s.delay ?? 0))}>
                <Card accent={last ? C.gold : undefined} style={{ height: 118, boxSizing: "border-box", padding: "0 28px", display: "flex", alignItems: "center", gap: 24 }}>
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      flexShrink: 0,
                      borderRadius: "50%",
                      background: last ? C.gold : C.ink,
                      color: last ? C.ink : C.onDark,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: F.small,
                      fontWeight: 700,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: F.small, fontWeight: 700, lineHeight: 1.15, whiteSpace: "nowrap" }}>{s.text}</div>
                    {s.note ? <div style={{ fontSize: F.small, color: C.muted }}>{s.note}</div> : null}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 120, top: 700, ...fadeUp(frame, cue("rotation") - 4) }}>
          <Pill tone="gold" size={F.small}>
            щоб зміни не відкотилися після ротації
          </Pill>
        </div>
      </div>

      {/* Кейс 3: паралельний паперовий облік */}
      <div style={{ position: "absolute", inset: 0, opacity: prog(frame, cue("paper") - 4, 12) }}>
        <div style={{ position: "absolute", left: 120, top: 160 }}>
          <Label>Кейс 3 · Опір змінам</Label>
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 240, display: "flex", gap: 40 }}>
          <Card accent={C.gold} style={{ flex: 1, padding: "28px 40px" }}>
            <Label>Впроваджено</Label>
            <div style={{ fontSize: F.body, fontWeight: 700, marginTop: 8 }}>Система</div>
          </Card>
          <Card accent={C.graphite} style={{ flex: 1, padding: "28px 40px" }}>
            <Label>Паралельно</Label>
            <div style={{ fontSize: F.body, fontWeight: 700, marginTop: 8 }}>Паперовий облік</div>
          </Card>
        </div>
        <div style={{ position: "absolute", left: 120, top: 480, ...fadeUp(frame, cue("signal") - 4) }}>
          <Pill tone="dark" size={F.body}>
            не саботаж, а сигнал
          </Pill>
        </div>
        <div style={{ position: "absolute", left: 120, top: 600, fontSize: F.body, fontWeight: 700, ...fadeUp(frame, cue("notWorked") - 4) }}>
          управління змінами не спрацювало
        </div>
      </div>
    </T2Z5Frame>
  );
};
