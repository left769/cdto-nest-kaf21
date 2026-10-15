import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeOut, fadeUp, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z4Frame } from "../frame";
import { TwoFutures } from "../TwoFutures";

export const S0Intro: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const strip = prog(frame, cue("six"), 18);

  return (
    <T2Z4Frame
      timing={timing}
      dark
      current={null}
      done={0}
      glossaryStyle={{ opacity: strip, translate: `0px ${(1 - strip) * 140}px` }}
    >
      {/* Два варіанти того самого ризику */}
      <div style={{ position: "absolute", inset: 0, opacity: fadeOut(frame, cue("title") - 12) }}>
        <div style={{ position: "absolute", left: 120, top: 130, ...fadeUp(frame, 0) }}>
          <Pill tone="dark" size={F.small}>
            Проєкт «Система обліку майна»
          </Pill>
        </div>
        <div style={{ position: "absolute", inset: 0, opacity: prog(frame, cue("delay") - 4, 12) }}>
          <TwoFutures
            frame={frame}
            dark
            top={240}
            topAt={cue("dayOf")}
            fireAt={cue("fire") - 4}
            bottomAt={cue("early")}
            planAt={cue("plan")}
            focusAt={cue("difference")}
          />
        </div>
      </div>

      {/* Назва ролика */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 170, ...fadeUp(frame, cue("title")) }}>
        <div style={{ fontSize: F.head, fontWeight: 700, lineHeight: 1.1 }}>Ризик-менеджмент:</div>
        <div style={{ fontSize: F.big, fontWeight: 400, marginTop: 24, color: C.onDark }}>
          <span style={{ color: C.gold, fontWeight: 700 }}>6 понять</span> для практичного заняття
        </div>
      </div>

      {/* Наскрізний кейс */}
      <div style={{ position: "absolute", left: 120, top: 520, ...fadeUp(frame, cue("title") + 24) }}>
        <Card accent={C.gold} style={{ padding: "40px 64px 48px 56px", width: 1400 }}>
          <Label>Приклад</Label>
          <div style={{ fontSize: F.big, fontWeight: 700, marginTop: 12 }}>Система обліку майна</div>
          <div style={{ fontSize: F.small, color: C.muted, marginTop: 16 }}>risk register · крок 4 робочого зошита</div>
        </Card>
      </div>
    </T2Z4Frame>
  );
};
