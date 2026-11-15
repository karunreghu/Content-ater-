import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraRig } from "../components/CameraRig";
import { Clock } from "../components/Clock";
import { Headline } from "../components/Headline";
import { sceneFade } from "../components/helpers";
import { theme } from "../theme";

/** A floating monitor showing a choppy red chart that flickers. */
export const Screen: React.FC<{
  position: [number, number, number];
  rotationY: number;
  seed: string;
  frame: number;
  scale?: number;
}> = ({ position, rotationY, seed, frame, scale = 1 }) => {
  const bars = 14;
  const flicker = 0.6 + 0.4 * Math.abs(Math.sin(frame * 0.9 + random(seed) * 10));
  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      <mesh>
        <boxGeometry args={[3.2, 2, 0.12]} />
        <meshStandardMaterial color="#0d1b3d" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.065]}>
        <planeGeometry args={[3, 1.8]} />
        <meshBasicMaterial color="#071026" />
      </mesh>
      {Array.from({ length: bars }).map((_, i) => {
        const h = 0.2 + random(`${seed}-${i}-${Math.floor(frame / 4)}`) * 1.2;
        const red = random(`${seed}-c-${i}`) > 0.35;
        const c = red ? theme.red : theme.green;
        return (
          <mesh key={i} position={[-1.3 + i * 0.2, -0.8 + h / 2, 0.08]}>
            <planeGeometry args={[0.12, h]} />
            <meshBasicMaterial color={c} transparent opacity={flicker} />
          </mesh>
        );
      })}
    </group>
  );
};

const Alert: React.FC<{ position: [number, number, number]; frame: number; phase: number }> = ({
  position,
  frame,
  phase,
}) => {
  const pulse = 1 + 0.25 * Math.sin(frame * 0.35 + phase);
  return (
    <group position={position} scale={pulse} rotation={[0, frame * 0.05 + phase, 0]}>
      <mesh>
        <octahedronGeometry args={[0.35]} />
        <meshStandardMaterial color={theme.red} emissive={theme.red} emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
};

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const wobble = Math.sin(frame * 0.25) * 0.12;
  const appear = (i: number) => spring({ frame: frame - i * 8, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ opacity: sceneFade(frame, durationInFrames) }}>
      <ThreeCanvas width={width} height={height}>
        <color attach="background" args={[theme.bg]} />
        <CameraRig position={[wobble, 0.4 + wobble * 0.5, 9]} lookAt={[0, 0.3, 0]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 3, 5]} intensity={40} color={theme.red} />
        <pointLight position={[-5, 2, 3]} intensity={30} color={theme.blue} />
        <Screen position={[-4.2, 0.6, -1]} rotationY={0.45} seed="s1" frame={frame} scale={appear(0)} />
        <Screen position={[0, -0.3, -2.2]} rotationY={0} seed="s2" frame={frame} scale={appear(1)} />
        <Screen position={[4.2, 0.6, -1]} rotationY={-0.45} seed="s3" frame={frame} scale={appear(2)} />
        <Clock t={frame * 0.15} position={[0, 2.4, 0]} scale={0.8 * appear(3)} color={theme.red} />
        <Alert position={[-2.4, 2.5, 0.5]} frame={frame} phase={0} />
        <Alert position={[2.5, 2.2, 0.8]} frame={frame} phase={2} />
        <Alert position={[-4.6, 2.6, 0.5]} frame={frame} phase={4} />
      </ThreeCanvas>
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 90 }}>
        <div style={{ display: "flex", gap: 40 }}>
          <Headline delay={20} size={62} color={theme.red}>Missed entries.</Headline>
          <Headline delay={45} size={62} color={theme.red}>Late exits.</Headline>
          <Headline delay={70} size={62} color={theme.red}>Emotional trades.</Headline>
        </div>
        <Headline delay={105} size={40} weight={500} color={theme.muted} style={{ marginTop: 16 }}>
          Watching charts all day is exhausting.
        </Headline>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
