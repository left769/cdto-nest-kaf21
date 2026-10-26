import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, inOut } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T3Z3Frame } from "../frame";
import { GLOSSARY } from "../script";

// Методи збору — розділ 1.2; «як є» проти інструкції — 1.4; метрики — 1.5 заняття і зразок кроку зошита.
const METHODS = [
  { at: "m1", text: "спостереження" },
  { at: "m2", text: "інтерв’ю" },
  { at: "m3", text: "аналіз документів" },
  { at: "m4", text: "збір метрик" },
  { at: "m5", text: "walkthrough" },
];
const METRIC_KINDS = ["загальний час", "очікування", "кроки й погодження", "частота помилок"];
const OURS = [
  { value: "3 дні", label: "тривалість" },
  { value: "9", label: "кроків" },
  { value: "1", label: "погодження" },
  { value: "8%", label: "розбіжностей" },
];

export const S1AsIs: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);

  return (
    <T3Z3Frame timing={timing} current={0} done={0}>
      <TermCard frame={frame} at={0} outAt={cue("why") - 22} index={0} count={GLOSSARY.length} title="AS-IS" uk="процес «як є»" />

      {/* Навіщо й як збирати дані */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("why") - 4, cue("main") - 10) }}>
        <div style={{ position: "absolute", left: 120, right: 120, top: 160 }}>
          <Card accent={C.gold} style={{ padding: "24px 40px 28px 32px" }}>
            <div style={{ fontSize: F.body, fontWeight: 700, lineHeight: 1.2 }}>Як робота відбувається насправді — ще до проєктування змін</div>
          </Card>
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 400, ...fadeUp(frame, cue("methods") - 4) }}>
          <Label>П’ять способів зібрати дані</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 16 }}>
            {METHODS.map((m) => (
              <div key={m.at} style={fadeUp(frame, cue(m.at) - 4)}>
                <Pill tone={m.at === "m5" ? "gold" : "ghost"} size={F.small}>
                  {m.text}
                </Pill>
              </div>
            ))}
          </div>
          <div style={{ fontSize: F.small, color: C.muted, marginTop: 18, ...fadeUp(frame, cue("m5") + 12) }}>
            walkthrough — покроковий прохід процесу разом із виконавцями
          </div>
        </div>
      </div>

      {/* Як є насправді, а не за інструкцією */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("main") - 4, cue("metrics") - 10) }}>
        <div style={{ position: "absolute", left: 120, top: 160 }}>
          <Label>Моделюємо як є насправді, а не як в інструкції</Label>
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 240, display: "flex", gap: 24 }}>
          <div style={{ flex: 1, ...fadeUp(frame, cue("instr") - 4) }}>
            <Card muted style={{ padding: "26px 36px 32px", height: 300, boxSizing: "border-box" }}>
              <Label>За інструкцією</Label>
              <div style={{ fontSize: F.big, fontWeight: 700, lineHeight: 1.15, marginTop: 14, color: C.muted }}>дані одразу в систему</div>
            </Card>
          </div>
          <div style={{ flex: 1, ...fadeUp(frame, cue("real") - 4) }}>
            <Card accent={C.gold} style={{ padding: "26px 36px 32px", height: 300, boxSizing: "border-box" }}>
              <Label>Насправді</Label>
              <div style={{ fontSize: F.big, fontWeight: 700, lineHeight: 1.15, marginTop: 14 }}>
                папір <span style={{ color: C.gold }}>→</span> увечері в систему
              </div>
            </Card>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 600, display: "flex", justifyContent: "center", ...fadeUp(frame, cue("diff") - 4) }}>
          <Pill tone="bad" size={F.body}>
            розбіжність = справжня проблема
          </Pill>
        </div>
      </div>

      {/* Метрики AS-IS */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 160, ...fadeUp(frame, cue("metrics") - 4) }}>
        <Label>Метрики AS-IS</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 14 }}>
          {METRIC_KINDS.map((m, i) => (
            <div key={m} style={fadeUp(frame, cue("metrics") + 8 + i * 8)}>
              <Pill tone="ghost" size={F.small}>
                {m}
              </Pill>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 440, display: "flex", gap: 24 }}>
        {OURS.map((m, i) => (
          <div key={m.label} style={{ flex: 1, ...fadeUp(frame, cue("ours") + i * 10) }}>
            <Card accent={i === 3 ? C.bad : C.graphite} style={{ padding: "22px 28px 26px", height: 220, boxSizing: "border-box" }}>
              <div style={{ fontSize: F.head, fontWeight: 700, lineHeight: 1 }}>{m.value}</div>
              <div style={{ fontSize: F.small, color: C.muted, marginTop: 14 }}>{m.label}</div>
            </Card>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 120, top: 710, ...fadeUp(frame, cue("base") - 4) }}>
        <Pill tone="gold" size={F.body}>
          база, щоб довести ефект
        </Pill>
      </div>
    </T3Z3Frame>
  );
};
