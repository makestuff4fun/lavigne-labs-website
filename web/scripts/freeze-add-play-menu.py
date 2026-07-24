#!/usr/bin/env python3
"""
Post-process the WordPress static freeze for deploy:
  1. add a "Play" item to the nav menu (desktop + mobile) linking to /play
  2. drop a root /favicon.ico (the LL site icon) — Simply Static doesn't emit one,
     so the browser's automatic /favicon.ico probe 404s and the tab icon vanishes.

The freeze (made with Simply Static) is a deploy artifact that lives OUTSIDE the
repo — see docs/DEPLOYMENT.md. Its nav is hand-built HTML repeated on every page,
so the Play link is injected before the "Contact" item on all of them. The games
deploy into the same public_html (apex /play), so the link is root-relative and
the games reuse this same root /favicon.ico.

Usage:
    python3 scripts/freeze-add-play-menu.py [src.zip] [out.zip] [play-url]

Defaults: lavigne-labs-static-slim.zip -> lavigne-site-flat.zip, /play/
Idempotent: pages that already link to the play URL are left untouched.
"""
import os
import sys
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
FAVICON = os.path.join(HERE, "freeze-favicon.ico")  # prebuilt LL multi-size .ico

SRC = sys.argv[1] if len(sys.argv) > 1 else "lavigne-labs-static-slim.zip"
OUT = sys.argv[2] if len(sys.argv) > 2 else "lavigne-site-flat.zip"
URL = sys.argv[3] if len(sys.argv) > 3 else "/play/"

# The Contact <li> we insert before (id is stable across pages; only classes
# change on the active page). Desktop menu uses the "narrow" class; mobile not.
CONTACT_DESKTOP = '<li id="nav-menu-item-1006"'
CONTACT_MOBILE = '<li id="accordion-menu-item-1006"'
PLAY_DESKTOP = (
    '<li id="nav-menu-item-play" class="menu-item menu-item-type-post_type '
    f'menu-item-object-page narrow"><a href="{URL}">Play</a></li>\n'
)
PLAY_MOBILE = (
    '<li id="accordion-menu-item-play" class="menu-item menu-item-type-post_type '
    f'menu-item-object-page"><a href="{URL}">Play</a></li>\n'
)


def main() -> int:
    edited = 0
    with zipfile.ZipFile(SRC) as zin, zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as zout:
        for info in zin.infolist():
            if info.filename == "favicon.ico":
                continue  # replaced below with the LL icon
            data = zin.read(info.filename)
            if info.filename.endswith(".html"):
                html = data.decode("utf-8", "replace")
                if "nav-menu-item-play" not in html:
                    new = html.replace(CONTACT_DESKTOP, PLAY_DESKTOP + CONTACT_DESKTOP)
                    new = new.replace(CONTACT_MOBILE, PLAY_MOBILE + CONTACT_MOBILE)
                    if new != html:
                        edited += 1
                    data = new.encode("utf-8")
            zout.writestr(info, data)
        with open(FAVICON, "rb") as f:
            zout.writestr("favicon.ico", f.read())
    print(f"Injected Play menu link into {edited} HTML page(s); added root favicon.ico -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
