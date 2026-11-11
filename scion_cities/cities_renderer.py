#!/opt/homebrew/bin/python3
"""
SCION — 55-City Hand-Drawn Rough-Construction Multiplane Studio Renderer (`v1.0`).

CRITICAL CRAFT INVARIANTS:
1. Zero static PNG overlays. Every mark across all 7 multiplane depth layers is
   procedurally inked on parchment with clipped parallel cross-hatching, sanguine
   rough-construction lines, and exposure-quantized contour boiling (ones / twos / holds).
2. Performers in all 55 cities are faceless, constant-volume half-filled sack/cloak
   silhouettes (`flour_engine.build_constant_volume_sack`, `area_error <= 0.01%`) whose
   intention, anticipation, recoil, and post-clinamen stance read purely from posture,
   squash/stretch, and hold duration.
3. Every single one of the 55 canonical cities (`01-diomira` .. `55-berenice`) has its
   own unmistakable architectural & material emblem geometry coupled to `CITIES_55`
   and `PhilogynyAccumulator`.
"""
from __future__ import annotations

import json
import math
import os
import subprocess
import sys
from typing import Any, Dict, List, Optional, Tuple

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from PyQt6.QtCore import Qt, QPointF, QRectF
from PyQt6.QtGui import (
    QGuiApplication, QImage, QPainter, QPen, QBrush, QColor,
    QFont, QFontDatabase, QPainterPath, QRadialGradient, QLinearGradient
)

from scion_cities.core.flour_engine import build_constant_volume_sack, quantize_exposure, lerp, smooth
from scion_cities.swarms.catalog_55 import CITIES_55, CityGenomeSpec
from scion_cities.cities_sound import build_city_sound

W, H = 1280, 720
FPS = 24

FILMS_DIR = os.path.join(HERE, "films")
SHEETS_DIR = os.path.join(HERE, "sheets")
TIMING_DIR = os.path.join(HERE, "timing")
AUDIO_DIR = os.path.join(HERE, "audio")
for d in (FILMS_DIR, SHEETS_DIR, TIMING_DIR, AUDIO_DIR):
    os.makedirs(d, exist_ok=True)

C_PAPER       = QColor(241, 233, 216)
C_PAPER_HI    = QColor(250, 245, 234)
C_PAPER_DEEP  = QColor(223, 211, 188)
C_INK         = QColor(28, 24, 20)
C_INK_MID     = QColor(72, 62, 51)
C_INK_FAINT   = QColor(126, 114, 96)
C_SANGUINE    = QColor(158, 71, 42)
C_CRIMSON     = QColor(168, 41, 30)
C_BLUEPRINT   = QColor(40, 75, 99)
C_OCHRE       = QColor(192, 138, 52)
C_EMERALD     = QColor(38, 89, 64)
C_SILVER_WASH = QColor(196, 204, 210, 150)

_APP = None
_FONTS: Dict[str, str] = {}


def init_qt():
    global _APP, _FONTS
    if _APP is not None:
        return
    _APP = QGuiApplication(sys.argv[:1])
    font_dir = os.path.join(ROOT, "studio", "fonts")
    serif_fam, mono_fam = "Georgia", "Menlo"
    if os.path.isdir(font_dir):
        for fn in sorted(os.listdir(font_dir)):
            if fn.endswith(".woff2"):
                fid = QFontDatabase.addApplicationFont(os.path.join(font_dir, fn))
                fams = QFontDatabase.applicationFontFamilies(fid)
                if fams:
                    if "fell" in fn.lower():
                        serif_fam = fams[0]
                    elif "plex" in fn.lower():
                        mono_fam = fams[0]
    _FONTS["serif"] = serif_fam
    _FONTS["mono"] = mono_fam


def get_font(kind="serif", size=14, italic=False, bold=False) -> QFont:
    f = QFont(_FONTS.get(kind, "Georgia"), int(size))
    f.setItalic(italic)
    if bold:
        f.setWeight(QFont.Weight.Bold)
    return f


def hnoise(seed: int, idx: int) -> float:
    x = math.sin(seed * 127.1 + idx * 311.7) * 43758.5453
    return x - math.floor(x)


def rline(p: QPainter, x1: float, y1: float, x2: float, y2: float, seed: int, wobble=1.0, col=C_INK, w=1.6, dashed=False):
    dist = math.hypot(x2 - x1, y2 - y1)
    steps = max(2, min(22, int(dist / 16.0)))
    path = QPainterPath()
    for i in range(steps + 1):
        u = i / float(steps)
        if 0 < i < steps and wobble > 0:
            jx = (hnoise(seed, i * 19 + int(x1)) - 0.5) * 2.0 * wobble
            jy = (hnoise(seed + 5, i * 37 + int(y1)) - 0.5) * 2.0 * wobble
        else:
            jx = jy = 0.0
        px = x1 + (x2 - x1) * u + jx
        py = y1 + (y2 - y1) * u + jy
        if i == 0:
            path.moveTo(QPointF(px, py))
        else:
            path.lineTo(QPointF(px, py))
    pen = QPen(col, w)
    if dashed:
        pen.setStyle(Qt.PenStyle.DashLine)
    p.setPen(pen)
    p.setBrush(Qt.BrushStyle.NoBrush)
    p.drawPath(path)


def engraved_poly(
    p: QPainter,
    pts: List[Tuple[float, float]],
    seed: int,
    fill: QColor = C_PAPER_HI,
    stroke: QColor = C_INK,
    w: float = 1.8,
    hatch_step: float = 7.0,
    hatch_angle_deg: float = 35.0,
    wobble: float = 1.1,
):
    if len(pts) < 3:
        return
    path = QPainterPath()
    xs = [pt[0] for pt in pts]
    ys = [pt[1] for pt in pts]
    for i, (px, py) in enumerate(pts):
        jx = (hnoise(seed, i * 23 + int(px)) - 0.5) * 2.0 * wobble
        jy = (hnoise(seed + 7, i * 41 + int(py)) - 0.5) * 2.0 * wobble
        if i == 0:
            path.moveTo(QPointF(px + jx, py + jy))
        else:
            path.lineTo(QPointF(px + jx, py + jy))
    path.closeSubpath()

    p.save()
    p.setPen(Qt.PenStyle.NoPen)
    p.setBrush(QBrush(fill))
    p.drawPath(path)

    if hatch_step > 0:
        p.save()
        p.setClipPath(path)
        xmin, xmax = min(xs) - 20, max(xs) + 20
        ymin, ymax = min(ys) - 20, max(ys) + 20
        diag = math.hypot(xmax - xmin, ymax - ymin)
        cx, cy = (xmin + xmax) * 0.5, (ymin + ymax) * 0.5
        ang = math.radians(hatch_angle_deg)
        ca, sa = math.cos(ang), math.sin(ang)
        p.setPen(QPen(QColor(28, 24, 20, 62), 0.85))
        d = -diag * 0.6
        while d <= diag * 0.6:
            x1 = cx + d * (-sa) - diag * ca
            y1 = cy + d * ca - diag * sa
            x2 = cx + d * (-sa) + diag * ca
            y2 = cy + d * ca + diag * sa
            p.drawLine(QPointF(x1, y1), QPointF(x2, y2))
            d += hatch_step
        p.restore()

    p.setPen(QPen(stroke, w))
    p.setBrush(Qt.BrushStyle.NoBrush)
    p.drawPath(path)
    p.restore()


def draw_dome(p: QPainter, cx: float, base_y: float, r: float, h: float, seed: int, fill: QColor = C_SILVER_WASH):
    pts = []
    for k in range(13):
        ang = math.pi * (1.0 - k / 12.0)
        pts.append((cx + math.cos(ang) * r, base_y - math.sin(ang) * h))
    pts.append((cx + r, base_y + 18))
    pts.append((cx - r, base_y + 18))
    engraved_poly(p, pts, seed, fill=fill, hatch_step=6.5, hatch_angle_deg=55)
    rline(p, cx, base_y - h, cx, base_y - h - 16, seed, 0.5, C_INK, 1.5)


def draw_tower(p: QPainter, x: float, base_y: float, w: float, h: float, seed: int, fill: QColor = C_PAPER_DEEP, spire=False):
    pts = [(x - w * 0.5, base_y), (x - w * 0.44, base_y - h), (x + w * 0.44, base_y - h), (x + w * 0.5, base_y)]
    engraved_poly(p, pts, seed, fill=fill, hatch_step=7.5, hatch_angle_deg=25)
    if spire:
        spts = [(x - w * 0.46, base_y - h), (x, base_y - h - w * 0.9), (x + w * 0.46, base_y - h)]
        engraved_poly(p, spts, seed + 3, fill=C_OCHRE, hatch_step=5.5, hatch_angle_deg=-35)


