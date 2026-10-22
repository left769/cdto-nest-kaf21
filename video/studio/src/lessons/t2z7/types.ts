import { C } from "../../shared/theme";

// Чотири типи залежностей (розділ 1.2 заняття) — ті самі кольори в усіх сценах.
// Червоний не використовується: він позначає критичний шлях і невиконання.
export const DEP_TYPES = {
  tech: { name: "технічна", color: C.graphite },
  norm: { name: "нормативна", color: C.gold },
  org: { name: "організаційна", color: C.ok },
  res: { name: "ресурсна", color: C.dim },
} as const;

export type DepType = keyof typeof DEP_TYPES;
