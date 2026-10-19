import { makeLessonVideo } from "../../shared/LessonVideo";
import { T2Z5 } from "./meta";
import { S0Intro } from "./scenes/S0Intro";
import { S1Tuckman } from "./scenes/S1Tuckman";
import { S2Capacity } from "./scenes/S2Capacity";
import { S3Contractors } from "./scenes/S3Contractors";
import { S4Bottleneck } from "./scenes/S4Bottleneck";
import { S5Roi } from "./scenes/S5Roi";
import { S6Kotter } from "./scenes/S6Kotter";
import { S7Case1 } from "./scenes/S7Case1";
import { S8Seminar } from "./scenes/S8Seminar";

export const T2Z5_VIDEO = makeLessonVideo(T2Z5, {
  "s0-intro": S0Intro,
  "s1-tuckman": S1Tuckman,
  "s2-capacity": S2Capacity,
  "s3-contractors": S3Contractors,
  "s4-bottleneck": S4Bottleneck,
  "s5-roi": S5Roi,
  "s6-kotter": S6Kotter,
  "s7-case1": S7Case1,
  "s8-seminar": S8Seminar,
});
