import { usePageMeta } from '../hooks/usePageMeta'
import { PageHero } from '../components/ui/PageHero'
import { site } from '../lib/site'

export function Legal({ title }: { title: string }) {
  usePageMeta({
    title,
    description: `${title} for Global Tech Byte Private Limited.`,
  })

  return (
    <>
      <PageHero label="Legal" title={title} />
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-6 leading-relaxed text-[var(--color-text-gray)]">
          <p>
            This page is a placeholder. Global Tech Byte Private Limited's finalized{' '}
            {title.toLowerCase()} will be published here. For any questions in the meantime, please contact us at{' '}
            <a href={`mailto:${site.email}`} className="font-medium text-[var(--color-orange)]">
              {site.email}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  )
}
