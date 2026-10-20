import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, inOut, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { StruckCard } from "../../../shared/StruckCard";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z6Frame } from "../frame";
import { INITIATIVES } from "../initiatives";
import { GLOSSARY } from "../script";

// Рішення в контрольній точці — розділ 6 заняття; дашборд і чат-бот — еталонне проходження.
const DECISIONS = ["продовжити", "продовжити зі зміною", "призупинити", "закрити"];
const USAGE = 15;
const THRESHOLD = 60;
const SCALE_W = 540;
const LEFT_W = 1060;

export const S6Checkpoint: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const usage = prog(frame, cue("usage") + 4, 20);
  // На висновку обидва кейси відходять на другий план.
  const back = 1 - 0.75 * prog(frame, cue("same") - 6, 14);

  return (
    <T2Z6Frame timing={timing} current={5} done={5}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("criteria") - 22}
        index={5}
        count={GLOSSARY.length}
        title="Контрольна точка"
        uk="продовжити / призупинити / закрити"
      />

      {/* Чотири рішення й пастка невідворотних витрат */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("criteria") - 4, cue("pilot") - 10) }}>
        <div style={{ position: "absolute", left: 120, right: 120, top: 150, display: "flex", flexWrap: "wrap", gap: 18 }}>
          {DECISIONS.map((d, i) => (
            <div key={d} style={fadeUp(frame, cue("criteria") - 4 + i * 6)}>
              <Pill tone="dark" size={F.small}>
                {d}
              </Pill>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 120, top: 370, ...fadeUp(frame, cue("criteria") + 10) }}>
          <Label>Критерії точки — наперед</Label>
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 440, ...fadeUp(frame, cue("future") - 4) }}>
          <Card accent={C.ok} style={{ padding: "22px 40px 26px 32px" }}>
            <div style={{ fontSize: F.body, fontWeight: 700 }}>
              Рішення — за <span style={{ color: C.ok }}>майбутньою цінністю</span>
            </div>
          </Card>
        </div>
        <div style={{ position: "absolute", left: 120, top: 600, ...fadeUp(frame, cue("future") + 20) }}>
          <StruckCard strike={prog(frame, cue("sunk") - 2, 14)}>«Ми вже стільки вклали»</StruckCard>
        </div>
        <div style={{ position: "absolute", left: 120, top: 770, ...fadeUp(frame, cue("sunk") + 6) }}>
          <Pill tone="bad" size={F.small}>
            пастка невідворотних витрат
          </Pill>
        </div>
      </div>

      {/* Дашборд командира */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 150, opacity: back }}>
        <div style={fadeUp(frame, cue("pilot") - 4)}>
          <Card accent={C.yellow} style={{ padding: "20px 36px 24px 30px", display: "flex", height: 390, boxSizing: "border-box" }}>
            <div style={{ width: LEFT_W, flexShrink: 0 }}>
              <Label>Пілот · 2 місяці</Label>
              <div style={{ fontSize: 56, fontWeight: 700, marginTop: 4 }}>{INITIATIVES.dashboard}</div>
              <div style={{ display: "flex", gap: 24, marginTop: 26, opacity: prog(frame, cue("usage") - 4, 12) }}>
                <div style={{ fontSize: F.small, color: C.muted, lineHeight: "48px" }}>використання</div>
                <div>
                  <div style={{ position: "relative", width: SCALE_W, height: 48, background: C.warmLight, border: `2px solid ${C.line}` }}>
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: (SCALE_W * USAGE * usage) / 100, background: C.bad }} />
                    <div style={{ position: "absolute", left: (SCALE_W * THRESHOLD) / 100 - 3, top: -14, width: 6, height: 76, background: C.ink }} />
                  </div>
                  <div style={{ position: "relative", height: 60, marginTop: 6, fontSize: F.small }}>
                    <div style={{ position: "absolute", left: 0, fontWeight: 700, color: C.bad }}>{USAGE}%</div>
                    <div style={{ position: "absolute", left: (SCALE_W * THRESHOLD) / 100 - 60, whiteSpace: "nowrap" }}>поріг {THRESHOLD}%</div>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: F.small, color: C.muted, marginTop: 4, ...fadeUp(frame, cue("reason") - 4) }}>немає достовірних даних про майно</div>
            </div>
            <div style={{ borderLeft: `2px solid ${C.line}`, paddingLeft: 36 }}>
              <div style={fadeUp(frame, cue("pause") - 4)}>
                <Pill tone="yellow" size={56}>
                  призупинити
                </Pill>
              </div>
              <div style={{ fontSize: F.small, fontWeight: 700, lineHeight: 1.2, marginTop: 18, ...fadeUp(frame, cue("condition") - 4) }}>
                умова відновлення:
                <br />≥ 95% позицій у реєстрі
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Чат-бот довідки */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 556, opacity: back }}>
        <div style={fadeUp(frame, cue("chatbot") - 4)}>
          <Card accent={C.graphite} style={{ padding: "20px 36px 24px 30px", display: "flex", height: 344, boxSizing: "border-box" }}>
            <div style={{ width: LEFT_W, flexShrink: 0 }}>
              <Label>Дослідження · 16 год</Label>
              <div style={{ fontSize: 56, fontWeight: 700, marginTop: 4 }}>{INITIATIVES.chatbot}</div>
              <div style={{ fontSize: F.small, lineHeight: 1.2, marginTop: 20, paddingRight: 40 }}>
                зовнішні сервіси не відповідають вимогам захисту інформації
              </div>
            </div>
            <div style={{ borderLeft: `2px solid ${C.line}`, paddingLeft: 36 }}>
              <div style={fadeUp(frame, cue("close") - 4)}>
                <Pill tone="bad" size={56}>
                  закрити
                </Pill>
              </div>
              <div style={{ fontSize: F.small, fontWeight: 700, marginTop: 18, ...fadeUp(frame, cue("close") + 10) }}>урок зафіксовано</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Висновок */}
      <div style={{ position: "absolute", left: 220, right: 220, top: 330, ...fadeUp(frame, cue("same") - 4) }}>
        <Card accent={C.gold} style={{ padding: "36px 56px 42px 44px" }}>
          <div style={{ fontSize: F.body, fontWeight: 700, lineHeight: 1.2 }}>
            Зупинити ініціативу без ефекту — таке саме управлінське рішення, як і запустити нову
          </div>
        </Card>
      </div>
    </T2Z6Frame>
  );
};
