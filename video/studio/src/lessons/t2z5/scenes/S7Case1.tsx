import React from "react";
import { useCurrentFrame } from "remotion";
import { EASE_IN_OUT, fadeUp, inOut, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { StepChain } from "../../../shared/StepChain";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z5Frame } from "../frame";
import { GLOSSARY } from "../script";

// Розбір кейсу 1 — розділ 8 заняття; варіанти — розділ 2; рівні MoSCoW — Т1·З3, 5.3.
const LEVELS = [
  { m: "M", word: "Must", k: "К", meaning: "критично" },
  { m: "S", word: "Should", k: "И", meaning: "важливо" },
  { m: "C", word: "Could", k: "Ї", meaning: "бажано" },
  { m: "W", word: "Won’t", k: "В", meaning: "свідомо відкладено" },
];
// Схематичний розподіл безіменних проєктів — лише ілюстрація принципу.
const SORTED: number[][] = [[1, 6], [2], [4], [3, 5]];
const VARIANTS = [
  { text: "«Гнати» команду", at: "v1" },
  { text: "Залучити додатковий ресурс", at: "v2" },
  { text: "Переглянути обсяг", at: "v3" },
  { text: "Перепріоритезувати", at: "v4" },
];

const Column: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", ...style }}>{children}</div>
);

