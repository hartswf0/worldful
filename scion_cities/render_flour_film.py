#!/opt/homebrew/bin/python3
"""
Renders Film 00: `00-abominable-cellar-flour-test.mp4` + `mute_silhouette_sheet.jpg`
+ `contact_sheet.jpg` directly from the verified canonical worldtext store
(`flour_test_worldtext.json`) + Kokoro v1.0 narration & parameter-coupled foley.

Strict SCION Craft Floors:
- Zero static PNGs; 100% hand-inked procedural lithography, charcoal hatching, and
  sanguine rough-construction arcs on ones, twos, and deliberate holds.
- Zero facial features on Inigo, Belindo, and Flower (constant-volume half-filled sacks).
- Produces `mute_silhouette_sheet.jpg` with ALL text/labels stripped so an Independent
  Critic can audit the Mute Silhouette & Timing Gate visually before reading any labels.
"""
import json
import math
import os
import subprocess
import sys
import numpy as np
from scipy.io import wavfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from PyQt6.QtCore import Qt, QPointF, QRectF
from PyQt6.QtGui import (
    QGuiApplication, QImage, QPainter, QPen, QBrush, QColor,
    QFont, QFontDatabase, QPainterPath, QRadialGradient
)

from scion_cities.core.flour_engine import build_and_verify_flour_proof
from studio.kokoro_tts import speak
from studio.build_sound import lp, bp, pan_stereo, mix_at, apply_verb

W, H = 1280, 720
FPS = 24
SR = 48000

FILMS_DIR = os.path.join(HERE, "films")
SHEETS_DIR = os.path.join(HERE, "sheets")
AUDIO_DIR = os.path.join(HERE, "audio")
TIMING_DIR = os.path.join(HERE, "timing")
for d in (FILMS_DIR, SHEETS_DIR, AUDIO_DIR, TIMING_DIR):
    os.makedirs(d, exist_ok=True)

C_PAPER      = QColor(242, 234, 217)
C_PAPER_HI   = QColor(250, 245, 234)
C_PAPER_DEEP = QColor(226, 213, 188)
C_INK        = QColor(29, 25, 21)
C_INK_MID    = QColor(74, 64, 53)
C_SANGUINE   = QColor(158, 71, 42)
C_CRIMSON    = QColor(168, 41, 30)
C_BLUEPRINT  = QColor(40, 75, 99)
C_EMERALD    = QColor(38, 89, 64)

_APP = None
_FONTS = {}


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


def get_font(kind="serif", size=14, italic=False, bold=False):
    f = QFont(_FONTS.get(kind, "Georgia"), int(size))
    f.setItalic(italic)
    if bold:
        f.setWeight(QFont.Weight.Bold)
    return f


def hash_noise(seed, idx):
    x = math.sin(seed * 127.1 + idx * 311.7) * 43758.5453
    return x - math.floor(x)


def rough_line(p: QPainter, x1, y1, x2, y2, seed, wobble=1.1, color=C_INK, width=1.6, dashed=False):
    dist = math.hypot(x2 - x1, y2 - y1)
    steps = max(2, min(20, int(dist / 16.0)))
    path = QPainterPath()
    for i in range(steps + 1):
        u = i / float(steps)
        if 0 < i < steps and wobble > 0:
            jx = (hash_noise(seed, i * 19 + int(x1)) - 0.5) * 2.0 * wobble
            jy = (hash_noise(seed + 5, i * 37 + int(y1)) - 0.5) * 2.0 * wobble
        else:
            jx = jy = 0.0
        px = x1 + (x2 - x1) * u + jx
        py = y1 + (y2 - y1) * u + jy
        if i == 0:
            path.moveTo(QPointF(px, py))
        else:
            path.lineTo(QPointF(px, py))
    pen = QPen(color, width)
    if dashed:
        pen.setStyle(Qt.PenStyle.DashLine)
    p.setPen(pen)
    p.setBrush(Qt.BrushStyle.NoBrush)
    p.drawPath(path)


