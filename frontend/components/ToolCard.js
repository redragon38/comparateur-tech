import { Star, Zap, Check, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const CAT_META = {
  'VPN': {
    icon: '🛡️', label: 'VPN',
    gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    color: '#3b82f6',
    softBg: '#eff6ff', softText: '#1d4ed8', softLight: '#dbeafe',
    borderAlpha: 'rgba(59,130,246,0.18)', hoverBorder: 'rgba(59,130,246,0.35)',
    glow: 'rgba(59,130,246,0.22)',
  },
  'Intelligence artificielle': {
    icon: '🤖', label: 'IA',
    gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    color: '#7c3aed',
    softBg: '#f5f3ff', softText: '#5b21b6', softLight: '#ede9fe',
    borderAlpha: 'rgba(124,58,237,0.18)', hoverBorder: 'rgba(124,58,237,0.35)',
    glow: 'rgba(124,58,237,0.22)',
  },
  'Hébergement web': {
    icon: '🌐', label: 'Hébergement',
    gradient: 'linear-gradient(135deg, #059669, #10b981)',
    color: '#059669',
    softBg: '#ecfdf5', softText: '#065f46', softLight: '#d1fae5',
    borderAlpha: 'rgba(5,150,105,0.18)', hoverBorder: 'rgba(5,150,105,0.35)',
    glow: 'rgba(5,150,105,0.22)',
  },
  'Antivirus': {
    icon: '🦠', label: 'Antivirus',
    gradient: 'linear-gradient(135deg, #dc2626, #f97316)',
    color: '#dc2626',
    softBg: '#fff1f2', softText: '#9f1239', softLight: '#fee2e2',
    borderAlpha: 'rgba(220,38,38,0.18)', hoverBorder: 'rgba(220,38,38,0.35)',
    glow: 'rgba(220,38,38,0.22)',
  },
  'IA générative': {
    icon: '✨', label: 'IA Générative',
    gradient: 'linear-gradient(135deg, #db2777, #7c3aed)',
    color: '#db2777',
    softBg: '#fdf2f8', softText: '#9d174d', softLight: '#fce7f3',
    borderAlpha: 'rgba(219,39,119,0.18)', hoverBorder: 'rgba(219,39,119,0.35)',
    glow: 'rgba(219,39,119,0.22)',
  },
};

const DEFAULT = {
  icon: '🛠️', label: 'Outil',
  gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
  color: '#7c3aed',
  softBg: '#f5f3ff', softText: '#5b21b6', softLight: '#ede9fe',
  borderAlpha: 'rgba(124,58,237,0.18)', hoverBorder: 'rgba(124,58,237,0.35)',
  glow: 'rgba(124,58,237,0.22)',
};

function StarRating({ value }) {
  return (
    <div className="flex gap-0.5" aria-label={`${value} étoiles sur 5`}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-3 h-3" viewBox="0 0 14 14">
          <path
            d="M7 1l1.5 3.5L12 5l-2.5 2.5.5 3.5L7 9.5 4 11l.5-3.5L2 5l3.5-.5Z"
            fill={i < Math.floor(value || 0) ? '#f59e0b' : '#e5e7eb'}
          />
        </svg>
      ))}
    </div>
  );
}

