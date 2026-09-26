import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { processSteps } from '../../data/process'
import { SectionLabel } from '../ui/SectionLabel'
import { Button } from '../ui/Button'

export function Process() {
  return (
    <section id="process" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <SectionLabel>Our Process</SectionLabel>
            <h2 className="max-w-md text-4xl font-extrabold leading-tight tracking-tight text-[var(--color-ink)] sm:text-5xl">
              From Idea to Impact<span className="text-[var(--color-orange)]">.</span>
            </h2>
            <p className="mt-4 max-w-sm text-[var(--color-text-gray)]">
              A clear and collaborative approach to bring your vision to life.
            </p>
            <div className="mt-6">
              <Button as="link" to="/services" variant="outline">
                Our Approach
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {processSteps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative flex flex-col items-center text-center lg:px-4"
              >
                {i < processSteps.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.15 + 0.3 }}
                    className="absolute right-[-1rem] top-9 hidden h-px w-8 origin-left bg-[var(--color-ink)]/15 lg:block"
                  >
                    <ArrowRight
                      size={14}
                      className="absolute -right-1 -top-[7px] text-[var(--color-ink)]/30"
                    />
                  </motion.div>
                )}
                <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[var(--color-peach)] text-[var(--color-orange)]">
                  <Icon size={26} />
                </span>
                <span className="mt-5 text-xs font-bold tracking-wider text-[var(--color-orange)]">
                  {step.number}
                </span>
                <h3 className="mt-1 text-lg font-bold text-[var(--color-ink)]">{step.title}</h3>
                <p className="mt-2 max-w-[180px] text-sm leading-relaxed text-[var(--color-text-gray)]">
                  {step.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