def draw_bespoke_city_stage(
    p: QPainter,
    spec: CityGenomeSpec,
    f_idx: int,
    seed: int,
    swerved: bool,
    swerve_u: float,
    ground_y: float,
    cam_x: float,
):
    """
    Renders unique, recognizable multiplane architecture & material emblems for each
    of the 55 canonical cities (`idx = 1..55`), shifting physically on `swerved`!
    """
    idx = spec.index
    px4 = -cam_x * 0.35  # Plane 4 midground parallax
    px3 = -cam_x * 0.65  # Plane 3 primary locus parallax

    # --- SANGUINE CONSTRUCTION HORIZON & PERSPECTIVE RAYS (RAW ANIMATOR DESK MARKS) ---
    rline(p, 0, ground_y, W, ground_y, seed, 0.9, C_INK, 2.2)
    for ray in range(-3, 4):
        rline(p, W * 0.5 + px4 * 0.4, ground_y - 180, W * 0.5 + ray * 240, ground_y + 110, seed + ray, 0.4, QColor(158, 71, 42, 42), 0.8, dashed=True)

    # --- BESPOKE 55-CITY ARCHITECTURAL DISPATCH ---
    if idx == 1:  # Diomira: 60 silver domes + golden cock + igniting multicolored September lamps
        for d_i in range(11):
            dx = 110 + d_i * 102 + px4
            dh = 48 + (d_i % 3) * 22
            draw_dome(p, dx, ground_y - 70, 38, dh, seed + d_i, C_SILVER_WASH)
            draw_tower(p, dx, ground_y, 64, 70, seed + d_i, C_PAPER_DEEP)
        draw_tower(p, 640 + px3, ground_y, 72, 230, seed, C_PAPER_HI, spire=True)
        # Golden weathercock
        p.setBrush(QBrush(C_OCHRE))
        p.setPen(QPen(C_INK, 1.5))
        p.drawEllipse(QPointF(640 + px3, ground_y - 312), 14, 9)
        if swerved:
            cols = [C_CRIMSON, C_OCHRE, C_BLUEPRINT, C_EMERALD]
            for l_i in range(9):
                lx = 180 + l_i * 112 + px3
                ly = ground_y - 105 - (l_i % 2) * 24
                rline(p, lx, ly - 25, lx, ly, seed, 0.5, C_INK, 1.2)
                c = cols[l_i % 4]
                grad = QRadialGradient(QPointF(lx, ly), 36 * swerve_u)
                grad.setColorAt(0, QColor(c.red(), c.green(), c.blue(), 210))
                grad.setColorAt(1, QColor(c.red(), c.green(), c.blue(), 0))
                p.setBrush(QBrush(grad))
                p.setPen(Qt.PenStyle.NoPen)
                p.drawEllipse(QPointF(lx, ly), 36 * swerve_u, 36 * swerve_u)

    elif idx == 2:  # Isidora: Spiral seashell stair-towers + telescopes + old men's bench wall
        for s_i in range(3):
            tx = 250 + s_i * 340 + px4
            draw_tower(p, tx, ground_y, 92, 240, seed + s_i, C_PAPER_HI)
            for step in range(8):
                sy = ground_y - 24 - step * 26
                sx_off = math.sin(step * 0.9 + f_idx * 0.04) * 34
                p.setBrush(QBrush(C_OCHRE))
                p.setPen(QPen(C_INK, 1.3))
                p.drawEllipse(QPointF(tx + sx_off, sy), 12, 7)
        # Brass telescope aimed upward
        rline(p, 490 + px3, ground_y - 52, 575 + px3, ground_y - 135, seed, 0.6, C_BLUEPRINT, 4.0)
        if swerved:
            # Low stone wall of seated elders on right
            engraved_poly(p, [(760 + px3, ground_y), (760 + px3, ground_y - 56), (1140 + px3, ground_y - 56), (1140 + px3, ground_y)], seed, C_PAPER_DEEP, hatch_step=5.0)

    elif idx == 3:  # Dorothea: 4 aluminum towers, 7 spring drawbridges, 4 green canals -> brass banners
        for t_i in range(4):
            tx = 220 + t_i * 265 + px4
            draw_tower(p, tx, ground_y, 76, 250, seed + t_i, C_SILVER_WASH)
            # Green canal strip + drawbridge leaf
            p.fillRect(QRectF(tx - 60, ground_y + 4, 120, 18), QColor(38, 89, 64, 150))
            ang = -0.65 * swerve_u if swerved else -0.15
            rline(p, tx + 38, ground_y - 12, tx + 38 + math.cos(ang) * 78, ground_y - 12 + math.sin(ang) * 78, seed, 0.8, C_INK, 2.8)
            if swerved:
                # Fluttering crimson/ochre desert banners
                bx = tx + 38
                by = ground_y - 250
                bpts = [(bx, by), (bx + 68 + 10 * math.sin(f_idx * 0.25 + t_i), by + 14), (bx, by + 30)]
                engraved_poly(p, bpts, seed + t_i, C_CRIMSON if t_i % 2 == 0 else C_OCHRE, hatch_step=0)

    elif idx == 4:  # Zaira: Stair-streets, zinc roof scales, lamppost & relational scar rulers
        for s_i in range(7):
            sx0 = 120 + s_i * 150 + px4
            sh = 70 + s_i * 24
            engraved_poly(p, [(sx0, ground_y), (sx0, ground_y - sh), (sx0 + 135, ground_y - sh), (sx0 + 135, ground_y)], seed + s_i, C_PAPER_DEEP)
        # Tall iron lamppost + festoon span
        lx = 360 + px3
        rline(p, lx, ground_y, lx, ground_y - 265, seed, 0.7, C_INK, 3.2)
        rline(p, lx, ground_y - 255, lx + 420, ground_y - 195, seed, 1.6, C_CRIMSON if swerved else C_INK_MID, 2.0, dashed=not swerved)

    elif idx == 5:  # Anastasia: Concentric canals, overhead kites, agate cutting wheel below
        for ring in range(3):
            p.setPen(QPen(QColor(40, 75, 99, 130), 2.2))
            p.setBrush(Qt.BrushStyle.NoBrush)
            p.drawEllipse(QPointF(640 + px4, ground_y + 18), 180 + ring * 130, 22 + ring * 12)
        for k_i in range(5):
            kx = 240 + k_i * 195 + px3 + 18 * math.sin(f_idx * 0.12 + k_i)
            ky = 135 + (k_i % 2) * 42
            rline(p, kx - 55, ground_y - 40, kx, ky, seed + k_i, 0.9, C_INK_MID, 1.1)
            engraved_poly(p, [(kx, ky - 22), (kx + 18, ky), (kx, ky + 26), (kx - 18, ky)], seed + k_i, C_OCHRE if k_i % 2 else C_CRIMSON, hatch_step=5)
        if swerved:
            # Agate grinding wheel bench in foreground
            p.setPen(QPen(C_INK, 2.4))
            p.setBrush(QBrush(C_PAPER_DEEP))
            p.drawEllipse(QPointF(640 + px3, ground_y - 48), 38, 38)

    elif idx == 6:  # Tamara: Jutting iron signboards (pincers, tankard, scales) vs cloud shapes
        for b_i in range(6):
            bx = 140 + b_i * 185 + px4
            draw_tower(p, bx, ground_y, 110, 255, seed + b_i, C_PAPER_HI if not swerved else C_PAPER_DEEP)
            # Jutting iron bracket + signboard
            rline(p, bx + 55, ground_y - 190, bx + 112, ground_y - 190, seed, 0.6, C_INK, 2.5)
            engraved_poly(p, [(bx + 68, ground_y - 185), (bx + 108, ground_y - 185), (bx + 108, ground_y - 142), (bx + 68, ground_y - 142)], seed + b_i, C_OCHRE, hatch_step=5)
        if swerved:
            for c_i in range(3):
                cx = 280 + c_i * 310 + (f_idx * 1.2) % 90
                engraved_poly(p, [(cx - 55, 130), (cx - 20, 95), (cx + 35, 102), (cx + 65, 132)], seed + c_i, C_PAPER_HI, stroke=C_BLUEPRINT, hatch_step=8)

    elif idx == 7:  # Zora: Honeycomb memory cells crumbling into drifting chalk particles on swerve
        fade = max(0.18, 1.0 - 0.72 * swerve_u) if swerved else 1.0
        p.save()
        p.setOpacity(fade)
        for row in range(3):
            for col in range(6):
                hx = 230 + col * 155 + (row % 2) * 75 + px4
                hy = ground_y - 60 - row * 86
                pts = [(hx + 46 * math.cos(math.radians(60 * k + 30)), hy + 46 * math.sin(math.radians(60 * k + 30))) for k in range(6)]
                engraved_poly(p, pts, seed + row * 7 + col, C_PAPER_HI, hatch_step=6.5)
        p.restore()
        if swerved:
            p.setBrush(QBrush(C_SANGUINE))
            p.setPen(Qt.PenStyle.NoPen)
            for d_i in range(42):
                dx = 220 + (d_i * 23 + f_idx * 4) % 860
                dy = ground_y - 30 - (d_i * 37) % 240
                p.drawRect(QRectF(dx, dy, 4, 4))

    elif idx == 8:  # Despina: Steamboat smokestacks & windsocks <-> two-humped camel silhouette
        if not swerved:
            engraved_poly(p, [(290 + px3, ground_y), (340 + px3, ground_y - 110), (920 + px3, ground_y - 110), (970 + px3, ground_y)], seed, C_PAPER_DEEP)
            for s_i in range(3):
                draw_tower(p, 470 + s_i * 140 + px3, ground_y - 110, 44, 135, seed + s_i, C_INK_MID)
        else:
            # Camel-hump skyline arches + oasis saddle fringe
            draw_dome(p, 490 + px3, ground_y - 60, 125, 145, seed, C_OCHRE)
            draw_dome(p, 750 + px3, ground_y - 60, 135, 160, seed + 2, C_OCHRE)

    elif idx == 9:  # Zirma: Window-level dirigibles multiplied vs pruned to one
        for b_i in range(5):
            draw_tower(p, 180 + b_i * 225 + px4, ground_y, 130, 260, seed + b_i, C_PAPER_DEEP)
        n_blimps = 1 if swerved else 4
        for z_i in range(n_blimps):
            zx = 280 + z_i * 240 + math.sin(f_idx * 0.06 + z_i) * 28 + px3
            zy = 185 + (z_i % 2) * 48
            p.setBrush(QBrush(C_SILVER_WASH))
            p.setPen(QPen(C_INK, 2.0))
            p.drawEllipse(QPointF(zx, zy), 88, 34)
            p.drawRect(QRectF(zx - 24, zy + 34, 48, 12))

    elif idx == 10:  # Isaura: Buried black lake below + 1,000 well derricks, pulleys & aqueducts above
        p.fillRect(QRectF(80, ground_y + 22, W - 160, 82), QColor(24, 28, 34, 225))
        for w_i in range(6):
            wx = 175 + w_i * 182 + px3
            rline(p, wx, ground_y + 65, wx, ground_y - 235, seed + w_i, 0.6, C_INK_MID, 1.5)
            # Pulley wheel + rising bucket
            p.setPen(QPen(C_INK, 2.0))
            p.setBrush(QBrush(C_OCHRE))
            p.drawEllipse(QPointF(wx, ground_y - 240), 14, 14)
            by = ground_y - (45 + ((f_idx * 3 + w_i * 35) % 175) if swerved else 25)
            p.fillRect(QRectF(wx - 9, by, 18, 22), C_BLUEPRINT)
        if swerved:
            rline(p, 110 + px4, ground_y - 255, 1160 + px4, ground_y - 255, seed, 0.8, C_CRIMSON, 3.4)

    elif idx == 12:  # Fedora: Gray ashlar stone hall enclosing glowing blue crystal globes
        engraved_poly(p, [(120 + px4, ground_y), (120 + px4, 130), (1160 + px4, 130), (1160 + px4, ground_y)], seed, C_PAPER_DEEP, hatch_step=8)
        n_globes = 7 if swerved else 2
        for g_i in range(n_globes):
            gx = 230 + g_i * 135 + px3
            gy = ground_y - 135 - (g_i % 2) * 48
            rline(p, gx, ground_y, gx, gy + 36, seed + g_i, 0.5, C_INK, 2.0)
            p.setBrush(QBrush(QColor(56, 118, 168, 165 if swerved else 85)))
            p.setPen(QPen(C_INK, 1.8))
            p.drawEllipse(QPointF(gx, gy), 38, 38)
            draw_tower(p, gx, gy + 20, 18, 34, seed + g_i, C_PAPER_HI, spire=True)

    elif idx in (14, 26, 28):  # Thin stilt / abyss cities: Zenobia (14), Octavia (26), Baucis (28)
        if idx == 26:
            # Octavia: Catenary cables between mountain crests + hanging sack-houses over chasm!
            engraved_poly(p, [(0, H), (0, 150), (210, ground_y + 120)], seed, C_PAPER_DEEP)
            engraved_poly(p, [(W, H), (W, 150), (W - 210, ground_y + 120)], seed + 2, C_PAPER_DEEP)
            prev_pt = None
            for k in range(17):
                u = k / 16.0
                cx = 160 + u * (W - 320)
                cy = 185 + math.sin(u * math.pi) * 115
                if prev_pt:
                    rline(p, prev_pt[0], prev_pt[1], cx, cy, seed, 0.7, C_INK, 2.6)
                prev_pt = (cx, cy)
                if 2 <= k <= 14 and k % 2 == 0:
                    drop = 95 + (k % 3) * 28
                    rline(p, cx, cy, cx, cy + drop, seed + k, 0.5, C_CRIMSON if swerved else C_INK, 1.5)
                    engraved_poly(p, [(cx - 22, cy + drop), (cx + 22, cy + drop), (cx + 18, cy + drop + 44), (cx - 18, cy + drop + 44)], seed + k, C_OCHRE if swerved else C_PAPER_HI)
        else:
            # Zenobia / Baucis high stilts piercing clouds
            for s_i in range(6):
                sx0 = 195 + s_i * 175 + px3
                rline(p, sx0 - 12, ground_y + 40, sx0 - 4, 215, seed + s_i, 0.7, C_INK, 2.2)
                rline(p, sx0 + 12, ground_y + 40, sx0 + 4, 215, seed + s_i, 0.7, C_INK, 2.2)
                draw_tower(p, sx0, 215, 76, 82, seed + s_i, C_PAPER_HI, spire=(idx == 14))
            if idx == 28:
                # Cloud deck below aerial balconies + spyglass ray to leaf/ant on ground
                for c_i in range(5):
                    p.setBrush(QBrush(QColor(250, 245, 234, 215)))
                    p.setPen(QPen(C_INK_MID, 1.2))
                    p.drawEllipse(QPointF(220 + c_i * 210, 310), 130, 28)
                if swerved:
                    rline(p, 545 + px3, 215, 640, ground_y - 6, seed, 0.4, C_CRIMSON, 1.8, dashed=True)

    elif idx == 18:  # Armilla: Forest of vertical water risers, suspended bathtubs & spray
        for p_i in range(9):
            rx = 145 + p_i * 122 + px3
            rline(p, rx, ground_y, rx, 130, seed + p_i, 0.4, C_BLUEPRINT, 3.0)
            if p_i % 2 == 0:
                rline(p, rx - 60, 250 + (p_i % 3) * 55, rx + 60, 250 + (p_i % 3) * 55, seed, 0.4, C_BLUEPRINT, 2.4)
                by = 246 + (p_i % 3) * 55
                engraved_poly(p, [(rx - 36, by), (rx + 36, by), (rx + 28, by + 26), (rx - 28, by + 26)], seed + p_i, C_PAPER_HI, hatch_step=0)
                if swerved:
                    for sp in range(-2, 3):
                        rline(p, rx, by - 28, rx + sp * 12, by, seed + sp, 0.6, C_BLUEPRINT, 1.1)

    elif idx == 20:  # Valdrada: Cliff verandas mirrored upside down in black specular lake!
        lake_y = ground_y - 30
        for v_i in range(5):
            vx = 220 + v_i * 195 + px3
            vh = 110 + (v_i % 2) * 55
            # Erect upper veranda
            engraved_poly(p, [(vx - 65, lake_y), (vx - 65, lake_y - vh), (vx + 65, lake_y - vh), (vx + 65, lake_y)], seed + v_i, C_PAPER_HI)
            # Limpid inverted twin below lake plane!
            inv_col = QColor(40, 75, 99, 175) if swerved else QColor(72, 62, 51, 110)
            engraved_poly(p, [(vx - 65, lake_y), (vx - 65, lake_y + vh * 0.88), (vx + 65, lake_y + vh * 0.88), (vx + 65, lake_y)], seed + v_i, inv_col, stroke=C_CRIMSON if swerved else C_INK_MID)
        rline(p, 60, lake_y, W - 60, lake_y, seed, 0.4, C_BLUEPRINT, 3.0)

    elif idx == 27:  # Ersilia: Poles laced with white, black, and gray relational chords after walls vanish
        poles = [190 + k * 175 + px3 for k in range(6)]
        for k, px_p in enumerate(poles):
            if not swerved:
                draw_tower(p, px_p, ground_y, 95, 175, seed + k, C_PAPER_DEEP)
            rline(p, px_p, ground_y, px_p, ground_y - 245, seed + k, 0.5, C_INK, 2.8)
        chord_cols = [C_PAPER_HI, C_INK, C_CRIMSON, C_BLUEPRINT]
        for i in range(len(poles)):
            for j in range(i + 1, len(poles)):
                y_a = ground_y - 70 - ((i * 37 + j * 19) % 155)
                y_b = ground_y - 65 - ((j * 43 + i * 29) % 160)
                rline(p, poles[i], y_a, poles[j], y_b, seed + i + j, 0.4, chord_cols[(i + j) % 4], 1.6)

    elif idx == 31:  # Esmeralda: Zigzag canal bridges + soaring swallow parabolas
        for c_i in range(4):
            cx = 230 + c_i * 255 + px3
            p.setPen(QPen(C_INK, 2.2))
            p.setBrush(Qt.BrushStyle.NoBrush)
            p.drawArc(QRectF(cx - 85, ground_y - 55, 170, 90), 0, 180 * 16)
            draw_tower(p, cx + 95, ground_y, 78, 195, seed + c_i, C_PAPER_HI)
        if swerved:
            for sw_i in range(3):
                path = QPainterPath()
                path.moveTo(QPointF(140, 320 - sw_i * 35))
                path.quadTo(QPointF(640, 85 + sw_i * 28), QPointF(1140, 295 - sw_i * 25))
                p.setPen(QPen(C_CRIMSON if sw_i == 0 else C_BLUEPRINT, 2.0))
                p.drawPath(path)

    elif idx == 36:  # Moriana: Paper-thin ridge fold—alabaster left vs rusted spiked sheet-metal right
        mid = W * 0.5 + px3 * 0.3
        for a_i in range(3):
            ax = 160 + a_i * 145
            draw_dome(p, ax, ground_y - 120, 48, 55, seed + a_i, C_PAPER_HI)
            draw_tower(p, ax, ground_y, 84, 120, seed + a_i, C_PAPER_HI)
        if swerved:
            rline(p, mid, 95, mid, ground_y + 20, seed, 1.5, C_CRIMSON, 3.2)
            for r_i in range(4):
                rx = mid + 85 + r_i * 125
                pts = [(rx - 48, ground_y), (rx - 54, ground_y - 185), (rx + 12, ground_y - 225), (rx + 52, ground_y - 160), (rx + 46, ground_y)]
                engraved_poly(p, pts, seed + r_i, QColor(92, 74, 62, 195), hatch_step=4.5, hatch_angle_deg=-45)

    elif idx in (38, 42, 46):  # Subterranean / Dead / Unborn cities: Eusapia (38), Argia (42), Laudomia (46)
        if idx == 42:  # Argia: Solid packed earth filling frame + negative white stair-cuts + door shockwave
            engraved_poly(p, [(60, 120), (W - 60, 120), (W - 60, ground_y), (60, ground_y)], seed, QColor(118, 96, 74, 185), hatch_step=5.5)
            for st_i in range(6):
                p.fillRect(QRectF(280 + st_i * 52, 230 + st_i * 36, 54, 36), C_PAPER_HI)
            if swerved:
                for ring in range(1, 5):
                    p.setPen(QPen(C_CRIMSON, 2.0))
                    p.setBrush(Qt.BrushStyle.NoBrush)
                    p.drawEllipse(QPointF(640, ground_y - 20), ring * 95 * swerve_u, ring * 38 * swerve_u)
        elif idx == 46:  # Laudomia: Giant marble two-bulb hourglass of the unborn at center!
            engraved_poly(p, [(520 + px3, 145), (760 + px3, 145), (652 + px3, 315), (628 + px3, 315)], seed, C_PAPER_HI, hatch_step=6)
            engraved_poly(p, [(628 + px3, 315), (652 + px3, 315), (760 + px3, ground_y), (520 + px3, ground_y)], seed + 2, C_OCHRE if swerved else C_PAPER_DEEP, hatch_step=6)
            draw_tower(p, 260 + px4, ground_y, 130, 235, seed + 4, C_PAPER_DEEP)
            draw_tower(p, 1020 + px4, ground_y, 130, 195, seed + 5, C_SILVER_WASH)
        else:  # Eusapia: Upper arcade mirroring lower subterranean catacomb vault
            mid_y = ground_y - 145
            rline(p, 80, mid_y, W - 80, mid_y, seed, 1.0, C_INK, 3.0)
            for a_i in range(5):
                ax = 210 + a_i * 210 + px3
                draw_tower(p, ax, mid_y, 92, 135, seed + a_i, C_PAPER_HI)
                draw_tower(p, ax, ground_y, 92, 125, seed + a_i + 9, QColor(188, 168, 132, 210))

    elif idx == 40:  # Leonia: Spotless center ringed by towering mountains of indestructible refuse
        draw_tower(p, 640 + px3, ground_y, 150, 195, seed, C_PAPER_HI, spire=True)
        h_ref = 285 if swerved else 135
        engraved_poly(p, [(40, ground_y), (220, ground_y - h_ref), (455, ground_y)], seed + 1, C_PAPER_DEEP, hatch_step=4.5, hatch_angle_deg=-35)
        engraved_poly(p, [(825, ground_y), (1060, ground_y - h_ref * 1.08), (W - 40, ground_y)], seed + 2, C_PAPER_DEEP, hatch_step=4.5, hatch_angle_deg=35)

    elif idx == 43:  # Thekla: Cranes hoisting cranes & pine scaffolding -> starry blueprint sky
        if swerved:
            p.fillRect(QRectF(60, 95, W - 120, ground_y - 95), QColor(26, 38, 56, 225))
        scaf_col = C_PAPER_HI if swerved else C_INK
        for s_i in range(7):
            sx0 = 175 + s_i * 155 + px3
            rline(p, sx0, ground_y, sx0, 140, seed + s_i, 0.5, scaf_col, 1.8)
            if s_i < 6:
                rline(p, sx0, 220, sx0 + 155, 340, seed + s_i, 0.5, scaf_col, 1.3)
                rline(p, sx0, 340, sx0 + 155, 220, seed + s_i, 0.5, scaf_col, 1.3)
        # Crane boom
        rline(p, 380 + px3, 140, 880 + px3, 110, seed, 0.6, C_OCHRE, 3.0)

    elif idx == 45:  # Olinda: Magnifying lens & concentric expanding tree-ring city walls
        cx, cy = 640 + px3 * 0.4, ground_y - 145
        rings = 6 if swerved else 2
        for r_i in range(rings, 0, -1):
            rad = r_i * (36 + 14 * swerve_u)
            p.setPen(QPen(C_CRIMSON if r_i == 1 else C_INK, 2.2))
            p.setBrush(QBrush(QColor(242, 230, 202, 95)))
            p.drawEllipse(QPointF(cx, cy), rad, rad * 0.72)

    elif idx == 48:  # Procopia: Inn window rectangle filling from horizon to sill with polite round silhouettes
        wx, wy, ww, wh = 340 + px3 * 0.3, 125, 600, 330
        engraved_poly(p, [(wx, wy), (wx + ww, wy), (wx + ww, wy + wh), (wx, wy + wh)], seed, QColor(208, 224, 235) if not swerved else C_OCHRE, hatch_step=0)
        n_rows = 5 if swerved else 1
        for r_i in range(n_rows):
            for c_i in range(9):
                p.setBrush(QBrush(C_PAPER_DEEP))
                p.setPen(QPen(C_INK, 1.4))
                p.drawEllipse(QPointF(wx + 38 + c_i * 65, wy + wh - 28 - r_i * 56), 26, 26)

    elif idx == 49:  # Raissa: Dark workshop gloom pierced by crimson-gold joy lightning-chain + freed bird
        for b_i in range(5):
            draw_tower(p, 190 + b_i * 220 + px4, ground_y, 150, 250, seed + b_i, QColor(176, 166, 148, 210))
        if swerved:
            pts = [(190, ground_y - 60), (410, ground_y - 175), (640, ground_y - 120), (860, ground_y - 245), (1090, 145)]
            for k in range(len(pts) - 1):
                rline(p, pts[k][0], pts[k][1], pts[k + 1][0], pts[k + 1][1], seed + k, 1.2, C_CRIMSON, 3.4)
            # Freed speckled bird arc
            bx, by = 1090, 145
            rline(p, bx - 24, by + 8, bx, by - 6, seed, 0.5, C_OCHRE, 2.8)
            rline(p, bx, by - 6, bx + 24, by + 8, seed, 0.5, C_OCHRE, 2.8)

    elif idx == 11:  # Maurilia: Sepia bandstand & white parasols vs concrete steel highway overpass
        engraved_poly(p, [(210 + px3, ground_y), (210 + px3, ground_y - 110), (370 + px3, ground_y - 155), (530 + px3, ground_y - 110), (530 + px3, ground_y)], seed, C_PAPER_HI)
        p.setBrush(QBrush(C_PAPER_HI))
        p.setPen(QPen(C_INK, 1.5))
        p.drawPie(QRectF(560 + px3, ground_y - 95, 70, 50), 0, 180 * 16)
        if swerved:
            rline(p, 80, ground_y - 185, W - 80, ground_y - 185, seed, 0.4, C_INK, 6.0)
            for p_i in range(4):
                draw_tower(p, 250 + p_i * 260, ground_y, 38, 185, seed + p_i, C_SILVER_WASH)

    elif idx == 13:  # Zoe: Cluster of identical stepped pyramid roofs blurring palace & bazaar
        for z_i in range(6):
            zx = 180 + z_i * 182 + px3
            engraved_poly(p, [(zx - 78, ground_y), (zx, ground_y - 215), (zx + 78, ground_y)], seed + z_i, C_OCHRE if (swerved and z_i % 2 == 0) else C_PAPER_DEEP, hatch_step=6)

    elif idx == 15:  # Euphemia: Yellow-mat spice bales transmuting into solstice campfire & rising memory sparks
        for b_i in range(6):
            bx = 185 + b_i * 175 + px4
            engraved_poly(p, [(bx - 42, ground_y), (bx - 36, ground_y - 68), (bx + 36, ground_y - 68), (bx + 42, ground_y)], seed + b_i, C_OCHRE)
        if swerved:
            engraved_poly(p, [(590, ground_y), (640, ground_y - 135 - (f_idx % 4) * 8), (690, ground_y)], seed, C_CRIMSON, hatch_step=0)
            for sp_k in range(14):
                p.fillRect(QRectF(580 + ((sp_k * 29 + f_idx * 2) % 120), ground_y - 140 - ((sp_k * 31 + f_idx * 4) % 190), 5, 5), C_OCHRE)

    elif idx == 16:  # Zobeide: Stark whitewashed moonlit blind cul-de-sac walls winding inward
        p.setBrush(QBrush(C_PAPER_HI))
        p.setPen(QPen(C_INK, 1.8))
        p.drawEllipse(QPointF(980 + px4, 130), 34, 34)
        for w_i in range(5):
            wx = 220 + w_i * 185 + px3
            wh = 150 + (w_i % 2) * 75
            engraved_poly(p, [(wx - 65, ground_y), (wx - 65, ground_y - wh), (wx + 65, ground_y - wh), (wx + 65, ground_y)], seed + w_i, C_PAPER_HI, hatch_step=9 if not swerved else 4)
            if swerved:
                rline(p, wx - 65, ground_y - wh, wx + 65, ground_y, seed + w_i, 0.8, C_CRIMSON, 2.2)

    elif idx == 17:  # Hypatia: Cerulean magnolia lagoon at base + porphyry domes + high citadel pinnacle
        p.fillRect(QRectF(90, ground_y - 26, W - 180, 38), QColor(40, 75, 99, 175))
        draw_dome(p, 330 + px4, ground_y - 120, 72, 85, seed, C_CRIMSON if swerved else C_PAPER_DEEP)
        draw_tower(p, 920 + px3, ground_y, 82, 290, seed + 2, C_PAPER_HI, spire=True)

    elif idx == 19:  # Chloe: Rain-darkened bazaar arcades + silent crimson geometric glance triangles
        for a_i in range(5):
            ax = 200 + a_i * 215 + px4
            p.setPen(QPen(C_INK, 2.2))
            p.setBrush(Qt.BrushStyle.NoBrush)
            p.drawArc(QRectF(ax - 95, ground_y - 230, 190, 220), 0, 180 * 16)
        if swerved:
            pts_g = [(260, ground_y - 95), (640, 175), (1010, ground_y - 105), (480, 260)]
            for k in range(len(pts_g)):
                p1, p2 = pts_g[k], pts_g[(k + 1) % len(pts_g)]
                rline(p, p1[0], p1[1], p2[0], p2[1], seed + k, 0.5, C_CRIMSON, 1.9, dashed=True)

    elif idx == 21:  # Olivia: Filigree mullioned arches & peacock fan vs thick soot & lathe mandrels
        if not swerved:
            for r_i in range(7):
                ang = math.pi * (0.15 + 0.7 * r_i / 6.0)
                rline(p, 640 + px3, ground_y - 40, 640 + px3 + math.cos(ang) * 185, ground_y - 40 - math.sin(ang) * 185, seed + r_i, 0.6, C_BLUEPRINT, 2.0)
        else:
            for m_i in range(4):
                mx = 240 + m_i * 255 + px3
                draw_tower(p, mx, ground_y, 64, 240, seed + m_i, QColor(68, 62, 56, 215))
                p.drawEllipse(QPointF(mx, 130), 48, 22)

    elif idx == 22:  # Sophronia: Skeletal Ferris wheel anchored beside trailer-mounted marble pediment
        wx, wy = 360 + px3, ground_y - 165
        p.setPen(QPen(C_INK, 2.4))
        p.setBrush(Qt.BrushStyle.NoBrush)
        p.drawEllipse(QPointF(wx, wy), 125, 125)
        for sp in range(8):
            ang = sp * (math.pi / 4.0) + f_idx * 0.03
            rline(p, wx, wy, wx + math.cos(ang) * 125, wy + math.sin(ang) * 125, seed, 0.3, C_CRIMSON, 1.5)
        tx_m = (880 + swerve_u * 210) if swerved else 880
        engraved_poly(p, [(tx_m - 95, ground_y - 28), (tx_m - 95, ground_y - 165), (tx_m, ground_y - 220), (tx_m + 95, ground_y - 165), (tx_m + 95, ground_y - 28)], seed + 3, C_PAPER_HI)
        p.drawEllipse(QPointF(tx_m - 55, ground_y - 14), 14, 14)
        p.drawEllipse(QPointF(tx_m + 55, ground_y - 14), 14, 14)

    elif idx == 23:  # Eutropia: Plateau chessboard of twin towns shifting occupancy
        for sq in range(6):
            sx_e = 150 + sq * 185 + px4
            occupied = (sq % 2 == (1 if swerved else 0))
            draw_tower(p, sx_e, ground_y, 110, 175 if occupied else 95, seed + sq, C_OCHRE if occupied else C_PAPER_HI, spire=occupied)

    elif idx == 24:  # Zemrude: High sunlit window sills & curtains severed from low fish-scaled gutter manhole
        horizon_cut = ground_y - 150
        rline(p, 80, horizon_cut, W - 80, horizon_cut, seed, 0.8, C_CRIMSON if swerved else C_BLUEPRINT, 2.2, dashed=True)
        for w_i in range(4):
            wx = 230 + w_i * 265 + px3
            engraved_poly(p, [(wx - 40, horizon_cut - 120), (wx + 40, horizon_cut - 120), (wx + 52, horizon_cut - 25), (wx - 28, horizon_cut - 25)], seed + w_i, C_PAPER_HI if not swerved else C_PAPER_DEEP)
        if swerved:
            p.setBrush(QBrush(C_INK_MID))
            p.drawEllipse(QPointF(640 + px3, ground_y - 18), 75, 16)

    elif idx == 25:  # Aglaura: Dense proverbial stone tablets eclipsing an unnamed golden street-corner glimmer
        for t_i in range(5):
            tx = 205 + t_i * 215 + px4
            draw_tower(p, tx, ground_y, 135, 235, seed + t_i, C_PAPER_DEEP)
        if swerved:
            grad = QRadialGradient(QPointF(640 + px3, ground_y - 95), 95 * swerve_u)
            grad.setColorAt(0, QColor(235, 182, 58, 220))
            grad.setColorAt(1, QColor(235, 182, 58, 0))
            p.setBrush(QBrush(grad))
            p.setPen(Qt.PenStyle.NoPen)
            p.drawEllipse(QPointF(640 + px3, ground_y - 95), 95 * swerve_u, 95 * swerve_u)

    elif idx == 29:  # Leandra: Domestic stucco cornice, coatrack & kitchen flue pipes with tiny household gods
        rline(p, 120, 185, W - 120, 185, seed, 0.7, C_INK, 3.0)
        for f_p in range(4):
            fx = 260 + f_p * 250 + px3
            rline(p, fx, ground_y, fx, 185, seed + f_p, 0.5, C_SANGUINE if swerved else C_INK_MID, 4.0)
            p.fillRect(QRectF(fx - 12, 162, 24, 22), C_CRIMSON if (swerved and f_p % 2) else C_INK)

    elif idx == 30:  # Melania: Harsh theatrical proscenium arch & cascading role masks
        engraved_poly(p, [(130, ground_y), (130, 115), (235, 115), (235, ground_y)], seed, C_PAPER_DEEP)
        engraved_poly(p, [(W - 235, ground_y), (W - 235, 115), (W - 130, 115), (W - 130, ground_y)], seed + 1, C_PAPER_DEEP)
        rline(p, 130, 135, W - 130, 135, seed, 0.8, C_CRIMSON, 3.5)
        for m_i in range(5):
            mx = 320 + m_i * 160 + px3
            my = 215 + ((m_i * 28 + (f_idx if swerved else 0)) % 95)
            p.setBrush(QBrush(C_PAPER_HI))
            p.setPen(QPen(C_INK, 1.8))
            p.drawEllipse(QPointF(mx, my), 22, 30)

    elif idx == 32:  # Phyllis: Rose windows & onion spires bleaching into bare dashed footstep zigzags
        if not swerved:
            for r_i in range(4):
                rx = 240 + r_i * 265 + px3
                draw_tower(p, rx, ground_y, 105, 225, seed + r_i, C_PAPER_HI, spire=True)
                p.drawEllipse(QPointF(rx, ground_y - 145), 32, 32)
        else:
            zig = [(180, ground_y - 18), (420, ground_y - 68), (670, ground_y - 22), (910, ground_y - 74), (1110, ground_y - 20)]
            for k in range(len(zig) - 1):
                rline(p, zig[k][0], zig[k][1], zig[k + 1][0], zig[k + 1][1], seed + k, 0.7, C_CRIMSON, 2.6, dashed=True)

    elif idx == 33:  # Pyrrha: Dark vertical goblet bay fortress overwritten by sawmill lumber & wind-pump vanes
        if not swerved:
            engraved_poly(p, [(430 + px3, ground_y), (370 + px3, 155), (910 + px3, 155), (850 + px3, ground_y)], seed, C_PAPER_DEEP, hatch_step=5)
        else:
            for w_p in range(4):
                wx = 250 + w_p * 260 + px3
                rline(p, wx, ground_y, wx, 195, seed + w_p, 0.5, C_INK, 2.2)
                for blade in range(6):
                    ang = blade * (math.pi / 3.0) + f_idx * 0.11
                    rline(p, wx, 195, wx + math.cos(ang) * 44, 195 + math.sin(ang) * 44, seed, 0.3, C_OCHRE, 2.0)

    elif idx == 34:  # Adelma: Dusk dock bollards, mooring ropes & hooded ancestral silhouettes
        for b_i in range(5):
            bx = 215 + b_i * 215 + px3
            engraved_poly(p, [(bx - 18, ground_y), (bx - 14, ground_y - 48), (bx + 14, ground_y - 48), (bx + 18, ground_y)], seed + b_i, C_INK_MID)
            if swerved:
                draw_dome(p, bx, ground_y - 135, 34, 65, seed + b_i, QColor(72, 62, 51, 145))

    elif idx == 35:  # Eudoxia: Symmetrical crimson-indigo geometric carpet beside crooked mule-alley stain
        cx_e = 640 + px3 * 0.4
        engraved_poly(p, [(cx_e - 185, 140), (cx_e + 185, 140), (cx_e + 185, 340), (cx_e - 185, 340)], seed, C_BLUEPRINT if not swerved else C_CRIMSON, hatch_step=7)
        p.setPen(QPen(C_PAPER_HI, 2.0))
        p.drawRect(QRectF(cx_e - 135, 175, 270, 130))
        p.drawEllipse(QPointF(cx_e, 240), 52, 52)

    elif idx == 37:  # Clarice: Corinthian capitals shuffled into velvet bell-jar museum pedestals
        for c_i in range(5):
            cx = 215 + c_i * 212 + px3
            engraved_poly(p, [(cx - 38, ground_y), (cx - 28, ground_y - 85), (cx + 28, ground_y - 85), (cx + 38, ground_y)], seed + c_i, C_PAPER_HI)
            if swerved:
                p.setPen(QPen(C_CRIMSON, 2.0))
                p.setBrush(QBrush(QColor(250, 245, 234, 115)))
                p.drawArc(QRectF(cx - 46, ground_y - 175, 92, 165), 0, 180 * 16)

    elif idx == 39:  # Beersheba: Subterranean brass gears below vs radiant zenith orb of castoff peels & shells
        for g_i in range(4):
            gx = 290 + g_i * 230 + px4
            p.setPen(QPen(C_INK, 2.0))
            p.setBrush(QBrush(C_PAPER_DEEP))
            p.drawEllipse(QPointF(gx, ground_y - 38), 38, 38)
        if swerved:
            p.setBrush(QBrush(C_OCHRE))
            p.setPen(QPen(C_CRIMSON, 2.2))
            p.drawEllipse(QPointF(640 + px3 * 0.3, 155), 68, 68)
            for orb in range(8):
                ang = orb * (math.pi / 4.0) + f_idx * 0.05
                p.drawEllipse(QPointF(640 + math.cos(ang) * 135, 155 + math.sin(ang) * 42), 8, 5)

    elif idx == 41:  # Irene: High windy plateau rim overlooking distant pink-glowing valley gulley
        engraved_poly(p, [(0, ground_y), (0, 240), (350, 285), (430, ground_y)], seed, C_PAPER_DEEP)
        grad = QRadialGradient(QPointF(830 + px4, ground_y - 55), 185)
        grad.setColorAt(0, QColor(208, 92, 98, 195 if not swerved else 75))
        grad.setColorAt(1, QColor(208, 92, 98, 0))
        p.setBrush(QBrush(grad))
        p.setPen(Qt.PenStyle.NoPen)
        p.drawEllipse(QPointF(830 + px4, ground_y - 55), 185, 95)

    elif idx == 44:  # Trude: Identical greenish suburban gables + giant swapping airport placard
        for h_i in range(7):
            hx = 145 + h_i * 165 + px4
            draw_tower(p, hx, ground_y, 92, 115, seed, QColor(186, 198, 168, 210), spire=True)
        engraved_poly(p, [(460, 125), (820, 125), (820, 195), (460, 195)], seed, C_PAPER_HI, stroke=C_CRIMSON if swerved else C_INK, w=2.5, hatch_step=0)
        p.setFont(get_font("mono", 16, bold=True))
        p.setPen(C_CRIMSON if swerved else C_INK)
        p.drawText(QRectF(460, 125, 360, 70), Qt.AlignmentFlag.AlignCenter, "TRUDE INT'L" if not swerved else "TRUDE -> TRUDE")

    elif idx == 47:  # Perinthia: Solar eclipse zodiac gate & cardo cross above multi-horned cellar shadows
        p.setPen(QPen(C_INK, 2.8))
        p.setBrush(QBrush(C_OCHRE if not swerved else C_INK))
        p.drawEllipse(QPointF(640 + px4, 165), 48, 48)
        for z_g in range(4):
            gx = 240 + z_g * 265 + px3
            draw_tower(p, gx, ground_y, 88, 195, seed + z_g, C_PAPER_HI if not swerved else C_PAPER_DEEP)
            if swerved:
                rline(p, gx - 24, ground_y - 195, gx - 44, ground_y - 245, seed, 0.9, C_CRIMSON, 2.6)
                rline(p, gx + 24, ground_y - 195, gx + 44, ground_y - 245, seed, 0.9, C_CRIMSON, 2.6)

    elif idx == 50:  # Andria: Concentric planetary street orbits flaring a golden-crimson nova spiral
        for o_i in range(1, 5):
            p.setPen(QPen(C_BLUEPRINT, 1.6))
            p.setBrush(Qt.BrushStyle.NoBrush)
            p.drawEllipse(QPointF(640 + px3 * 0.4, 245), o_i * 95, o_i * 42)
        if swerved:
            p.setBrush(QBrush(C_CRIMSON))
            p.setPen(QPen(C_OCHRE, 3.0))
            p.drawEllipse(QPointF(785, 165), 32 * swerve_u, 32 * swerve_u)

    elif idx == 51:  # Cecilia: Endless paved street rows enclosing a tiny sage traffic island
        for r_c in range(8):
            draw_tower(p, 125 + r_c * 148 + px4, ground_y, 98, 205 if swerved else 110, seed + r_c, C_PAPER_DEEP)
        p.setBrush(QBrush(C_EMERALD))
        p.setPen(QPen(C_INK, 1.8))
        p.drawEllipse(QPointF(640 + px3, ground_y - 8), 85 if not swerved else 42, 14)

    elif idx == 52:  # Marozia: Heavy leaden stone tunnel splitting open into dragonfly crystal & swallows
        engraved_poly(p, [(80, ground_y), (80, 105), (W - 80, 105), (W - 80, ground_y)], seed, QColor(136, 132, 126, 210), hatch_step=5)
        if swerved:
            crack = [(490, ground_y), (585, 290), (745, 105), (845, 105), (695, 310), (590, ground_y)]
            engraved_poly(p, crack, seed, C_PAPER_HI, stroke=C_BLUEPRINT, w=2.4, hatch_step=0)
            for sw_b in range(3):
                bx, by = 640 + sw_b * 46, 225 - sw_b * 38
                rline(p, bx - 18, by + 6, bx, by - 6, seed, 0.4, C_CRIMSON, 2.4)
                rline(p, bx, by - 6, bx + 18, by + 6, seed, 0.4, C_CRIMSON, 2.4)

    elif idx == 53:  # Penthesilea: Shallow corrugated swamp sheds + contradictory pointing arms in every direction
        for sh_i in range(6):
            sx_p = 165 + sh_i * 185 + px4
            engraved_poly(p, [(sx_p - 55, ground_y), (sx_p - 55, ground_y - 82), (sx_p + 55, ground_y - 98), (sx_p + 55, ground_y)], seed + sh_i, C_PAPER_DEEP, hatch_step=4.5)
        if swerved:
            rline(p, 640, ground_y, 640, 185, seed, 0.6, C_INK, 3.0)
            for dy_a, dir_x in [(205, -135), (235, 145), (265, -110), (295, 125)]:
                rline(p, 640, dy_a, 640 + dir_x, dy_a - 18, seed + dy_a, 0.7, C_CRIMSON, 2.6)

    elif idx == 54:  # Theodora: Sealed library vaults erupting with winged griffons & hydras atop capitals
        for col_i in range(4):
            cx_t = 245 + col_i * 262 + px3
            draw_tower(p, cx_t, ground_y, 82, 205, seed + col_i, C_PAPER_HI)
            if swerved:
                wing_l = [(cx_t, ground_y - 210), (cx_t - 68, ground_y - 275), (cx_t - 24, ground_y - 205)]
                wing_r = [(cx_t, ground_y - 210), (cx_t + 68, ground_y - 275), (cx_t + 24, ground_y - 205)]
                engraved_poly(p, wing_l, seed + col_i, C_CRIMSON, hatch_step=4)
                engraved_poly(p, wing_r, seed + col_i + 1, C_CRIMSON, hatch_step=4)

    elif idx == 55:  # Berenice: Classical triglyph cogwheels infiltrated by nested pulley seeds!
        for c_i in range(3):
            cx = 310 + c_i * 330 + px3
            cy = ground_y - 145
            p.setPen(QPen(C_INK, 2.6))
            p.setBrush(QBrush(C_PAPER_DEEP))
            p.drawEllipse(QPointF(cx, cy), 86, 86)
            for tooth in range(12):
                ang = tooth * (math.pi / 6.0) + f_idx * 0.02 * (1 if c_i % 2 == 0 else -1)
                rline(p, cx + math.cos(ang) * 84, cy + math.sin(ang) * 84, cx + math.cos(ang) * 102, cy + math.sin(ang) * 102, seed, 0.3, C_INK, 3.2)
            if swerved:
                p.setBrush(QBrush(QColor(168, 41, 30, 145)))
                p.drawEllipse(QPointF(cx, cy), 46 * swerve_u, 46 * swerve_u)
                p.setBrush(QBrush(C_PAPER_HI))
                p.drawEllipse(QPointF(cx, cy), 20 * swerve_u, 20 * swerve_u)


