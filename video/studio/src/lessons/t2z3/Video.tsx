import { makeLessonVideo } from "../../shared/LessonVideo";
import { T2Z3 } from "./meta";
import { S0Hook } from "./scenes/S0Hook";
import { S1Kpi } from "./scenes/S1Kpi";
import { S2LeadingLagging } from "./scenes/S2LeadingLagging";
import { S3EarnedValue } from "./scenes/S3EarnedValue";
import { S4Raid } from "./scenes/S4Raid";
import { S5Logs } from "./scenes/S5Logs";
import { S6Dashboard } from "./scenes/S6Dashboard";
import { S7Practice } from "./scenes/S7Practice";

export const T2Z3_VIDEO = makeLessonVideo(T2Z3, {
  "s0-hook": S0Hook,
  "s1-kpi": S1Kpi,
  "s2-leading-lagging": S2LeadingLagging,
  "s3-earned-value": S3EarnedValue,
  "s4-raid": S4Raid,
  "s5-logs": S5Logs,
  "s6-dashboard": S6Dashboard,
  "s7-practice": S7Practice,
});
