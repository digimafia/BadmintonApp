import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '../ui/Reveal'

export function CTABanner() {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-[var(--color-orange)] p-8 sm:flex-row sm:items-center sm:p-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-white/80">
                Let's Work Together
              </span>
              <h3 className="mt-2 text-2xl font-extrabold leading-snug text-white sm:text-3xl">
                Have a project in mind?
                <br />
                Let's create something bold.
              </h3>
            </div>
            <Link
              to="/contact"
              className="focus-ring group flex shrink-0 items-center gap-3 rounded-full bg-[var(--color-ink)] py-3 pl-6 pr-3 text-sm font-semibold text-white transition-colors hover:bg-black"
            >
              Start a Conversation
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--color-ink)] transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight size={16} />
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
