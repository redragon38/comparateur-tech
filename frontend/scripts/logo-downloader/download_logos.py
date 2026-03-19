#!/usr/bin/env python3
"""
Script de téléchargement automatique des logos
Utilise plusieurs APIs pour récupérer les logos

Installation :
pip install requests Pillow

Usage :
python download_logos.py
"""

import json
import os
import sys
from pathlib import Path
from urllib.parse import urlparse
import time

try:
    import requests
    from PIL import Image
    from io import BytesIO
except ImportError:
    print("❌ Dépendances manquantes. Installez-les avec:")
    print("   pip install requests Pillow")
    sys.exit(1)

# Configuration
TOOLS_JSON = './public/data/tools.json'
OUTPUT_DIR = './public/partners'
LOGO_SIZE = 256
TIMEOUT = 10

# APIs de logos
LOGO_APIS = {
    'clearbit': lambda domain: f'https://logo.clearbit.com/{domain}?size={LOGO_SIZE}',
    'google': lambda domain: f'https://www.google.com/s2/favicons?domain={domain}&sz=256',
    'duckduckgo': lambda domain: f'https://icons.duckduckgo.com/ip3/{domain}.ico',
}

def extract_domain(url):
    """Extraire le domaine depuis une URL"""
    try:
        parsed = urlparse(url)
        domain = parsed.netloc.replace('www.', '')
        return domain
    except Exception as e:
        print(f"❌ URL invalide: {url}")
        return None

def download_image(url, output_path):
    """Télécharger une image depuis une URL"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, timeout=TIMEOUT, headers=headers, stream=True)
        
        if response.status_code != 200:
            return False
        
        # Vérifier que c'est une image
        content_type = response.headers.get('content-type', '')
        if not content_type.startswith('image/'):
            return False
        
        # Sauvegarder l'image
        with open(output_path, 'wb') as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)
        
        # Vérifier que l'image est valide
        try:
            img = Image.open(output_path)
            img.verify()
            return True
        except Exception:
            os.remove(output_path)
            return False
            
    except Exception as e:
        return False

def download_tool_logo(tool, output_dir):
    """Télécharger le logo d'un outil"""
    domain = extract_domain(tool['website'])
    if not domain:
        print(f"⚠️  {tool['name']}: URL invalide")
        return False
    
    # Extraire le nom du fichier
    logo_filename = os.path.basename(tool['logo'])
    output_path = os.path.join(output_dir, logo_filename)
    
    # Vérifier si le logo existe déjà
    if os.path.exists(output_path):
        print(f"✓  {tool['name']}: Logo déjà présent")
        return True
    
    print(f"⬇️  {tool['name']}: Téléchargement...")
    
    # Essayer chaque API
    for api_name, get_url in LOGO_APIS.items():
        logo_url = get_url(domain)
        print(f"   → Essai {api_name}: {logo_url}")
        
        if download_image(logo_url, output_path):
            print(f"✅ {tool['name']}: Logo téléchargé via {api_name}")
            return True
    
    print(f"❌ {tool['name']}: Échec du téléchargement")
    return False

def main():
    """Main"""
    print("🚀 Démarrage du téléchargement des logos...\n")
    
    # Vérifier que tools.json existe
    if not os.path.exists(TOOLS_JSON):
        print(f"❌ Fichier {TOOLS_JSON} introuvable")
        sys.exit(1)
    
    # Créer le dossier de sortie
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Charger tools.json
    with open(TOOLS_JSON, 'r', encoding='utf-8') as f:
        tools = json.load(f)
    
    print(f"📦 {len(tools)} outils trouvés\n")
    
    # Statistiques
    stats = {
        'existing': 0,
        'downloaded': 0,
        'failed': 0
    }
    
    # Télécharger chaque logo
    for tool in tools:
        logo_path = os.path.join(OUTPUT_DIR, os.path.basename(tool['logo']))
        
        if os.path.exists(logo_path):
            stats['existing'] += 1
            print(f"✓  {tool['name']}: Logo déjà présent")
        else:
            success = download_tool_logo(tool, OUTPUT_DIR)
            if success:
                stats['downloaded'] += 1
            else:
                stats['failed'] += 1
        
        # Pause pour éviter de spammer les APIs
        time.sleep(0.5)
    
    # Résumé
    print('\n' + '=' * 50)
    print('📊 RÉSUMÉ')
    print('=' * 50)
    print(f"✅ Logos existants    : {stats['existing']}")
    print(f"⬇️  Logos téléchargés  : {stats['downloaded']}")
    print(f"❌ Échecs             : {stats['failed']}")
    print(f"📦 Total              : {len(tools)}")
    print('=' * 50)
    
    if stats['failed'] > 0:
        print('\n⚠️  Certains logos n\'ont pas pu être téléchargés.')
        print(f'💡 Vous pouvez les ajouter manuellement dans: {OUTPUT_DIR}')

if __name__ == '__main__':
    main()
