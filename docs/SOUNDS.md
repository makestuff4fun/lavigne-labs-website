# Sounds

`lib/sfx.ts` is a tiny Web Audio engine. The games now use the **real recorded
device sound effects** (from the WT588F voice chip), in `public/games/sfx/*.mp3`.
The in-code synth voices remain as a **fallback** for any event not mapped to a
sample.

## How it works

- Browsers block audio until a user gesture, so the games call `sfx.unlock()`
  from their first keydown/pointer handler.
- `sfx.play(name)` triggers an effect. A **mute toggle** (`components/SoundToggle.tsx`)
  flips `sfx.toggle()`; the state persists in `localStorage`. Freezing Fortress also
  has an in-menu **volume** (0–5) via `sfx.setVolume`.
- Each game registers its real samples on mount with `sfx.useSamples({...})` (see
  the `useEffect` in `Shiverwing.tsx` / `FreezingFortress.tsx`). A registered
  buffer overrides the synth for that name automatically.

### Effect → event → sample map

| Effect | Event | Real sample (`public/games/sfx/`) |
|---|---|---|
| `flap` | Shiverwing: every flap (incl. the start press) | `move_dragon.mp3` (id 7) |
| `score` | Shiverwing: pipe passed | `bell.mp3` (id 12) ⚠️ |
| `crash` | Shiverwing: death | `spare_cymbal.mp3` (id 3) |
| `move` | Freezing Fortress: step | `move_dragon.mp3` (id 7) |
| `push` | FF: push a cube onto floor | `push_ice.mp3` (id 4) |
| `iceFire` | FF: push a cube into a fire pit | `ice_cube_fire.mp3` (id 9) |
| `levelStart` | FF: new level | `level_start.mp3` (id 14) |
| `levelComplete` | FF: level solved | `level_complete.mp3` (id 13) |
| `button` | FF: menu navigation | `menu_up.mp3` (id 2) |

⚠️ **`score`**: the badge firmware plays *no* sound on passing a pipe (it only
fires `move_dragon` on flap and `cymbal` on crash). `bell.mp3` is a chosen
point-cue, not original — set `score` to silence it if you want it badge-faithful.

## The full sample set

All 18 device effects are extracted to `public/games/sfx/` (from the recorded
`shiverwing-mp3.zip` — WAVs also exist in `shiverwing-wav.zip`; MP3 is used for the
smaller web download). Names: `wall_drop`, `menu_up`, `spare_cymbal`, `push_ice`,
`button_click`, `fire_pit_drop`, `move_dragon`, `ice_cube_drop`, `ice_cube_fire`,
`power_off`, `pew`, `bell`, `level_complete`, `level_start`, `power_on`,
`show_score`, `great_score`, `perfect_score`. The unmapped ones (e.g. the score
tallies, power on/off, boot chime) are available to wire up later — register them
with another `sfx.useSamples({...})` entry; no engine changes needed.

> The WT588F `.bin` itself is obfuscated (a known-plaintext probe showed the byte
> stream doesn't preserve the input's time structure), so these come from the
> recovered source recordings, not a `.bin` decode.
