import { CSSProperties } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp } from "./helpers";
import { theme } from "../theme";

/** Animated text line (slides up + fades in at `delay`). */
export const Headline: React.FC<{
  children: React.ReactNode;
  delay?: number;
  size?: number;
  color?: string;
  weight?: number;
  style?: CSSProperties;
}> = ({ children, delay = 0, size = 88, color = theme.white, weight = 800, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 16 } });
  const blur = interpolate(s, [0, 1], [12, 0], clamp);
  return (
    <div
      style={{
        fontFamily: theme.font,
        fontSize: size,
        fontWeight: weight,
        color,
        letterSpacing: -1,
        lineHeight: 1.1,
        opacity: s,
        transform: `translateY(${(1 - s) * 40}px)`,
        filter: `blur(${blur}px)`,
        textShadow: "0 6px 30px rgba(0,0,0,0.7)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
