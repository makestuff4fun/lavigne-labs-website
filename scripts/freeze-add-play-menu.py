#!/usr/bin/env python3
"""
Post-process the WordPress static freeze: add a "Play" item to the nav menu
(both the desktop and mobile menus) linking to the games at /play.

The freeze (made with Simply Static) is a deploy artifact that lives OUTSIDE the
repo — see docs/DEPLOYMENT.md. Its nav is hand-built HTML repeated on every page,
so this injects the same <li> before the "Contact" item on all of them. The games
are deployed into the same public_html (apex /play), so the link is root-relative.

Usage:
    python3 scripts/freeze-add-play-menu.py [src.zip] [out.zip] [play-url]

Defaults: lavigne-labs-static-slim.zip -> lavigne-site-flat.zip, /play/
Idempotent: pages that already link to the play URL are left untouched.
"""
import sys
import zipfile

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
    print(f"Injected Play menu link into {edited} HTML page(s) -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
