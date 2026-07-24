# Games

> **All paths here are relative to `web/`** (e.g. `components/games/…` is
> `web/components/games/…`).

Two of Brian's hardware side-projects, ported to the browser as faithful
reproductions (not reimaginings). Both are canvas-based client components.

## Shiverwing — `components/games/Shiverwing.tsx`

A 1:1 browser port of the Flappy-Bird game from the ESP32 badge firmware
(`bc_shiverwing_lcd8_te.ino`).

- **240×320 playfield**, physics constants lifted from the firmware (gravity
  `0.125`, flap `-3.0`, pipe speed `2`, gap `90`, 140 px spacing, floor at 270).
- **Real sprites** in `public/games/shiverwing/` were extracted from the firmware
  `.h` files (byte-swapped RGB565 → PNG, sky-blue `0xa69c` keyed to transparent;
  the text/UI graphics also had a leftover magenta chroma-key halo removed).
- 4-frame flap (up→mid→dn→mid), parallax sky/mountains/lava, pixel-accurate
  collision against the bird's opaque pixels, one-shot shimmer on each move, the
  real bitmap fonts, and the attract → play → game-over flow with the firmware's
  timings. (The badge's "Hi, I'm Brian" trade-show splash is omitted.)
- 60 fps fixed timestep; best score in `localStorage`.

## Freezing Fortress — `components/games/FreezingFortress.tsx`

A 1:1 port of the 14×10 addressable-LED Sokoban (`Software/Holtek/ff_500_levels`).

- It's a **generic Sokoban engine** fed an external level file
  (`public/games/freezing-fortress/levels.txt`, standard `.xsb`), so any of the
  ~500 real levels can be dropped in. Ships the first 100 solvable ones.
- Tiles match the firmware: empty · wall · **pit (goal)** · **cube (box)** ·
  dragon · cube-on-pit · dragon-on-pit. Push every ice cube into a fire pit.
- Renders as the real device: each cell a **diffused square LED** (brighter
  centre), glowing on black, seated in the real **snowflake bezel**
  (`bezel.png`, extracted from the case artwork PDF with the cutout keyed out).
- Exact colours + animations (fire flicker, cube-melt, dragon shimmer, level
  digit readout) live in `components/games/ffData.ts`, extracted from
  `colors.h` / `animation_colors.h` / `digits.h` (LED values ×8 to full brightness).
- On-screen D-pad + A/B + keyboard; undo/reset/level nav; progress in `localStorage`.

### Adding levels

Append to `public/games/freezing-fortress/levels.txt`:

```
;Level 101
########
#.  $@ #
########
```

Legend: `#` wall · ` ` floor · `.` pit/goal · `$` ice cube · `@` dragon ·
`*` cube-on-pit · `+` dragon-on-pit. The engine validates one player and
boxes == goals.

## Sound

Both games trigger effects via `lib/sfx.ts` — see [SOUNDS.md](SOUNDS.md).

## Where the original assets came from

Sprites, levels, colours, and the bezel were extracted from Brian's firmware /
hardware project files (the ESP32 badge repo and the Holtek Freezing Fortress
project). The extraction one-offs aren't committed; the **outputs** live in
`public/games/` and `components/games/ffData.ts`.