def draw_sack_qt(p: QPainter, actor, ox, oy, sx, sy, fill_col: QColor, seed: int, show_rig=True, label=""):
    pts = [(ox + pt[0] * sx, oy + pt[1] * sy) for pt in actor["pts"]]
    poly = QPainterPath()
    for idx, (px, py) in enumerate(pts):
        jx = (hash_noise(seed, idx * 13) - 0.5) * 1.4
        jy = (hash_noise(seed + 3, idx * 29) - 0.5) * 1.4
        if idx == 0:
            poly.moveTo(QPointF(px + jx, py + jy))
        else:
            poly.lineTo(QPointF(px + jx, py + jy))
    poly.closeSubpath()

    p.save()
    p.setPen(Qt.PenStyle.NoPen)
    p.setBrush(QBrush(fill_col))
    p.drawPath(poly)

    # Clipped lower-belly flour weight hatching
    p.save()
    p.setClipPath(poly)
    cx = ox + actor["cx"] * sx
    fy = oy + actor["foot_y"] * sy
    p.setPen(QPen(QColor(29, 25, 21, 78), 1.0))
    for h in range(-44, 46, 5):
        p.drawLine(QPointF(cx - 58 * sx, fy - 30 * sy + h * 0.55), QPointF(cx + 58 * sx, fy - 5 * sy + h * 0.55))
    p.restore()

    # Double rough ink + sanguine construction contour
    p.setPen(QPen(C_INK, 2.1))
    p.setBrush(Qt.BrushStyle.NoBrush)
    p.drawPath(poly)

    poly2 = QPainterPath()
    for idx, (px, py) in enumerate(pts):
        jx = (hash_noise(seed + 11, idx * 17) - 0.5) * 2.4
        jy = (hash_noise(seed + 19, idx * 23) - 0.5) * 2.4
        if idx == 0:
            poly2.moveTo(QPointF(px + jx, py + jy))
        else:
            poly2.lineTo(QPointF(px + jx, py + jy))
    poly2.closeSubpath()
    p.setPen(QPen(QColor(158, 71, 42, 110), 0.9))
    p.drawPath(poly2)

    sp = [(ox + pt[0] * sx, oy + pt[1] * sy) for pt in actor["spine"]]
    if len(sp) >= 3:
        rough_line(p, sp[1][0] - 12 * sx, sp[1][1], sp[1][0] + 12 * sx, sp[1][1] + 2, seed, 0.7, QColor(29, 25, 21, 140), 1.1)

    if show_rig:
        s_path = QPainterPath()
        for idx, (px, py) in enumerate(sp):
            if idx == 0:
                s_path.moveTo(QPointF(px, py))
            else:
                s_path.lineTo(QPointF(px, py))
        p.setPen(QPen(QColor(158, 71, 42, 165), 1.3, Qt.PenStyle.DotLine))
        p.drawPath(s_path)

    if label:
        p.setFont(get_font("mono", 9, bold=True))
        p.setPen(C_INK)
        p.drawText(QRectF(cx - 60, sp[-1][1] - 22, 120, 18), Qt.AlignmentFlag.AlignCenter, label)
    p.restore()


