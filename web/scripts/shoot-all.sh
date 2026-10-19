#!/usr/bin/env bash
# usage: scripts/shoot-all.sh <baseUrl> <outDir>   (site must already be served)
cd "$(dirname "$0")/.."
node scripts/shoot.mjs "$1" "$2" home=/ work-index=/work/ \
  work-microscope-slider=/work/microscope-slider/ work-camera-arm=/work/camera-arm/ \
  article-fast-prototyping-china=/articles/fast-prototyping-china/ \
  article-lowest-cost-manufacturing-china=/articles/lowest-cost-manufacturing-china/ \
  article-designing-moldable-parts=/articles/designing-moldable-parts/ article-taobao-factory-sourcing=/articles/taobao-factory-sourcing/ \
  article-vetting-a-factory=/articles/vetting-a-factory/ \
  charts=/tools/charts/cheat-sheet/ faq=/faq/ contact=/contact/ tools=/tools/ articles=/articles/
# shrink: palette-quantise so each PNG stays small
python3 - "$2" <<'PY'
import sys,glob
from PIL import Image
for f in glob.glob(sys.argv[1]+'/*.png'):
    im=Image.open(f).convert('RGB')
    if im.height>6000:
        im=im.crop((0,0,im.width,6000))
    if im.width>900:
        im=im.resize((900,round(im.height*900/im.width)),Image.LANCZOS)
    im.quantize(64,dither=Image.FLOYDSTEINBERG).save(f,optimize=True)
PY
