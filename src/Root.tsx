import { Composition } from "remotion";
import { HelloThree, helloThreeSchema } from "./scenes/HelloThree";

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
    </>
  );
};
