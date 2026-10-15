import React from "react";
import { useCurrentFrame } from "remotion";
import { EASE_IN_OUT, fadeUp, inOut, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z3Frame } from "../frame";
import { GLOSSARY } from "../script";

const MeetingIcon: React.FC = () => (
  <svg width={360} height={280} viewBox="0 0 360 280">
    <rect x={70} y={95} width={220} height={90} fill={C.graphite} />
    {[
      [110, 50],
      [180, 40],
      [250, 50],
      [110, 230],
      [180, 240],
      [250, 230],
      [30, 140],
      [330, 140],
    ].map(([x, y]) => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r={26} fill={C.muted} />
    ))}
  </svg>
);

const Sheet: React.FC = () => (
  <Card style={{ width: 360, height: 380, padding: "32px 36px" }}>
    <div style={{ fontSize: F.small, fontWeight: 700 }}>Протокол</div>
    {[0.9, 0.7, 0.85, 0.6, 0.8].map((w, i) => (
      <div key={i} style={{ height: 14, width: `${w * 100}%`, background: C.line, marginTop: 34 }} />
    ))}
  </Card>
);

/** Рядок картки: підпис і значення (у стовпчик для довгих значень). */
const Field: React.FC<{
  label: string;
  stacked?: boolean;
  labelOpacity: number;
  valueOpacity: number;
  children: React.ReactNode;
}> = ({ label, stacked, labelOpacity, valueOpacity, children }) => (
  <div
    style={{
      display: "flex",
      flexDirection: stacked ? "column" : "row",
      alignItems: stacked ? "flex-start" : "center",
      gap: stacked ? 6 : 0,
      padding: "18px 0",
      borderTop: `2px solid ${C.line}`,
      opacity: labelOpacity,
    }}
  >
    <div style={{ width: stacked ? "auto" : 440, fontSize: F.small, color: C.muted }}>{label}</div>
    <div style={{ fontSize: 56, fontWeight: 500, lineHeight: 1.2, opacity: valueOpacity, minHeight: 67 }}>{children}</div>
  </div>
);

export const S5Logs: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const out = prog(frame, cue("decision") - 6, 18, EASE_IN_OUT);
  const emerge = (at: number) => prog(frame, at, 20, EASE_IN_OUT);
  const dCard = emerge(cue("decision") - 4);
  const aCard = emerge(cue("action") - 4);
  // «Побажання»: відповідальний і строк зникають, картка сіріє; потім повертаються.
  const wish = inOut(frame, cue("wish") + 6, cue("next"), 10);
  const show = (at: string) => prog(frame, cue(at) - 4, 10);

  return (
    <T2Z3Frame timing={timing} current={4} done={4}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("meeting") - 22}
        index={4}
        count={GLOSSARY.length}
        title="Decision log · Action log"
        titleSize={F.head}
        uk="журнали рішень і доручень"
      />

      {/* Нарада → протокол */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 230,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 80,
          opacity: prog(frame, cue("meeting") - 4, 12) * (1 - out),
          scale: String(1 - 0.3 * out),
        }}
      >
        <MeetingIcon />
        <svg width={140} height={60} style={fadeUp(frame, cue("meeting") + 20, { dx: -30, dy: 0 })}>
          <path d="M0 30 H120 M96 8 L124 30 L96 52" fill="none" stroke={C.gold} strokeWidth={8} />
        </svg>
        <div style={fadeUp(frame, cue("meeting") + 28)}>
          <Sheet />
        </div>
      </div>

      {/* Decision log */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 150,
          width: 820,
          opacity: dCard,
          translate: `${(1 - dCard) * 420}px ${(1 - dCard) * 120}px`,
          scale: String(0.6 + 0.4 * dCard),
        }}
      >
        <Card style={{ padding: "24px 40px 8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 18 }}>
            <Pill tone="dark" size={F.small}>
              Decision log
            </Pill>
            <div style={{ fontSize: F.small, color: C.muted }}>рішення</div>
          </div>
          <Field label="Що" stacked labelOpacity={show("dWhat")} valueOpacity={show("dExample")}>
            Обрати готове ПЗ замість власної розробки
          </Field>
          <Field label="Хто" labelOpacity={show("dWho")} valueOpacity={show("dExWho")}>
            DT Lead
          </Field>
          <Field label="Підстава" labelOpacity={show("dBasis")} valueOpacity={show("dExBasis")}>
            Строк
          </Field>
        </Card>
      </div>

      {/* Action log */}
      <div
        style={{
          position: "absolute",
          left: 980,
          top: 150,
          width: 820,
          opacity: aCard,
          translate: `${(1 - aCard) * -420}px ${(1 - aCard) * 120}px`,
          scale: String(0.6 + 0.4 * aCard),
        }}
      >
        <Card style={{ padding: "24px 40px 8px", position: "relative" }}>
          <div style={{ filter: `grayscale(${wish})`, opacity: 1 - 0.45 * wish }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 18 }}>
              <Pill tone="gold" size={F.small}>
                Action log
              </Pill>
              <div style={{ fontSize: F.small, color: C.muted }}>доручення</div>
            </div>
            <Field label="Що" stacked labelOpacity={show("aWhat")} valueOpacity={show("aWhat")}>
              Підготувати доступи для пілоту
            </Field>
            <Field label="Відповідальний" labelOpacity={show("aWho")} valueOpacity={show("aWho") * (1 - wish)}>
              Support
            </Field>
            <Field label="Строк" labelOpacity={show("aDue")} valueOpacity={show("aDue") * (1 - wish)}>
              __.__
            </Field>
            <Field label="Статус" labelOpacity={show("aStatus")} valueOpacity={show("aStatus")}>
              <Pill tone="ghost" size={F.small}>
                В роботі
              </Pill>
            </Field>
          </div>
          <div
            style={{
              position: "absolute",
              right: 48,
              top: 400,
              rotate: "-6deg",
              border: `6px solid ${C.bad}`,
              color: C.bad,
              fontSize: F.body,
              fontWeight: 700,
              padding: "8px 28px",
              background: "rgba(255,255,255,0.85)",
              opacity: wish,
              scale: String(1.15 - 0.15 * wish),
            }}
          >
            не доручення
          </div>
        </Card>
      </div>

      <div style={{ position: "absolute", left: 120, top: 860, ...fadeUp(frame, cue("next") + 40) }}>
        <Label style={{ textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>
          Є ще issue log і change log — див. текст заняття
        </Label>
      </div>
    </T2Z3Frame>
  );
};
