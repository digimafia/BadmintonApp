import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { SectionLabel } from './SectionLabel'

interface PageHeroProps {
  label: string
  title: ReactNode
  description?: string
}

export function PageHero({ label, title, description }: PageHeroProps) {
  return (
    <section className="px-4 pb-12 pt-32 sm:px-6 lg:px-8 lg:pt-40">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <SectionLabel>{label}</SectionLabel>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-extrabold leading-tight tracking-tight text-[var(--color-ink)] sm:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-text-gray)] sm:text-lg"
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  )
}
