import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { CallToAction } from "./scenes/CallToAction";
import { Benefits } from "./scenes/Benefits";
import { Hook } from "./scenes/Hook";
import { Problem } from "./scenes/Problem";
import { Solution } from "./scenes/Solution";
import { SCENES, TOTAL_FRAMES, theme } from "./theme";

export type TraderswallePromoProps = {
  brand: string;
  tagline: string;
  contact: string;
  music: boolean;
};

export const traderswalleDefaults: TraderswallePromoProps = {
  brand: "traderswalle",
  tagline: "Automate your trading strategy",
  contact: "Get in touch today →",
  music: true,
};

export const TraderswallePromo: React.FC<TraderswallePromoProps> = ({ brand, tagline, contact, music }) => {
  const whooshAt = [SCENES.problem.from, SCENES.solution.from, SCENES.benefits.from, SCENES.cta.from];
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      <Sequence from={SCENES.hook.from} durationInFrames={SCENES.hook.duration} name="1 Hook">
        <Hook />
      </Sequence>
      <Sequence from={SCENES.problem.from} durationInFrames={SCENES.problem.duration} name="2 Problem">
        <Problem />
      </Sequence>
      <Sequence from={SCENES.solution.from} durationInFrames={SCENES.solution.duration} name="3 Solution">
        <Solution />
      </Sequence>
      <Sequence from={SCENES.benefits.from} durationInFrames={SCENES.benefits.duration} name="4 Benefits">
        <Benefits />
      </Sequence>
      <Sequence from={SCENES.cta.from} durationInFrames={SCENES.cta.duration} name="5 CTA">
        <CallToAction brand={brand} tagline={tagline} contact={contact} />
      </Sequence>

      {music ? (
        <>
          <Audio
            src={staticFile("traderswalle/music.mp3")}
            volume={(f) =>
              interpolate(f, [0, 20, TOTAL_FRAMES - 30, TOTAL_FRAMES], [0, 0.7, 0.7, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            }
          />
          {whooshAt.map((f) => (
            <Sequence key={f} from={f - 8} durationInFrames={30}>
              <Audio src={staticFile("traderswalle/whoosh.mp3")} volume={0.5} />
            </Sequence>
          ))}
        </>
      ) : null}
    </AbsoluteFill>
  );
};
