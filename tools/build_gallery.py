"""ギャラリーの画像リストと軽量画像を作るスクリプト

  images/gallery/picup/ の画像 → ピックアップ（最初から表示）
  images/gallery/       の画像 → MOREボタンを押すと表示

並び順はファイル名順です。順番を決めたいときはファイル名の頭に 01_ 02_ … と付けてください。

使い方（public フォルダで実行）:
  py tools/build_gallery.py

画像を入れ替えたら、push する前にこれを実行してください。
images/thumbs（軽量画像）と js/gallery-data.js（画像リスト）が作り直されます。
"""

import hashlib
import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent
GALLERY = ROOT / "images" / "gallery"
PICKUP = GALLERY / "picup"
THUMBS = ROOT / "images" / "thumbs"
DATA_JS = ROOT / "js" / "gallery-data.js"

EXTS = {".png", ".jpg", ".jpeg", ".webp", ".gif"}
THUMB_PX = 700    # 一覧に並べる画像の長辺
FULL_PX = 1600    # 拡大表示の画像の長辺


def natural_key(path):
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", path.name)]


def list_images(folder):
    if not folder.is_dir():
        return []
    files = [p for p in folder.iterdir() if p.is_file() and p.suffix.lower() in EXTS]
    return sorted(files, key=natural_key)


def save_webp(im, size, dest):
    copy = im.copy()
    copy.thumbnail((size, size), Image.LANCZOS)
    copy.save(dest, "WEBP", quality=82, method=4)
    return copy.size


def process(path, used):
    key = hashlib.sha1(path.read_bytes()).hexdigest()[:12]
    thumb = THUMBS / f"{key}-s.webp"
    full = THUMBS / f"{key}-l.webp"
    used.update({thumb.name, full.name})

    if thumb.exists() and full.exists():
        with Image.open(thumb) as t:
            w, h = t.size
    else:
        with Image.open(path) as im:
            im = ImageOps.exif_transpose(im)
            has_alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
            im = im.convert("RGBA" if has_alpha else "RGB")
            w, h = save_webp(im, THUMB_PX, thumb)
            save_webp(im, FULL_PX, full)
        print(f"  作成: {path.relative_to(GALLERY)}")

    return {
        "thumb": f"images/thumbs/{thumb.name}",
        "full": f"images/thumbs/{full.name}",
        "w": w,
        "h": h,
    }


def build():
    THUMBS.mkdir(parents=True, exist_ok=True)
    used = set()
    data = {"pickup": [], "more": []}

    for name, folder in (("pickup", PICKUP), ("more", GALLERY)):
        for path in list_images(folder):
            try:
                data[name].append(process(path, used))
            except Exception as e:  # 壊れた画像などは飛ばして続ける
                print(f"  スキップ: {path.relative_to(GALLERY)} ({e})")

    # もう使っていない軽量画像を消す
    for old in THUMBS.glob("*.webp"):
        if old.name not in used:
            old.unlink()

    DATA_JS.write_text(
        "// tools/build_gallery.py が自動で作るファイルです（手で編集しないでください）\n"
        f"window.GALLERY = {json.dumps(data, ensure_ascii=False, indent=2)};\n",
        encoding="utf-8",
    )
    print(f"ピックアップ {len(data['pickup'])}枚 / MORE {len(data['more'])}枚")


if __name__ == "__main__":
    build()