def draw_conflict_grain_arch(p: QPainter, cx: float, ground_y: float, u: float, seed: int, pole_a: str, pole_b: str):
    """
    'Without stones there is no arch': Ground-springing load-bearing masonry arch!
    Instead of scaling from a mid-air dot, vouissoir stones lay course-by-course upward
    from both grounded springings (`k = 0, 8 -> 1, 7 -> 2, 6 -> 3, 5 -> 4 [keystone]`)!
    """
    if u <= 0.02:
        return
    span = 205.0
    rise = 215.0
    n_stones = 9
    center_idx = n_stones // 2
    max_course = int(round(u * (center_idx + 1)))
    for k in range(n_stones):
        dist_from_base = center_idx - abs(k - center_idx)  # 0 at bases (0,8), 4 at keystone (4)
        if dist_from_base >= max_course:
            continue
        a0 = math.pi * (1.0 - k / float(n_stones))
        a1 = math.pi * (1.0 - (k + 1) / float(n_stones))
        r_in, r_out = span * 0.78, span
        pts = [
            (cx + math.cos(a0) * r_in, ground_y - math.sin(a0) * rise * 0.78),
            (cx + math.cos(a0) * r_out, ground_y - math.sin(a0) * rise),
            (cx + math.cos(a1) * r_out, ground_y - math.sin(a1) * rise),
            (cx + math.cos(a1) * r_in, ground_y - math.sin(a1) * rise * 0.78),
        ]
        is_keystone = (k == center_idx)
        engraved_poly(
            p, pts, seed + k,
            fill=C_CRIMSON if is_keystone else C_PAPER_HI,
            stroke=C_INK,
            w=2.2 if is_keystone else 1.5,
            hatch_step=0 if is_keystone else 5.5,
        )


