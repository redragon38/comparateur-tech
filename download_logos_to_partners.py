#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Télécharge/copie automatiquement tous les logos dans public/partners
et met à jour public/data/tools.json pour que les chemins pointent vers /partners/...

Utilisation :
    python3 download_logos_to_partners.py
    python3 download_logos_to_partners.py --force
    python3 download_logos_to_partners.py /chemin/vers/projet --force
    python3 download_logos_to_partners.py --dry-run

Fonctionnement :
- lit public/data/tools.json
- force tous les logos à être stockés dans public/partners
- si un logo local existe déjà ailleurs dans public/, il le copie vers public/partners
- si le logo manque, il tente de le télécharger depuis :
  - l'URL du logo si elle est distante
  - les balises <link rel="icon"> du site
  - quelques endpoints classiques (favicon.ico, apple-touch-icon, etc.)
  - Google S2 / DuckDuckGo en secours
- sauvegarde une copie de tools.json avant modification

Dépendances : aucune (stdlib uniquement)
"""

from __future__ import annotations

import json
import mimetypes
import os
import re
import shutil
import socket
import sys
import time
from html import unescape
from pathlib import Path
from typing import Iterable, List, Optional, Tuple
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urljoin, urlparse
from urllib.request import Request, urlopen

ALLOWED_EXTS = {".png", ".jpg", ".jpeg", ".svg", ".webp", ".ico", ".gif"}
UA = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
)

CONTENT_TYPE_TO_EXT = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/svg+xml": ".svg",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/x-icon": ".ico",
    "image/vnd.microsoft.icon": ".ico",
}


def parse_args(argv: List[str]):
    force = False
    dry_run = False
    timeout = 20
    project_root: Optional[Path] = None

    for arg in argv[1:]:
        if arg == "--force":
            force = True
        elif arg == "--dry-run":
            dry_run = True
        elif arg.startswith("--timeout="):
            timeout = int(arg.split("=", 1)[1])
        elif arg.startswith("-"):
            raise SystemExit(f"Option inconnue: {arg}")
        else:
            project_root = Path(arg).expanduser().resolve()

    return force, dry_run, timeout, project_root


def find_project_root(explicit: Optional[Path]) -> Path:
    candidates = []
    if explicit:
        candidates.append(explicit)
    candidates += [Path.cwd(), Path(__file__).resolve().parent, Path(__file__).resolve().parent.parent]

    seen = set()
    for candidate in candidates:
        candidate = candidate.resolve()
        if candidate in seen:
            continue
        seen.add(candidate)
        if (candidate / "public" / "data" / "tools.json").exists():
            return candidate

    raise SystemExit(
        "Impossible de trouver le projet. Lance le script à la racine du projet, "
        "ou passe le chemin du projet en argument."
    )


def load_tools(path: Path):
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list):
        raise SystemExit("tools.json doit contenir une liste JSON")
    return data


def backup_file(path: Path, dry_run: bool) -> Optional[Path]:
    backup = path.with_suffix(path.suffix + f".bak-{time.strftime('%Y%m%d-%H%M%S')}")
    if not dry_run:
        shutil.copy2(path, backup)
    return backup


def unique(items: Iterable[str]) -> List[str]:
    seen = set()
    out = []
    for item in items:
        if item and item not in seen:
            seen.add(item)
            out.append(item)
    return out


def slugify(value: str) -> str:
    value = (value or "logo").strip().lower()
    value = re.sub(r"[^a-z0-9._-]+", "-", value)
    value = re.sub(r"-+", "-", value).strip("-._")
    return value or "logo"


def guess_ext_from_url(url: str) -> Optional[str]:
    try:
        ext = Path(urlparse(url).path).suffix.lower()
    except Exception:
        return None
    return ".jpg" if ext == ".jpeg" else (ext if ext in ALLOWED_EXTS else None)


def guess_ext(content_type: Optional[str], url: str) -> str:
    ct = (content_type or "").split(";", 1)[0].strip().lower()
    if ct in CONTENT_TYPE_TO_EXT:
        return CONTENT_TYPE_TO_EXT[ct]
    ext = guess_ext_from_url(url)
    if ext:
        return ext
    guessed, _ = mimetypes.guess_type(url)
    if guessed and guessed in CONTENT_TYPE_TO_EXT:
        return CONTENT_TYPE_TO_EXT[guessed]
    return ".png"


def looks_like_image(data: bytes, ext: str) -> bool:
    if not data or len(data) < 32:
        return False
    if ext == ".png":
        return data.startswith(b"\x89PNG\r\n\x1a\n")
    if ext in {".jpg", ".jpeg"}:
        return data.startswith(b"\xff\xd8")
    if ext == ".gif":
        return data.startswith((b"GIF87a", b"GIF89a"))
    if ext == ".webp":
        return data.startswith(b"RIFF") and b"WEBP" in data[:16]
    if ext == ".ico":
        return data.startswith(b"\x00\x00\x01\x00")
    if ext == ".svg":
        start = data[:512].lstrip().lower()
        return start.startswith(b"<svg") or b"<svg" in start or start.startswith(b"<?xml")
    return True


def fetch(url: str, timeout: int, accept: str = "image/*,*/*;q=0.8") -> Tuple[bytes, str, Optional[str]]:
    req = Request(url, headers={
        "User-Agent": UA,
        "Accept": accept,
        "Referer": "https://www.google.com/",
    })
    with urlopen(req, timeout=timeout) as resp:
        return resp.read(), resp.geturl(), resp.headers.get("Content-Type")


def fetch_html(url: str, timeout: int) -> List[str]:
    try:
        raw, final_url, ctype = fetch(url, timeout, accept="text/html,application/xhtml+xml,*/*;q=0.8")
    except Exception:
        return []

    ctype = (ctype or "").lower()
    if "html" not in ctype and b"<html" not in raw[:2048].lower():
        return []

    try:
        html = raw.decode("utf-8", errors="ignore")
    except Exception:
        return []

    found = []
    # Rel icon/apple-touch-icon/mask-icon etc.
    link_tags = re.findall(r"<link\b[^>]*>", html, flags=re.I)
    for tag in link_tags:
        rel_m = re.search(r'rel=["\']([^"\']+)["\']', tag, flags=re.I)
        href_m = re.search(r'href=["\']([^"\']+)["\']', tag, flags=re.I)
        if not href_m:
            continue
        rel = (rel_m.group(1).lower() if rel_m else "")
        if any(k in rel for k in ["icon", "apple-touch", "mask-icon", "shortcut"]):
            href = unescape(href_m.group(1).strip())
            found.append(urljoin(final_url, href))
    return unique(found)


def build_candidate_urls(tool: dict, timeout: int) -> List[str]:
    logo = tool.get("logo")
    website = tool.get("website")
    urls: List[str] = []

    if isinstance(logo, str) and logo.startswith(("http://", "https://")):
        urls.append(logo)

    if isinstance(website, str) and website.startswith(("http://", "https://")):
        parsed = urlparse(website)
        host = parsed.netloc
        scheme = parsed.scheme or "https"
        if host:
            root = f"{scheme}://{host}"
            urls.extend(fetch_html(website, timeout))
            urls.extend([
                f"{root}/favicon.ico",
                f"{root}/favicon.png",
                f"{root}/favicon.svg",
                f"{root}/apple-touch-icon.png",
                f"{root}/apple-touch-icon-precomposed.png",
                f"https://www.google.com/s2/favicons?sz=256&domain_url={quote(website, safe='')}",
                f"https://icons.duckduckgo.com/ip3/{quote(host, safe='')}.ico",
            ])
            if host.startswith("www."):
                bare = host[4:]
                bare_root = f"{scheme}://{bare}"
                urls.extend([
                    f"{bare_root}/favicon.ico",
                    f"{bare_root}/apple-touch-icon.png",
                    f"https://icons.duckduckgo.com/ip3/{quote(bare, safe='')}.ico",
                ])
            else:
                www = f"www.{host}"
                www_root = f"{scheme}://{www}"
                urls.extend([
                    f"{www_root}/favicon.ico",
                    f"{www_root}/apple-touch-icon.png",
                    f"https://icons.duckduckgo.com/ip3/{quote(www, safe='')}.ico",
                ])

    return unique(urls)


def try_download(urls: List[str], timeout: int) -> Tuple[Optional[bytes], Optional[str], Optional[str], Optional[str]]:
    last_error = None
    for url in urls:
        try:
            data, final_url, content_type = fetch(url, timeout)
            ext = guess_ext(content_type, final_url)
            if looks_like_image(data, ext):
                return data, final_url, content_type, None
            last_error = f"format invalide depuis {url}"
        except (HTTPError, URLError, socket.timeout, TimeoutError, ValueError) as exc:
            last_error = f"{type(exc).__name__}: {exc}"
        except Exception as exc:
            last_error = f"{type(exc).__name__}: {exc}"
    return None, None, None, last_error


def write_bytes(path: Path, data: bytes, dry_run: bool):
    if dry_run:
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("wb") as f:
        f.write(data)


def copy_file(src: Path, dst: Path, dry_run: bool):
    if dry_run:
        return
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)


def main(argv: List[str]) -> int:
    force, dry_run, timeout, explicit_root = parse_args(argv)
    root = find_project_root(explicit_root)
    tools_path = root / "public" / "data" / "tools.json"
    partners_dir = root / "public" / "partners"
    tools = load_tools(tools_path)

    changed_json = False
    backup_path: Optional[Path] = None
    backup_done = False

    ok = 0
    copied = 0
    downloaded = 0
    skipped = 0
    failed = 0
    fixed_refs = 0
    failures = []

    print(f"Projet      : {root}")
    print(f"tools.json  : {tools_path}")
    print(f"Destination : {partners_dir}")
    print(f"Mode        : {'FORCE' if force else 'normal'}{' + DRY-RUN' if dry_run else ''}")
    print()

    for i, tool in enumerate(tools, start=1):
        tool_id = slugify(str(tool.get("id") or f"tool-{i}"))
        name = str(tool.get("name") or tool_id)
        logo = tool.get("logo")
        website = tool.get("website")
        prefix = f"[{i:03d}/{len(tools)}] {tool_id}"

        # Nom de base du fichier dans /partners
        if isinstance(logo, str) and logo.startswith("/"):
            stem = slugify(Path(logo).stem)
            original_abs = root / "public" / logo.lstrip("/")
            original_ext = Path(logo).suffix.lower()
        else:
            stem = tool_id
            original_abs = None
            original_ext = None

        if not stem:
            stem = tool_id

        target_ext = original_ext if original_ext in ALLOWED_EXTS else ".png"
        target_abs = partners_dir / f"{stem}{target_ext}"
        target_rel = f"/partners/{target_abs.name}"

        # 1) Si le fichier existe déjà dans /partners et pas de force : on garde.
        existing_variants = [p for p in partners_dir.glob(f"{stem}.*") if p.suffix.lower() in ALLOWED_EXTS and p.is_file() and p.stat().st_size > 0]
        if existing_variants and not force:
            chosen = sorted(existing_variants, key=lambda p: (p.suffix.lower() != target_ext, p.name))[0]
            new_rel = f"/partners/{chosen.name}"
            if tool.get("logo") != new_rel:
                tool["logo"] = new_rel
                changed_json = True
                fixed_refs += 1
                print(f"{prefix} ref corrigée -> {new_rel}")
            else:
                print(f"{prefix} déjà OK -> {new_rel}")
            ok += 1
            continue

        # 2) Si un fichier local existe ailleurs dans public/, on le copie dans /partners.
        if original_abs and original_abs.exists() and original_abs.is_file() and original_abs.stat().st_size > 0 and not force:
            if original_abs.resolve() != target_abs.resolve():
                copy_file(original_abs, target_abs, dry_run)
                copied += 1
                print(f"{prefix} copié vers /partners -> {target_rel}")
            else:
                print(f"{prefix} déjà dans /partners -> {target_rel}")
            if tool.get("logo") != target_rel:
                tool["logo"] = target_rel
                changed_json = True
                fixed_refs += 1
            ok += 1
            continue

        # 3) Téléchargement.
        urls = build_candidate_urls(tool, timeout)
        if not urls:
            failed += 1
            failures.append(f"{tool_id}: aucune source exploitable (website/logo distant manquant)")
            print(f"{prefix} ÉCHEC aucune source exploitable")
            continue

        data, final_url, content_type, error = try_download(urls, timeout)
        if not data or not final_url:
            failed += 1
            failures.append(f"{tool_id}: {error or 'téléchargement impossible'}")
            print(f"{prefix} ÉCHEC {error or 'téléchargement impossible'}")
            continue

        ext = guess_ext(content_type, final_url)
        target_abs = partners_dir / f"{stem}{ext}"
        target_rel = f"/partners/{target_abs.name}"
        write_bytes(target_abs, data, dry_run)
        downloaded += 1
        ok += 1
        if tool.get("logo") != target_rel:
            tool["logo"] = target_rel
            changed_json = True
            fixed_refs += 1
        print(f"{prefix} téléchargé -> {target_rel}")

    if changed_json:
        if not backup_done:
            backup_path = backup_file(tools_path, dry_run)
            backup_done = True
        if dry_run:
            print("\n[DRY-RUN] tools.json serait mis à jour.")
        else:
            with tools_path.open("w", encoding="utf-8") as f:
                json.dump(tools, f, ensure_ascii=False, indent=2)
            print("\ntools.json mis à jour.")
            if backup_path:
                print(f"Backup : {backup_path}")

    print("\n=== RÉSUMÉ ===")
    print(f"OK              : {ok}")
    print(f"Copiés          : {copied}")
    print(f"Téléchargés     : {downloaded}")
    print(f"Réfs corrigées  : {fixed_refs}")
    print(f"Ignorés/Skip    : {skipped}")
    print(f"Échecs          : {failed}")

    if failures:
        print("\n=== ÉCHECS ===")
        for line in failures:
            print("-", line)

    print("\nTerminé.")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv))
    except KeyboardInterrupt:
        raise SystemExit("\nInterrompu.")
