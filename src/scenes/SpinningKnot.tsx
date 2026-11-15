import { useCurrentFrame, useVideoConfig } from "remotion";

export const SpinningKnot: React.FC<{ color: string; scale: number }> = ({
  color,
  scale,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <mesh
      castShadow
      scale={scale}
      position={[0, Math.sin(t * 2) * 0.2, 0]}
      rotation={[t * 0.6, t * 0.9, 0]}
    >
      <torusKnotGeometry args={[1, 0.32, 256, 48]} />
      <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
    </mesh>
  );
};
