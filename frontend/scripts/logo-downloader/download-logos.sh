#!/bin/bash

###############################################################################
# Script de téléchargement automatique des logos
# Utilise curl pour récupérer les favicons et logos
#
# Usage:
#   chmod +x download-logos.sh
#   ./download-logos.sh
###############################################################################

set -e

# Configuration
TOOLS_JSON="./public/data/tools.json"
OUTPUT_DIR="./public/partners"
LOGO_SIZE=256

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Vérifier les dépendances
if ! command -v jq &> /dev/null; then
    echo -e "${RED}❌ jq n'est pas installé${NC}"
    echo "Installation:"
    echo "  - macOS: brew install jq"
    echo "  - Ubuntu/Debian: sudo apt-get install jq"
    echo "  - CentOS/RHEL: sudo yum install jq"
    exit 1
fi

if ! command -v curl &> /dev/null; then
    echo -e "${RED}❌ curl n'est pas installé${NC}"
    exit 1
fi

# Vérifier que tools.json existe
if [ ! -f "$TOOLS_JSON" ]; then
    echo -e "${RED}❌ Fichier $TOOLS_JSON introuvable${NC}"
    exit 1
fi

# Créer le dossier de sortie
mkdir -p "$OUTPUT_DIR"

# Fonction pour extraire le domaine
extract_domain() {
    local url="$1"
    echo "$url" | sed -E 's|https?://||' | sed -E 's|www\.||' | sed -E 's|/.*||'
}

# Fonction pour télécharger un logo
download_logo() {
    local name="$1"
    local website="$2"
    local logo_path="$3"
    
    local domain=$(extract_domain "$website")
    local filename=$(basename "$logo_path")
    local output="$OUTPUT_DIR/$filename"
    
    # Vérifier si le logo existe déjà
    if [ -f "$output" ]; then
        echo -e "${GREEN}✓${NC}  $name: Logo déjà présent"
        return 0
    fi
    
    echo -e "${BLUE}⬇️${NC}  $name: Téléchargement..."
    
    # APIs à essayer (dans l'ordre)
    local apis=(
        "https://logo.clearbit.com/$domain?size=$LOGO_SIZE"
        "https://www.google.com/s2/favicons?domain=$domain&sz=256"
        "https://icons.duckduckgo.com/ip3/$domain.ico"
    )
    
    local success=0
    
    for api_url in "${apis[@]}"; do
        echo "   → Essai: $api_url"
        
        # Télécharger avec curl
        if curl -s -f -L \
            -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
            --max-time 10 \
            "$api_url" \
            -o "$output" 2>/dev/null; then
            
            # Vérifier que c'est bien une image
            if file "$output" | grep -q "image"; then
                echo -e "${GREEN}✅${NC} $name: Logo téléchargé"
                success=1
                break
            else
                rm -f "$output"
            fi
        fi
    done
    
    if [ $success -eq 0 ]; then
        echo -e "${RED}❌${NC} $name: Échec du téléchargement"
        return 1
    fi
    
    return 0
}

# Main
echo "🚀 Démarrage du téléchargement des logos..."
echo ""

# Compter les outils
total=$(jq 'length' "$TOOLS_JSON")
echo "📦 $total outils trouvés"
echo ""

# Statistiques
existing=0
downloaded=0
failed=0

# Lire et traiter chaque outil
jq -c '.[]' "$TOOLS_JSON" | while read -r tool; do
    name=$(echo "$tool" | jq -r '.name')
    website=$(echo "$tool" | jq -r '.website')
    logo=$(echo "$tool" | jq -r '.logo')
    
    filename=$(basename "$logo")
    output="$OUTPUT_DIR/$filename"
    
    if [ -f "$output" ]; then
        ((existing++))
        echo -e "${GREEN}✓${NC}  $name: Logo déjà présent"
    else
        if download_logo "$name" "$website" "$logo"; then
            ((downloaded++))
        else
            ((failed++))
        fi
    fi
    
    # Pause pour éviter de spammer les APIs
    sleep 0.5
done

# Résumé
echo ""
echo "=================================================="
echo "📊 RÉSUMÉ"
echo "=================================================="
echo -e "✅ Logos existants    : ${existing}"
echo -e "⬇️  Logos téléchargés  : ${downloaded}"
echo -e "❌ Échecs             : ${failed}"
echo -e "📦 Total              : ${total}"
echo "=================================================="

if [ $failed -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Certains logos n'ont pas pu être téléchargés.${NC}"
    echo -e "${BLUE}💡${NC} Vous pouvez les ajouter manuellement dans: $OUTPUT_DIR"
fi