def draw_cellar_pane(p: QPainter, branch: dict, tick: int, x0: float, y0: float, pw: float, ph: float, hide_labels=False):
    sx = pw / 1120.0
    sy = ph / 620.0
    wf = branch["world_trace"][tick]
    mem_f = branch["actor_memory"]["flower"][tick]
    seed = branch["sensory_bus"][tick]["roughness_seed"]

    p.save()
    p.setClipRect(QRectF(x0, y0, pw, ph))
    p.fillRect(QRectF(x0, y0, pw, ph), QColor(235, 225, 204))

    # High street grate + autonomous offscreen passerby ("Other Worlds Being There")
    gx, gy, gw, gh = x0 + 92 * sx, y0 + 36 * sy, 195 * sx, 50 * sy
    p.fillRect(QRectF(gx, gy, gw, gh), C_PAPER_HI)
    px_off = wf["offscreen_continuity"]["alley_grate_passerby_x"] * sx * 0.25
    p.setBrush(QBrush(QColor(42, 36, 30, 82)))
    p.setPen(Qt.PenStyle.NoPen)
    p.drawEllipse(QPointF(gx + ((px_off + 200) % gw), gy + gh * 0.65), 14 * sx, 20 * sy)
    for b in range(7):
        bx = gx + gw * (b / 6.0)
        rough_line(p, bx, gy, bx, gy + gh, seed, 0.5, C_INK_MID, 1.3)
    p.setPen(QPen(C_INK, 1.4))
    p.setBrush(Qt.BrushStyle.NoBrush)
    p.drawRect(QRectF(gx, gy, gw, gh))

    # Autonomous cistern pipe drip
    drip_u = wf["offscreen_continuity"]["cistern_pipe_drip_phase"]
    rough_line(p, x0 + 38 * sx, y0 + 20 * sy, x0 + 38 * sx, y0 + 300 * sy, seed, 0.6, C_INK_MID, 2.6)
    p.setBrush(QBrush(C_BLUEPRINT))
    p.setPen(Qt.PenStyle.NoPen)
    p.drawEllipse(QPointF(x0 + 44 * sx, y0 + (120 + drip_u * 380) * sy), 2.8, 3.8)

    # Vault arch, ashlar stone courses, cellar shelf & floor
    for row in range(1, 6):
        ry = y0 + (95 + row * 72) * sy
        rough_line(p, x0 + 42 * sx, ry, x0 + (1120 - 42) * sx, ry, seed + row, 0.7, QColor(74, 64, 53, 46), 1.0)
        for col_s in range(6):
            stagger = 45 if row % 2 == 0 else 0
            bx_s = x0 + (90 + stagger + col_s * 165) * sx
            if bx_s < x0 + pw - 50:
                rough_line(p, bx_s, ry - 72 * sy, bx_s, ry, seed + col_s, 0.5, QColor(74, 64, 53, 35), 0.9)

    # Background cellar shelf + storage casks/demijohns (Plane 4)
    rough_line(p, x0 + 785 * sx, y0 + 255 * sy, x0 + 1055 * sx, y0 + 255 * sy, seed, 0.8, QColor(74, 64, 53, 130), 2.2)
    rough_line(p, x0 + 810 * sx, y0 + 255 * sy, x0 + 810 * sx, y0 + 544 * sy, seed, 0.6, QColor(74, 64, 53, 95), 1.5)
    rough_line(p, x0 + 1035 * sx, y0 + 255 * sy, x0 + 1035 * sx, y0 + 544 * sy, seed, 0.6, QColor(74, 64, 53, 95), 1.5)
    p.setPen(QPen(QColor(74, 64, 53, 110), 1.3))
    p.setBrush(QBrush(QColor(214, 202, 180, 120)))
    for jx in (848, 908, 972):
        p.drawEllipse(QPointF(x0 + jx * sx, y0 + 230 * sy), 17 * sx, 24 * sy)

    # Vault arch + cellar floor
    p.setPen(QPen(QColor(74, 64, 53, 135), 2.2))
    p.setBrush(Qt.BrushStyle.NoBrush)
    p.drawArc(QRectF(x0 + pw * 0.03, y0 + ph * 0.06, pw * 0.94, ph * 0.98), 0, 180 * 16)
    floor_y = y0 + 544 * sy
    rough_line(p, x0, floor_y, x0 + pw, floor_y, seed, 1.0, C_INK, 2.4)

    # Grounded contact shadows beneath every sack
    p.setPen(Qt.PenStyle.NoPen)
    p.setBrush(QBrush(QColor(29, 25, 21, 62)))
    for act_k in ("inigo", "belindo", "flower"):
        act = wf["actors"][act_k]
        p.drawEllipse(QPointF(x0 + act["cx"] * sx, floor_y + 2), (46.0 / act["stretch"]) * sx, 5.5 * sy)

    pr = wf["props_and_residue"]
    if pr["floor_scuff"]["persists"] and pr["floor_scuff"]["len"] > 0:
        sx0 = x0 + pr["floor_scuff"]["x0"] * sx
        slen = pr["floor_scuff"]["len"] * sx
        rough_line(p, sx0, floor_y + 5, sx0 + slen, floor_y + 3, seed, 1.4, C_SANGUINE, 3.2)

    if pr["oil_spill_radius"] > 0:
        ox, oy = x0 + 682 * sx, floor_y + 4
        rx, ry = pr["oil_spill_radius"] * sx, max(4.0, pr["oil_spill_radius"] * sy * 0.22)
        p.setBrush(QBrush(QColor(30, 24, 18, 188)))
        p.setPen(Qt.PenStyle.NoPen)
        p.drawEllipse(QPointF(ox, oy), rx, ry)
        heat = pr["thermal_ember_intensity"]
        if heat > 0.02:
            grad = QRadialGradient(QPointF(ox, oy - 12), rx * 1.2)
            grad.setColorAt(0.0, QColor(218, 72, 32, int(175 * heat)))
            grad.setColorAt(0.6, QColor(220, 145, 42, int(85 * heat)))
            grad.setColorAt(1.0, QColor(220, 145, 42, 0))
            p.setBrush(QBrush(grad))
            p.drawEllipse(QPointF(ox, oy - 12), rx * 1.2, rx * 1.2)

    ped_x = x0 + 682 * sx
    rough_line(p, ped_x - 18 * sx, y0 + 474 * sy, ped_x + 18 * sx, y0 + 474 * sy, seed, 0.8, C_INK, 2.2)
    rough_line(p, ped_x - 12 * sx, y0 + 474 * sy, ped_x - 16 * sx, floor_y, seed, 0.8, C_INK, 1.8)
    rough_line(p, ped_x + 12 * sx, y0 + 474 * sy, ped_x + 16 * sx, floor_y, seed, 0.8, C_INK, 1.8)

    if pr["lamp"]["intact"]:
        p.save()
        p.translate(QPointF(x0 + pr["lamp"]["x"] * sx, y0 + pr["lamp"]["y"] * sy))
        p.rotate(math.degrees(pr["lamp"]["tilt_rad"]))
        p.setBrush(QBrush(QColor(201, 150, 59)))
        p.setPen(QPen(C_INK, 1.6))
        p.drawEllipse(QPointF(0, -6), 12 * sx, 8 * sy)
        p.setBrush(QBrush(QColor(217, 78, 40)))
        p.setPen(Qt.PenStyle.NoPen)
        p.drawEllipse(QPointF(0, -18), 4.5, 8.0)
        p.restore()
    else:
        for sh in pr["ceramic_shards"]:
            p.save()
            p.translate(QPointF(x0 + sh["x"] * sx, y0 + sh["y"] * sy))
            p.rotate(math.degrees(sh["ang"]))
            p.setBrush(QBrush(QColor(218, 210, 194)))
            p.setPen(QPen(C_INK, 1.2))
            tri = QPainterPath()
            tri.moveTo(-6, -3)
            tri.lineTo(7, -1)
            tri.lineTo(2, 5)
            tri.closeSubpath()
            p.drawPath(tri)
            p.restore()

    draw_sack_qt(p, wf["actors"]["inigo"], x0, y0, sx, sy, QColor(223, 210, 183), seed, show_rig=True, label="" if hide_labels else "INIGO")
    draw_sack_qt(p, wf["actors"]["belindo"], x0, y0, sx, sy, QColor(235, 226, 206), seed + 7, show_rig=True, label="" if hide_labels else "BELINDO")
    draw_sack_qt(p, wf["actors"]["flower"], x0, y0, sx, sy, QColor(245, 239, 224), seed + 13, show_rig=True, label="" if hide_labels else "FLOWER")

    if not hide_labels:
        erased = "E2_DELIBERATE_SHOVE" in mem_f.get("erased_by_filter", [])
        p.fillRect(QRectF(x0 + 8, y0 + 8, pw - 16, 28), QColor(29, 25, 21, 215))
        p.setFont(get_font("mono", 9, bold=True))
        p.setPen(C_PAPER_HI)
        hdr = f"{branch['branch_id']} · Pose={wf['actors']['flower']['performed_action']}"
        p.drawText(QRectF(x0 + 16, y0 + 8, pw - 32, 28), Qt.AlignmentFlag.AlignVCenter, hdr)
        if tick >= 48:
            fx, fy = x0 + wf["actors"]["flower"]["cx"] * sx, y0 + (wf["actors"]["flower"]["foot_y"] - 68) * sy
            ix, iy = x0 + wf["actors"]["inigo"]["cx"] * sx, y0 + (wf["actors"]["inigo"]["foot_y"] - 62) * sy
            rough_line(p, fx, fy, ix, iy, seed, 0.7, C_CRIMSON if erased else C_EMERALD, 1.6, dashed=erased)

    p.setPen(QPen(C_INK, 2.0))
    p.setBrush(Qt.BrushStyle.NoBrush)
    p.drawRect(QRectF(x0, y0, pw, ph))
    p.restore()


