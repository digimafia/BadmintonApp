import { highlights } from '../../data/highlights'
import { Reveal } from '../ui/Reveal'

export function Highlights() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-3xl bg-[var(--color-peach)] px-6 py-10 sm:px-10">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {highlights.map((item, i) => {
            const Icon = item.icon
            return (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[var(--color-orange)]">
                    <Icon size={18} />
                  </span>
                  <span className="text-sm font-bold leading-tight text-[var(--color-ink)]">{item.title}</span>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
