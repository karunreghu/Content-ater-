import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

/** 2D HTML/CSS overlay composited on top of the 3D canvas. */
export const Title: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [20, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [20, 45], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 110 }}
    >
      <h1
        style={{
          margin: 0,
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 84,
          fontWeight: 800,
          color: "white",
          opacity,
          transform: `translateY(${y}px)`,
          textShadow: "0 8px 30px rgba(0,0,0,0.6)",
        }}
      >
        {text}
      </h1>
    </AbsoluteFill>
  );
};
