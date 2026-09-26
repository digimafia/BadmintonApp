import { usePageMeta } from '../hooks/usePageMeta'
import { PageHero } from '../components/ui/PageHero'
import { Reveal } from '../components/ui/Reveal'
import { WhyUs } from '../components/sections/WhyUs'
import { Highlights } from '../components/sections/Highlights'
import { CTABanner } from '../components/sections/CTABanner'
import { Code2, Server, GitBranch, Kanban } from 'lucide-react'

const stack = [
  { name: 'React', icon: Code2, note: 'Front-end application development' },
  { name: '.NET / C#', icon: Server, note: 'Backend services and APIs' },
  { name: 'Git & GitHub', icon: GitBranch, note: 'Version control and collaboration' },
  { name: 'Jira / Agile', icon: Kanban, note: 'Iterative, transparent delivery' },
]

export function About() {
  usePageMeta({
    title: 'About Us',
    description:
      'Global Tech Byte Private Limited is an India-based software engineering company focused on business-driven web applications and digital products.',
  })

  return (
    <>
      <PageHero
        label="About Us"
        title={
          <>
            Engineering Software
            <br />
            with <span className="text-[var(--color-orange)]">Purpose.</span>
          </>
        }
        description="Global Tech Byte Private Limited is a software engineering company based in India, focused on turning business ideas into reliable, well-built digital products."
      />

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-[var(--color-ink)]">Our Approach</h2>
              <p className="mt-4 leading-relaxed text-[var(--color-text-gray)]">
                We work closely with business owners and organizations to understand real operational needs, then
                design and build software that addresses them directly. Every engagement starts with discovery, not
                assumptions — because software that doesn't fit the business isn't useful, no matter how well it's
                built.
              </p>
              <p className="mt-4 leading-relaxed text-[var(--color-text-gray)]">
                Our team follows an agile, transparent process, keeping clients informed at every stage from planning
                through delivery and beyond.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="rounded-3xl bg-[var(--color-peach)] p-8">
              <h3 className="text-lg font-bold text-[var(--color-ink)]">Our Technology Stack</h3>
              <div className="mt-6 grid grid-cols-2 gap-5">
                {stack.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.name} className="flex flex-col gap-2">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[var(--color-orange)]">
                        <Icon size={18} />
                      </span>
                      <span className="text-sm font-bold text-[var(--color-ink)]">{item.name}</span>
                      <span className="text-xs leading-snug text-[var(--color-text-gray)]">{item.note}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Highlights />
      <WhyUs />
      <CTABanner />
    </>
  )
}
