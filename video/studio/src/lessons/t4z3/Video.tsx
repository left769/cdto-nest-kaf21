import { makeLessonVideo } from "../../shared/LessonVideo";
import { T4Z3 } from "./meta";
import { S0Intro } from "./scenes/S0Intro";
import { S1Stakeholder } from "./scenes/S1Stakeholder";
import { S2Matrix } from "./scenes/S2Matrix";
import { S3Plan } from "./scenes/S3Plan";
import { S4Trust } from "./scenes/S4Trust";
import { S5Concerns } from "./scenes/S5Concerns";
import { S6Audience } from "./scenes/S6Audience";
import { S7Next } from "./scenes/S7Next";

export const T4Z3_VIDEO = makeLessonVideo(T4Z3, {
  "s0-intro": S0Intro,
  "s1-stakeholder": S1Stakeholder,
  "s2-matrix": S2Matrix,
  "s3-plan": S3Plan,
  "s4-trust": S4Trust,
  "s5-concerns": S5Concerns,
  "s6-audience": S6Audience,
  "s7-next": S7Next,
});
