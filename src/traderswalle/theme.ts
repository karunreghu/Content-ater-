export const theme = {
  bg: "#050b1f",
  navy: "#0a1636",
  green: "#22ff88",
  red: "#ff3b5c",
  blue: "#2f8cff",
  white: "#ffffff",
  muted: "#8ea3c7",
  font: "Inter, 'Segoe UI', system-ui, sans-serif",
};

export const FPS = 30;

/** Scene timings in frames (30 fps), matching scripts/traderswalle-promo.md */
export const SCENES = {
  hook: { from: 0, duration: 150 },
  problem: { from: 150, duration: 180 },
  solution: { from: 330, duration: 210 },
  benefits: { from: 540, duration: 210 },
  cta: { from: 750, duration: 150 },
} as const;

export const TOTAL_FRAMES = 900;
