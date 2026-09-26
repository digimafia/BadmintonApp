import { ArrowUpRight } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import { PageHero } from '../components/ui/PageHero'
import { Reveal } from '../components/ui/Reveal'
import { solutions } from '../data/solutions'
import { CTABanner } from '../components/sections/CTABanner'

export function Work() {
  usePageMeta({
    title: 'Work',
    description:
      'Solution concepts Global Tech Byte Private Limited can build — business dashboards, service platforms, and e-commerce applications.',
  })

  return (
    <>
      <PageHero
        label="Our Work"
        title={
          <>
            Solutions We Can <span className="text-[var(--color-orange)]">Build.</span>
          </>
        }
        description="These are representative solution concepts, not completed client case studies — a preview of what we can build for your business."
      />

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution, i) => (
            <Reveal key={solution.id} delay={i * 0.1}>
              <div
                id={solution.id}
                data-cursor="view"
                className="scroll-mt-32 group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-peach)]">
                  <img
                    src={solution.image}
                    alt={solution.title}
                    loading="lazy"
                    className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--color-ink)] opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
                <div className="p-6">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-orange)]">
                    {solution.category}
                  </span>
                  <h2 className="mt-2 text-lg font-bold text-[var(--color-ink)]">{solution.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-gray)]">{solution.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CTABanner />
    </>
  )
}
