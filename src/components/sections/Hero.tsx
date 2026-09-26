import { useRef, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react'
import { Play, Sparkles, Lightbulb, Cpu, Layers } from 'lucide-react'
import { Button } from '../ui/Button'

const heroFeatures = [
  { label: 'Idea to Product', icon: Lightbulb },
  { label: 'Modern Technologies', icon: Cpu },
  { label: 'Scalable Solutions', icon: Layers },
]

export function Hero() {
  const shouldReduceMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springX = useSpring(mx, { stiffness: 100, damping: 20 })
  const springY = useSpring(my, { stiffness: 100, damping: 20 })
  const floatX = useTransform(springX, [-1, 1], [-14, 14])
  const floatY = useTransform(springY, [-1, 1], [-14, 14])
  const floatXReverse = useTransform(floatX, (v) => v * -0.5)
  const floatYReverse = useTransform(floatY, (v) => v * -0.5)

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (shouldReduceMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mx.set(((e.clientX - rect.left) / rect.width) * 2 - 1)
    my.set(((e.clientY - rect.top) / rect.height) * 2 - 1)
  }

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden px-4 pb-16 pt-32 sm:px-6 lg:px-8 lg:pt-40"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-ink)]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink)]/70"
          >
            <Sparkles size={13} className="text-[var(--color-orange)]" />
            Software Engineering Company / India
          </motion.div>

          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-[var(--color-ink)] sm:text-6xl lg:text-7xl">
            {['Your Idea.', 'Our '].map((line, i) => (
              <motion.span
                key={line}
                className="block overflow-hidden"
              >
                <motion.span
                  className="block"
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  {i === 1 ? (
                    <>
                      Our <span className="text-[var(--color-orange)]">Technology.</span>
                    </>
                  ) : (
                    line
                  )}
                </motion.span>
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-6 max-w-md text-base leading-relaxed text-[var(--color-text-gray)] sm:text-lg"
          >
            We turn your ideas into powerful web applications and software products that create real business value.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-9 flex flex-wrap items-center gap-6"
          >
            <Button as="link" to="/contact" variant="primary">
              Start a Project
            </Button>
            <a
              href="#process"
              className="focus-ring group flex items-center gap-3 text-sm font-semibold text-[var(--color-ink)]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-ink)]/15 transition-colors group-hover:border-[var(--color-orange)] group-hover:text-[var(--color-orange)]">
                <Play size={13} fill="currentColor" />
              </span>
              See How It Works
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[var(--color-ink)]/8 pt-6"
          >
            {heroFeatures.map((feature) => {
              const Icon = feature.icon
              return (
                <span key={feature.label} className="flex items-center gap-2 text-xs font-semibold text-[var(--color-ink)]/70 sm:text-sm">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-peach)] text-[var(--color-orange)]">
                    <Icon size={13} />
                  </span>
                  {feature.label}
                </span>
              )
            })}
          </motion.div>
        </div>

        <div className="relative mx-auto flex h-[440px] w-full max-w-sm items-center justify-center sm:h-[560px]">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ x: shouldReduceMotion ? 0 : floatX, y: shouldReduceMotion ? 0 : floatY }}
            className="relative h-full w-full overflow-hidden rounded-[3rem] bg-[var(--color-peach)] shadow-2xl shadow-black/10"
          >
            <img
              src="/images/hero/hero-person.webp"
              alt="Global Tech Byte software engineer"
              className="h-full w-full object-cover object-top"
              width={1024}
              height={1536}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            style={{ x: shouldReduceMotion ? 0 : floatXReverse }}
            className="absolute -right-2 top-6 hidden rounded-2xl bg-white px-4 py-3 text-xs font-semibold leading-relaxed text-[var(--color-ink)] shadow-xl sm:block"
          >
            IDEA
            <br />
            PLAN
            <br />
            DEVELOP
            <br />
            LAUNCH
            <br />
            SCALE
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.05 }}
            style={{ y: shouldReduceMotion ? 0 : floatYReverse }}
            className="absolute -bottom-4 left-0 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)] shadow-xl"
          >
            Build · Innovate · Scale
          </motion.div>
        </div>
      </div>
    </section>
  )
}
