#!/usr/bin/env bash
# usage: scripts/shoot-all.sh <baseUrl> <outDir>   (site must already be served)
cd "$(dirname "$0")/.."
node scripts/shoot.mjs "$1" "$2" home=/ work-index=/work/ \
  work-microscope-slider=/work/microscope-slider/ work-camera-arm=/work/camera-arm/ \
  article-fast-prototyping-china=/articles/fast-prototyping-china/ \
  article-lowest-cost-manufacturing-china=/articles/lowest-cost-manufacturing-china/ \
  charts=/tools/charts/cheat-sheet/
# shrink: palette-quantise so each PNG stays small
python3 - "$2" <<'PY'
import sys,glob
from PIL import Image
for f in glob.glob(sys.argv[1]+'/*.png'):
    im=Image.open(f).convert('RGB')
    if im.height>6000:
        im=im.crop((0,0,im.width,6000))
    im.quantize(128,dither=Image.FLOYDSTEINBERG).save(f,optimize=True)
PY
