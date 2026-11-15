import { ThreeCanvas } from "@remotion/three";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Camera } from "./Camera";
import { SpinningKnot } from "./SpinningKnot";
import { Title } from "./Title";

export type HelloThreeProps = {
  title: string;
  color: string;
  withAudio: boolean;
};

export const helloThreeSchema: HelloThreeProps = {
  title: "Hello, three.js + Remotion",
  color: "#7c5cff",
  withAudio: true,
};

/**
 * Example scene. Golden rule: every animation must be driven by
 * `useCurrentFrame()` — never by `useFrame`/clock time — so renders are
 * deterministic and frame-accurate.
 */
export const HelloThree: React.FC<HelloThreeProps> = ({
  title,
  color,
  withAudio,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();

  const intro = spring({ frame, fps, config: { damping: 14 } });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0b14", opacity: fadeOut }}>
      <ThreeCanvas width={width} height={height} shadows>
        <Camera />
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[5, 6, 4]}
          intensity={2.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-4, -2, 3]} intensity={30} color="#ff6ad5" />
        <SpinningKnot color={color} scale={intro} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#14142a" />
        </mesh>
      </ThreeCanvas>

      <Title text={title} />

      {withAudio ? <Audio src={staticFile("music.mp3")} volume={(f) =>
        interpolate(f, [0, 15, durationInFrames - 20, durationInFrames], [0, 0.6, 0.6, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      } /> : null}
    </AbsoluteFill>
  );
};