export const S7Case1: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const phase = (from: string, to: string) => inOut(frame, cue(from) - 4, cue(to) - 8);
  const chainAt = (i: number) => cue("structure") + i * 8;

  return (
    <T2Z5Frame timing={timing} current={null} done={GLOSSARY.length}>
      <div style={{ position: "absolute", left: 120, top: 130, ...fadeUp(frame, 0) }}>
        <Label>Розбір кейсу 1 · Перевантажена команда</Label>
      </div>
      <div style={{ position: "absolute", left: 120, top: 190 }}>
        <StepChain
          frame={frame}
          steps={[
            { label: "Ситуація", at: chainAt(0), activeFrom: cue("situation"), activeTo: cue("problem") },
            { label: "Проблема", at: chainAt(1), activeFrom: cue("problem"), activeTo: cue("variants") },
            { label: "Варіанти", at: chainAt(2), activeFrom: cue("variants"), activeTo: cue("choice") },
            { label: "Вибір", at: chainAt(3), activeFrom: cue("choice"), activeTo: cue("risk") },
            { label: "Ризики", at: chainAt(4), activeFrom: cue("risk") },
          ]}
        />
      </div>

      {/* Ситуація */}
      <div style={{ position: "absolute", inset: 0, opacity: phase("situation", "problem") }}>
        <div style={{ position: "absolute", left: 120, right: 120, top: 330, display: "flex", gap: 28 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Card key={n} style={{ flex: 1, padding: "22px 24px" }}>
              <div style={{ fontSize: F.small, fontWeight: 700 }}>Проєкт {n}</div>
            </Card>
          ))}
        </div>
        <div style={{ position: "absolute", left: 120, top: 500, display: "flex", gap: 24, alignItems: "center" }}>
          <Card accent={C.gold} style={{ padding: "18px 36px 18px 28px" }}>
            <div style={{ fontSize: F.small, fontWeight: 700 }}>+1 від командування</div>
          </Card>
          <Pill tone="bad" size={F.small}>
            строки зриваються
          </Pill>
          <Pill tone="bad" size={F.small}>
            вигорання
          </Pill>
        </div>
      </div>

      {/* Проблема */}
      <div style={{ position: "absolute", inset: 0, opacity: phase("problem", "variants") }}>
        <div style={{ position: "absolute", left: 120, top: 330 }}>
          <div style={{ fontSize: F.small, fontWeight: 700 }}>Реальна доступність</div>
          <div style={{ width: 1000, height: 50, border: `5px solid ${C.gold}`, boxSizing: "border-box", marginTop: 10 }} />
        </div>
        <div style={{ position: "absolute", left: 120, top: 470, ...fadeUp(frame, cue("overload") - 4) }}>
          <div style={{ fontSize: F.small, fontWeight: 700 }}>Узяли в роботу</div>
          <div style={{ display: "flex", marginTop: 10, height: 50 }}>
            <div style={{ width: 1000, background: C.graphite }} />
            <div style={{ width: 520 * prog(frame, cue("overload"), 20, EASE_IN_OUT), background: C.bad }} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 120, top: 650, ...fadeUp(frame, cue("notPeople") - 4) }}>
          <Card accent={C.bad} style={{ padding: "22px 40px 26px 32px" }}>
            <div style={{ fontSize: 56, fontWeight: 700 }}>Не в людях, а у відсутності</div>
            <div style={{ fontSize: 56, fontWeight: 700 }}>capacity planning і пріоритезації</div>
          </Card>
        </div>
      </div>

      {/* Варіанти */}
      <div style={{ position: "absolute", inset: 0, opacity: phase("variants", "levels") }}>
        <div
          style={{
            position: "absolute",
            left: 120,
            right: 120,
            top: 330,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 28,
          }}
        >
          {VARIANTS.map((v, i) => {
            const chosen = i === VARIANTS.length - 1;
            const pushed = i === 0;
            return (
              <div key={v.text} style={fadeUp(frame, cue(v.at) - 4)}>
                <Card
                  accent={chosen ? C.gold : undefined}
                  muted={pushed && frame >= cue("notPush")}
                  style={{
                    padding: "30px 40px",
                    position: "relative",
                    background: chosen ? `rgba(243, 146, 0, ${0.16 * prog(frame, cue("choice"), 10)})` : undefined,
                  }}
                >
                  <div style={{ fontSize: 56, fontWeight: 700, color: pushed && frame >= cue("notPush") ? C.dim : C.ink }}>{v.text}</div>
                  {pushed ? (
                    <div
                      style={{
                        position: "absolute",
                        left: 30,
                        top: "50%",
                        height: 8,
                        width: `calc((100% - 60px) * ${prog(frame, cue("notPush") + 6, 12)})`,
                        background: C.muted,
                      }}
                    />
                  ) : null}
                </Card>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 120, top: 720, display: "flex", gap: 24, alignItems: "center" }}>
          <div style={fadeUp(frame, cue("notPush"))}>
            <Pill tone="dim" size={F.small}>
              перевантаження — управлінська проблема
            </Pill>
          </div>
        </div>
        <div style={{ position: "absolute", left: 120, top: 820, ...fadeUp(frame, cue("choice") + 10) }}>
          <Pill tone="gold" size={F.small}>
            вибір усуває причину
          </Pill>
        </div>
      </div>

      {/* Рівні MoSCoW */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 320, opacity: phase("levels", "kyiv") }}>
        <Label>Рівні з Теми 1 · MoSCoW</Label>
        <div style={{ display: "flex", gap: 24, marginTop: 24 }}>
          {LEVELS.map((l, i) => (
            <Column key={l.m} style={fadeUp(frame, cue("must") + i * 10)}>
              <Card style={{ width: "100%", padding: "24px 16px 30px" }}>
                <div style={{ fontSize: F.title, fontWeight: 700, lineHeight: 1 }}>{l.m}</div>
                <div style={{ fontSize: 56, fontWeight: 700, marginTop: 8 }}>{l.word}</div>
                <div style={{ fontSize: F.small, color: C.muted, marginTop: 10, opacity: prog(frame, cue("meaning") + i * 12, 10) }}>{l.meaning}</div>
              </Card>
            </Column>
          ))}
        </div>
      </div>

      {/* Слайд «КИЇВ»: дві назви однієї шкали */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 300, opacity: phase("kyiv", "apply") }}>
        <Label>Дві назви однієї шкали</Label>
        <div style={{ display: "flex", gap: 24, marginTop: 20 }}>
          {LEVELS.map((l, i) => (
            <Column key={l.k} style={fadeUp(frame, cue("kyivLetters") + i * 14)}>
              <Card accent={C.gold} style={{ width: "100%", padding: "18px 16px 26px" }}>
                <div style={{ fontSize: F.small, color: C.muted }}>
                  {l.m} · {l.word}
                </div>
                <div style={{ fontSize: 170, fontWeight: 700, color: C.gold, lineHeight: 1, marginTop: 6 }}>{l.k}</div>
                <div style={{ fontSize: F.small, marginTop: 8 }}>{l.meaning}</div>
              </Card>
            </Column>
          ))}
        </div>
        <div style={{ marginTop: 36, display: "flex", gap: 28, alignItems: "center", ...fadeUp(frame, cue("both") - 4) }}>
          <Pill tone="gold" size={F.body}>
            можна і так, і так
          </Pill>
          <div style={{ fontSize: F.small, color: C.muted }}>MoSCoW = КИЇВ · рівні ті самі</div>
        </div>
      </div>

      {/* Застосування: проєкти за рівнями */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 320, opacity: phase("apply", "risk") }}>
        <div style={{ display: "flex", gap: 24 }}>
          {LEVELS.map((l, i) => {
            const deferred = i === LEVELS.length - 1;
            const grey = deferred ? prog(frame, cue("apply") + 50, 12) : 0;
            return (
              <Column key={l.m} style={{ opacity: 1 - 0.55 * grey }}>
                <Card accent={deferred ? C.graphite : C.gold} style={{ width: "100%", padding: "18px 16px", boxSizing: "border-box" }}>
                  <div style={{ fontSize: 56, fontWeight: 700 }}>
                    {l.m} · {l.k}
                  </div>
                  <div style={{ fontSize: F.small, color: C.muted }}>{l.meaning}</div>
                </Card>
                {SORTED[i].map((n, k) => (
                  <div key={n} style={{ marginTop: 16, ...fadeUp(frame, cue("apply") + (i * 2 + k) * 6, { dy: -60 }) }}>
                    <Pill tone={deferred ? "dim" : "outline"} size={F.small}>
                      Проєкт {n}
                    </Pill>
                  </div>
                ))}
              </Column>
            );
          })}
        </div>
        <div style={{ marginTop: 40, ...fadeUp(frame, cue("protect") - 4) }}>
          <Pill tone="gold" size={F.body}>
            реальну доступність захищено
          </Pill>
        </div>
      </div>

      {/* Ризики вибору */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 330, opacity: prog(frame, cue("risk") - 4, 12) }}>
        <Pill tone="bad" size={F.body}>
          невдоволення замовників відкладених проєктів
        </Pill>
        <svg width={60} height={90} style={{ display: "block", marginLeft: 80, marginTop: 10, opacity: prog(frame, cue("comms") - 4, 8) }}>
          <path d="M30 0 V76 M14 60 L30 82 L46 60" fill="none" stroke={C.gold} strokeWidth={7} />
        </svg>
        <div style={fadeUp(frame, cue("comms") - 4)}>
          <Card accent={C.gold} style={{ padding: "26px 44px 30px 36px", marginTop: 6 }}>
            <Label>Комунікація</Label>
            <div style={{ fontSize: F.body, fontWeight: 700, marginTop: 8 }}>
              пріоритети й <span style={{ opacity: prog(frame, cue("cod") - 4, 8) }}>cost of delay — вартість зволікання</span>
            </div>
          </Card>
        </div>
      </div>
    </T2Z5Frame>
  );
};
