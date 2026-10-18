#!/usr/bin/env python3
"""Fail the export if the old domain lavignelabs.com is still referenced in out/.

The canonical site is https://lavignelabs.net (since 2026-10-18). Every absolute
URL, email and host must come from site.url / site.email / formsEndpoint.
Allowed mentions of the old domain:
  * the Organization JSON-LD "sameAs": ["https://lavignelabs.com"] (the "formerly");
  * Wayback Machine URLs that embed it (web.archive.org/web/<ts>id_/https://lavignelabs.com/...),
    which are archive.org URLs, not links to the old host.
Usage: check-domain.py [out-dir]   (default: out)
"""
import os, re, sys

root = sys.argv[1] if len(sys.argv) > 1 else "out"
TEXT = (".html", ".txt", ".xml", ".json", ".md", ".js", ".rsc", ".webmanifest", ".css", ".yaml")
hit = re.compile(r"lavignelabs\.com", re.I)
allowed = [
    re.compile(r'\\*"sameAs\\*":\s*\[\s*\\*"https://lavignelabs\.com\\*"\s*\]'),
    re.compile(r"web\.archive\.org/web/\d+(?:[a-z]{2}_)?/https?://(?:www\.)?lavignelabs\.com[^\s\"'<>)\\]*", re.I),
]
bad = 0
files = 0
for dp, _, fns in os.walk(root):
    for fn in fns:
        if not fn.endswith(TEXT):
            continue
        p = os.path.join(dp, fn)
        files += 1
        s = open(p, encoding="utf8", errors="replace").read()
        if not hit.search(s):
            continue
        for a in allowed:
            s = a.sub("", s)
        for m in hit.finditer(s):
            bad += 1
            if bad <= 20:
                print(f"OLD DOMAIN in {p}: ...{s[max(0, m.start() - 60):m.end() + 40]!r}...")
if bad:
    print(f"FAIL: {bad} reference(s) to lavignelabs.com in {root}/ (canonical is lavignelabs.net)")
    sys.exit(1)
print(f"domain check: {files} text files, no lavignelabs.com outside sameAs/archive URLs")
