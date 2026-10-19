import React from "react";
import { Composition, Folder } from "remotion";
import { T2Z3 } from "./lessons/t2z3/meta";
import { T2Z3_VIDEO } from "./lessons/t2z3/Video";
import { T2Z4 } from "./lessons/t2z4/meta";
import { T2Z4_VIDEO } from "./lessons/t2z4/Video";
import { T2Z5 } from "./lessons/t2z5/meta";
import { T2Z5_VIDEO } from "./lessons/t2z5/Video";
import "./shared/fonts";

const LESSON_VIDEOS = [
  { meta: T2Z3, video: T2Z3_VIDEO },
  { meta: T2Z4, video: T2Z4_VIDEO },
  { meta: T2Z5, video: T2Z5_VIDEO },
];

// Тривалості в <Composition> — заглушки: справжні рахує calculateMetadata
// (голос із public/voiceover/<урок>/ або оцінка за кількістю слів).
export const RemotionRoot: React.FC = () => (
  <>
    {LESSON_VIDEOS.map(({ meta, video }) => {
      const prefix = meta.composition.split("-").slice(0, 2).join("-");
      return (
        <React.Fragment key={meta.id}>
          <Composition
            id={meta.composition}
            component={video.Video}
            width={1920}
            height={1080}
            fps={30}
            durationInFrames={300}
            defaultProps={{ timings: [] }}
            calculateMetadata={video.calculateMetadata}
          />
          <Folder name={`${prefix}-Scenes`}>
            {meta.scenes.map((scene, i) => (
              <Composition
                key={scene.id}
                id={`${prefix}-${scene.id}`}
                component={video.components[scene.id]}
                width={1920}
                height={1080}
                fps={30}
                durationInFrames={300}
                defaultProps={{ timing: video.fallbackTiming(i) }}
                calculateMetadata={video.sceneMetadata(i)}
              />
            ))}
          </Folder>
        </React.Fragment>
      );
    })}
  </>
);
