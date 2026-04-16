#!/usr/bin/env python3
"""
Normalise tous les logos dans public/partners et met à jour public/data/tools.json.

Usage:
  python3 fix_all_partners_logos.py --force
  python3 fix_all_partners_logos.py --only-missing
  python3 fix_all_partners_logos.py --project /chemin/vers/projet --force

Le script :
- lit public/data/tools.json
- essaie de récupérer un logo exploitable pour chaque outil
- écrit les fichiers dans public/partners
- met à jour le champ "logo" vers /partners/...
- crée une sauvegarde de tools.json avant modification

Sources essayées :
- logo distant déjà présent dans tools.json
- website/favicon.ico
- website/favicon.png
- website/apple-touch-icon.png
- logo.clearbit.com/<domain>
- Google S2 favicons
- DuckDuckGo icons
"""

from __future__ import annotations

import argparse
import json
import mimetypes
import os
import re
import shutil
import socket
import ssl
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Optional
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urljoin, urlparse
from urllib.request import Request, urlopen

TIMEOUT = 20
USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"

# Dépendances optionnelles
try:
    from PIL import Image  # type: ignore
except Exception:
    Image = None

try:
    import cairosvg  # type: ignore
except Exception:
    cairosvg = None


@dataclass
class FetchResult:
    ok: bool
    bytes_data: bytes | None = None
    content_type: str | None = None
    final_url: str | None = None
    reason: str | None = None


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-+", "-", value).strip("-")
    return value or "logo"


def guess_ext(url: str | None, content_type: str | None, data: bytes | None) -> str:
    ctype = (content_type or "").split(";")[0].strip().lower()
    by_ctype = {
        "image/png": ".png",
        "image/jpeg": ".jpg",
        "image/jpg": ".jpg",
        "image/svg+xml": ".svg",
        "image/x-icon": ".ico",
        "image/vnd.microsoft.icon": ".ico",
        "image/webp": ".webp",
        "image/gif": ".gif",
        "image/bmp": ".bmp",
        "image/avif": ".avif",
    }
    if ctype in by_ctype:
        return by_ctype[ctype]

    if data:
        head = data[:64]
        if head.startswith(b"\x89PNG\r\n\x1a\n"):
            return ".png"
        if head[:3] == b"GIF":
            return ".gif"
        if head[:2] == b"BM":
            return ".bmp"
        if head[:4] == b"RIFF" and b"WEBP" in head[:16]:
            return ".webp"
        if head[:4] == b"\x00\x00\x01\x00":
            return ".ico"
        if head[:2] == b"\xff\xd8":
            return ".jpg"
        txt = data[:512].lstrip().lower()
        if txt.startswith(b"<svg") or txt.startswith(b"<?xml"):
            return ".svg"

    if url:
        path = urlparse(url).path
        ext = Path(path).suffix.lower()
        if ext in {".png", ".jpg", ".jpeg", ".svg", ".ico", ".webp", ".gif", ".bmp", ".avif"}:
            return ".jpg" if ext == ".jpeg" else ext

    return ".png"


def is_probably_html(data: bytes) -> bool:
    sample = data[:512].lstrip().lower()
    return sample.startswith(b"<!doctype html") or sample.startswith(b"<html")


def fetch(url: str) -> FetchResult:
    req = Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        },
    )
    try:
        context = ssl.create_default_context()
        with urlopen(req, timeout=TIMEOUT, context=context) as r:
            data = r.read()
            ctype = r.headers.get("Content-Type", "")
            final = r.geturl()
            if not data:
                return FetchResult(False, reason="réponse vide")
            if is_probably_html(data):
                return FetchResult(False, reason="HTML au lieu d'une image")
            return FetchResult(True, bytes_data=data, content_type=ctype, final_url=final)
    except HTTPError as e:
        return FetchResult(False, reason=f"HTTP {e.code}")
    except URLError as e:
        return FetchResult(False, reason=f"URL error: {e.reason}")
    except socket.timeout:
        return FetchResult(False, reason="timeout")
    except Exception as e:
        return FetchResult(False, reason=str(e))


def domain_from_website(website: str | None) -> str | None:
    if not website:
        return None
    try:
        parsed = urlparse(website)
        host = parsed.netloc.strip().lower()
        if host.startswith("www."):
            host = host[4:]
        return host or None
    except Exception:
        return None


