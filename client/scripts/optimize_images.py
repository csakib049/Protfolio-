"""Convert local public JPG/PNG assets to smaller WebP files and update references."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
TEXT_ROOTS = [ROOT / "src", ROOT / "index.html"]
converted = 0
saved = 0

for source in list(PUBLIC.rglob("*")):
    if not source.is_file() or source.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
        continue
    target = source.with_suffix(".webp")
    original_size = source.stat().st_size
    with Image.open(source) as image:
        image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
        image.save(target, "WEBP", quality=80, method=6)
    if target.stat().st_size >= original_size:
        target.unlink()
        continue
    saved += original_size - target.stat().st_size
    old_ref = "/" + source.relative_to(PUBLIC).as_posix()
    new_ref = "/" + target.relative_to(PUBLIC).as_posix()
    for root in TEXT_ROOTS:
        files = [root] if root.is_file() else root.rglob("*")
        for file in files:
            if file.is_file() and file.suffix.lower() in {".jsx", ".js", ".css", ".html", ".json"}:
                content = file.read_text(encoding="utf-8")
                updated = content.replace(old_ref, new_ref)
                if updated != content:
                    file.write_text(updated, encoding="utf-8")
    if source.exists():
        source.unlink()
    converted += 1

print(f"Converted {converted} images to WebP and saved about {saved / 1024 / 1024:.1f} MB.")
