import Link from 'next/link';

export default function SeoInternalLinks({ title = 'Guides, alternatives et comparatifs liés', groups = [], links = [] }) {
  const normalizedGroups = groups.length ? groups : [{ title: null, links }];
  const visibleGroups = normalizedGroups.filter(group => group?.links?.length);

  if (!visibleGroups.length) return null;

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <h2 className="mb-5 text-2xl font-bold text-gray-900">{title}</h2>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleGroups.map((group, index) => (
          <div key={group.title || index} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            {group.title && (
              <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-gray-500">{group.title}</h3>
            )}
            <div className="space-y-2">
              {group.links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-xl border border-transparent bg-white px-3 py-2 text-sm font-semibold text-gray-800 transition-colors hover:border-purple-200 hover:text-purple-700"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
