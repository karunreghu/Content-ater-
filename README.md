# Content-ater

3D animation videos built with **three.js** (via React Three Fiber) and **Remotion** (timeline, animation, audio and MP4 rendering).

## Quick start

```bash
npm install
npm run dev            # opens Remotion Studio: live preview, scrubbing, props editor
npm run render         # renders out/hello-three.mp4 (with audio)
npm run render:still   # renders out/thumbnail.png at frame 60
```

On a machine without a GPU (servers, CI), render with `--gl=swangle`:

```bash
npx remotion render HelloThree out/video.mp4 --gl=swangle
```

## Project layout

```
remotion.config.ts        Render settings (OpenGL backend, image format)
public/music.mp3          Placeholder soundtrack — swap in your own audio
src/index.ts              Entry point (registerRoot)
src/Root.tsx              Registers compositions (id, size, fps, duration)
src/scenes/HelloThree.tsx Example video: 3D canvas + text overlay + audio
src/scenes/Camera.tsx     Frame-driven orbiting camera
src/scenes/SpinningKnot.tsx Animated 3D mesh
src/scenes/Title.tsx      2D HTML/CSS overlay on top of the 3D scene
```

## Rules for 3D in Remotion

1. **Drive all motion from `useCurrentFrame()`**, never from `useFrame()`'s clock or `Date.now()`. Remotion renders frames out of order and in parallel, so time-based animation will flicker or desync.
2. Use `<ThreeCanvas>` from `@remotion/three` instead of R3F's `<Canvas>`. It passes the Remotion context into the 3D tree.
3. Use `interpolate()` and `spring()` for easing; both work inside the 3D scene too.
4. Load assets (GLTF models, textures, audio) from `public/` with `staticFile("name.ext")`. Wrap async loads with `delayRender()`/`continueRender()` or use `<Suspense>` so frames wait for them.
5. `@react-three/drei` is installed for helpers (`useGLTF`, `Text3D`, `Environment`, etc.). Avoid drei helpers that animate on their own clock (`Float`, `OrbitControls` auto-rotate) unless you drive them from the frame.

## Adding a new video

1. Create `src/scenes/MyVideo.tsx`.
2. Register it in `src/Root.tsx` with a `<Composition id="MyVideo" ... />`.
3. Render it with `npx remotion render MyVideo out/my-video.mp4`.

## Audio

Use `<Audio src={staticFile("track.mp3")} />` anywhere in the composition. Use `<Sequence from={frame}>` to start a sound at a specific moment, and pass `volume` as a function of the frame for fades. `@remotion/media-utils` is installed for audio visualisation (`useAudioData`, `visualizeAudio`), so you can make 3D objects react to the music.

## Videos

| Composition | Length | Render |
|---|---|---|
| `HelloThree` | 8s | `npm run render` |
| `TraderswallePromo` | 30s | `npm run render:traderswalle` |

`TraderswallePromo` follows `scripts/traderswalle-promo.md`. Its brand name, tagline and end-card text are props (`brand`, `tagline`, `contact`), so you can edit them in Remotion Studio's props panel. Scene timings live in `src/traderswalle/theme.ts`. The music and whoosh in `public/traderswalle/` are generated placeholders.
