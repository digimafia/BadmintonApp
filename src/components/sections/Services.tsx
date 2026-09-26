import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { services } from '../../data/services'
import { SectionLabel } from '../ui/SectionLabel'
import { Reveal } from '../ui/Reveal'

export function Services() {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8" id="services">
      <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-[var(--color-ink)] px-6 py-14 sm:px-10 lg:px-14">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <SectionLabel dark>Our Services</SectionLabel>
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              What We Do<span className="text-[var(--color-orange)]">.</span>
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <p className="max-w-xs text-sm text-white/60">
              Business-focused software solutions designed for real-world impact.
            </p>
            <Link
              to="/services"
              aria-label="View all services"
              className="focus-ring flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-orange)] text-white transition-transform hover:rotate-45"
            >
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <Reveal key={service.id} delay={i * 0.08}>
                <Link
                  to={`/services#${service.id}`}
                  className="focus-ring group flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-orange)]/50 hover:bg-white/[0.06]"
                >
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-orange)] text-white transition-transform duration-300 group-hover:scale-110">
                      <Icon size={20} />
                    </span>
                    <h3 className="mt-5 text-lg font-bold leading-snug text-white">{service.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">{service.description}</p>
                  </div>
                  <span className="mt-6 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition-all duration-300 group-hover:rotate-45 group-hover:border-[var(--color-orange)] group-hover:bg-[var(--color-orange)]">
                    <ArrowUpRight size={15} />
                  </span>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
