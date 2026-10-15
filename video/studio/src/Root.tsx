import { Composition, Folder } from "remotion";
import { calculateVideoMetadata, fallbackTiming, sceneMetadata, T2Z3Video } from "./lessons/t2z3/Video";
import { S0Hook } from "./lessons/t2z3/scenes/S0Hook";
import { S1Kpi } from "./lessons/t2z3/scenes/S1Kpi";
import { S2LeadingLagging } from "./lessons/t2z3/scenes/S2LeadingLagging";
import { S3EarnedValue } from "./lessons/t2z3/scenes/S3EarnedValue";
import { S4Raid } from "./lessons/t2z3/scenes/S4Raid";
import { S5Logs } from "./lessons/t2z3/scenes/S5Logs";
import { S6Dashboard } from "./lessons/t2z3/scenes/S6Dashboard";
import { S7Practice } from "./lessons/t2z3/scenes/S7Practice";
import "./shared/fonts";

// Тривалості в <Composition> — заглушки: справжні рахує calculateMetadata
// (голос із public/voiceover/t2z3/ або оцінка за кількістю слів).
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="T2-Z3-Terms"
        component={T2Z3Video}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={300}
        defaultProps={{ timings: [] }}
        calculateMetadata={calculateVideoMetadata}
      />
      <Folder name="T2-Z3-Scenes">
        <Composition id="T2-Z3-S0-Hook" component={S0Hook} width={1920} height={1080} fps={30} durationInFrames={300} defaultProps={{ timing: fallbackTiming(0) }} calculateMetadata={sceneMetadata(0)} />
        <Composition id="T2-Z3-S1-KPI" component={S1Kpi} width={1920} height={1080} fps={30} durationInFrames={300} defaultProps={{ timing: fallbackTiming(1) }} calculateMetadata={sceneMetadata(1)} />
        <Composition id="T2-Z3-S2-Leading-Lagging" component={S2LeadingLagging} width={1920} height={1080} fps={30} durationInFrames={300} defaultProps={{ timing: fallbackTiming(2) }} calculateMetadata={sceneMetadata(2)} />
        <Composition id="T2-Z3-S3-Earned-Value" component={S3EarnedValue} width={1920} height={1080} fps={30} durationInFrames={300} defaultProps={{ timing: fallbackTiming(3) }} calculateMetadata={sceneMetadata(3)} />
        <Composition id="T2-Z3-S4-RAID" component={S4Raid} width={1920} height={1080} fps={30} durationInFrames={300} defaultProps={{ timing: fallbackTiming(4) }} calculateMetadata={sceneMetadata(4)} />
        <Composition id="T2-Z3-S5-Logs" component={S5Logs} width={1920} height={1080} fps={30} durationInFrames={300} defaultProps={{ timing: fallbackTiming(5) }} calculateMetadata={sceneMetadata(5)} />
        <Composition id="T2-Z3-S6-Dashboard" component={S6Dashboard} width={1920} height={1080} fps={30} durationInFrames={300} defaultProps={{ timing: fallbackTiming(6) }} calculateMetadata={sceneMetadata(6)} />
        <Composition id="T2-Z3-S7-Practice" component={S7Practice} width={1920} height={1080} fps={30} durationInFrames={300} defaultProps={{ timing: fallbackTiming(7) }} calculateMetadata={sceneMetadata(7)} />
      </Folder>
    </>
  );
};
