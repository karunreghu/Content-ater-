import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// WebGL needs a GPU-capable backend when rendering headless.
// "angle" works on most machines; use "swangle" on servers without a GPU.
Config.setChromiumOpenGlRenderer("angle");
