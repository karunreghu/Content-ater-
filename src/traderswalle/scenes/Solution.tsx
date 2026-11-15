import { ThreeCanvas } from "@remotion/three";
import { useMemo } from "react";
import { BoxGeometry } from "three";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraRig } from "../components/CameraRig";
import { Candles } from "../components/Candles";
import { Gear } from "../components/Gear";
import { Headline } from "../components/Headline";
import { clamp, sceneFade } from "../components/helpers";
import { theme } from "../theme";
import { Screen } from "./Problem";

const StrategyCube: React.FC<{ frame: number; scale: number }> = ({ frame, scale }) => {
  const edges = useMemo(() => new BoxGeometry(2, 2, 2), []);
  const pulse = 0.8 + 0.3 * Math.sin(frame * 0.15);
  return (
    <group scale={scale} rotation={[frame * 0.012, frame * 0.02, 0]}>
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial
          color={theme.blue}
          emissive={theme.blue}
          emissiveIntensity={pulse}
          transparent
          opacity={0.35}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[edges]} />
        <lineBasicMaterial color={theme.green} />
      </lineSegments>
      <mesh>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color={theme.green} emissive={theme.green} emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
};

export const Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();

  // 0-45: screens fly into the centre and shrink; cube grows out of them
  const merge = interpolate(frame, [0, 45], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const cubeScale = spring({ frame: frame - 35, fps, config: { damping: 10 } });
  const orbit = spring({ frame: frame - 50, fps, config: { damping: 18 } });
  const camZ = interpolate(frame, [0, durationInFrames], [10, 8], clamp);

  const screens: { from: [number, number, number]; rot: number; seed: string }[] = [
    { from: [-4.2, 0.6, -1], rot: 0.45, seed: "s1" },
    { from: [0, -0.3, -2.2], rot: 0, seed: "s2" },
    { from: [4.2, 0.6, -1], rot: -0.45, seed: "s3" },
  ];

  return (
    <AbsoluteFill style={{ opacity: sceneFade(frame, durationInFrames) }}>
      <ThreeCanvas width={width} height={height}>
        <color attach="background" args={[theme.bg]} />
        <fog attach="fog" args={[theme.bg, 8, 26]} />
        <CameraRig position={[0, 0.8, camZ]} lookAt={[0, 0.4, 0]} />
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 4, 5]} intensity={60} color={theme.blue} />
        <pointLight position={[0, 0, 3]} intensity={25 * cubeScale} color={theme.green} />

        {merge < 1 &&
          screens.map((s, i) => (
            <Screen
              key={i}
              seed={s.seed}
              frame={frame}
              position={[s.from[0] * (1 - merge), s.from[1] * (1 - merge) + 0.6 * merge, s.from[2] * (1 - merge)]}
              rotationY={s.rot * (1 - merge) + merge * Math.PI}
              scale={1 - merge}
            />
          ))}

        <group position={[0, 0.6, 0]}>
          <StrategyCube frame={frame} scale={cubeScale} />
          {[0, 1, 2, 3].map((i) => {
            const a = frame * 0.03 + (i * Math.PI) / 2;
            const r = 2.6 * orbit;
            return (
              <Gear
                key={i}
                color={i % 2 ? theme.green : theme.blue}
                radius={0.35}
                rotation={frame * (i % 2 ? 0.08 : -0.08)}
                position={[Math.cos(a) * r, Math.sin(a * 1.3) * 0.6, Math.sin(a) * r]}
              />
            );
          })}
          {/* orbiting "code" lines */}
          {Array.from({ length: 10 }).map((_, i) => {
            const a = -frame * 0.04 + (i / 10) * Math.PI * 2;
            const r = 3.2 * orbit;
            return (
              <mesh key={i} position={[Math.cos(a) * r, -0.9 + (i % 3) * 0.9, Math.sin(a) * r]}>
                <boxGeometry args={[0.6 + (i % 3) * 0.3, 0.05, 0.05]} />
                <meshBasicMaterial color={i % 2 ? theme.green : theme.blue} />
              </mesh>
            );
          })}
        </group>

        <Candles count={30} trend="up" seed="solution" stagger={2} delay={70} spacing={0.6} position={[0, -0.5, -12]} glow={0.9} />
      </ThreeCanvas>
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 90 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 30 }}>
          <Headline delay={60} size={80}>Your strategy</Headline>
          <Headline delay={80} size={80} color={theme.green}>→</Headline>
          <Headline delay={95} size={80} color={theme.green}>fully automated</Headline>
        </div>
        <Headline delay={125} size={40} weight={500} color={theme.muted} style={{ marginTop: 16 }}>
          A system that follows your rules — every time.
        </Headline>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
