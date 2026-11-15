import { interpolate } from "remotion";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Opacity that fades in at the start and out at the end of a scene. */
export const sceneFade = (frame: number, duration: number, fadeLen = 12) =>
  interpolate(frame, [0, fadeLen, duration - fadeLen, duration], [0, 1, 1, 0], clamp);
