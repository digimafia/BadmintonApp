import { advantages } from '../../data/whyUs'
import { SectionLabel } from '../ui/SectionLabel'
import { Reveal } from '../ui/Reveal'

export function WhyUs() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <SectionLabel>Why Global Tech Byte</SectionLabel>
            <h2 className="max-w-lg text-4xl font-extrabold leading-tight tracking-tight text-[var(--color-ink)] sm:text-5xl">
              Built for Your Business Growth<span className="text-[var(--color-orange)]">.</span>
            </h2>
          </div>
          <p className="max-w-sm text-[var(--color-text-gray)]">
            We combine modern technologies, clear communication and a business-focused approach to deliver software
            that makes a real difference.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((item, i) => {
            const Icon = item.icon
            return (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="group h-full rounded-3xl border border-[var(--color-ink)]/8 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-peach)] text-[var(--color-orange)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-5 text-base font-bold leading-snug text-[var(--color-ink)]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-gray)]">{item.description}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
