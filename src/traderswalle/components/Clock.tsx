import { theme } from "../theme";

/** Simple 3D clock. `t` is a time value driving the hands (radians-ish). */
export const Clock: React.FC<{
  t: number;
  color?: string;
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}> = ({ t, color = theme.blue, position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) => {
  return (
    <group position={position} scale={scale} rotation={rotation}>
      <mesh>
        <torusGeometry args={[1, 0.09, 24, 96]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 0, -0.05]}>
        <circleGeometry args={[0.95, 64]} />
        <meshStandardMaterial color={theme.navy} transparent opacity={0.85} />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.sin(a) * 0.78, Math.cos(a) * 0.78, 0]} rotation={[0, 0, -a]}>
            <boxGeometry args={[0.05, 0.14, 0.04]} />
            <meshBasicMaterial color={theme.white} />
          </mesh>
        );
      })}
      {/* minute hand */}
      <group rotation={[0, 0, -t * 12]}>
        <mesh position={[0, 0.32, 0.03]}>
          <boxGeometry args={[0.06, 0.64, 0.04]} />
          <meshBasicMaterial color={theme.white} />
        </mesh>
      </group>
      {/* hour hand */}
      <group rotation={[0, 0, -t]}>
        <mesh position={[0, 0.2, 0.05]}>
          <boxGeometry args={[0.09, 0.42, 0.04]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
      <mesh position={[0, 0, 0.08]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color={theme.white} />
      </mesh>
    </group>
  );
};
