import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Lightbulb, ClipboardList, PenTool, Code2, Rocket } from 'lucide-react'
import { SectionLabel } from '../ui/SectionLabel'
import { Button } from '../ui/Button'

const journey = [
  { label: 'Idea Consultation', icon: Lightbulb },
  { label: 'Product Planning', icon: ClipboardList },
  { label: 'UI/UX Design', icon: PenTool },
  { label: 'Development', icon: Code2 },
  { label: 'Launch & Support', icon: Rocket },
]

export function ProductShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  const imageY = useTransform(scrollYProgress, [0, 1], [30, -30])
  const imageRotate = useTransform(scrollYProgress, [0, 1], [-4, 4])

  return (
    <section ref={ref} className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[var(--color-ink)] px-6 py-16 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionLabel dark>Your Idea Into Real Products</SectionLabel>
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              Turn Your Ideas
              <br />
              into an <span className="text-[var(--color-orange)]">App or Product.</span>
            </h2>
            <p className="mt-5 max-w-md text-white/60">
              Have a unique idea? We can help you plan, design and develop it into a real, working product.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button as="link" to="/contact" variant="primary">
                Discuss Your Idea
              </Button>
              <a href="#process" className="focus-ring text-sm font-semibold text-white/80 hover:text-white">
                See How It Works
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 xl:justify-start">
            <div className="relative h-[380px] w-full max-w-sm shrink-0 sm:h-[420px]">
              <motion.img
                src="/images/product/product-development.webp"
                alt="App interface mockup with UI/UX planning elements"
                style={{ y: imageY, rotate: imageRotate }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 h-full w-full object-contain"
                width={1199}
                height={1312}
              />
            </div>

            <div className="hidden shrink-0 flex-col gap-2 xl:flex">
              {journey.map((step, i) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-xs font-semibold text-[var(--color-ink)] shadow-lg"
                  >
                    <Icon size={13} className="text-[var(--color-orange)]" />
                    {step.label}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-2 xl:hidden">
          {journey.map((step) => {
            const Icon = step.icon
            return (
              <span
                key={step.label}
                className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70"
              >
                <Icon size={12} className="text-[var(--color-orange)]" />
                {step.label}
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}
