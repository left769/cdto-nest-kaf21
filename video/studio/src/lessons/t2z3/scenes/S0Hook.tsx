import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeOut, fadeUp, prog } from "../../../shared/anim";
import { Bubble } from "../../../shared/Bubble";
import { Card, Label } from "../../../shared/Card";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z3Frame } from "../frame";

const QUESTIONS = [
  { cue: "q1", text: "строки?" },
  { cue: "q2", text: "ресурс?" },
  { cue: "q3", text: "що робити?" },
];

export const S0Hook: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const dialogueOut = fadeOut(frame, cue("title") - 12);
  const strip = prog(frame, cue("six"), 18);

  return (
    <T2Z3Frame
      timing={timing}
      dark
      current={null}
      done={0}
      glossaryStyle={{ opacity: strip, translate: `0px ${(1 - strip) * 140}px` }}
    >
      {/* Діалог: питання командира й відповідь «Нормально» */}
      <div style={{ position: "absolute", inset: 0, opacity: dialogueOut }}>
        <div style={{ position: "absolute", left: 120, top: 170, ...fadeUp(frame, cue("question") - 8) }}>
          <Label color={C.onDarkMuted} style={{ marginBottom: 20 }}>
            Командир
          </Label>
          <Bubble side="left" tone="light" style={{ fontSize: F.big, fontWeight: 500 }}>
            Як справи з проєктом?
          </Bubble>
        </div>
        <div
          style={{
            position: "absolute",
            right: 120,
            top: 420,
            textAlign: "right",
            ...fadeUp(frame, cue("answer") + 4),
          }}
        >
          <Label color={C.onDarkMuted} style={{ marginBottom: 20 }}>
            Ви
          </Label>
          <Bubble side="right" tone="dark" style={{ fontSize: F.head, fontWeight: 700 }}>
            Нормально.
          </Bubble>
        </div>
        <div
          style={{
            position: "absolute",
            left: 120,
            right: 120,
            top: 740,
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          {QUESTIONS.map((q) => (
            <div
              key={q.cue}
              style={{ display: "flex", alignItems: "center", gap: 24, ...fadeUp(frame, cue(q.cue) - 4, { dy: 40 }) }}
            >
              <div style={{ fontSize: F.title, fontWeight: 700, color: C.gold, lineHeight: 1 }}>?</div>
              <div style={{ fontSize: F.body, color: C.onDark }}>{q.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Назва ролика */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 170, ...fadeUp(frame, cue("title")) }}>
        <div style={{ fontSize: F.head, fontWeight: 700, lineHeight: 1.1 }}>Моніторинг і контроль:</div>
        <div style={{ fontSize: F.big, fontWeight: 400, marginTop: 24, color: C.onDark }}>
          <span style={{ color: C.gold, fontWeight: 700 }}>6 понять</span> для практичного заняття
        </div>
      </div>

      {/* Наскрізний кейс */}
      <div style={{ position: "absolute", left: 120, top: 520, ...fadeUp(frame, cue("example")) }}>
        <Card accent={C.gold} style={{ padding: "40px 64px 48px 56px", width: 1400 }}>
          <Label>Приклад</Label>
          <div style={{ fontSize: F.big, fontWeight: 700, marginTop: 12 }}>Система обліку майна</div>
          <div style={{ display: "flex", alignItems: "center", gap: 32, marginTop: 24 }}>
            <div style={{ fontSize: F.small, color: C.muted }}>середина реалізації</div>
            <div style={{ flex: 1, height: 20, background: C.warm, position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${50 * prog(frame, cue("example") + 15, 30)}%`,
                  background: C.gold,
                }}
              />
            </div>
          </div>
        </Card>
      </div>
    </T2Z3Frame>
  );
};
