#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════════╗
║         TheCreAmAI — Téléchargeur de logos v2                   ║
║  Télécharge automatiquement tous les logos depuis tools.json    ║
╚══════════════════════════════════════════════════════════════════╝

Installation :
    pip install requests Pillow

Usage (depuis le dossier frontend/) :
    python scripts/logo-downloader/download_logos_v2.py

Options :
    --force      Retélécharge même les logos déjà présents
    --only-missing  Télécharge uniquement les logos manquants (défaut)
    --size 256   Taille cible en px (défaut: 256)
"""

import json
import os
import sys
import time
import argparse
from pathlib import Path
from urllib.parse import urlparse

# ── Vérification des dépendances ──────────────────────────────────────────────
try:
    import requests
except ImportError:
    print("❌  'requests' manquant. Lancez :  pip install requests Pillow")
    sys.exit(1)

try:
    from PIL import Image
    from io import BytesIO
    HAS_PIL = True
except ImportError:
    HAS_PIL = False
    print("⚠️  'Pillow' manquant — les logos ne seront pas redimensionnés.")
    print("    Installez-le avec :  pip install Pillow\n")

# ── Configuration ─────────────────────────────────────────────────────────────
SCRIPT_DIR   = Path(__file__).parent
FRONTEND_DIR = SCRIPT_DIR.parent.parent          # remonte jusqu'à frontend/
TOOLS_JSON   = FRONTEND_DIR / "public" / "data" / "tools.json"
OUTPUT_DIR   = FRONTEND_DIR / "public" / "partners"
TIMEOUT      = 12   # secondes
DELAY        = 0.4  # pause entre chaque outil (pour ne pas spammer les APIs)

# Couleurs ANSI
GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
BLUE   = "\033[94m"
GRAY   = "\033[90m"
BOLD   = "\033[1m"
RESET  = "\033[0m"

# ── Sources de logos, par ordre de qualité ────────────────────────────────────
def get_sources(domain: str, size: int) -> list[tuple[str, str]]:
    """Retourne une liste de (nom, url) pour le domaine donné."""
    return [
        ("Clearbit",    f"https://logo.clearbit.com/{domain}?size={size}"),
        ("Brandfetch",  f"https://cdn.brandfetch.io/{domain}/w/{size}/h/{size}/logo"),
        ("Google HD",   f"https://www.google.com/s2/favicons?domain={domain}&sz=256"),
        ("DuckDuckGo",  f"https://icons.duckduckgo.com/ip3/{domain}.ico"),
        ("Favicon.io",  f"https://favicons.githubusercontent.com/{domain}"),
        ("Favicon kit", f"https://api.faviconkit.com/{domain}/{size}"),
    ]

# ── Helpers ───────────────────────────────────────────────────────────────────
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "image/*,*/*;q=0.8",
}

def extract_domain(url: str) -> str | None:
    """Extrait le domaine racine d'une URL."""
    try:
        parsed = urlparse(url)
        host = parsed.netloc or parsed.path
        # supprime www., fr., etc.
        parts = host.replace("www.", "").split(".")
        if len(parts) >= 2:
            return ".".join(parts[-2:])
        return host
    except Exception:
        return None

def fetch_image(url: str) -> bytes | None:
    """Télécharge une URL et retourne les bytes si c'est une image valide."""
    try:
        r = requests.get(url, headers=HEADERS, timeout=TIMEOUT, stream=True)
        if r.status_code != 200:
            return None
        ct = r.headers.get("content-type", "")
        # Accepte image/* et aussi les octet-stream (certains serveurs)
        if "image" not in ct and "octet-stream" not in ct:
            return None
        data = b"".join(r.iter_content(4096))
        if len(data) < 500:          # trop petit = probablement une erreur
            return None
        return data
    except Exception:
        return None

