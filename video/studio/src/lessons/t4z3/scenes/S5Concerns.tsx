import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, inOut, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { StruckCard } from "../../../shared/StruckCard";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T4Z3Frame } from "../frame";
import { GLOSSARY } from "../script";

// Три речі — розділ 4.1 лекції; як виявляти й приклад начальника складу — 4.2; розрив очікувань — 4.3.
const THREE = [
  { at: "needs", title: "Потреби", text: "що об’єктивно потрібно", color: C.graphite },
  { at: "expect", title: "Очікування", text: "що сподівається отримати", color: C.graphite },
  { at: "fears", title: "Побоювання", text: "чого остерігається", color: C.bad },
];
const FEARS = ["втрата контролю", "зайве навантаження", "ризики"];
const METHODS = [
  { at: "m1", text: "відкриті питання" },
  { at: "m2", text: "активне слухання" },
  { at: "m3", text: "спостереження" },
];

export const S5Concerns: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const gap = prog(frame, cue("gets") + 10, 14);

  return (
    <T4Z3Frame timing={timing} current={4} done={4}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("three") - 22}
        index={4}
        count={GLOSSARY.length}
        title="Побоювання"
        uk="невисловлений страх, що часто стоїть за опором"
      />

      {/* Потреби, очікування, побоювання; як виявляти */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("three") - 4, cue("key") - 10) }}>
        <div style={{ position: "absolute", left: 120, right: 120, top: 160, display: "flex", gap: 24 }}>
          {THREE.map((c) => (
            <div key={c.at} style={{ flex: 1, ...fadeUp(frame, cue(c.at) - 4) }}>
              <div
                style={{
                  background: C.card,
                  border: `2px solid ${C.line}`,
                  borderTop: `16px solid ${c.color}`,
                  padding: "22px 28px 28px",
                  height: 480,
                  boxSizing: "border-box",
                }}
              >
                <div style={{ fontSize: F.body, fontWeight: 700 }}>{c.title}</div>
                <div style={{ fontSize: F.small, color: C.muted, lineHeight: 1.2, marginTop: 12 }}>{c.text}</div>
                {c.at === "fears" ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10, marginTop: 18 }}>
                    {FEARS.map((f, i) => (
                      <div key={f} style={fadeUp(frame, cue("fears") + 30 + i * 10)}>
                        <Pill tone="ghost" size={F.small}>
                          {f}
                        </Pill>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 680, ...fadeUp(frame, cue("how") - 4) }}>
          <Label>Як виявити</Label>
          <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
            {METHODS.map((m) => (
              <div key={m.at} style={fadeUp(frame, cue(m.at) - 4)}>
                <Pill tone="gold" size={F.small}>
                  {m.text}
                </Pill>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* За опором — побоювання */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("key") - 4, cue("trap") - 10) }}>
        <div style={{ position: "absolute", left: 120, top: 160, fontSize: F.big, fontWeight: 700, ...fadeUp(frame, cue("key") - 2) }}>
          За опором часто стоять <span style={{ color: C.bad }}>побоювання</span>
        </div>
        <div style={{ position: "absolute", left: 120, top: 330, ...fadeUp(frame, cue("looks") - 4) }}>
          <Label>Зовні схоже на</Label>
          <div style={{ marginTop: 16, width: 1200 }}>
            <StruckCard strike={prog(frame, cue("chief") - 2, 14)}>незгоду з технологією</StruckCard>
          </div>
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 600, ...fadeUp(frame, cue("chief") + 6) }}>
          <Card accent={C.bad} style={{ padding: "26px 40px 32px 32px" }}>
            <Label>Начальник складу</Label>
            <div style={{ fontSize: F.big, fontWeight: 700, marginTop: 10 }}>
              лякає не цифра, а <span style={{ color: C.bad }}>давні розбіжності</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Розрив очікувань */}
      <div style={{ position: "absolute", inset: 0, opacity: prog(frame, cue("trap") - 4, 12) }}>
        <div style={{ position: "absolute", left: 120, top: 150 }}>
          <Label>Розрив очікувань</Label>
        </div>
        <div style={{ position: "absolute", left: 120, top: 230, width: 1680, ...fadeUp(frame, cue("wants") - 4) }}>
          <div style={{ fontSize: F.small, color: C.muted }}>Стейкхолдер чекає</div>
          <div style={{ marginTop: 10, height: 96, background: C.graphite, color: C.onDark, display: "flex", alignItems: "center", paddingLeft: 32, fontSize: F.small, fontWeight: 700 }}>
            повна автоматизація всього
          </div>
        </div>
        <div style={{ position: "absolute", left: 120, top: 420, width: 1680, ...fadeUp(frame, cue("gets") - 4) }}>
          <div style={{ fontSize: F.small, color: C.muted }}>Проєкт дасть</div>
          <div style={{ display: "flex", marginTop: 10, height: 96 }}>
            <div style={{ width: 1100, background: C.gold, display: "flex", alignItems: "center", paddingLeft: 32, fontSize: F.small, fontWeight: 700, whiteSpace: "nowrap" }}>
              облік однієї категорії майна
            </div>
            {/* Розрив — заштрихована решта смуги */}
            <div
              style={{
                flex: 1,
                opacity: gap,
                border: `4px dashed ${C.bad}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: F.body,
                fontWeight: 700,
                color: C.bad,
              }}
            >
              розрив
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 120, top: 610, ...fadeUp(frame, cue("dis") - 4) }}>
          <Pill tone="bad" size={F.small}>
            розчарування навіть за успішного проєкту
          </Pill>
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 720, ...fadeUp(frame, cue("early") - 4) }}>
          <Card accent={C.ok} style={{ padding: "22px 36px 26px 30px" }}>
            <div style={{ fontSize: F.body, fontWeight: 700, lineHeight: 1.15 }}>Рано й чесно: що входить в обсяг, а що ні</div>
          </Card>
        </div>
      </div>
    </T4Z3Frame>
  );
};
