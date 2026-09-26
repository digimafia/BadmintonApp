import { Inbox } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import { PageHero } from '../components/ui/PageHero'
import { Reveal } from '../components/ui/Reveal'
import { JobCard } from '../components/ui/JobCard'
import { jobs } from '../data/jobs'
import { site } from '../lib/site'

export function Careers() {
  usePageMeta({
    title: 'Careers',
    description: 'Explore current job opportunities at Global Tech Byte Private Limited, a software engineering company based in India.',
  })

  return (
    <>
      <PageHero
        label="Careers"
        title={
          <>
            Your Next Chapter
            <br />
            Starts <span className="text-[var(--color-orange)]">Here.</span>
          </>
        }
        description="We're a software engineering company building business-focused digital products with React and .NET — and we grow through people who care about doing the work well."
      />

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { title: 'Work Philosophy', body: 'Transparent collaboration, clear ownership, and software built around real business outcomes.' },
            { title: 'Technology Environment', body: 'React, .NET / C#, Git & GitHub, and agile delivery with Jira.' },
            { title: 'How We Work', body: 'Close client collaboration from discovery through delivery, with room to learn and grow.' },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <div className="h-full rounded-3xl bg-[var(--color-peach)] p-6">
                <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--color-orange)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink)]/80">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-2xl font-extrabold text-[var(--color-ink)]">Current Opportunities</h2>

          {jobs.length === 0 ? (
            <Reveal>
              <div className="flex flex-col items-center rounded-3xl border border-dashed border-[var(--color-ink)]/15 bg-white px-8 py-16 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-peach)] text-[var(--color-orange)]">
                  <Inbox size={24} />
                </span>
                <h3 className="mt-5 text-lg font-bold text-[var(--color-ink)]">No open positions right now</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--color-text-gray)]">
                  We don't have any published vacancies at the moment. We're always glad to hear from strong
                  engineers — send your profile and we'll keep it on file for future openings.
                </p>
                <a
                  href={`mailto:${site.email}?subject=${encodeURIComponent('Interest in future opportunities')}`}
                  className="focus-ring mt-6 rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
                >
                  Send Your Profile
                </a>
              </div>
            </Reveal>
          ) : (
            <div className="flex flex-col gap-6">
              {jobs.map((job) => (
                <Reveal key={job.id}>
                  <JobCard job={job} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
