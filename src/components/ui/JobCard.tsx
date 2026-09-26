import { MapPin, Briefcase, Clock } from 'lucide-react'
import { site } from '../../lib/site'
import type { Job } from '../../data/jobs'

export function JobCard({ job }: { job: Job }) {
  return (
    <div className="rounded-3xl border border-[var(--color-ink)]/8 bg-white p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-[var(--color-ink)]">{job.title}</h3>
          <p className="mt-1 text-sm font-medium text-[var(--color-orange)]">{job.department}</p>
        </div>
        <a
          href={`mailto:${site.email}?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
          className="focus-ring rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black"
        >
          Apply Now
        </a>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--color-text-gray)]">
        <span className="flex items-center gap-1.5">
          <MapPin size={14} /> {job.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Briefcase size={14} /> {job.arrangement}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={14} /> {job.type}
        </span>
      </div>

      <p className="mt-4 leading-relaxed text-[var(--color-text-gray)]">{job.description}</p>

      {job.requirements.length > 0 && (
        <>
          <h4 className="mt-5 text-sm font-bold text-[var(--color-ink)]">Requirements</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--color-text-gray)]">
            {job.requirements.map((req) => (
              <li key={req}>{req}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
