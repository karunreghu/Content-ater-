import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { CameraRig } from "../components/CameraRig";
import { Candles } from "../components/Candles";
import { Headline } from "../components/Headline";
import { clamp, sceneFade } from "../components/helpers";
import { theme } from "../theme";

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const z = interpolate(frame, [0, durationInFrames], [16, 9.5], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const x = interpolate(frame, [0, durationInFrames], [-3, 1.5], clamp);

  return (
    <AbsoluteFill style={{ opacity: sceneFade(frame, durationInFrames) }}>
      <ThreeCanvas width={width} height={height}>
        <color attach="background" args={[theme.bg]} />
        <fog attach="fog" args={[theme.bg, 10, 30]} />
        <CameraRig position={[x, 2.6, z]} lookAt={[0, 1.6, 0]} />
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 6, 6]} intensity={60} color={theme.blue} />
        <Candles count={26} trend="mixed" seed="hook" stagger={3} delay={5} position={[0, -0.4, 0]} />
        <gridHelper args={[60, 60, theme.blue, "#12275a"]} position={[0, -2.2, 0]} />
      </ThreeCanvas>
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 110 }}>
        <Headline delay={25} size={60} weight={600} color={theme.muted}>
          Hey there!
        </Headline>
        <Headline delay={40} size={100}>
          Looking for <span style={{ color: theme.green }}>automation?</span>
        </Headline>
        <Headline delay={70} size={46} weight={500} color={theme.muted} style={{ marginTop: 18 }}>
          …for your trading strategy
        </Headline>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
