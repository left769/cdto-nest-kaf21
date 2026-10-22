import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeOut, fadeUp, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z7Frame } from "../frame";

// Три чужі «ні», через які стоїть інтеграція, — розділ 1.4 заняття.
const BLOCKERS = [
  { at: "api", text: "API не готове" },
  { at: "zi", text: "немає погодження ЗІ" },
  { at: "access", text: "немає рішення про доступ" },
];

const SystemBox: React.FC<{ left: number; children: React.ReactNode }> = ({ left, children }) => (
  <div style={{ position: "absolute", left, top: 200, width: 640, height: 190 }}>
    <Card style={{ height: "100%", boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 40px" }}>
      <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.15 }}>{children}</div>
    </Card>
  </div>
);

export const S0Intro: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const strip = prog(frame, cue("concepts"), 18);
  const stuck = prog(frame, cue("stuck") - 4, 10);

  return (
    <T2Z7Frame timing={timing} dark current={null} done={0} glossaryStyle={{ opacity: strip, translate: `0px ${(1 - strip) * 140}px` }}>
      {/* Дві системи, з’єднання й три «ні» */}
      <div style={{ position: "absolute", inset: 0, opacity: fadeOut(frame, cue("title") - 12) }}>
        <div style={fadeUp(frame, cue("project") - 4)}>
          <SystemBox left={120}>
            Система
            <br />
            обліку майна
          </SystemBox>
          <SystemBox left={1160}>Кадрова система</SystemBox>
          <div
            style={{
              position: "absolute",
              left: 760,
              width: 400,
              top: 292,
              height: 0,
              borderTop: `8px ${stuck > 0.5 ? "dashed" : "solid"} ${stuck > 0.5 ? C.bad : C.onDarkMuted}`,
            }}
          />
        </div>
        <div style={{ position: "absolute", left: 120, top: 410, ...fadeUp(frame, cue("ours") - 4) }}>
          <Pill tone="ok" size={F.small}>
            наша частина — готово
          </Pill>
        </div>
        <div style={{ position: "absolute", left: 760, width: 400, top: 200, display: "flex", justifyContent: "center", ...fadeUp(frame, cue("stuck") - 4, { dy: -16 }) }}>
          <Pill tone="bad" size={F.small}>
            стоїть
          </Pill>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          {BLOCKERS.map((b) => (
            <div key={b.at} style={fadeUp(frame, cue(b.at) - 4, { dy: -24 })}>
              <Pill tone="bad" size={F.body}>
                ✕ {b.text}
              </Pill>
            </div>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: 120,
            right: 120,
            top: 830,
            textAlign: "center",
            fontSize: F.small,
            color: C.onDark,
            ...fadeUp(frame, cue("depends") - 4),
          }}
        >
          Проєкт залежить від людей, рішень і систем, якими команда не керує
        </div>
      </div>

      {/* Назва ролика */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 170, ...fadeUp(frame, cue("title")) }}>
        <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.1 }}>Залежності та інтеграція:</div>
        <div style={{ fontSize: F.big, fontWeight: 400, marginTop: 24, color: C.onDark }}>
          <span style={{ color: C.gold, fontWeight: 700 }}>6 понять</span> для практичного заняття
        </div>
      </div>
      <div style={{ position: "absolute", left: 120, top: 520, ...fadeUp(frame, cue("title") + 24) }}>
        <Card accent={C.gold} style={{ padding: "40px 64px 48px 56px", width: 1400 }}>
          <Label>Приклад</Label>
          <div style={{ fontSize: F.big, fontWeight: 700, marginTop: 12 }}>Інтеграція обліку майна</div>
          <div style={{ fontSize: F.small, color: C.muted, marginTop: 16 }}>з кадровою системою</div>
        </Card>
      </div>
    </T2Z7Frame>
  );
};
