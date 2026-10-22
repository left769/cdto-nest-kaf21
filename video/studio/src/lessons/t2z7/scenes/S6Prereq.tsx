import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, prog } from "../../../shared/anim";
import { Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z7Frame } from "../frame";
import { GLOSSARY } from "../script";

// Передумови по етапах — таблиця 6.2 заняття; управління ними — 6.3.
const GATES = [
  { at: "test", name: "Тестування", items: ["тестове середовище", "доступи", "тестові дані", "критерії тестування"] },
  { at: "deploy", name: "Впровадження", items: ["пройдені випробування", "погодження", "реєстрація ІКС", "навчання користувачів"] },
  { at: "accept", name: "Приймання", items: ["приймальні критерії", "документація", "відповідність вимогам ЗІ"] },
];
const MANAGE = ["заздалегідь", "власники", "перевірка перед переходом"];

export const S6Prereq: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  // «Почали тестування, а середовища немає»: перша передумова тестування не виконана.
  const fail = prog(frame, cue("fail") - 4, 12);

  return (
    <T2Z7Frame timing={timing} current={5} done={5}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("block") - 30}
        index={5}
        count={GLOSSARY.length}
        title="Передумови"
        uk="умова переходу до етапу"
      />

      <div style={{ position: "absolute", left: 120, top: 150, ...fadeUp(frame, cue("block") - 4) }}>
        <Label color={C.bad}>Невиконана передумова блокує етап</Label>
      </div>

      <div style={{ position: "absolute", left: 120, right: 120, top: 224, display: "flex", gap: 24 }}>
        {GATES.map((g, gi) => {
          const blocked = gi === 0 ? fail : 0;
          return (
            <div key={g.at} style={{ flex: 1, position: "relative", ...fadeUp(frame, cue(g.at) - 4) }}>
              <div
                style={{
                  background: C.card,
                  border: `${blocked > 0.5 ? 6 : 2}px solid ${blocked > 0.5 ? C.bad : C.line}`,
                  borderTop: `14px solid ${blocked > 0.5 ? C.bad : C.graphite}`,
                  padding: "18px 28px 24px",
                  height: 560,
                  boxSizing: "border-box",
                }}
              >
                <div style={{ fontSize: 56, fontWeight: 700 }}>{g.name}</div>
                {/* Місце під позначку блокування є в кожній колонці, щоб списки стояли на одній висоті. */}
                <div style={{ fontSize: F.small, fontWeight: 700, color: C.bad, height: 58, whiteSpace: "nowrap", opacity: blocked }}>{gi === 0 ? "✕ заблоковано" : ""}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                  {g.items.map((item, k) => {
                    const missing = gi === 0 && k === 0 ? blocked : 0;
                    return (
                      <div key={item} style={{ display: "flex", alignItems: "baseline", gap: 16, ...fadeUp(frame, cue(g.at) + 6 + k * 8, { dx: -16, dy: 0 }) }}>
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            flexShrink: 0,
                            background: missing > 0.5 ? C.bad : C.gold,
                            translate: "0px 2px",
                          }}
                        />
                        <div style={{ fontSize: F.small, lineHeight: 1.2, color: missing > 0.5 ? C.bad : C.ink, fontWeight: missing > 0.5 ? 700 : 500 }}>
                          {missing > 0.5 ? `✕ ${item}` : item}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", left: 120, right: 120, top: 820, display: "flex", gap: 16 }}>
        {MANAGE.map((m, i) => (
          <div key={m} style={fadeUp(frame, cue("manage") + i * 10)}>
            <Pill tone="dark" size={F.small}>
              {m}
            </Pill>
          </div>
        ))}
      </div>
    </T2Z7Frame>
  );
};
