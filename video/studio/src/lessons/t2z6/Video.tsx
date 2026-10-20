import { makeLessonVideo } from "../../shared/LessonVideo";
import { T2Z6 } from "./meta";
import { S0Intro } from "./scenes/S0Intro";
import { S1Levels } from "./scenes/S1Levels";
import { S2Baskets } from "./scenes/S2Baskets";
import { S3Wsjf } from "./scenes/S3Wsjf";
import { S4Load } from "./scenes/S4Load";
import { S5Wip } from "./scenes/S5Wip";
import { S6Checkpoint } from "./scenes/S6Checkpoint";
import { S7Practice } from "./scenes/S7Practice";

export const T2Z6_VIDEO = makeLessonVideo(T2Z6, {
  "s0-intro": S0Intro,
  "s1-levels": S1Levels,
  "s2-baskets": S2Baskets,
  "s3-wsjf": S3Wsjf,
  "s4-load": S4Load,
  "s5-wip": S5Wip,
  "s6-checkpoint": S6Checkpoint,
  "s7-practice": S7Practice,
});
