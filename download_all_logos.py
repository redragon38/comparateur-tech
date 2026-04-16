#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Télécharge automatiquement les logos d'un projet qui stocke ses outils dans
public/data/tools.json.

Fonctionnement :
- lit public/data/tools.json
- pour chaque outil, repère le champ `logo`
- si le fichier local manque, tente plusieurs sources à partir du site officiel
- si une autre extension existe déjà localement (.svg/.png/.jpg/.ico/.webp),
  met à jour tools.json automatiquement
- sauvegarde les fichiers dans le bon dossier (ex: public/partners/)
- met à jour tools.json si nécessaire

Utilisation :
    python3 download_all_logos.py
    python3 download_all_logos.py --force
    python3 download_all_logos.py /chemin/vers/le/projet --force

Options :
    --force        re-télécharge même si un logo existe déjà
    --dry-run      n'écrit rien, affiche seulement ce qui serait fait
    --timeout=20   timeout HTTP par requête

Dépendances : AUCUNE (stdlib uniquement)
"""

from __future__ import annotations

import json
import mimetypes
import os
import shutil
import socket
import sys
import time
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Tuple
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlparse
from urllib.request import Request, urlopen

ALLOWED_EXTS = {".png", ".jpg", ".jpeg", ".svg", ".webp", ".ico", ".gif"}

CONTENT_TYPE_TO_EXT = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/svg+xml": ".svg",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/x-icon": ".ico",
    "image/vnd.microsoft.icon": ".ico",
    "application/octet-stream": None,
}

UA = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
)


def eprint(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)


def parse_args(argv: List[str]) -> Dict[str, object]:
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
            try:
                timeout = int(arg.split("=", 1)[1])
            except ValueError:
                raise SystemExit(f"Timeout invalide: {arg}")
        elif arg.startswith("-"):
            raise SystemExit(f"Option inconnue: {arg}")
        else:
            project_root = Path(arg).expanduser().resolve()

    return {
        "force": force,
        "dry_run": dry_run,
        "timeout": timeout,
        "project_root": project_root,
    }


def find_project_root(explicit: Optional[Path]) -> Path:
    candidates: List[Path] = []
    if explicit is not None:
        candidates.append(explicit)
    candidates.extend([
        Path.cwd(),
        Path(__file__).resolve().parent,
        Path(__file__).resolve().parent.parent,
    ])

    seen = set()
    for candidate in candidates:
        if candidate in seen:
            continue
        seen.add(candidate)
        tools = candidate / "public" / "data" / "tools.json"
        if tools.exists():
            return candidate

    searched = "\n - ".join(str(c) for c in candidates)
    raise SystemExit(
        "Impossible de trouver le projet.\n"
        "Je cherche un dossier contenant public/data/tools.json.\n"
        f"Dossiers testés:\n - {searched}"
    )


def load_tools(tools_path: Path) -> List[dict]:
    with tools_path.open("r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list):
        raise SystemExit(f"{tools_path} ne contient pas une liste JSON.")
    return data


def ensure_parent(path: Path, dry_run: bool = False) -> None:
    if dry_run:
        return
    path.parent.mkdir(parents=True, exist_ok=True)


def backup_file(path: Path, dry_run: bool = False) -> Optional[Path]:
    timestamp = time.strftime("%Y%m%d-%H%M%S")
    backup = path.with_suffix(path.suffix + f".bak-{timestamp}")
    if not dry_run:
        shutil.copy2(path, backup)
    return backup


def normalize_local_logo_path(value: str) -> Optional[str]:
    if not isinstance(value, str):
        return None
    if value.startswith("/"):
        return value
    return None


def local_abs_path(project_root: Path, local_logo_path: str) -> Path:
    return project_root / "public" / local_logo_path.lstrip("/")


def path_without_ext(path: Path) -> Path:
    return path.with_suffix("")


def find_existing_variant(base_abs_path: Path) -> Optional[Path]:
    parent = base_abs_path.parent
    stem = base_abs_path.stem
    if not parent.exists():
        return None
    for ext in [".svg", ".png", ".jpg", ".jpeg", ".webp", ".ico", ".gif"]:
        candidate = parent / f"{stem}{ext}"
        if candidate.exists() and candidate.stat().st_size > 0:
            return candidate
    return None


def guess_ext_from_url(url: str) -> Optional[str]:
    try:
        parsed = urlparse(url)
    except Exception:
        return None
    ext = Path(parsed.path).suffix.lower()
    return ext if ext in ALLOWED_EXTS else None


def guess_ext_from_headers(content_type: Optional[str], url: str) -> str:
    ct = (content_type or "").split(";", 1)[0].strip().lower()
    if ct in CONTENT_TYPE_TO_EXT and CONTENT_TYPE_TO_EXT[ct]:
        return CONTENT_TYPE_TO_EXT[ct]  # type: ignore[return-value]

    ext = guess_ext_from_url(url)
    if ext:
        return ".jpg" if ext == ".jpeg" else ext

    guessed, _ = mimetypes.guess_type(url)
    if guessed and guessed in CONTENT_TYPE_TO_EXT and CONTENT_TYPE_TO_EXT[guessed]:
        return CONTENT_TYPE_TO_EXT[guessed]  # type: ignore[return-value]

    return ".png"


def build_candidate_urls(tool: dict) -> List[str]:
    logo = tool.get("logo")
    website = tool.get("website")
    candidates: List[str] = []

    if isinstance(logo, str) and logo.startswith(("http://", "https://")):
        candidates.append(logo)

    if not isinstance(website, str) or not website.startswith(("http://", "https://")):
        return unique(candidates)

    parsed = urlparse(website)
    host = parsed.netloc
    scheme = parsed.scheme or "https"
    if not host:
        return unique(candidates)

    root = f"{scheme}://{host}"
    domain_url = quote(website, safe="")
    domain_host = quote(host, safe="")

    candidates.extend([
        f"https://www.google.com/s2/favicons?sz=256&domain_url={domain_url}",
        f"https://icons.duckduckgo.com/ip3/{domain_host}.ico",
        f"{root}/favicon.ico",
        f"{root}/favicon.png",
        f"{root}/favicon.svg",
        f"{root}/apple-touch-icon.png",
        f"{root}/apple-touch-icon-precomposed.png",
    ])

    # Variantes www / sans www
    if host.startswith("www."):
        bare_host = host[4:]
        bare_root = f"{scheme}://{bare_host}"
        candidates.extend([
            f"https://www.google.com/s2/favicons?sz=256&domain_url={quote(bare_root, safe='')}",
            f"https://icons.duckduckgo.com/ip3/{quote(bare_host, safe='')}.ico",
            f"{bare_root}/favicon.ico",
            f"{bare_root}/apple-touch-icon.png",
        ])
    else:
        www_host = f"www.{host}"
        www_root = f"{scheme}://{www_host}"
        candidates.extend([
            f"https://www.google.com/s2/favicons?sz=256&domain_url={quote(www_root, safe='')}",
            f"https://icons.duckduckgo.com/ip3/{quote(www_host, safe='')}.ico",
            f"{www_root}/favicon.ico",
            f"{www_root}/apple-touch-icon.png",
        ])

    return unique(candidates)


def unique(items: Iterable[str]) -> List[str]:
    seen = set()
    out = []
    for item in items:
        if item and item not in seen:
            seen.add(item)
            out.append(item)
    return out


def fetch_bytes(url: str, timeout: int) -> Tuple[bytes, str, Optional[str]]:
    req = Request(
        url,
        headers={
            "User-Agent": UA,
            "Accept": "image/*,*/*;q=0.8",
            "Referer": "https://www.google.com/",
        },
    )
    with urlopen(req, timeout=timeout) as resp:
        data = resp.read()
        final_url = resp.geturl()
        content_type = resp.headers.get("Content-Type")
        return data, final_url, content_type


def looks_like_valid_image(data: bytes, ext: str) -> bool:
    if not data or len(data) < 64:
        return False
    header = data[:32]

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
        start = data[:256].lstrip().lower()
        return start.startswith(b"<svg") or b"<svg" in start or b"<?xml" in start
    return True


def try_download_candidates(candidates: List[str], timeout: int) -> Tuple[Optional[bytes], Optional[str], Optional[str], Optional[str]]:
    last_error = None
    for url in candidates:
        try:
            data, final_url, content_type = fetch_bytes(url, timeout=timeout)
            ext = guess_ext_from_headers(content_type, final_url)
            if looks_like_valid_image(data, ext):
                return data, final_url, content_type, None
            last_error = f"format non valide depuis {url}"
        except (HTTPError, URLError, socket.timeout, TimeoutError, ValueError) as exc:
            last_error = f"{type(exc).__name__}: {exc}"
        except Exception as exc:
            last_error = f"{type(exc).__name__}: {exc}"
    return None, None, None, last_error


def save_bytes(path: Path, data: bytes, dry_run: bool = False) -> None:
    ensure_parent(path, dry_run=dry_run)
    if dry_run:
        return
    with path.open("wb") as f:
        f.write(data)


def rel_logo_from_abs(project_root: Path, abs_path: Path) -> str:
    public_dir = project_root / "public"
    rel = abs_path.relative_to(public_dir)
    return "/" + rel.as_posix()


def main(argv: List[str]) -> int:
    args = parse_args(argv)
    project_root = find_project_root(args["project_root"])  # type: ignore[arg-type]
    force = bool(args["force"])
    dry_run = bool(args["dry_run"])
    timeout = int(args["timeout"])

    tools_path = project_root / "public" / "data" / "tools.json"
    tools = load_tools(tools_path)

    total = len(tools)
    ok = 0
    skipped = 0
    updated_json_refs = 0
    downloaded = 0
    failed = 0
    unchanged = 0
    failures: List[str] = []
    changed_json = False
    backup_done = False
    backup_path: Optional[Path] = None

    print(f"Projet : {project_root}")
    print(f"tools.json : {tools_path}")
    print(f"Outils trouvés : {total}")
    print(f"Mode : {'FORCE' if force else 'normal'}{' + DRY-RUN' if dry_run else ''}")
    print()

    for index, tool in enumerate(tools, start=1):
        tool_id = str(tool.get("id") or f"tool-{index}")
        name = str(tool.get("name") or tool_id)
        logo_value = tool.get("logo")
        website = tool.get("website")

        prefix = f"[{index:03d}/{total}] {tool_id}"

        # Cas 1 : logo local attendu
        local_logo = normalize_local_logo_path(logo_value) if isinstance(logo_value, str) else None
        if local_logo:
            current_abs = local_abs_path(project_root, local_logo)
            base_abs = path_without_ext(current_abs)

            if current_abs.exists() and current_abs.stat().st_size > 0 and not force:
                skipped += 1
                unchanged += 1
                print(f"{prefix} OK déjà présent -> {local_logo}")
                continue

            # Cherche une variante locale existante (ex: .svg au lieu de .png)
            variant = find_existing_variant(base_abs)
            if variant and variant.exists() and variant.stat().st_size > 0 and not force:
                new_logo = rel_logo_from_abs(project_root, variant)
                if new_logo != local_logo:
                    tool["logo"] = new_logo
                    updated_json_refs += 1
                    changed_json = True
                    print(f"{prefix} référence corrigée {local_logo} -> {new_logo}")
                else:
                    print(f"{prefix} variante locale trouvée -> {new_logo}")
                ok += 1
                continue

            if not isinstance(website, str) or not website.startswith(("http://", "https://")):
                failed += 1
                failures.append(f"{tool_id}: aucun website exploitable pour télécharger {local_logo}")
                print(f"{prefix} ÉCHEC aucun website exploitable")
                continue

            candidates = build_candidate_urls(tool)
            data, final_url, content_type, error = try_download_candidates(candidates, timeout=timeout)
            if not data or not final_url:
                failed += 1
                failures.append(f"{tool_id}: {error or 'téléchargement impossible'}")
                print(f"{prefix} ÉCHEC {error or 'téléchargement impossible'}")
                continue

            ext = guess_ext_from_headers(content_type, final_url)
            dest_abs = base_abs.with_suffix(ext)
            new_logo = rel_logo_from_abs(project_root, dest_abs)

            if not backup_done and changed_json and not dry_run:
                backup_path = backup_file(tools_path, dry_run=False)
                backup_done = True

            save_bytes(dest_abs, data, dry_run=dry_run)
            downloaded += 1
            ok += 1

            if new_logo != local_logo:
                if not backup_done and not dry_run:
                    backup_path = backup_file(tools_path, dry_run=False)
                    backup_done = True
                tool["logo"] = new_logo
                updated_json_refs += 1
                changed_json = True
                print(f"{prefix} téléchargé -> {new_logo} (source: {final_url})")
            else:
                print(f"{prefix} téléchargé -> {local_logo} (source: {final_url})")
            continue

        # Cas 2 : logo distant direct
        if isinstance(logo_value, str) and logo_value.startswith(("http://", "https://")):
            parsed_ext = guess_ext_from_url(logo_value) or ".png"
            dest_abs = project_root / "public" / "partners" / f"{tool_id}{parsed_ext}"
            new_logo = rel_logo_from_abs(project_root, dest_abs)

            if dest_abs.exists() and dest_abs.stat().st_size > 0 and not force:
                if logo_value != new_logo:
                    tool["logo"] = new_logo
                    updated_json_refs += 1
                    changed_json = True
                    print(f"{prefix} référence distante localisée -> {new_logo}")
                    ok += 1
                else:
                    skipped += 1
                    unchanged += 1
                    print(f"{prefix} OK déjà présent -> {new_logo}")
                continue

            candidates = build_candidate_urls(tool)
            data, final_url, content_type, error = try_download_candidates(candidates, timeout=timeout)
            if not data or not final_url:
                failed += 1
                failures.append(f"{tool_id}: {error or 'téléchargement impossible'}")
                print(f"{prefix} ÉCHEC {error or 'téléchargement impossible'}")
                continue

            ext = guess_ext_from_headers(content_type, final_url)
            dest_abs = dest_abs.with_suffix(ext)
            new_logo = rel_logo_from_abs(project_root, dest_abs)
            save_bytes(dest_abs, data, dry_run=dry_run)
            downloaded += 1
            ok += 1
            if logo_value != new_logo:
                tool["logo"] = new_logo
                updated_json_refs += 1
                changed_json = True
            print(f"{prefix} téléchargé -> {new_logo} (source: {final_url})")
            continue

        skipped += 1
        print(f"{prefix} ignoré (champ logo inutilisable: {logo_value!r})")

    if changed_json:
        if not backup_done and not dry_run:
            backup_path = backup_file(tools_path, dry_run=False)
            backup_done = True
        if dry_run:
            print("\n[DRY-RUN] tools.json serait mis à jour.")
        else:
            with tools_path.open("w", encoding="utf-8") as f:
                json.dump(tools, f, ensure_ascii=False, indent=2)
            print("\ntools.json mis à jour.")
            if backup_path:
                print(f"Backup créé : {backup_path}")

    print("\n=== RÉSUMÉ ===")
    print(f"OK                : {ok}")
    print(f"Téléchargés       : {downloaded}")
    print(f"Réfs JSON corrigées: {updated_json_refs}")
    print(f"Inchangés         : {unchanged}")
    print(f"Ignorés           : {skipped}")
    print(f"Échecs            : {failed}")

    if failures:
        print("\n=== ÉCHECS ===")
        for item in failures:
            print("-", item)

    print("\nTerminé.")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv))
    except KeyboardInterrupt:
        raise SystemExit("\nInterrompu.")