def build_flour_audio_and_timing(bundle: dict):
    """Synthesize Kokoro v1.0 narration + 440Hz -> parameter-coupled foley track for Film 00."""
    rng = np.random.default_rng(1974)
    lines = [
        ("archivist", "bf_emma", 0.96, "First Risk Case: The Cellar of the Abominable House. Three half-filled flour sacks conserve volume without faces: Inigo, Belindo, and the witness Flower."),
        ("polo", "bm_fable", 0.95, "In Checkpoint Lawful A, Inigo holds coiled stillness, then lunges deliberately into Belindo, shattering the oil lamp. Flower retains the complete causal chain, shields Belindo, and enforces Policy P one against Inigo."),
        ("khan", "bm_george", 0.93, "Now fork Clinamen Branch A prime. Keep every physical trace in the cellar identical: the eighty-four Newton-second shove, the floor scuff, the spreading oil, and the five ceramic shards. Erase only the shove from Flower's memory."),
        ("polo", "bm_fable", 0.92, "Seeing only Belindo crash into the flame, Flower recoils into the far corner. Under Policy P three, an honest witness's partial memory hardens into institutional law, billing the victim while the floor scuff stays mute."),
    ]
    segments = []
    cursor = 0.65
    clips = []
    for role, voice, spd, txt in lines:
        wav = speak(txt, voice=voice, speed=spd, target_sr=SR)
        dur = len(wav) / float(SR)
        segments.append({"speaker": role, "voice": voice, "t0": round(cursor, 3), "t1": round(cursor + dur, 3), "text": txt})
        clips.append((cursor, wav, -0.18 if role == "polo" else (0.18 if role == "khan" else 0.0)))
        cursor += dur + 0.65

    total_dur = max(28.0, cursor + 1.0)
    total_samples = int(total_dur * SR)
    mix = np.zeros((total_samples, 2), dtype=np.float64)

    # Subtle cellar room air + 440Hz reference hum in first half, fracturing in second half
    t = np.arange(total_samples) / float(SR)
    swerve_t = segments[2]["t0"] + 1.2
    hum_env = np.where(t < swerve_t, 0.016, 0.003)
    hum = np.sin(2 * np.pi * 440.0 * t) * hum_env
    airL = lp(rng.standard_normal(total_samples), 180) * 0.011 + hum
    airR = lp(rng.standard_normal(total_samples), 180) * 0.011 + hum
    mix[:, 0] += airL
    mix[:, 1] += airR

    # Parameter-coupled foley hits locked to visual cellar cycles (8.0s loop = 192 ticks)
    cycle_len = 192.0 / FPS  # 8.0s
    n_cycles = int(math.ceil(total_dur / cycle_len))
    for cyc in range(n_cycles):
        base = cyc * cycle_len
        # Tick 48 (2.00s): sack shove thud
        t_shove = base + 48.0 / FPS
        if t_shove < total_dur - 0.3:
            n = int(0.24 * SR)
            tt = np.arange(n) / float(SR)
            thud = np.sin(2 * np.pi * (82 * np.exp(-tt * 11)) * tt) * np.exp(-tt * 16) * 0.32
            mix_at(mix, thud, t_shove, gain=0.85, pan=-0.25)
        # Tick 76 (3.167s): ceramic lamp fracture pings (5 shard angles!) + oil bloom
        t_lamp = base + 76.0 / FPS
        if t_lamp < total_dur - 0.5:
            n = int(0.36 * SR)
            tt = np.arange(n) / float(SR)
            pings = np.zeros(n)
            for f_hz, ang in [(2180, 0.42), (2640, 1.15), (1930, 2.04), (3110, 2.68), (2490, 0.88)]:
                pings += np.sin(2 * np.pi * f_hz * (1 + 0.05 * ang) * tt) * np.exp(-tt * 19) * 0.09
            whoosh = bp(rng.standard_normal(n), 220, 1450) * np.exp(-tt * 8.5) * 0.22
            mix_at(mix, pings + whoosh, t_lamp, gain=0.9, pan=0.15)

    # Mix Kokoro dialogue with cellar vault impulse response
    for t0, wav, pan in clips:
        st = apply_verb(wav, room="hall", wet=0.14)
        # Apply slight pan balance
        st[:, 0] *= (1.0 - max(0.0, pan) * 0.35)
        st[:, 1] *= (1.0 + min(0.0, pan) * 0.35)
        mix_at(mix, st, t0, gain=0.92)

    peak = max(np.max(np.abs(mix)), 1e-6)
    mix_i16 = np.clip(mix / peak * 0.88 * 32767.0, -32767, 32767).astype(np.int16)

    slug = "00-abominable-cellar-flour-test"
    wav_tmp = os.path.join(AUDIO_DIR, f"{slug}.wav")
    m4a_out = os.path.join(AUDIO_DIR, f"{slug}.m4a")
    wavfile.write(wav_tmp, SR, mix_i16)
    subprocess.run([
        "/opt/homebrew/bin/ffmpeg", "-y", "-loglevel", "error",
        "-i", wav_tmp, "-c:a", "aac", "-b:a", "192k", m4a_out
    ], check=True)
    os.remove(wav_tmp)

    timing = {
        "slug": slug,
        "duration": round(total_dur, 3),
        "total_frames": int(round(total_dur * FPS)),
        "segments": segments,
    }
    with open(os.path.join(TIMING_DIR, f"{slug}.json"), "w") as f:
        json.dump(timing, f, indent=2)
    return timing, m4a_out


