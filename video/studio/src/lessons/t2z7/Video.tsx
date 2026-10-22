import { makeLessonVideo } from "../../shared/LessonVideo";
import { T2Z7 } from "./meta";
import { S0Intro } from "./scenes/S0Intro";
import { S1Map } from "./scenes/S1Map";
import { S2Interagency } from "./scenes/S2Interagency";
import { S3Interface } from "./scenes/S3Interface";
import { S4PlanB } from "./scenes/S4PlanB";
import { S5Constraints } from "./scenes/S5Constraints";
import { S6Prereq } from "./scenes/S6Prereq";
import { S7Practice } from "./scenes/S7Practice";

export const T2Z7_VIDEO = makeLessonVideo(T2Z7, {
  "s0-intro": S0Intro,
  "s1-map": S1Map,
  "s2-interagency": S2Interagency,
  "s3-interface": S3Interface,
  "s4-planb": S4PlanB,
  "s5-constraints": S5Constraints,
  "s6-prereq": S6Prereq,
  "s7-practice": S7Practice,
});