def candidate_urls(tool: dict) -> list[str]:
    urls: list[str] = []
    logo = str(tool.get("logo") or "").strip()
    website = str(tool.get("website") or "").strip()
    domain = domain_from_website(website)

    if logo.startswith("http://") or logo.startswith("https://"):
        urls.append(logo)

    if website:
        urls.extend([
            urljoin(website, "/favicon.ico"),
            urljoin(website, "/favicon.png"),
            urljoin(website, "/apple-touch-icon.png"),
            urljoin(website, "/apple-touch-icon-precomposed.png"),
            urljoin(website, "/icon.png"),
            urljoin(website, "/logo.png"),
        ])

    if domain:
        urls.extend([
            f"https://logo.clearbit.com/{domain}",
            f"https://www.google.com/s2/favicons?sz=256&domain_url={quote(website or ('https://' + domain), safe='')}",
            f"https://icons.duckduckgo.com/ip3/{domain}.ico",
        ])

    # Déduplication en gardant l'ordre
    out = []
    seen = set()
    for u in urls:
        if u not in seen:
            seen.add(u)
            out.append(u)
    return out


def convert_to_png(src_path: Path, dst_path: Path) -> bool:
    suffix = src_path.suffix.lower()
    try:
        if suffix == ".svg" and cairosvg is not None:
            cairosvg.svg2png(url=str(src_path), write_to=str(dst_path), output_width=256, output_height=256)
            return True
        if Image is not None:
            with Image.open(src_path) as im:
                im = im.convert("RGBA")
                im.thumbnail((256, 256))
                canvas = Image.new("RGBA", (256, 256), (255, 255, 255, 0))
                x = (256 - im.width) // 2
                y = (256 - im.height) // 2
                canvas.paste(im, (x, y), im if im.mode == "RGBA" else None)
                canvas.save(dst_path, format="PNG")
                return True
    except Exception:
        return False
    return False