def render_composite_frame(bundle: dict, timing: dict, f_idx: int, hide_labels=False) -> QImage:
    img = QImage(W, H, QImage.Format.Format_ARGB32)
    img.fill(C_PAPER)
    p = QPainter(img)
    p.setRenderHint(QPainter.RenderHint.Antialiasing, True)

    tick = f_idx % 192
    t_sec = f_idx / float(FPS)

    if not hide_labels:
        p.fillRect(QRectF(0, 0, W, 52), C_INK)
        p.setFont(get_font("mono", 12, bold=True))
        p.setPen(C_PAPER_HI)
        p.drawText(
            QRectF(20, 8, W - 40, 36),
            Qt.AlignmentFlag.AlignVCenter,
            f"SCION PROOF FILM 00 · THE FLOUR TEST WITNESS-MEMORY SWERVE · CELLAR TICK {tick:03d}/191"
        )

    top_y = 64 if not hide_labels else 24
    pane_h = 420 if not hide_labels else 672
    pane_w = 612

    draw_cellar_pane(p, bundle["branches"]["A"], tick, 20, top_y, pane_w, pane_h, hide_labels=hide_labels)
    draw_cellar_pane(p, bundle["branches"]["A_PRIME"], tick, 648, top_y, pane_w, pane_h, hide_labels=hide_labels)

    if not hide_labels:
        # Bottom ledger & subtitle strip
        p.fillRect(QRectF(20, 498, W - 40, 128), C_PAPER_HI)
        p.setPen(QPen(C_INK, 1.6))
        p.drawRect(QRectF(20, 498, W - 40, 128))

        if tick < 76:
            a_pol = "ARMED_PENDING_INCIDENT"
            ap_pol = "ARMED_PENDING_INCIDENT"
        elif tick < 164:
            a_pol = "EVALUATING: SHOVE + LAMP IN RECORD"
            ap_pol = "EVALUATING: SHOVE ERASED BY [-| FILTER]"
        else:
            a_pol = bundle["branches"]["A"]["rule_ledger"]["P4_SUBROGATION_LIABILITY"]["status"]
            ap_pol = bundle["branches"]["A_PRIME"]["rule_ledger"]["P4_SUBROGATION_LIABILITY"]["status"]
        scuff = bundle["branches"]["A"]["world_trace"][tick]["props_and_residue"]["floor_scuff"]["len"]
        oil = bundle["branches"]["A"]["world_trace"][tick]["props_and_residue"]["oil_spill_radius"]
        vol_err = bundle["branches"]["A"]["invariants"]["max_volume_area_error_pct"]

        p.setFont(get_font("mono", 10, bold=True))
        p.setPen(C_INK)
        p.drawText(QRectF(34, 508, W - 68, 24), Qt.AlignmentFlag.AlignVCenter,
                   f"SHARED WORLD RESIDUE: Scuff={scuff:.0f}px (INTACT IN BOTH) · Oil Radius={oil:.1f}px · Max Sack Volume Drift={vol_err:.5f}%")
        p.setPen(C_EMERALD)
        p.drawText(QRectF(34, 536, 590, 24), Qt.AlignmentFlag.AlignVCenter,
                   f"LAWFUL A P4: {a_pol}")
        p.setPen(C_CRIMSON)
        p.drawText(QRectF(654, 536, 590, 24), Qt.AlignmentFlag.AlignVCenter,
                   f"CLINAMEN A' P4: {ap_pol}")

        # Active spoken caption
        cur_txt = ""
        for seg in timing["segments"]:
            if seg["t0"] <= t_sec <= seg["t1"] + 0.25:
                cur_txt = f"[{seg['speaker'].upper()}] {seg['text']}"
                break
        if cur_txt:
            p.setFont(get_font("serif", 13, italic=True))
            p.setPen(C_INK)
            p.drawText(QRectF(34, 566, W - 68, 54), Qt.AlignmentFlag.AlignLeft | Qt.TextFlag.TextWordWrap, cur_txt)

        # Exposure-sheet ruler along very bottom
        p.fillRect(QRectF(20, 640, W - 40, 60), C_PAPER_DEEP)
        p.setPen(QPen(C_INK, 1.4))
        p.drawRect(QRectF(20, 640, W - 40, 60))
        p.setFont(get_font("mono", 9, bold=True))
        p.drawText(QRectF(32, 646, 500, 18), Qt.AlignmentFlag.AlignVCenter,
                   "EXPOSURE SHEET (ONES / TWOS / DELIBERATE HOLDS) & CLINAMEN CLOCK:")
        for k in range(64):
            bx = 32 + k * ((W - 64) / 64.0)
            active = int((tick / 192.0) * 64) == k
            p.fillRect(QRectF(bx, 670, 8 if active else 3, 22 if k % 4 == 0 else 12), C_CRIMSON if active else C_INK_MID)

    p.end()
    return img


