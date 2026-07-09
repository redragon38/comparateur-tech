export const TOOL_LIST_PAGE_SIZE = 96;

export function toCardTool(tool) {
  return {
    id: tool.id,
    name: tool.name,
    logo: tool.logo || null,
    website: tool.website || null,
    affiliateUrl: tool.affiliateUrl || null,
    categories: tool.categories || [],
    price: tool.price || null,
    trial: Boolean(tool.trial),
    featured: Boolean(tool.featured),
    verified: Boolean(tool.verified),
    rating: tool.rating?.value ? { value: tool.rating.value } : null,
    short: tool.short || null,
    highlight: tool.highlight || null,
    strengthShort: (tool.strengthShort || []).slice(0, 3),
  };
}

export function sortByRating(tools) {
  return [...tools].sort((a, b) => (b.rating?.value || 0) - (a.rating?.value || 0));
}

export function normalizeText(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

// Canonical category aliases, keep in sync with the data normalization script
const CATEGORY_ALIASES = {
  'Intelligence artificielle': ['Intelligence artificielle', 'IA', 'IA générative'],
  'Hébergement web': ['Hébergement web', 'Hébergement Web'],
};

export function matchesMainCategory(tool, category) {
  const categories = tool.categories || [];
  if (category === 'Tout') return true;
  const aliases = CATEGORY_ALIASES[category];
  if (aliases) {
    return categories.some(c => aliases.includes(c));
  }
  return categories.includes(category);
}
