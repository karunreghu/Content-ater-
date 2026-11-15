import { random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

type Props = {
  count: number;
  /** "mixed" = choppy market, "up" = steady uptrend */
  trend: "mixed" | "up";
  spacing?: number;
  /** frames between each candle popping up */
  stagger?: number;
  delay?: number;
  seed?: string;
  position?: [number, number, number];
  glow?: number;
};

const buildSeries = (count: number, trend: Props["trend"], seed: string) => {
  const candles: { low: number; high: number; open: number; close: number }[] = [];
  let price = 0;
  for (let i = 0; i < count; i++) {
    const r = random(`${seed}-${i}`);
    const drift = trend === "up" ? 0.22 : 0;
    const move = trend === "up" ? (r - 0.25) * 0.6 + drift : (r - 0.5) * 1.4;
    const open = price;
    const close = price + move;
    const wick = 0.15 + random(`${seed}-w-${i}`) * 0.35;
    candles.push({
      open,
      close,
      low: Math.min(open, close) - wick,
      high: Math.max(open, close) + wick,
    });
    price = close;
  }
  // Recentre vertically around 0
  const min = Math.min(...candles.map((c) => c.low));
  const max = Math.max(...candles.map((c) => c.high));
  const mid = (min + max) / 2;
  return candles.map((c) => ({
    open: c.open - mid,
    close: c.close - mid,
    low: c.low - mid,
    high: c.high - mid,
  }));
};

export const Candles: React.FC<Props> = ({
  count,
  trend,
  spacing = 0.55,
  stagger = 3,
  delay = 0,
  seed = "candles",
  position = [0, 0, 0],
  glow = 0.6,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const series = buildSeries(count, trend, seed);
  const offsetX = ((count - 1) * spacing) / 2;

  return (
    <group position={position}>
      {series.map((c, i) => {
        const s = spring({
          frame: frame - delay - i * stagger,
          fps,
          config: { damping: 12, stiffness: 140 },
        });
        if (s <= 0.001) return null;
        const up = c.close >= c.open;
        const color = up ? theme.green : theme.red;
        const bodyH = Math.max(Math.abs(c.close - c.open), 0.06);
        const bodyY = (c.open + c.close) / 2;
        const wickH = c.high - c.low;
        const wickY = (c.high + c.low) / 2;
        return (
          <group key={i} position={[i * spacing - offsetX, 0, 0]} scale={[1, s, 1]}>
            <mesh position={[0, bodyY, 0]}>
              <boxGeometry args={[spacing * 0.6, bodyH, spacing * 0.6]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={glow}
                metalness={0.3}
                roughness={0.3}
              />
            </mesh>
            <mesh position={[0, wickY, 0]}>
              <boxGeometry args={[0.04, wickH, 0.04]} />
              <meshBasicMaterial color={color} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
