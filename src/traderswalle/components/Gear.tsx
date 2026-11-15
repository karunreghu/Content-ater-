export const Gear: React.FC<{
  radius?: number;
  teeth?: number;
  color: string;
  rotation?: number;
  position?: [number, number, number];
}> = ({ radius = 0.5, teeth = 10, color, rotation = 0, position = [0, 0, 0] }) => (
  <group position={position} rotation={[0, 0, rotation]}>
    <mesh>
      <torusGeometry args={[radius, radius * 0.22, 12, 48]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} metalness={0.7} roughness={0.25} />
    </mesh>
    {Array.from({ length: teeth }).map((_, i) => {
      const a = (i / teeth) * Math.PI * 2;
      const r = radius * 1.25;
      return (
        <mesh key={i} position={[Math.cos(a) * r, Math.sin(a) * r, 0]} rotation={[0, 0, a]}>
          <boxGeometry args={[radius * 0.32, radius * 0.24, radius * 0.3]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} metalness={0.7} roughness={0.25} />
        </mesh>
      );
    })}
  </group>
);
