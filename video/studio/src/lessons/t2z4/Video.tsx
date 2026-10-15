import { makeLessonVideo } from "../../shared/LessonVideo";
import { T2Z4 } from "./meta";
import { S0Intro } from "./scenes/S0Intro";
import { S1RiskIssue } from "./scenes/S1RiskIssue";
import { S2Matrix } from "./scenes/S2Matrix";
import { S3Emv } from "./scenes/S3Emv";
import { S4Owner } from "./scenes/S4Owner";
import { S5Response } from "./scenes/S5Response";
import { S6Escalation } from "./scenes/S6Escalation";
import { S7Practice } from "./scenes/S7Practice";

export const T2Z4_VIDEO = makeLessonVideo(T2Z4, {
  "s0-intro": S0Intro,
  "s1-risk-issue": S1RiskIssue,
  "s2-matrix": S2Matrix,
  "s3-emv": S3Emv,
  "s4-owner": S4Owner,
  "s5-response": S5Response,
  "s6-escalation": S6Escalation,
  "s7-practice": S7Practice,
});
