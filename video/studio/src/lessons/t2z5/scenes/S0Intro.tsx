import React from "react";
import { useCurrentFrame } from "remotion";
import { EASE_IN_OUT, fadeOut, fadeUp, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z5Frame } from "../frame";

// Ситуація кейсу 1 (Додаток 4 заняття).
const PROJECTS = [1, 2, 3, 4, 5];
const LATE = [1, 3, 4];

export const S0Intro: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const strip = prog(frame, cue("six"), 18);
  const drop = prog(frame, cue("plusOne") - 4, 20, EASE_IN_OUT);

  return (
    <T2Z5Frame timing={timing} dark current={null} done={0} glossaryStyle={{ opacity: strip, translate: `0px ${(1 - strip) * 140}px` }}>
      {/* Кейс 1: перевантажена команда */}
      <div style={{ position: "absolute", inset: 0, opacity: fadeOut(frame, cue("title") - 12) }}>
        <div style={{ position: "absolute", left: 120, top: 130, ...fadeUp(frame, 0) }}>
          <Label color={C.onDarkMuted}>Кейс 1 · Перевантажена команда</Label>
        </div>
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 360 - 200 * (1 - drop),
            opacity: drop,
          }}
        >
          <Card accent={C.gold} style={{ padding: "18px 36px 18px 28px" }}>
            <div style={{ fontSize: F.small, fontWeight: 700 }}>+1 проєкт від командування</div>
          </Card>
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 610, display: "flex", gap: 36 }}>
          {PROJECTS.map((n, i) => (
            <div key={n} style={{ flex: 1, position: "relative", ...fadeUp(frame, cue("five") + i * 4) }}>
              <Card style={{ padding: "26px 28px", height: 130, boxSizing: "border-box" }}>
                <div style={{ fontSize: F.small, fontWeight: 700 }}>Проєкт {n}</div>
              </Card>
              {LATE.includes(i) ? (
                <div style={{ position: "absolute", right: 0, top: -90, ...fadeUp(frame, cue("late") + LATE.indexOf(i) * 6, { dy: -12 }) }}>
                  <Pill tone="bad" size={F.small}>
                    строк
                  </Pill>
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 120, top: 780, ...fadeUp(frame, cue("burnout") - 4) }}>
          <Pill tone="bad" size={F.body}>
            вигорання
          </Pill>
        </div>
        <div
          style={{
            position: "absolute",
            right: 160,
            top: 250,
            fontSize: 220,
            fontWeight: 700,
            color: C.gold,
            lineHeight: 1,
            ...fadeUp(frame, cue("what") - 4),
          }}
        >
          ?
        </div>
      </div>

      {/* Назва ролика */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 170, ...fadeUp(frame, cue("title")) }}>
        <div style={{ fontSize: F.head, fontWeight: 700, lineHeight: 1.1 }}>Команда, ресурси, зміни:</div>
        <div style={{ fontSize: F.big, fontWeight: 400, marginTop: 24, color: C.onDark }}>
          <span style={{ color: C.gold, fontWeight: 700 }}>6 понять</span> для семінару
        </div>
      </div>
      <div style={{ position: "absolute", left: 120, top: 520, ...fadeUp(frame, cue("title") + 24) }}>
        <Card accent={C.gold} style={{ padding: "40px 64px 48px 56px", width: 1400 }}>
          <Label>На семінарі</Label>
          <div style={{ fontSize: F.big, fontWeight: 700, marginTop: 12 }}>Кейси й розбір кейсу 1</div>
          <div style={{ fontSize: F.small, color: C.muted, marginTop: 16 }}>картки кейсів · Додаток 4 до заняття</div>
        </Card>
      </div>
    </T2Z5Frame>
  );
};
