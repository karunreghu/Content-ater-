import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

/** Slow orbiting camera driven by the Remotion frame. */
export const Camera: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const camera = useThree((s) => s.camera);

  const angle = interpolate(frame, [0, durationInFrames], [-0.6, 0.6]);
  const radius = interpolate(frame, [0, durationInFrames], [7, 5.5]);

  useEffect(() => {
    camera.position.set(Math.sin(angle) * radius, 1.2, Math.cos(angle) * radius);
    camera.lookAt(0, 0, 0);
  }, [camera, angle, radius]);

  return null;
};
