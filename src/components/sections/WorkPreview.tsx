import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { solutions } from '../../data/solutions'
import { SectionLabel } from '../ui/SectionLabel'
import { Reveal } from '../ui/Reveal'

export function WorkPreview() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <SectionLabel>Selected Projects</SectionLabel>
            <h2 className="text-4xl font-extrabold tracking-tight text-[var(--color-ink)] sm:text-5xl">
              Solutions We Can Build<span className="text-[var(--color-orange)]">.</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm text-[var(--color-text-gray)]">
            Concept-driven solutions matched to real business needs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution, i) => (
            <Reveal key={solution.id} delay={i * 0.1}>
              <Link
                to={`/work#${solution.id}`}
                data-cursor="view"
                className="focus-ring group block overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-xl"
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
                  <h3 className="mt-2 text-lg font-bold text-[var(--color-ink)]">{solution.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-gray)]">{solution.description}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/work"
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-[var(--color-ink)]/15 px-6 py-3 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)]"
          >
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  )
}