def process_image(data: bytes, output_path: Path, size: int) -> bool:
    """Valide, redimensionne si besoin, et sauvegarde l'image."""
    if not HAS_PIL:
        output_path.write_bytes(data)
        return True
    try:
        img = Image.open(BytesIO(data)).convert("RGBA")

        # Ignore les images trop petites (favicon 16x16)
        if img.width < 32 or img.height < 32:
            return False

        # Redimensionne en gardant le ratio, avec fond transparent
        img.thumbnail((size, size), Image.LANCZOS)

        # Crée un carré avec fond blanc pour les PNG non carrés
        square = Image.new("RGBA", (size, size), (255, 255, 255, 0))
        offset = ((size - img.width) // 2, (size - img.height) // 2)
        square.paste(img, offset, mask=img if img.mode == "RGBA" else None)

        # Sauvegarde en PNG
        square.save(str(output_path), "PNG", optimize=True)
        return True
    except Exception:
        # Si Pillow échoue, on sauvegarde quand même le fichier brut
        try:
            output_path.write_bytes(data)
            return True
        except Exception:
            return False

def print_progress(current: int, total: int, label: str = ""):
    """Affiche une barre de progression."""
    width = 30
    filled = int(width * current / total)
    bar = "█" * filled + "░" * (width - filled)
    pct = int(100 * current / total)
    print(f"\r  [{bar}] {pct:3d}%  {label:<30}", end="", flush=True)

# ── Logique principale ────────────────────────────────────────────────────────
def download_logo(tool: dict, output_dir: Path, size: int, force: bool) -> str:
    """
    Télécharge le logo d'un outil.
    Retourne : 'existing' | 'downloaded' | 'failed'
    """
    logo_filename = Path(tool.get("logo", "")).name
    if not logo_filename:
        return "failed"

    output_path = output_dir / logo_filename

    if output_path.exists() and not force:
        return "existing"

    website = tool.get("website", "")
    domain  = extract_domain(website)
    if not domain:
        return "failed"

    sources = get_sources(domain, size)

    for source_name, url in sources:
        data = fetch_image(url)
        if data and process_image(data, output_path, size):
            return f"downloaded:{source_name}"

    return "failed"

def main():
    parser = argparse.ArgumentParser(description="Télécharge les logos TheCreAmAI")
    parser.add_argument("--force",        action="store_true", help="Retélécharge même les logos existants")
    parser.add_argument("--only-missing", action="store_true", help="Affiche seulement les logos manquants (défaut)")
    parser.add_argument("--size",         type=int, default=256, help="Taille cible en px (défaut: 256)")
    args = parser.parse_args()

    # ── Bannière ──────────────────────────────────────────────────────────────
    print(f"\n{BOLD}{'═'*60}{RESET}")
    print(f"{BOLD}  🎨  TheCreAmAI — Téléchargeur de logos v2{RESET}")
    print(f"{'═'*60}")
    if args.force:
        print(f"  {YELLOW}Mode FORCE — retéléchargement de tous les logos{RESET}")
    print(f"  Taille cible : {args.size}×{args.size} px")
    print(f"  Sortie       : {OUTPUT_DIR.relative_to(FRONTEND_DIR)}")
    print(f"{'═'*60}\n")

    # ── Vérifications ─────────────────────────────────────────────────────────
    if not TOOLS_JSON.exists():
        print(f"{RED}❌  Fichier introuvable : {TOOLS_JSON}{RESET}")
        print(f"   Lancez le script depuis le dossier {BOLD}frontend/{RESET}")
        sys.exit(1)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    with open(TOOLS_JSON, "r", encoding="utf-8") as f:
        tools = json.load(f)

    total = len(tools)
    print(f"  {BLUE}📦  {total} outils chargés depuis tools.json{RESET}\n")

    # ── Téléchargements ───────────────────────────────────────────────────────
    stats = {"existing": 0, "downloaded": 0, "failed": []}

    for i, tool in enumerate(tools, 1):
        name = tool.get("name", tool.get("id", "?"))
        print_progress(i, total, name)

        result = download_logo(tool, OUTPUT_DIR, args.size, args.force)

        if result == "existing":
            stats["existing"] += 1
        elif result.startswith("downloaded:"):
            source = result.split(":")[1]
            stats["downloaded"] += 1
            print(f"\r  {GREEN}✅  {name:<30}{GRAY}via {source}{RESET}")
        else:
            stats["failed"].append(name)
            print(f"\r  {RED}❌  {name:<30}(aucune source disponible){RESET}")

        time.sleep(DELAY)

    # ── Résumé ────────────────────────────────────────────────────────────────
    print(f"\n\n{'═'*60}")
    print(f"{BOLD}  📊  RÉSUMÉ{RESET}")
    print(f"{'═'*60}")
    print(f"  {GREEN}✅  Téléchargés  : {stats['downloaded']}{RESET}")
    print(f"  {GRAY}✓   Déjà présents : {stats['existing']}{RESET}")
    print(f"  {RED}❌  Échecs        : {len(stats['failed'])}{RESET}")
    print(f"      Total         : {total}")
    print(f"{'═'*60}")

    if stats["failed"]:
        print(f"\n  {YELLOW}⚠️   Logos non téléchargés :{RESET}")
        for name in stats["failed"]:
            print(f"       • {name}")
        print(f"\n  {GRAY}💡  Ajoutez-les manuellement dans :{RESET}")
        print(f"      {OUTPUT_DIR}")

    print()

if __name__ == "__main__":
    main()
# NOTE: Ce script est conçu pour être lancé depuis le dossier frontend/
# Si vous avez une erreur de réseau, vérifiez votre connexion internet.
