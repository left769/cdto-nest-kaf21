import React from "react";
import { EASE_IN_OUT, fadeUp, prog } from "./anim";
import { Label } from "./Card";
import { cellCenter } from "./GlossaryStrip";
import { C, F } from "./theme";

/**
 * Картка терміна: з’являється по центру, а коли поняття назване — зменшується
 * й «відлітає» у свою комірку смуги глосарію.
 */
export const TermCard: React.FC<{
  frame: number;
  at: number;
  outAt: number;
  index: number;
  count: number;
  title: string;
  en?: string;
  uk: string;
  kicker?: string;
  titleSize?: number;
}> = ({ frame, at, outAt, index, count, title, en, uk, kicker, titleSize = F.title }) => {
  const fly = prog(frame, outAt, 22, EASE_IN_OUT);
  if (fly >= 1) {
    return null;
  }
  const appear = fadeUp(frame, at, { dur: 16 });
  const target = cellCenter(index, count);
  // Центр картки — приблизно центр робочої зони над смугою.
  const dx = target.x - 960;
  const dy = target.y - 470;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: 940,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: appear.opacity * (1 - prog(frame, outAt + 10, 12)),
        translate: fly > 0 ? `${dx * fly}px ${dy * fly}px` : appear.translate,
        scale: String(1 - 0.85 * fly),
      }}
    >
      <div
        style={{
          background: C.card,
          border: `2px solid ${C.line}`,
          borderLeft: `16px solid ${C.gold}`,
          padding: "56px 88px 64px 80px",
          maxWidth: 1680,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <Label color={C.muted}>{kicker ?? `Поняття ${index + 1} / ${count}`}</Label>
        <div style={{ fontSize: titleSize, fontWeight: 700, lineHeight: 1.05, color: C.ink }}>{title}</div>
        {en ? <div style={{ fontSize: F.body, fontWeight: 400, color: C.muted, lineHeight: 1.2 }}>{en}</div> : null}
        <div style={{ fontSize: F.big, fontWeight: 500, color: C.ink, lineHeight: 1.2 }}>{uk}</div>
      </div>
    </div>
  );
};
