import { makeLessonVideo } from "../../shared/LessonVideo";
import { T3Z3 } from "./meta";
import { S0Intro } from "./scenes/S0Intro";
import { S1AsIs } from "./scenes/S1AsIs";
import { S2Waste } from "./scenes/S2Waste";
import { S3Value } from "./scenes/S3Value";
import { S4Bottleneck } from "./scenes/S4Bottleneck";
import { S5ToBe } from "./scenes/S5ToBe";
import { S6Gap } from "./scenes/S6Gap";
import { S7Practice } from "./scenes/S7Practice";

export const T3Z3_VIDEO = makeLessonVideo(T3Z3, {
  "s0-intro": S0Intro,
  "s1-as-is": S1AsIs,
  "s2-waste": S2Waste,
  "s3-value": S3Value,
  "s4-bottleneck": S4Bottleneck,
  "s5-to-be": S5ToBe,
  "s6-gap": S6Gap,
  "s7-practice": S7Practice,
});