def draw_constant_volume_performer(p: QPainter, sack: dict, fill: QColor, seed: int, ground_y: float):
    """Draw constant-volume faceless half-filled flour-sack traveler/citizen with contact shadow."""
    p.save()
    p.setPen(Qt.PenStyle.NoPen)
    p.setBrush(QBrush(QColor(28, 24, 20, 62)))
    p.drawEllipse(QPointF(sack["cx"], ground_y + 2), 44.0 / sack["stretch"], 5.5)

    pts = sack["pts"]
    engraved_poly(p, pts, seed, fill=fill, stroke=C_INK, w=2.1, hatch_step=6.0, hatch_angle_deg=28, wobble=1.2)

    # Sanguine rough-construction spine curve (animator's visible plumb/action line)
    sp = sack["spine"]
    s_path = QPainterPath()
    for i, (sx, sy) in enumerate(sp):
        if i == 0:
            s_path.moveTo(QPointF(sx, sy))
        else:
            s_path.lineTo(QPointF(sx, sy))
    p.setPen(QPen(QColor(158, 71, 42, 145), 1.2, Qt.PenStyle.DotLine))
    p.setBrush(Qt.BrushStyle.NoBrush)
    p.drawPath(s_path)
    p.restore()


def render_city_frame(spec: CityGenomeSpec, timing: Dict[str, Any], f_idx: int, onion_skin: bool = False) -> QImage:
    img = QImage(W, H, QImage.Format.Format_ARGB32)
    img.fill(C_PAPER)
    p = QPainter(img)
    p.setRenderHint(QPainter.RenderHint.Antialiasing, True)

    t_sec = f_idx / float(FPS)
    swerve_f = timing["swerve_frame"]
    fulcrum_f = timing["fulcrum_frame"]
    swerved = f_idx >= swerve_f
    swerve_u = smooth((f_idx - swerve_f) / 28.0) if swerved else 0.0
    in_fulcrum = f_idx >= fulcrum_f - 4

    # Exposure quantization: ONES during immediate swerve collision, HOLD_8 on fulcrum, TWOS otherwise
    if swerve_f <= f_idx <= swerve_f + 24:
        exp_mode = "ones"
    elif fulcrum_f - 6 <= f_idx <= fulcrum_f + 14:
        exp_mode = "hold_8"
    else:
        exp_mode = "twos"
    qf = quantize_exposure(f_idx, exp_mode)
    seed = qf + spec.index * 31

    # Multiplane camera choreography (gentle lateral drift + crisp fulcrum zoom-in!)
    cam_x = math.sin(qf * 0.012) * 32.0
    zoom = lerp(1.0, 1.28, smooth((f_idx - fulcrum_f + 6) / 14.0)) if in_fulcrum else 1.0

    ground_y = 516.0

    # --- PLANE 6 & 5: SKY WASH + AUTONOMOUS OFF-SCREEN HORIZON CONTINUITY ---
    sky_grad = QLinearGradient(0, 52, 0, ground_y)
    sky_grad.setColorAt(0.0, QColor(232, 221, 198) if not swerved else QColor(225, 209, 184))
    sky_grad.setColorAt(1.0, C_PAPER_HI)
    p.fillRect(QRectF(0, 52, W, ground_y - 52), QBrush(sky_grad))

    # Autonomous off-screen desert caravan / horizon birds ("Other Worlds Being There")
    caravan_x = ((f_idx * 1.6 + spec.index * 85) % (W + 240)) - 120
    p.setBrush(QBrush(QColor(72, 62, 51, 75)))
    p.setPen(Qt.PenStyle.NoPen)
    for c_k in range(3):
        p.drawEllipse(QPointF(caravan_x - c_k * 26, ground_y - 12), 8, 5)

    # Apply virtual multiplane camera transform for Planes 4..2
    p.save()
    if zoom > 1.001:
        p.translate(W * 0.5, ground_y)
        p.scale(zoom, zoom)
        p.translate(-W * 0.5, -ground_y)

    # --- PLANE 4 & 3: BESPOKE 55-CITY ARCHITECTURE + CONFLICT-GRAIN KEYSTONE ARCH ---
    draw_bespoke_city_stage(p, spec, qf, seed, swerved, swerve_u, ground_y, cam_x)
    if swerved:
        draw_conflict_grain_arch(p, 640.0 - cam_x * 0.5, ground_y, swerve_u, seed, spec.pole_alpha, spec.pole_beta)

    # --- PLANE 2: CONSTANT-VOLUME FACELESS PERFORMERS (TRAVELER, CITIZEN, OPERATOR) ---
    env_amp = timing["env"][min(f_idx, len(timing["env"]) - 1)] if timing.get("env") else 0.0
    breath = env_amp * 0.35

    # Performer 1 (Marco / Traveler, left): steady walk -> coiled swerve intake -> contemplative lean
    if not swerved:
        px_1 = 355.0 + math.sin(qf * 0.05) * 28.0 - cam_x * 0.8
        st_1 = 1.02 + 0.04 * math.sin(qf * 0.14) + breath
        ln_1, bd_1 = 0.10, 0.12
    elif not in_fulcrum:
        px_1 = lerp(365.0, 445.0, swerve_u) - cam_x * 0.8
        st_1 = lerp(1.22, 0.86, swerve_u) + breath
        ln_1, bd_1 = lerp(-0.24, 0.28, swerve_u), lerp(-0.35, 0.42, swerve_u)
    else:
        px_1 = 445.0 - cam_x * 0.8
        st_1, ln_1, bd_1 = 1.08 + breath * 0.5, 0.22, 0.32

    # Performer 2 (Kublai / Local Swarm Witness, right): upright rule -> sharp counter-swerve stance
    if not swerved:
        px_2 = 905.0 - cam_x * 0.8
        st_2, ln_2, bd_2 = 0.96 + breath, -0.06, -0.08
    elif not in_fulcrum:
        px_2 = lerp(905.0, 815.0, swerve_u) - cam_x * 0.8
        st_2 = lerp(0.78, 1.18, swerve_u) + breath
        ln_2, bd_2 = lerp(0.20, -0.34, swerve_u), lerp(0.25, -0.48, swerve_u)
    else:
        px_2 = 815.0 - cam_x * 0.8
        st_2, ln_2, bd_2 = 0.84, -0.30, -0.42

    if onion_skin and f_idx >= 8:
        ghost = build_constant_volume_sack(px_1 - 24, ground_y, 1.14, -0.18, -0.25, 0.3, 0.3, target_area=10200.0)
        p.save()
        p.setOpacity(0.25)
        draw_constant_volume_performer(p, ghost, C_SANGUINE, seed - 4, ground_y)
        p.restore()

    trav_sack = build_constant_volume_sack(px_1, ground_y, st_1, ln_1, bd_1, 0.22, 0.42 if swerved else 0.20, target_area=10200.0)
    wit_sack = build_constant_volume_sack(px_2, ground_y, st_2, ln_2, bd_2, 0.48 if swerved else 0.20, 0.18, target_area=10000.0)

    draw_constant_volume_performer(p, trav_sack, QColor(232, 220, 196), seed, ground_y)
    draw_constant_volume_performer(p, wit_sack, QColor(246, 240, 226), seed + 11, ground_y)

    p.restore()  # End camera zoom

    # --- PLANE 1: FOREGROUND MULTIPLANE FRAMING PIERS ---
    fg_shift = -cam_x * 1.25
    engraved_poly(p, [(0, 52), (54 + fg_shift * 0.2, 52), (38 + fg_shift * 0.2, ground_y + 12), (0, ground_y + 12)], seed, C_PAPER_DEEP, hatch_step=6)
    engraved_poly(p, [(W - 54 + fg_shift * 0.2, 52), (W, 52), (W, ground_y + 12), (W - 38 + fg_shift * 0.2, ground_y + 12)], seed + 3, C_PAPER_DEEP, hatch_step=6)

    # --- PLANE 0: STUDIO HEADER, CLINAMEN LEDGER STRIP & EXPOSURE SHEET ---
    p.fillRect(QRectF(0, 0, W, 52), C_INK)
    p.setFont(get_font("mono", 11, bold=True))
    p.setPen(C_PAPER_HI)
    hdr_left = f"CITY {spec.index:02d}/55 · {spec.name.upper()} ({spec.series.upper()} · {spec.rank}) · CH.{spec.chapter}"
    hdr_right = f"{'BRANCH_CLINAMEN_A_PRIME [SWERVE]' if swerved else 'CHECKPOINT_LAWFUL_A [BASELINE]'} · {exp_mode.upper()} · F{f_idx:03d}"
    p.drawText(QRectF(20, 8, 720, 36), Qt.AlignmentFlag.AlignVCenter | Qt.AlignmentFlag.AlignLeft, hdr_left)
    p.setPen(C_OCHRE if swerved else C_PAPER_HI)
    p.drawText(QRectF(720, 8, W - 740, 36), Qt.AlignmentFlag.AlignVCenter | Qt.AlignmentFlag.AlignRight, hdr_right)

    # Coupled Worldtext & Spoken Subtitle Ledger below stage (`y = 528..720`)
    p.fillRect(QRectF(0, ground_y + 12, W, H - (ground_y + 12)), C_PAPER_HI)
    rline(p, 0, ground_y + 12, W, ground_y + 12, seed, 0.5, C_CRIMSON if in_fulcrum else C_INK, 2.6)

    p.setFont(get_font("mono", 9.5, bold=True))
    p.setPen(C_BLUEPRINT)
    p.drawText(
        QRectF(24, ground_y + 20, W - 48, 20),
        Qt.AlignmentFlag.AlignVCenter,
        f"TOPOLOGY: {spec.topology}  |  [A] BASELINE: {spec.pole_alpha}  -->  [A'] CLINAMEN: {spec.pole_beta}  |  VOL_ERR <= 0.01%"
    )

    # Active spoken text
    active_shot = None
    for sh in timing["shots"]:
        if sh["t0"] - 0.15 <= t_sec <= sh["t1"] + 0.35:
            active_shot = sh
            break
    if active_shot:
        is_f = active_shot.get("line", False)
        tag = {"slate": "PLATE", "polo": "MARCO POLO (T1 BASELINE)", "khan": "KUBLAI KHAN (T2/T3 SWERVE)", "archivist": "T5 BETTER QUESTION"}.get(active_shot["speaker"], "STUDIO")
        p.setFont(get_font("mono", 9.5, bold=True))
        p.setPen(C_CRIMSON if is_f else C_SANGUINE)
        p.drawText(QRectF(24, ground_y + 44, 420, 18), Qt.AlignmentFlag.AlignVCenter, f"[{tag}]")

        p.setFont(get_font("serif", 15 if is_f else 14, italic=is_f, bold=is_f))
        p.setPen(C_INK)
        p.drawText(
            QRectF(24, ground_y + 64, W - 48, 72),
            Qt.AlignmentFlag.AlignLeft | Qt.TextFlag.TextWordWrap,
            active_shot["text"]
        )

    # Bottom exposure-sheet tick ruler
    p.fillRect(QRectF(24, H - 36, W - 48, 24), C_PAPER_DEEP)
    p.setPen(QPen(C_INK, 1.2))
    p.drawRect(QRectF(24, H - 36, W - 48, 24))
    total_f = max(1, timing["total_frames"])
    for k in range(60):
        tx = 30 + k * ((W - 60) / 60.0)
        cur = int((f_idx / float(total_f)) * 60) == k
        sw_mark = int((swerve_f / float(total_f)) * 60) == k
        col = C_CRIMSON if (cur or sw_mark) else C_INK_MID
        p.fillRect(QRectF(tx, H - 32, 6 if cur else 2, 16 if k % 5 == 0 else 10), col)

    p.end()
    return img


