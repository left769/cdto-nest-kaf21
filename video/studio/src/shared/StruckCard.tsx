import React from "react";
import { Card } from "./Card";
import { C, F } from "./theme";

/** Антиприклад: сіра картка, яку перекреслює лінія (`strike` 0 → 1). */
export const StruckCard: React.FC<{ strike: number; children: React.ReactNode }> = ({ strike, children }) => (
  <Card muted style={{ padding: "32px 56px", position: "relative" }}>
    <div style={{ fontSize: F.body, fontWeight: 500, color: C.dim }}>{children}</div>
    <div
      style={{
        position: "absolute",
        left: 40,
        top: "50%",
        height: 8,
        width: `calc((100% - 80px) * ${strike})`,
        background: C.muted,
      }}
    />
  </Card>
);
