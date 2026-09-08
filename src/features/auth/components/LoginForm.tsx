import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import { mockLogin } from '@/features/auth/services/authService'
import { Role } from '@/types/auth.types'
import { usePlayerDirectoryStore } from '@/features/player/store/playerDirectoryStore'
import { usePlayerProfileStore } from '@/features/player/store/playerProfileStore'

const roles: { value: Role; label: string; detail: string; icon: string }[] = [
  { value: 'PLAYER', label: 'Player', detail: 'Join and compete', icon: '🏸' },
  { value: 'ORGANIZER', label: 'Organizer', detail: 'Run tournaments', icon: '🎯' },
  { value: 'ADMIN', label: 'Admin', detail: 'Manage platform', icon: '🛡️' },
]

const LoginForm = () => {
  const [mobile, setMobile] = useState('')
  const [role, setRole] = useState<Role | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!mobile) return setError('Enter your mobile number to continue.')
    if (!/^[6-9]\d{9}$/.test(mobile)) return setError('Enter a valid 10-digit mobile number.')
    if (!role) return setError('Choose how you want to enter the court.')
    setLoading(true)
    try {
      const user = await mockLogin(mobile, role)
      login(user)
      if (role === 'PLAYER') {
        const demoProfile = usePlayerDirectoryStore.getState().getProfileByMobileExact(mobile)
        if (demoProfile) usePlayerProfileStore.getState().createProfile(demoProfile)
      }
      navigate(role === 'PLAYER' ? '/player/dashboard' : role === 'ORGANIZER' ? '/organizer/dashboard' : '/admin/dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Welcome back</p>
      <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Step onto the court</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">Use your number and select your match-day role.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="mobile" className="mb-2 block text-sm font-bold text-slate-700">Mobile number</label>
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100"><span className="border-r border-slate-200 px-4 text-sm font-bold text-slate-500">+91</span><input id="mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
            maxLength={10}
            className="w-full border-0 bg-transparent px-4 py-3.5 text-base font-semibold text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400"
            placeholder="98765 43210"
          /></div>
        </div>
        
        <div>
          <label className="mb-3 block text-sm font-bold text-slate-700">I’m here as a</label>
          <div className="grid gap-2 sm:grid-cols-3">
            {roles.map((item) => (
              <label key={item.value} className="group relative cursor-pointer">
                <input
                  type="radio"
                  value={item.value}
                  checked={role === item.value}
                  onChange={() => setRole(item.value)}
                  className="peer sr-only"
                />
                <span className="flex min-h-28 flex-col justify-between rounded-xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:ring-2 peer-checked:ring-emerald-500"><span className="text-xl">{item.icon}</span><span><strong className="block text-sm text-slate-800">{item.label}</strong><small className="mt-0.5 block text-xs text-slate-500">{item.detail}</small></span></span>
              </label>
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-slate-950 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-600 disabled:translate-y-0 disabled:opacity-60"
        >
          {loading ? 'Getting your racket ready...' : 'Enter the court  →'}
        </button>
        
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {error}
          </p>
        )}
      </form>
      <p className="mt-6 text-center text-xs leading-5 text-slate-400">
        Demo: use any 10-digit Indian mobile number starting with 6–9.
      </p>
    </div>
  )
}

export default LoginForm
