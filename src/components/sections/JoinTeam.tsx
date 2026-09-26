import { Link } from 'react-router-dom'
import { ArrowUpRight, Briefcase, GraduationCap } from 'lucide-react'
import { SectionLabel } from '../ui/SectionLabel'
import { Reveal } from '../ui/Reveal'

const cards = [
  {
    title: 'Careers',
    description: 'Explore professional opportunities.',
    cta: 'Explore Careers',
    href: '/careers',
    icon: Briefcase,
    accent: 'bg-[var(--color-orange)]',
  },
  {
    title: 'Internships',
    description: 'Start your journey with practical technology exposure.',
    cta: 'Explore Internships',
    href: '/internships',
    icon: GraduationCap,
    accent: 'bg-white text-[var(--color-ink)]',
  },
]

export function JoinTeam() {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[var(--color-ink)] px-6 py-16 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div>
              <SectionLabel dark>Join Our Team</SectionLabel>
              <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
                Build Your Future
                <br />
                With Global Tech Byte<span className="text-[var(--color-orange)]">.</span>
              </h2>
              <p className="mt-4 max-w-sm text-white/60">
                Explore opportunities to contribute, learn, and grow in software engineering.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {cards.map((card, i) => {
              const Icon = card.icon
              return (
                <Reveal key={card.title} delay={i * 0.1}>
                  <Link
                    to={card.href}
                    className="focus-ring group flex h-full flex-col justify-between gap-8 rounded-3xl bg-white/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
                  >
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                        card.title === 'Careers' ? 'bg-[var(--color-orange)] text-white' : 'bg-white text-[var(--color-ink)]'
                      }`}
                    >
                      <Icon size={20} />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-white">{card.title}</h3>
                      <p className="mt-1 text-sm text-white/55">{card.description}</p>
                    </div>
                    <span className="flex items-center gap-2 text-sm font-semibold text-white">
                      {card.cta}
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 transition-transform duration-300 group-hover:translate-x-1 group-hover:rotate-45 group-hover:border-[var(--color-orange)] group-hover:bg-[var(--color-orange)]">
                        <ArrowUpRight size={14} />
                      </span>
                    </span>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
