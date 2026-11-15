import { ThreeCanvas } from "@remotion/three";
import { useLayoutEffect, useMemo, useRef } from "react";
import { Color, InstancedMesh, Object3D } from "three";
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraRig } from "../components/CameraRig";
import { clamp } from "../components/helpers";
import { theme } from "../theme";

const COUNT = 600;

/** Particles collapse to the centre, then burst into a ring framing the logo. */
const ParticleBurst: React.FC<{ frame: number }> = ({ frame }) => {
  const ref = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const data = useMemo(
    () =>
      Array.from({ length: COUNT }).map((_, i) => {
        const a = random(`a${i}`) * Math.PI * 2;
        const b = random(`b${i}`) * Math.PI - Math.PI / 2;
        const far = 9 + random(`f${i}`) * 6;
        const ring = 4.2 + (random(`r${i}`) - 0.5) * 1.6;
        const ringA = (i / COUNT) * Math.PI * 2;
        return {
          start: [Math.cos(a) * Math.cos(b) * far, Math.sin(b) * far * 0.6, Math.sin(a) * Math.cos(b) * far - 3],
          end: [Math.cos(ringA) * ring * 1.6, Math.sin(ringA) * ring * 0.75, (random(`z${i}`) - 0.5) * 2],
          size: 0.03 + random(`s${i}`) * 0.06,
          green: random(`c${i}`) > 0.5,
        };
      }),
    [],
  );

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const collapse = interpolate(frame, [0, 22], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
    const burst = interpolate(frame, [22, 50], [0, 1], { ...clamp, easing: Easing.out(Easing.exp) });
    const green = new Color(theme.green);
    const blue = new Color(theme.blue);
    data.forEach((p, i) => {
      const k = 1 - collapse;
      const swirl = frame * 0.004;
      let x = p.start[0] * k;
      let y = p.start[1] * k;
      let z = p.start[2] * k;
      if (burst > 0) {
        x = p.end[0] * burst;
        y = p.end[1] * burst;
        z = p.end[2] * burst;
      }
      const c = Math.cos(swirl), s = Math.sin(swirl);
      dummy.position.set(x * c - y * s, x * s + y * c, z);
      const twinkle = 0.7 + 0.5 * Math.sin(frame * 0.3 + i);
      dummy.scale.setScalar(p.size * (burst > 0 ? twinkle : 1) * 10);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, p.green ? green : blue);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [frame, data, dummy]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
};

export const CallToAction: React.FC<{ brand: string; tagline: string; contact: string }> = ({
  brand,
  tagline,
  contact,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const flash = interpolate(frame, [20, 24, 40], [0, 0.9, 0], clamp);
  const logo = spring({ frame: frame - 24, fps, config: { damping: 11, stiffness: 120 } });
  const sweep = interpolate(frame, [50, 85], [-30, 130], clamp);
  const tag = spring({ frame: frame - 55, fps, config: { damping: 16 } });
  const cta = spring({ frame: frame - 75, fps, config: { damping: 14 } });
  const fadeIn = interpolate(frame, [0, 10], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <ThreeCanvas width={width} height={height}>
        <color attach="background" args={[theme.bg]} />
        <CameraRig position={[0, 0, 12]} />
        <ParticleBurst frame={frame} />
      </ThreeCanvas>

      <AbsoluteFill style={{ background: "radial-gradient(circle, rgba(34,255,136,0.9), transparent 60%)", opacity: flash }} />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: theme.font }}>
        <div
          style={{
            fontSize: 170,
            fontWeight: 900,
            letterSpacing: -4,
            transform: `scale(${0.6 + 0.4 * logo}) perspective(800px) rotateX(${(1 - logo) * 50}deg)`,
            opacity: logo,
            backgroundImage: `linear-gradient(100deg, ${theme.green} 0%, ${theme.blue} ${sweep - 15}%, #ffffff ${sweep}%, ${theme.blue} ${sweep + 15}%, ${theme.green} 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: "drop-shadow(0 0 30px rgba(34,255,136,0.45)) drop-shadow(0 10px 0 #0a1a40)",
          }}
        >
          {brand}
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 52,
            fontWeight: 600,
            color: theme.white,
            opacity: tag,
            transform: `translateY(${(1 - tag) * 30}px)`,
          }}
        >
          {tagline}
        </div>
        <div
          style={{
            marginTop: 50,
            padding: "22px 56px",
            borderRadius: 999,
            fontSize: 40,
            fontWeight: 700,
            color: theme.bg,
            background: theme.green,
            boxShadow: `0 0 50px ${theme.green}88`,
            opacity: cta,
            transform: `scale(${0.8 + 0.2 * cta})`,
          }}
        >
          {contact}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
