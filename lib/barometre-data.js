// ─── Données des baromètres prix (études citables) ───────────────────────────
// Prix vérifiés le 2026-07-04 via les sites officiels et la presse spécialisée
// (Clubic, Presse-citron, iPhon, JournalDuNet, JournalDuGeek, Wizcase,
// vpnoverview, hostadvice…). À re-vérifier trimestriellement puis mettre à
// jour BAROMETRE_DATE. Montants en euros TTC par mois (sauf mention), pour
// l'offre standard la plus mise en avant par chaque éditeur.

export const BAROMETRE_DATE = '2026-07-04';
export const BAROMETRE_DATE_LABEL = 'juillet 2026';

// promoMonthly : prix mensuel promotionnel affiché (engagement initial)
// promoMonths  : durée de l'engagement initial en mois (mois offerts inclus)
// renewalMonthly : tarif au renouvellement ramené au mois (facturation annuelle
//                  le plus souvent, ex. NordVPN Basique : 139,08 €/an).
export const VPN_PRICING = [
  { id: 'nordvpn',        name: 'NordVPN',        promoMonthly: 2.99, promoMonths: 24, renewalMonthly: 11.59 }, // renouvelle à 139,08 €/an (Basique)
  { id: 'surfshark',      name: 'Surfshark',      promoMonthly: 1.99, promoMonths: 27, renewalMonthly: 4.67 },  // renouvelle à ~56 €/an (Starter)
  { id: 'expressvpn',     name: 'ExpressVPN',     promoMonthly: 3.49, promoMonths: 15, renewalMonthly: 8.33 },  // renouvelle à ~99,95/an (Basic)
  { id: 'cyberghost-vpn', name: 'CyberGhost',     promoMonthly: 1.59, promoMonths: 26, renewalMonthly: 3.45 },  // renouvelle à 41,34 €/an
  { id: 'proton-vpn',     name: 'Proton VPN',     promoMonthly: 2.99, promoMonths: 24, renewalMonthly: 5.99 },  // renouvelle au tarif standard annuel (~71,88 €/an, Plus)
  { id: 'mullvad-vpn',    name: 'Mullvad',        promoMonthly: 5.00, promoMonths: 1,  renewalMonthly: 5.00 },  // prix fixe historique, sans promo
  { id: 'pia-vpn',        name: 'Private Internet Access', promoMonthly: 1.29, promoMonths: 26, renewalMonthly: 3.33 }, // 33,54 €/26 mois ; renouvelle à ~39,95/an
  { id: 'ipvanish',       name: 'IPVanish',       promoMonthly: 2.19, promoMonths: 24, renewalMonthly: 7.50 },  // 52,56 $/2 ans ; renouvelle à 89,99 $/an (Essential)
  { id: 'windscribe',     name: 'Windscribe',     promoMonthly: 2.75, promoMonths: 12, renewalMonthly: 2.75 },  // Pro annuel ~33 €/an, tarif stable
  { id: 'tunnelbear',     name: 'TunnelBear',     promoMonthly: 4.58, promoMonths: 12, renewalMonthly: 4.58 },  // ~55 €/an, tarif stable
  { id: 'hideme',         name: 'hide.me',        promoMonthly: 2.59, promoMonths: 26, renewalMonthly: 5.83 },  // renouvelle au tarif standard annuel (~69,95/an)
  { id: 'purevpn',        name: 'PureVPN',        promoMonthly: 1.85, promoMonths: 27, renewalMonthly: 4.99 },  // 50,22 €/27 mois ; renouvelle au tarif standard 1 an
  { id: 'vypr-vpn',       name: 'VyprVPN',        promoMonthly: 2.50, promoMonths: 24, renewalMonthly: 8.33 },  // 60 €/2 ans promo ; Basic standard ~8,33/mois facturé à l'année
  { id: 'hma-vpn',        name: 'HMA VPN',        promoMonthly: 2.99, promoMonths: 36, renewalMonthly: 10.99 }, // 107,64 €/3 ans ; standard 1 an 131,88 €
];

// Hébergement web mutualisé : offre d'entrée/standard la plus mise en avant.
// o2switch (grille 2026) : Grow à 84 € HT/an en tarif découverte → 8,40 € TTC/mois ;
// l'hébergeur est réputé pour la stabilité de ses tarifs au renouvellement.
export const HOSTING_PRICING = [
  { id: 'hostinger',    name: 'Hostinger',    plan: 'Premium',      promoMonthly: 2.99,  promoMonths: 48, renewalMonthly: 7.99 },
  { id: 'o2switch',     name: 'o2switch',     plan: 'Grow',         promoMonthly: 8.40,  promoMonths: 12, renewalMonthly: 8.40 },
  { id: 'ovhcloud',     name: 'OVHcloud',     plan: 'Perso',        promoMonthly: 3.99,  promoMonths: 12, renewalMonthly: 7.99 },
  { id: 'ionos',        name: 'IONOS',        plan: 'Premium',      promoMonthly: 1.00,  promoMonths: 12, renewalMonthly: 12.00 },
  { id: 'siteground',   name: 'SiteGround',   plan: 'StartUp',      promoMonthly: 2.99,  promoMonths: 12, renewalMonthly: 17.99 },
  { id: 'infomaniak',   name: 'Infomaniak',   plan: 'Web + Mail',   promoMonthly: 5.75,  promoMonths: 12, renewalMonthly: 7.67 },
  { id: 'planethoster', name: 'PlanetHoster', plan: 'The World',    promoMonthly: 5.49,  promoMonths: 12, renewalMonthly: 7.99 },
  { id: 'lws',          name: 'LWS',          plan: 'Perso',        promoMonthly: 1.99,  promoMonths: 12, renewalMonthly: 4.49 },
  { id: 'bluehost',     name: 'Bluehost',     plan: 'Basic',        promoMonthly: 2.52,  promoMonths: 36, renewalMonthly: 7.67 },
  { id: 'kinsta',       name: 'Kinsta',       plan: 'Starter',      promoMonthly: 30.00, promoMonths: 1,  renewalMonthly: 30.00 },
];

export function increasePct(item) {
  if (!item.promoMonthly) return 0;
  return Math.round(((item.renewalMonthly - item.promoMonthly) / item.promoMonthly) * 100);
}

export function averageIncreasePct(items) {
  if (!items.length) return 0;
  return Math.round(items.reduce((sum, item) => sum + increasePct(item), 0) / items.length);
}

// Coût total sur `totalMonths` : période promo au tarif promo, puis renouvellement.
export function totalCost(item, totalMonths = 36) {
  const promoMonths = Math.min(item.promoMonths || 0, totalMonths);
  return item.promoMonthly * promoMonths + item.renewalMonthly * (totalMonths - promoMonths);
}

export function formatEuro(value) {
  return value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}
