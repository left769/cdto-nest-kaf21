import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, prog } from "../../../shared/anim";
import { Card } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T3Z3Frame } from "../frame";
import { GLOSSARY } from "../script";

// П’ять аспектів і розриви — Додаток 7 і зразок кроку зошита; шкала масштабу — розділ 3.3 заняття.
// Масштаб у занятті наведено для всього переходу («суттєва трансформація»), тож по рядках його не ставимо.
const ROWS = [
  { at: "g1", aspect: "Процеси", from: "ручне звіряння", to: "автоматичне" },
  { at: "g2", aspect: "Дані", from: "3 журнали", to: "єдиний реєстр" },
  { at: "g3", aspect: "Ролі", from: "—", to: "адміністратор реєстру" },
  { at: "g4", aspect: "Системи", from: "немає ІКС", to: "нова ІКС" },
  { at: "g5", aspect: "Навички", from: "—", to: "навчені МВО й комісія" },
];
const SCALE = ["дрібна зміна", "суттєва", "трансформація"];

export const S6Gap: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const ours = prog(frame, cue("ours") - 4, 12);
  // На висновку таблиця відходить на другий план.
  const back = 1 - 0.75 * prog(frame, cue("result") - 6, 14);

  return (
    <T3Z3Frame timing={timing} current={5} done={5}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("gapdef") - 22}
        index={5}
        count={GLOSSARY.length}
        title="Gap-аналіз"
        uk="розриви між AS-IS і TO-BE"
      />

      <div style={{ position: "absolute", inset: 0, opacity: back }}>
        <div style={{ position: "absolute", left: 120, right: 120, top: 150, fontSize: F.small, fontWeight: 700, ...fadeUp(frame, cue("gapdef") - 4) }}>
          Розрив — конкретна відмінність, яку треба усунути
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 236, display: "flex", flexDirection: "column", gap: 10 }}>
          {ROWS.map((r) => (
            <div key={r.at} style={fadeUp(frame, cue(r.at) - 4, { dx: -24, dy: 0 })}>
              <Card accent={C.gold} style={{ padding: "14px 28px 16px 24px", display: "flex", alignItems: "center", gap: 24, height: 92, boxSizing: "border-box" }}>
                <div style={{ width: 260, flexShrink: 0, fontSize: 52, fontWeight: 700 }}>{r.aspect}</div>
                <div style={{ width: 520, flexShrink: 0, fontSize: F.small, color: C.muted }}>{r.from}</div>
                <div style={{ fontSize: F.small, color: C.gold, fontWeight: 700, flexShrink: 0 }}>→</div>
                <div style={{ fontSize: F.small, fontWeight: 700 }}>{r.to}</div>
              </Card>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 120, top: 760, display: "flex", alignItems: "center", gap: 16, ...fadeUp(frame, cue("scale") - 4) }}>
          <div style={{ fontSize: F.small, fontWeight: 700, marginRight: 8 }}>Масштаб:</div>
          {/* Шкала зі заняття змінюється підсумком прикладу. */}
          <div style={{ display: "grid" }}>
            <div style={{ gridArea: "1 / 1", display: "flex", gap: 16, opacity: 1 - ours }}>
              {SCALE.map((s) => (
                <Pill key={s} tone="ghost" size={F.small}>
                  {s}
                </Pill>
              ))}
            </div>
            <div style={{ gridArea: "1 / 1", opacity: ours }}>
              <Pill tone="gold" size={F.small}>
                тут — суттєва трансформація
              </Pill>
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", left: 220, right: 220, top: 320, ...fadeUp(frame, cue("result") - 4) }}>
        <Card accent={C.gold} style={{ padding: "36px 56px 42px 44px" }}>
          <div style={{ fontSize: F.body, fontWeight: 700, lineHeight: 1.2 }}>
            Перелік змін — міст від аналізу до вимог і плану впровадження
          </div>
        </Card>
      </div>
    </T3Z3Frame>
  );
};
