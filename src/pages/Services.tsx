import { Check } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import { PageHero } from '../components/ui/PageHero'
import { Reveal } from '../components/ui/Reveal'
import { Button } from '../components/ui/Button'
import { services } from '../data/services'
import { CTABanner } from '../components/sections/CTABanner'

export function Services() {
  usePageMeta({
    title: 'Services',
    description:
      'Custom web applications, enterprise software, API & backend development, and frontend engineering from Global Tech Byte Private Limited.',
  })

  return (
    <>
      <PageHero
        label="Our Services"
        title={
          <>
            Business-Focused
            <br />
            Software <span className="text-[var(--color-orange)]">Solutions.</span>
          </>
        }
        description="Every engagement is scoped around a real business outcome — from a single application to a full product build."
      />

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <Reveal key={service.id} delay={i * 0.05}>
                <div
                  id={service.id}
                  className="scroll-mt-32 grid grid-cols-1 gap-8 rounded-3xl border border-[var(--color-ink)]/8 bg-white p-8 sm:p-10 lg:grid-cols-[auto_1fr]"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-peach)] text-[var(--color-orange)]">
                    <Icon size={28} />
                  </span>
                  <div>
                    <h2 className="text-2xl font-extrabold text-[var(--color-ink)]">{service.title}</h2>
                    <p className="mt-2 max-w-2xl text-[var(--color-text-gray)]">{service.description}</p>
                    <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                      {service.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-2 text-sm text-[var(--color-ink)]/80">
                          <Check size={16} className="mt-0.5 shrink-0 text-[var(--color-orange)]" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>

        <div className="mx-auto mt-14 flex max-w-6xl justify-center">
          <Button as="link" to="/contact" variant="primary">
            Discuss Your Project
          </Button>
        </div>
      </section>

      <CTABanner />
    </>
  )
}
