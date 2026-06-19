# Sounds

`lib/sfx.ts` is a tiny Web Audio engine. The effects are **synthesized in code**
(no asset files) as placeholders, and are built to be swapped for the real
Freezing Fortress clips later.

## How it works

- Browsers block audio until a user gesture, so the games call `sfx.unlock()`
  from their first keydown/pointer handler.
- `sfx.play(name)` triggers an effect. A **mute toggle** (`components/SoundToggle.tsx`)
  flips `sfx.toggle()`; the state persists in `localStorage`.

### Effect → event map

| Effect | Shiverwing | Freezing Fortress |
|---|---|---|
| `flap` | every flap | — |
| `score` | pipe passed | — |
| `crash` | death | — |
| `move` | — | step |
| `push` | — | push a cube onto floor |
| `iceFire` | — | push a cube into a fire pit |
| `levelStart` | — | new level |
| `levelComplete` | — | level solved |

## Swapping in the real audio

The real effects are compiled into a WT588F voice-chip `.bin` whose audio is
obfuscated (a known-plaintext probe confirmed the byte stream doesn't preserve
the input's time structure), so it isn't practically decodable. Recover the
original WAVs (the Waytronic cloud project / source files) instead, then:

1. Put the files in `public/games/sfx/` (any format Web Audio can decode).
2. Register them once at startup — e.g. in a game's mount effect:

```ts
import { sfx } from "@/lib/sfx";

sfx.useSamples({
  move:          "/games/sfx/move_dragon.mp3",
  push:          "/games/sfx/push_ice_cube.mp3",
  iceFire:       "/games/sfx/ice_cube_over_fire.mp3",
  levelStart:    "/games/sfx/level_start.mp3",
  levelComplete: "/games/sfx/level_complete.mp3",
  flap:          "/games/sfx/move_dragon.mp3",
  score:         "/games/sfx/bell.mp3",
  crash:         "/games/sfx/cymbal.mp3",
});
```

Registered buffers override the synth for those names automatically — no game
code changes. The 18 firmware effect names (for reference): wall drop, menu up,
cymbal, push ice cube, button click, fire-pit drop, move dragon, ice-cube drop,
ice-cube-over-fire, power off, pew, bell, level-complete, level-start, power-on,
show score, great score, perfect score.