export default function ToolCard({ tool }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const cat = tool.categories?.[0];
  const m = CAT_META[cat] || DEFAULT;
  const url = tool.affiliateUrl || tool.website || tool.link || '#';
  const strengths = (tool.strengthShort || []).slice(0, 3);

  return (
    <article
      className="relative flex flex-col rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: '#ffffff',
        border: `1.5px solid ${hovered ? m.hoverBorder : m.borderAlpha}`,
        boxShadow: hovered
          ? `0 20px 56px ${m.glow}, 0 4px 16px rgba(0,0,0,0.06)`
          : `0 1px 4px rgba(0,0,0,0.04), 0 4px 14px rgba(0,0,0,0.04)`,
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, border-color 0.25s ease',
      }}
      onClick={() => router.push(`/tool/${tool.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex flex-col flex-1 p-5 gap-3.5">

        {/* Header: logo + badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="relative flex-shrink-0">
            <div
              className="w-12 h-12 rounded-xl bg-white flex items-center justify-center overflow-hidden"
              style={{
                border: `1.5px solid ${m.borderAlpha}`,
                boxShadow: hovered ? `0 6px 20px ${m.glow}` : `0 2px 8px rgba(0,0,0,0.06)`,
                transform: hovered ? 'scale(1.08) rotate(2deg)' : 'scale(1) rotate(0deg)',
                transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            >
              {tool.logo ? (
                <img
                  src={tool.logo}
                  alt={`Logo ${tool.name}`}
                  className="w-full h-full object-contain p-1.5"
                  loading="lazy"
                  onError={e => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<span style="font-size:22px">${m.icon}</span>`;
                  }}
                />
              ) : (
                <span style={{ fontSize: '22px' }}>{m.icon}</span>
              )}
            </div>
            {tool.featured && (
              <div
                className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full flex items-center justify-center text-white"
                style={{
                  fontSize: '9px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  boxShadow: '0 2px 6px rgba(245,158,11,0.45)',
                  border: '1.5px solid white',
                }}
              >
                ★
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-1.5 pt-0.5">
            <span
              className="inline-flex items-center text-[9px] font-bold px-2 py-0.5 rounded-full tracking-widest uppercase"
              style={{ color: m.softText, background: m.softBg, border: `1px solid ${m.borderAlpha}` }}
            >
              {m.label}
            </span>
            {tool.verified && (
              <span
                className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{ color: '#059669', background: '#ecfdf5', border: '1px solid #a7f3d0' }}
              >
                <Check className="w-2.5 h-2.5" /> Vérifié
              </span>
            )}
            {tool.trial && (
              <span
                className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{ color: '#0369a1', background: '#e0f2fe', border: '1px solid #bae6fd' }}
              >
                <Zap className="w-2.5 h-2.5" /> Essai gratuit
              </span>
            )}
          </div>
        </div>

        {/* Title + price */}
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-[15px] font-bold leading-snug"
            style={{
              color: hovered ? m.color : '#111827',
              transition: 'color 0.2s ease',
            }}
          >
            {tool.name}
          </h3>
          {tool.price && (
            <span
              className="flex-shrink-0 text-[9px] font-bold px-2 py-1 rounded-lg whitespace-nowrap mt-0.5"
              style={{ color: m.softText, background: m.softBg, border: `1px solid ${m.borderAlpha}` }}
            >
              {tool.price}
            </span>
          )}
        </div>

        {/* Description */}
        <p
          className="text-[12px] text-gray-400 line-clamp-2"
          style={{ lineHeight: '1.7' }}
        >
          {tool.short || tool.highlight || ''}
        </p>

        {/* Strength chips */}
        {strengths.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {strengths.map((s, i) => (
              <span
                key={i}
                className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                style={{ color: m.softText, background: m.softLight, border: `1px solid ${m.borderAlpha}` }}
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Rating */}
        {tool.rating && (
          <div className="flex items-center gap-1.5">
            <StarRating value={tool.rating.value} />
            <span className="text-[12px] font-bold" style={{ color: m.color }}>
              {tool.rating.value}
            </span>
            <span className="text-[10px] text-gray-200">·</span>
            <span className="text-[10px] text-gray-400">{tool.rating.count} avis</span>
          </div>
        )}

        {/* Divider */}
        <div
          className="h-px"
          style={{ background: `linear-gradient(90deg, ${m.borderAlpha}, transparent)` }}
        />

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/tool/${tool.id}`}
            onClick={e => e.stopPropagation()}
            className="flex-1 h-10 rounded-xl font-semibold text-[11px] flex items-center justify-center transition-all duration-200"
            style={{ color: '#6b7280', background: '#f9fafb', border: '1.5px solid #e5e7eb' }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#f3f4f6';
              e.currentTarget.style.color = '#374151';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#f9fafb';
              e.currentTarget.style.color = '#6b7280';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            Voir la fiche
          </Link>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex-1 h-10 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 text-white transition-all duration-200"
            style={{
              background: m.gradient,
              boxShadow: `0 3px 12px ${m.glow}`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = `0 6px 22px ${m.glow}`;
              e.currentTarget.style.filter = 'brightness(1.06)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = `0 3px 12px ${m.glow}`;
              e.currentTarget.style.filter = '';
              e.currentTarget.style.transform = '';
            }}
          >
            Site officiel
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </article>
  );
}
