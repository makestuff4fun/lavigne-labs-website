#!/usr/bin/env python3
"""Decode QR Time Sync footage into a frame -> wall-clock mapping.

Scan a video in which the QR Time Sync screen was filmed. Every frame with a
readable QR code yields (frame_index, video_time_s, epoch_ms). A robust linear
fit of epoch_ms against video time then gives the mapping for *every* frame:

    epoch_ms(t) = slope * video_ms(t) + offset

Run it on each camera's footage; subtracting two cameras' fits aligns their
timelines. If you showed the QR screen at both the start and end of a long
recording, the slope also captures clock drift between camera and phone.

Requires: opencv-python, numpy.

Usage:
    python3 decode_sync.py VIDEO.mp4 [-o detections.csv] [--step N] [--roi x,y,w,h]
"""
import argparse
import csv
import sys

import cv2
import numpy as np


def parse_roi(s):
    x, y, w, h = (int(v) for v in s.split(","))
    return x, y, w, h


def scan(path, step=1, roi=None, verbose=True):
    cap = cv2.VideoCapture(path)
    if not cap.isOpened():
        sys.exit(f"error: cannot open {path}")
    fps = cap.get(cv2.CAP_PROP_FPS) or 0.0
    n_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    det = cv2.QRCodeDetector()
    rows = []
    idx = -1
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        idx += 1
        if idx % step:
            continue
        # Millisecond position as reported by the container; fall back to fps.
        t_ms = cap.get(cv2.CAP_PROP_POS_MSEC)
        if t_ms <= 0 and fps > 0:
            t_ms = idx * 1000.0 / fps
        if roi:
            x, y, w, h = roi
            frame = frame[y : y + h, x : x + w]
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        data, _, _ = det.detectAndDecode(gray)
        if not data:
            # Second attempt on an upscaled, contrast-stretched image helps
            # small/dim codes.
            g2 = cv2.normalize(gray, None, 0, 255, cv2.NORM_MINMAX)
            g2 = cv2.resize(g2, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
            data, _, _ = det.detectAndDecode(g2)
        if data and data.isdigit() and 10 <= len(data) <= 17:
            rows.append((idx, t_ms / 1000.0, int(data)))
            if verbose and len(rows) % 25 == 1:
                print(f"  frame {idx}: {data}")
    cap.release()
    return rows, fps, n_frames


def robust_fit(rows):
    """Theil–Sen style fit of epoch_ms vs video_ms, robust to misdecodes."""
    v = np.array([r[1] * 1000.0 for r in rows])
    e = np.array([float(r[2]) for r in rows])
    if len(rows) < 2:
        return None
    # Pairwise slopes over a subsample cap to stay O(n^2) small.
    n = len(rows)
    ii, jj = np.triu_indices(n, k=1)
    if len(ii) > 200_000:
        sel = np.random.default_rng(0).choice(len(ii), 200_000, replace=False)
        ii, jj = ii[sel], jj[sel]
    dv = v[jj] - v[ii]
    keep = np.abs(dv) > 1e-6
    slopes = (e[jj] - e[ii])[keep] / dv[keep]
    slope = float(np.median(slopes))
    offset = float(np.median(e - slope * v))
    resid = e - (slope * v + offset)
    return slope, offset, resid


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("video")
    ap.add_argument("-o", "--output", default=None, help="CSV of detections (default: VIDEO.sync.csv)")
    ap.add_argument("--step", type=int, default=1, help="process every Nth frame (default 1)")
    ap.add_argument("--roi", type=parse_roi, default=None, metavar="x,y,w,h", help="crop region containing the screen")
    args = ap.parse_args()

    out = args.output or (args.video.rsplit(".", 1)[0] + ".sync.csv")
    print(f"scanning {args.video} ...")
    rows, fps, n_frames = scan(args.video, step=args.step, roi=args.roi)
    print(f"decoded QR in {len(rows)} / {n_frames} frames (video fps: {fps:.3f})")
    if not rows:
        sys.exit("no QR codes decoded — try filming closer / larger QR size / higher shutter speed")

    with open(out, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["frame_index", "video_time_s", "epoch_ms"])
        w.writerows(rows)
    print(f"wrote {out}")

    fit = robust_fit(rows)
    if fit:
        slope, offset, resid = fit
        inliers = np.abs(resid) < 50  # ms
        print("\nlinear fit  epoch_ms = slope * video_ms + offset")
        print(f"  slope   : {slope:.9f}  (drift {1e6 * (slope - 1):+.1f} ppm)")
        print(f"  offset  : {offset:.1f} ms   (epoch time at video 0:00)")
        print(f"  inliers : {int(inliers.sum())}/{len(resid)}  residual RMS {np.sqrt(np.mean(resid[inliers] ** 2)):.2f} ms")
        print("\nvideo frame N maps to wall clock: slope * (N/fps*1000) + offset")
    else:
        print("only one detection — need at least two frames for a fit")


if __name__ == "__main__":
    main()