def main():
    init_qt()
    bundle = build_and_verify_flour_proof(os.path.join(HERE, "checkpoints"))
    timing, m4a_path = build_flour_audio_and_timing(bundle)
    slug = "00-abominable-cellar-flour-test"
    sheet_dir = os.path.join(SHEETS_DIR, slug)
    os.makedirs(sheet_dir, exist_ok=True)

    # 1. Render MUTE SILHOUETTE GATE SHEET (Zero text labels!) across the 6 critical beats
    key_ticks = [16, 30, 48, 76, 102, 148]
    cw, ch = 640, 360
    mute_sheet = QImage(cw * 2, ch * 3, QImage.Format.Format_ARGB32)
    mute_sheet.fill(C_INK)
    mp = QPainter(mute_sheet)
    for i, tk in enumerate(key_ticks):
        fr = render_composite_frame(bundle, timing, tk, hide_labels=True)
        col, row = i % 2, i // 2
        mp.drawImage(QRectF(col * cw + 4, row * ch + 4, cw - 8, ch - 8), fr)
    mp.end()
    mute_path = os.path.join(sheet_dir, "mute_silhouette_sheet.jpg")
    mute_sheet.save(mute_path, "JPG", 92)

    # 2. Render Annotated Contact Sheet
    ann_sheet = QImage(cw * 2, ch * 3 + 54, QImage.Format.Format_ARGB32)
    ann_sheet.fill(C_INK)
    ap = QPainter(ann_sheet)
    ap.setFont(get_font("mono", 12, bold=True))
    ap.setPen(C_PAPER_HI)
    ap.drawText(QRectF(18, 10, cw * 2 - 36, 34), Qt.AlignmentFlag.AlignVCenter,
                "SCION PROOF 00 · ABOMINABLE CELLAR FLOUR TEST (LAWFUL A vs CLINAMEN A')")
    for i, tk in enumerate(key_ticks):
        fr = render_composite_frame(bundle, timing, tk, hide_labels=False)
        col, row = i % 2, i // 2
        ap.drawImage(QRectF(col * cw + 4, 54 + row * ch + 4, cw - 8, ch - 8), fr)
    ap.end()
    sheet_path = os.path.join(sheet_dir, "contact_sheet.jpg")
    ann_sheet.save(sheet_path, "JPG", 92)

    # 3. Encode full 24fps MP4
    out_mp4 = os.path.join(FILMS_DIR, f"{slug}.mp4")
    out_jpg = os.path.join(FILMS_DIR, f"{slug}.jpg")
    cmd = [
        "/opt/homebrew/bin/ffmpeg", "-y", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "bgra", "-s", f"{W}x{H}", "-r", str(FPS),
        "-i", "pipe:0",
        "-i", m4a_path,
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "22", "-pix_fmt", "yuv420p",
        "-c:a", "copy", "-movflags", "+faststart", "-shortest", out_mp4,
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.PIPE)
    total_f = timing["total_frames"]
    for f_idx in range(total_f):
        img = render_composite_frame(bundle, timing, f_idx, hide_labels=False)
        if f_idx == 148:
            img.save(out_jpg, "JPG", 90)
        ptr = img.constBits()
        ptr.setsize(W * H * 4)
        proc.stdin.write(bytes(ptr))
    proc.stdin.close()
    err = proc.stderr.read().decode("utf-8", "ignore")
    if proc.wait() != 0:
        raise RuntimeError(f"ffmpeg failed: {err}")
    print(f"[proof-00] Rendered {out_mp4} ({total_f} frames) + {mute_path} + {sheet_path}")


if __name__ == "__main__":
    main()