def render_city_sheet_and_mp4(city_index: int, force: bool = False, sheet_only: bool = False, force_video: bool = False) -> Tuple[str, Optional[str]]:
    init_qt()
    spec = CITIES_55[city_index - 1]
    timing = build_city_sound(spec, force=force)
    slug = timing["slug"]

    # 1. Render 6-pose Contact Sheet (`DRAW -> LOOK -> COMPARE`)
    sheet_dir = os.path.join(SHEETS_DIR, slug)
    os.makedirs(sheet_dir, exist_ok=True)
    sheet_path = os.path.join(sheet_dir, "contact_sheet.jpg")

    total_f = timing["total_frames"]
    sw_f = timing["swerve_frame"]
    fl_f = timing["fulcrum_frame"]
    sample_frames = [
        max(4, int(sw_f * 0.25)),
        max(8, int(sw_f * 0.68)),
        sw_f + 8,
        min(total_f - 12, sw_f + 32),
        min(total_f - 8, fl_f + 6),
        min(total_f - 4, int((fl_f + total_f) * 0.55)),
    ]

    cw, ch = 640, 360
    sheet = QImage(cw * 2, ch * 3 + 52, QImage.Format.Format_ARGB32)
    sheet.fill(C_INK)
    sp = QPainter(sheet)
    sp.setFont(get_font("mono", 12, bold=True))
    sp.setPen(C_PAPER_HI)
    sp.drawText(
        QRectF(18, 8, cw * 2 - 36, 36),
        Qt.AlignmentFlag.AlignVCenter,
        f"SCION MULTIPLANE CONTACT SHEET · CITY {spec.index:02d}: {spec.name.upper()} ({spec.series} {spec.rank})"
    )
    for i, kf in enumerate(sample_frames):
        fr = render_city_frame(spec, timing, kf, onion_skin=(i in (2, 3)))
        col, row = i % 2, i // 2
        sp.drawImage(QRectF(col * cw + 4, 52 + row * ch + 4, cw - 8, ch - 8), fr)
    sp.end()
    sheet.save(sheet_path, "JPG", 91)

    if sheet_only:
        print(f"[sheet] {slug} -> {sheet_path}")
        return sheet_path, None

    # 2. Render full 24fps H.264 `.mp4` + poster `.jpg`
    out_mp4 = os.path.join(FILMS_DIR, f"{slug}.mp4")
    out_jpg = os.path.join(FILMS_DIR, f"{slug}.jpg")
    if not (force or force_video) and os.path.exists(out_mp4) and os.path.exists(out_jpg):
        print(f"[mp4] {slug}: cached ({out_mp4})")
        return sheet_path, out_mp4

    m4a_path = os.path.join(AUDIO_DIR, f"{slug}.m4a")
    cmd = [
        "/opt/homebrew/bin/ffmpeg", "-y", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "bgra", "-s", f"{W}x{H}", "-r", str(FPS),
        "-i", "pipe:0",
        "-i", m4a_path,
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "22", "-pix_fmt", "yuv420p",
        "-c:a", "copy", "-movflags", "+faststart", "-shortest", out_mp4,
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.PIPE)
    poster_f = min(total_f - 4, fl_f + 10)
    for f_i in range(total_f):
        img = render_city_frame(spec, timing, f_i, onion_skin=(sw_f <= f_i <= sw_f + 10))
        if f_i == poster_f:
            img.save(out_jpg, "JPG", 90)
        ptr = img.constBits()
        ptr.setsize(W * H * 4)
        proc.stdin.write(bytes(ptr))
    proc.stdin.close()
    err = proc.stderr.read().decode("utf-8", "ignore")
    if proc.wait() != 0:
        raise RuntimeError(f"ffmpeg failed for {slug}: {err}")
    print(f"[mp4] {slug}: rendered {total_f}f ({timing['duration']}s) -> {out_mp4}")
    return sheet_path, out_mp4


if __name__ == "__main__":
    args = sys.argv[1:]
    force = "--force" in args
    force_video = "--reencode-video" in args
    sheet_only = "--sheet-only" in args
    nums = [a for a in args if not a.startswith("--")]
    if not nums or "all" in nums:
        indices = list(range(1, 56))
    elif "-" in nums[0]:
        a, b = nums[0].split("-", 1)
        indices = list(range(int(a), int(b) + 1))
    else:
        indices = [int(x) for x in nums]
    for c_idx in indices:
        render_city_sheet_and_mp4(c_idx, force=force, sheet_only=sheet_only, force_video=force_video)
