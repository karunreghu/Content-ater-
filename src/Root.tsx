import { Composition } from "remotion";
import { HelloThree, helloThreeSchema } from "./scenes/HelloThree";
import { TraderswallePromo, traderswalleDefaults } from "./traderswalle/TraderswallePromo";
import { TOTAL_FRAMES } from "./traderswalle/theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloThree"
        component={HelloThree}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={helloThreeSchema}
      />
      <Composition
        id="TraderswallePromo"
        component={TraderswallePromo}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={traderswalleDefaults}
      />
    </>
  );
};
