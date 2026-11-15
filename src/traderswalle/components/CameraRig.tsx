import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

type Vec3 = [number, number, number];

/** Sets the camera each frame. Pass values computed from useCurrentFrame(). */
export const CameraRig: React.FC<{ position: Vec3; lookAt?: Vec3; fov?: number }> = ({
  position,
  lookAt = [0, 0, 0],
  fov = 45,
}) => {
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    camera.position.set(...position);
    camera.lookAt(...lookAt);
    if ("fov" in camera && camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }, [camera, position, lookAt, fov]);
  return null;
};
