import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, inOut, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { StruckPill } from "../../../shared/StruckPill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T3Z3Frame } from "../frame";
import { GLOSSARY } from "../script";

// Вузьке місце — розділ 4.3; першопричина — зразок кроку зошита; «швидкі перемоги» — розділ 4.4.
// Проміжних відповідей «5 чому» в занятті немає, тому в кадрі — лише питання й першопричина.
const STAGES = ["Опис майна", "Звіряння з журналами", "Акт", "Затвердження"];
const BOTTLENECK = 1;
const QUEUE = 6;

export const S4Bottleneck: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const hot = prog(frame, cue("ours") - 4, 12);
  const others = prog(frame, cue("others") - 4, 12);

  return (
    <T3Z3Frame timing={timing} current={3} done={3}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("queue") - 22}
        index={3}
        count={GLOSSARY.length}
        title="Вузьке місце"
        en="bottleneck"
        uk="етап, що лімітує весь процес"
      />

      {/* Черга перед вузьким місцем і простій після */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("queue") - 4, cue("why") - 10) }}>
        <div style={{ position: "absolute", left: 120, top: 160, ...fadeUp(frame, cue("find") - 4) }}>
          <Label>Шукаємо за часом етапів</Label>
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 400, display: "flex", alignItems: "center", gap: 18 }}>
          {STAGES.map((s, i) => {
            const isNeck = i === BOTTLENECK;
            const idle = i > BOTTLENECK ? prog(frame, cue("idle") - 4, 12) : 0;
            const appear = fadeUp(frame, cue("queue") + i * 6);
            return (
              <React.Fragment key={s}>
                {i > 0 ? (
                  <svg width={50} height={36} style={{ flexShrink: 0 }}>
                    <path d="M0 18 H38 M24 4 L44 18 L24 32" fill="none" stroke={C.gold} strokeWidth={6} />
                  </svg>
                ) : null}
                <div
                  style={{
                    flex: isNeck ? 1.4 : 1,
                    height: 170,
                    boxSizing: "border-box",
                    background: C.card,
                    border: `${isNeck && hot > 0.5 ? 6 : 2}px solid ${isNeck && hot > 0.5 ? C.bad : C.line}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: "0 18px",
                    fontSize: F.small,
                    fontWeight: 700,
                    lineHeight: 1.15,
                    ...appear,
                    opacity: appear.opacity * (1 - 0.5 * idle),
                  }}
                >
                  {s}
                </div>
              </React.Fragment>
            );
          })}
        </div>
        {/* Черга — стос заявок над входом у вузьке місце */}
        <div style={{ position: "absolute", left: 470, top: 250, display: "flex", gap: 10 }}>
          {Array.from({ length: QUEUE }, (_, k) => (
            <div key={k} style={{ width: 40, height: 110, background: C.dim, ...fadeUp(frame, cue("queue") + 10 + k * 5, { dy: -30 }) }} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 790, top: 290, fontSize: F.small, fontWeight: 700, color: C.bad, ...fadeUp(frame, cue("queue") + 30) }}>
          черга
        </div>
        <div style={{ position: "absolute", left: 1000, right: 120, top: 590, textAlign: "center", fontSize: F.small, color: C.muted, ...fadeUp(frame, cue("idle") - 2) }}>
          простій після
        </div>
        <div style={{ position: "absolute", left: 120, top: 700, ...fadeUp(frame, cue("focus") - 4) }}>
          <Pill tone="bad" size={F.body}>
            покращувати тут
          </Pill>
        </div>
        <div style={{ position: "absolute", left: 120, top: 820, fontSize: F.small, color: C.muted, opacity: others }}>
          прискорення інших етапів процес не пришвидшить
        </div>
      </div>

      {/* «5 чому» → першопричина */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 160, ...fadeUp(frame, cue("why") - 4) }}>
        <Label>5 чому</Label>
        <div style={{ fontSize: F.body, fontWeight: 700, marginTop: 10 }}>Чому звіряння триває 3 дні?</div>
        <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
          {[0, 1, 2, 3, 4].map((k) => (
            <div key={k} style={fadeUp(frame, cue("why") + 10 + k * 6, { dx: -16, dy: 0 })}>
              <Pill tone="ghost" size={F.small}>
                чому?
              </Pill>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 440, ...fadeUp(frame, cue("root") - 4) }}>
        <Card accent={C.gold} style={{ padding: "24px 40px 28px 32px" }}>
          <Label>Першопричина</Label>
          <div style={{ fontSize: F.big, fontWeight: 700, marginTop: 8 }}>немає єдиного джерела даних</div>
        </Card>
      </div>
      <div style={{ position: "absolute", left: 120, top: 650, display: "flex", alignItems: "center", gap: 20, ...fadeUp(frame, cue("symptom") - 4) }}>
        <StruckPill strike={prog(frame, cue("symptom") + 16, 14)}>звіряти частіше</StruckPill>
        <div style={{ fontSize: F.small, color: C.muted }}>це симптом</div>
      </div>
      <div style={{ position: "absolute", left: 120, top: 750, display: "flex", gap: 18, ...fadeUp(frame, cue("wins") - 6) }}>
        <Pill tone="dark" size={F.small}>
          розшити вузьке місце
        </Pill>
        <Pill tone="gold" size={F.small}>
          швидкі перемоги
        </Pill>
      </div>
      <div style={{ position: "absolute", left: 120, top: 850, fontSize: F.small, color: C.muted, ...fadeUp(frame, cue("wins") + 10) }}>
        швидкі перемоги — висока цінність за малих зусиль
      </div>
    </T3Z3Frame>
  );
};
