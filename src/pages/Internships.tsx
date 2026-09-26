import { useState, type FormEvent } from 'react'
import { Code2, Server, GitBranch, Kanban } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import { PageHero } from '../components/ui/PageHero'
import { Reveal } from '../components/ui/Reveal'
import { TextField, TextAreaField, SelectField } from '../components/ui/FormField'
import { buildMailto } from '../lib/mailto'
import { submitToWeb3Forms } from '../lib/web3forms'
import { site } from '../lib/site'

const interestAreas = [
  { name: 'React Development', icon: Code2 },
  { name: '.NET / C#', icon: Server },
  { name: 'Git & GitHub', icon: GitBranch },
  { name: 'Agile Workflows', icon: Kanban },
]

interface FormState {
  fullName: string
  email: string
  phone: string
  college: string
  degree: string
  interest: string
  portfolio: string
  message: string
}

const initialState: FormState = {
  fullName: '',
  email: '',
  phone: '',
  college: '',
  degree: '',
  interest: '',
  portfolio: '',
  message: '',
}

export function Internships() {
  usePageMeta({
    title: 'Internships',
    description:
      'Apply for a technology internship at Global Tech Byte Private Limited and gain practical experience with React, .NET, Git and agile workflows.',
  })

  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'fallback'>('idle')

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.fullName.trim()) next.fullName = 'Full name is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (!form.phone.trim()) next.phone = 'Phone number is required.'
    if (!form.college.trim()) next.college = 'College / institution is required.'
    if (!form.degree.trim()) next.degree = 'Degree / course is required.'
    if (!form.interest) next.interest = 'Select an area of interest.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setStatus('submitting')

    const fields = {
      'Full Name': form.fullName,
      Email: form.email,
      Phone: form.phone,
      'College / Institution': form.college,
      'Degree / Course': form.degree,
      'Area of Interest': form.interest,
      'Portfolio / GitHub': form.portfolio,
      Message: form.message,
    }

    const sent = await submitToWeb3Forms(
      import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
      `Internship Enquiry - ${form.fullName}`,
      fields,
    )

    if (sent) {
      setStatus('sent')
      return
    }

    const mailto = buildMailto(site.email, `Internship Enquiry - ${form.fullName}`, fields)
    window.location.href = mailto
    setStatus('fallback')
  }

  return (
    <>
      <PageHero
        label="Internships"
        title={
          <>
            Learn. Build. <span className="text-[var(--color-orange)]">Grow.</span>
          </>
        }
        description="Gain hands-on exposure to real software engineering practices alongside our team."
      />

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-center text-2xl font-extrabold text-[var(--color-ink)]">Interest Areas</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {interestAreas.map((area, i) => {
              const Icon = area.icon
              return (
                <Reveal key={area.name} delay={i * 0.08}>
                  <div className="flex h-full flex-col items-center gap-3 rounded-2xl bg-[var(--color-peach)] p-6 text-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[var(--color-orange)]">
                      <Icon size={18} />
                    </span>
                    <span className="text-sm font-bold text-[var(--color-ink)]">{area.name}</span>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-3xl rounded-3xl border border-[var(--color-ink)]/8 bg-white p-8 sm:p-10">
            <h2 className="text-2xl font-extrabold text-[var(--color-ink)]">Internship Enquiry</h2>
            <p className="mt-2 text-sm text-[var(--color-text-gray)]">
              Tell us about yourself. Submitting opens your email client with the details pre-filled, addressed to{' '}
              <span className="font-medium text-[var(--color-ink)]">{site.email}</span>.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <TextField
                htmlFor="fullName"
                label="Full Name"
                required
                value={form.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                error={errors.fullName}
              />
              <TextField
                htmlFor="email"
                type="email"
                label="Email"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                error={errors.email}
              />
              <TextField
                htmlFor="phone"
                type="tel"
                label="Phone"
                required
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                error={errors.phone}
              />
              <TextField
                htmlFor="college"
                label="College / Institution"
                required
                value={form.college}
                onChange={(e) => update('college', e.target.value)}
                error={errors.college}
              />
              <TextField
                htmlFor="degree"
                label="Degree / Course"
                required
                value={form.degree}
                onChange={(e) => update('degree', e.target.value)}
                error={errors.degree}
              />
              <SelectField
                htmlFor="interest"
                label="Area of Interest"
                required
                options={interestAreas.map((a) => a.name)}
                value={form.interest}
                onChange={(e) => update('interest', e.target.value)}
                error={errors.interest}
              />
              <div className="sm:col-span-2">
                <TextField
                  htmlFor="portfolio"
                  label="Portfolio / GitHub URL"
                  value={form.portfolio}
                  onChange={(e) => update('portfolio', e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <TextAreaField
                  htmlFor="message"
                  label="Message"
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="focus-ring w-full rounded-full bg-[var(--color-orange)] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-orange-dark)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
                >
                  {status === 'submitting' ? 'Sending…' : 'Send Enquiry'}
                </button>
                {status === 'sent' && (
                  <p className="mt-3 text-sm text-[var(--color-text-gray)]">
                    Thanks — we've received your enquiry and will be in touch shortly.
                  </p>
                )}
                {status === 'fallback' && (
                  <p className="mt-3 text-sm text-[var(--color-text-gray)]">
                    Your email client should now open with your enquiry pre-filled. If it doesn't open, please email
                    us directly at{' '}
                    <a href={`mailto:${site.email}`} className="font-medium text-[var(--color-orange)]">
                      {site.email}
                    </a>
                    .
                  </p>
                )}
              </div>
            </form>
          </div>
        </Reveal>
      </section>
    </>
  )
}
