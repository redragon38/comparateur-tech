
export default function FAQSchema({ faqs=[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context':'https://schema.org',
          '@type':'FAQPage',
          mainEntity: faqs.map(f => ({
            '@type':'Question',
            name:f.question,
            acceptedAnswer:{'@type':'Answer',text:f.answer}
          }))
        })
      }}
    />
  )
}
