import { ThreeCanvas } from "@remotion/three";
import { useMemo } from "react";
import { Shape } from "three";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraRig } from "../components/CameraRig";
import { Clock } from "../components/Clock";
import { Headline } from "../components/Headline";
import { sceneFade } from "../components/helpers";
import { theme } from "../theme";

const extrude = { depth: 0.35, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 4 };

const Lightning: React.FC = () => {
  const shape = useMemo(() => {
    const s = new Shape();
    s.moveTo(0.25, 1.3);
    s.lineTo(-0.75, -0.1);
    s.lineTo(-0.05, -0.1);
    s.lineTo(-0.35, -1.3);
    s.lineTo(0.75, 0.25);
    s.lineTo(0.05, 0.25);
    s.lineTo(0.25, 1.3);
    return s;
  }, []);
  return (
    <mesh position={[0, 0, -0.17]}>
      <extrudeGeometry args={[shape, extrude]} />
      <meshStandardMaterial color="#ffd23f" emissive="#ffb000" emissiveIntensity={0.7} metalness={0.4} roughness={0.25} />
    </mesh>
  );
};

const ShieldIcon: React.FC = () => {
  const shape = useMemo(() => {
    const s = new Shape();
    s.moveTo(0, 1.25);
    s.bezierCurveTo(0.45, 1.0, 0.8, 1.0, 1.0, 1.0);
    s.bezierCurveTo(1.0, 0.0, 0.8, -0.8, 0, -1.3);
    s.bezierCurveTo(-0.8, -0.8, -1.0, 0.0, -1.0, 1.0);
    s.bezierCurveTo(-0.8, 1.0, -0.45, 1.0, 0, 1.25);
    return s;
  }, []);
  const check = useMemo(() => {
    const s = new Shape();
    s.moveTo(-0.5, 0.05);
    s.lineTo(-0.15, -0.35);
    s.lineTo(0.5, 0.45);
    s.lineTo(0.38, 0.55);
    s.lineTo(-0.15, -0.1);
    s.lineTo(-0.38, 0.17);
    s.lineTo(-0.5, 0.05);
    return s;
  }, []);
  return (
    <group position={[0, 0, -0.17]}>
      <mesh>
        <extrudeGeometry args={[shape, extrude]} />
        <meshStandardMaterial color={theme.blue} emissive={theme.blue} emissiveIntensity={0.5} metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.42]}>
        <extrudeGeometry args={[check, { ...extrude, depth: 0.1 }]} />
        <meshStandardMaterial color={theme.green} emissive={theme.green} emissiveIntensity={1} />
      </mesh>
    </group>
  );
};

const ICON_X = [-4.6, 0, 4.6];

export const Benefits: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const fly = (i: number) => spring({ frame: frame - 10 - i * 40, fps, config: { damping: 13 } });

  const icon = (i: number, node: React.ReactNode) => {
    const s = fly(i);
    const y = interpolate(s, [0, 1], [6, 0.6]);
    const spin = (1 - s) * Math.PI * 2 + Math.sin(frame * 0.05 + i) * 0.35;
    return (
      <group key={i} position={[ICON_X[i], y, 0]} rotation={[0, spin, 0]} scale={s * 1.1}>
        {node}
      </group>
    );
  };

  const labels = [
    { title: "Fast execution", sub: "Orders fire in milliseconds" },
    { title: "Disciplined trading", sub: "Rule-based. No emotions." },
    { title: "Runs 24/7", sub: "Even while you sleep" },
  ];

  return (
    <AbsoluteFill style={{ opacity: sceneFade(frame, durationInFrames) }}>
      <ThreeCanvas width={width} height={height}>
        <color attach="background" args={[theme.bg]} />
        <CameraRig position={[0, 0.6, 11]} lookAt={[0, 0.6, 0]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 6]} intensity={2.5} />
        <pointLight position={[0, -2, 4]} intensity={30} color={theme.green} />
        {icon(0, <Lightning />)}
        {icon(1, <ShieldIcon />)}
        {icon(2, <Clock t={frame * 0.04} color={theme.green} scale={1.15} />)}
        <gridHelper args={[60, 60, "#1b3a7a", "#0f2150"]} position={[0, -2.6, 0]} />
      </ThreeCanvas>
      <AbsoluteFill>
        <Headline delay={0} size={56} style={{ position: "absolute", top: 80, width: "100%", textAlign: "center" }}>
          Why automate with us?
        </Headline>
        {labels.map((l, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 760,
              left: width / 2 + (ICON_X[i] / 4.6) * 600 - 300,
              width: 600,
              textAlign: "center",
            }}
          >
            <Headline delay={30 + i * 40} size={56} color={i === 0 ? "#ffd23f" : i === 1 ? theme.blue : theme.green}>
              {l.title}
            </Headline>
            <Headline delay={40 + i * 40} size={32} weight={500} color={theme.muted} style={{ marginTop: 10 }}>
              {l.sub}
            </Headline>
          </div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