def save_best_asset(data: bytes, fetched_url: str, content_type: str, tmp_dir: Path, target_base: Path) -> tuple[Path, str]:
    ext = guess_ext(fetched_url, content_type, data)
    raw_path = tmp_dir / f"download{ext}"
    raw_path.write_bytes(data)

    # On préfère un PNG unifié quand possible.
    png_path = target_base.with_suffix(".png")
    if ext in {".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".ico", ".svg"}:
        if convert_to_png(raw_path, png_path):
            return png_path, ".png"

    # Sinon on garde l'extension source
    final_path = target_base.with_suffix(ext)
    shutil.copy2(raw_path, final_path)
    return final_path, ext


def existing_local_candidates(project_dir: Path, logo_field: str, slug: str) -> list[Path]:
    candidates: list[Path] = []

    if logo_field.startswith("/"):
        p = project_dir / "public" / logo_field.lstrip("/")
        candidates.append(p)

    partners_dir = project_dir / "public" / "partners"
    for ext in [".png", ".jpg", ".jpeg", ".svg", ".ico", ".webp", ".gif"]:
        candidates.append(partners_dir / f"{slug}{ext}")

    # Variante sans tirets pour certains cas éventuels
    compact = slug.replace("-", "")
    if compact != slug:
        for ext in [".png", ".jpg", ".jpeg", ".svg", ".ico", ".webp", ".gif"]:
            candidates.append(partners_dir / f"{compact}{ext}")

    # Déduplication
    out = []
    seen = set()
    for p in candidates:
        s = str(p)
        if s not in seen:
            seen.add(s)
            out.append(p)
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description="Télécharge et normalise les logos vers public/partners")
    parser.add_argument("--project", default=".", help="Racine du projet")
    parser.add_argument("--force", action="store_true", help="Retélécharge tous les logos, même ceux déjà présents")
    parser.add_argument("--only-missing", action="store_true", help="Traite seulement les logos manquants")
    parser.add_argument("--limit", type=int, default=0, help="Limiter le nombre d'outils traités")
    parser.add_argument("--pause", type=float, default=0.15, help="Pause entre téléchargements")
    args = parser.parse_args()

    project_dir = Path(args.project).resolve()
    tools_path = project_dir / "public" / "data" / "tools.json"
    partners_dir = project_dir / "public" / "partners"
    tmp_dir = project_dir / ".logo_tmp"

    if not tools_path.exists():
        print(f"ERREUR: fichier introuvable: {tools_path}")
        return 1

    partners_dir.mkdir(parents=True, exist_ok=True)
    tmp_dir.mkdir(parents=True, exist_ok=True)

    with tools_path.open("r", encoding="utf-8") as f:
        tools = json.load(f)

    backup = tools_path.with_name(f"tools.backup.{int(time.time())}.json")
    shutil.copy2(tools_path, backup)
    print(f"Sauvegarde créée: {backup}")

    ok_count = 0
    downloaded_count = 0
    reused_count = 0
    fail_count = 0
    skipped_count = 0

    processed = 0
    for tool in tools:
        if args.limit and processed >= args.limit:
            break
        processed += 1

        name = str(tool.get("name") or tool.get("id") or "logo")
        slug = slugify(str(tool.get("id") or tool.get("slug") or name))
        current_logo = str(tool.get("logo") or "")
        current_target = project_dir / "public" / current_logo.lstrip("/") if current_logo.startswith("/") else None
        target_png = partners_dir / f"{slug}.png"

        current_exists = bool(current_target and current_target.exists())
        if args.only_missing and current_exists:
            skipped_count += 1
            print(f"[SKIP] {slug}: déjà présent")
            continue
        if not args.force and current_exists and str(current_logo).startswith("/partners/"):
            skipped_count += 1
            print(f"[SKIP] {slug}: déjà présent dans /partners")
            continue

        print(f"\n=== {name} ({slug}) ===")

        # 1) Réutiliser un fichier local existant si possible (hors mode force)
        if not args.force:
            local_done = False
            for cand in existing_local_candidates(project_dir, current_logo, slug):
                if cand.exists() and cand.is_file() and cand.stat().st_size > 0:
                    if convert_to_png(cand, target_png):
                        tool["logo"] = f"/partners/{target_png.name}"
                        reused_count += 1
                        ok_count += 1
                        local_done = True
                        print(f"[OK] réutilisé localement -> {tool['logo']}")
                        break
                    else:
                        final = partners_dir / f"{slug}{cand.suffix.lower()}"
                        shutil.copy2(cand, final)
                        tool["logo"] = f"/partners/{final.name}"
                        reused_count += 1
                        ok_count += 1
                        local_done = True
                        print(f"[OK] copié localement -> {tool['logo']}")
                        break
            if local_done:
                continue

        # 2) Téléchargement distant
        success = False
        reasons: list[str] = []
        for url in candidate_urls(tool):
            print(f"  → tentative: {url}")
            result = fetch(url)
            if not result.ok or not result.bytes_data:
                reasons.append(f"{url} -> {result.reason}")
                continue
            try:
                final_path, _ext = save_best_asset(
                    data=result.bytes_data,
                    fetched_url=result.final_url or url,
                    content_type=result.content_type or "",
                    tmp_dir=tmp_dir,
                    target_base=partners_dir / slug,
                )
                tool["logo"] = f"/partners/{final_path.name}"
                ok_count += 1
                downloaded_count += 1
                success = True
                print(f"[OK] téléchargé -> {tool['logo']}")
                time.sleep(max(0.0, args.pause))
                break
            except Exception as e:
                reasons.append(f"{url} -> erreur sauvegarde: {e}")

        if not success:
            fail_count += 1
            print(f"[ECHEC] {slug}")
            for r in reasons[-3:]:
                print(f"    {r}")

    with tools_path.open("w", encoding="utf-8") as f:
        json.dump(tools, f, ensure_ascii=False, indent=2)
        f.write("\n")

    shutil.rmtree(tmp_dir, ignore_errors=True)

    print("\n===== RÉSUMÉ =====")
    print(f"OK total        : {ok_count}")
    print(f"Téléchargés     : {downloaded_count}")
    print(f"Réutilisés      : {reused_count}")
    print(f"Ignorés         : {skipped_count}")
    print(f"Erreurs         : {fail_count}")
    print(f"tools.json mis à jour : {tools_path}")
    return 0 if fail_count == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())
