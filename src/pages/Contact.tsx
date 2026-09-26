import { useState, type FormEvent } from 'react'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import { PageHero } from '../components/ui/PageHero'
import { Reveal } from '../components/ui/Reveal'
import { TextField, TextAreaField, SelectField } from '../components/ui/FormField'
import { buildMailto } from '../lib/mailto'
import { submitToWeb3Forms } from '../lib/web3forms'
import { site } from '../lib/site'

const projectTypes = [
  'Custom Web Application',
  'Enterprise Software Solution',
  'API & Backend Development',
  'Frontend Engineering',
  'New App / Product Idea',
  'Other',
]

const budgetRanges = ['Under ₹1,00,000', '₹1,00,000 – ₹5,00,000', '₹5,00,000 – ₹15,00,000', 'Above ₹15,00,000', 'Not sure yet']

const timelines = ['Within 1 month', '1–3 months', '3–6 months', 'Flexible']

interface FormState {
  name: string
  email: string
  company: string
  projectType: string
  requirements: string
  budget: string
  timeline: string
}

const initialState: FormState = {
  name: '',
  email: '',
  company: '',
  projectType: '',
  requirements: '',
  budget: '',
  timeline: '',
}

export function Contact() {
  usePageMeta({
    title: 'Contact',
    description: 'Start a project with Global Tech Byte Private Limited. Reach us by phone, email, or WhatsApp.',
  })

  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'fallback'>('idle')

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.name.trim()) next.name = 'Name is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (!form.projectType) next.projectType = 'Select a project type.'
    if (!form.requirements.trim() || form.requirements.trim().length < 20)
      next.requirements = 'Please describe your requirements (at least 20 characters).'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setStatus('submitting')

    const fields = {
      Name: form.name,
      Email: form.email,
      Company: form.company,
      'Project Type': form.projectType,
      Requirements: form.requirements,
      Budget: form.budget,
      Timeline: form.timeline,
    }

    const sent = await submitToWeb3Forms(
      import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
      `Project Enquiry - ${form.name}`,
      fields,
    )

    if (sent) {
      setStatus('sent')
      return
    }

    const mailto = buildMailto(site.email, `Project Enquiry - ${form.name}`, fields)
    window.location.href = mailto
    setStatus('fallback')
  }

  return (
    <>
      <PageHero
        label="Contact Us"
        title={
          <>
            Let's Start Your <span className="text-[var(--color-orange)]">Project.</span>
          </>
        }
        description="Tell us about your idea or requirement — we'll get back to you to plan the next steps."
      />

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1fr_1.5fr]">
          <Reveal>
            <div className="flex flex-col gap-4">
              <div className="rounded-3xl bg-[var(--color-ink)] p-8 text-white">
                <h2 className="text-lg font-bold">Contact Details</h2>
                <ul className="mt-6 space-y-5">
                  <li className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-[var(--color-orange)]">
                      <Phone size={16} />
                    </span>
                    <a href={site.phoneHref} className="focus-ring text-sm font-medium hover:text-[var(--color-orange)]">
                      {site.phone}
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-[var(--color-orange)]">
                      <Mail size={16} />
                    </span>
                    <a href={`mailto:${site.email}`} className="focus-ring text-sm font-medium hover:text-[var(--color-orange)]">
                      {site.email}
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-[var(--color-orange)]">
                      <MapPin size={16} />
                    </span>
                    <span className="text-sm font-medium">{site.location}</span>
                  </li>
                </ul>
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring mt-8 flex items-center justify-center gap-2 rounded-full bg-[var(--color-orange)] py-3 text-sm font-semibold transition-colors hover:bg-[var(--color-orange-dark)]"
                >
                  <MessageCircle size={16} />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-3xl border border-[var(--color-ink)]/8 bg-white p-8 sm:p-10"
            >
              <h2 className="text-lg font-bold text-[var(--color-ink)]">Project Enquiry</h2>
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <TextField
                  htmlFor="name"
                  label="Name"
                  required
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  error={errors.name}
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
                  htmlFor="company"
                  label="Company"
                  value={form.company}
                  onChange={(e) => update('company', e.target.value)}
                />
                <SelectField
                  htmlFor="projectType"
                  label="Project Type"
                  required
                  options={projectTypes}
                  value={form.projectType}
                  onChange={(e) => update('projectType', e.target.value)}
                  error={errors.projectType}
                />
                <div className="sm:col-span-2">
                  <TextAreaField
                    htmlFor="requirements"
                    label="Project Requirements"
                    required
                    value={form.requirements}
                    onChange={(e) => update('requirements', e.target.value)}
                    error={errors.requirements}
                  />
                </div>
                <SelectField
                  htmlFor="budget"
                  label="Budget Range (optional)"
                  options={budgetRanges}
                  value={form.budget}
                  onChange={(e) => update('budget', e.target.value)}
                />
                <SelectField
                  htmlFor="timeline"
                  label="Timeline (optional)"
                  options={timelines}
                  value={form.timeline}
                  onChange={(e) => update('timeline', e.target.value)}
                />

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
                      Your email client should now open with your enquiry pre-filled. If it doesn't open, please
                      email us directly at{' '}
                      <a href={`mailto:${site.email}`} className="font-medium text-[var(--color-orange)]">
                        {site.email}
                      </a>
                      .
                    </p>
                  )}
                </div>
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  )
}
