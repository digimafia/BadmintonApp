import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockLogin } from '@/features/auth/services/authService'
import { useAuthStore } from '@/store/authStore'
import { Role } from '@/types/auth.types'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [role, setRole] = useState<Role>('PLAYER')
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', confirmPassword: '' })
  const [agree, setAgree] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }))

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.mobile || !form.password) return setError('Please complete all required fields.')
    if (!/^[6-9]\d{9}$/.test(form.mobile)) return setError('Enter a valid 10-digit mobile number.')
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.')
    if (!agree) return setError('Please accept the terms to continue.')
    setLoading(true)
    try {
      const user = await mockLogin(form.mobile, role)
      login({ ...user, displayName: form.name })
      navigate(role === 'PLAYER' ? '/player/dashboard' : '/organizer/dashboard')
    } catch (registrationError: any) {
      setError(registrationError.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-page__court auth-page__court--one" /><div className="auth-page__court auth-page__court--two" />
      <div className="auth-page__light auth-page__light--one" /><div className="auth-page__light auth-page__light--two" />
      <section className="auth-screen auth-screen--register">
        <div className="auth-topbar"><button className="auth-back" onClick={() => navigate(-1)} aria-label="Go back">←</button><span className="auth-status" aria-hidden="true">▮▮▮ ◼ ▰</span></div>
        <p className="auth-login-link">Already have an account? <button onClick={() => navigate('/login')}>Login</button></p>
        <div className="auth-brand"><span>SMASH</span> <b>POINT</b><i>➤</i></div>
        <div className="auth-tagline">PLAY <b>·</b> CONNECT <b>·</b> COMPETE</div>
        <div className="auth-register-heading"><h1>Create Your Account</h1><p>Join a growing badminton community</p></div>
        <form className="auth-register-form" onSubmit={handleSubmit}>
          <div className="auth-role-toggle"><label><input type="radio" checked={role === 'PLAYER'} onChange={() => setRole('PLAYER')} /><span><b>♙</b>Player</span></label><label><input type="radio" checked={role === 'ORGANIZER'} onChange={() => setRole('ORGANIZER')} /><span><b>▥</b>Organizer</span></label></div>
          <label className="auth-input"><span>♙</span><input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Full Name" /></label>
          <label className="auth-input"><span>✉</span><input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="Email Address" /></label>
          <label className="auth-input"><span>⌕</span><b className="auth-country">+91⌄</b><input type="tel" inputMode="numeric" maxLength={10} value={form.mobile} onChange={(e) => update('mobile', e.target.value.replace(/\D/g, ''))} placeholder="Mobile Number" /></label>
          <label className="auth-input"><span>▣</span><input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Password" /><b>◉</b></label>
          <label className="auth-input"><span>▣</span><input type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} placeholder="Confirm Password" /><b>◉</b></label>
          <label className="auth-terms"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /><span>I agree to the <button type="button">Terms &amp; Conditions</button> and <button type="button">Privacy Policy</button></span></label>
          <button className="auth-submit" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Account'} <b>→</b></button>
          {error && <p className="auth-error" role="alert">{error}</p>}
        </form>
        <div className="auth-register-footer"><span>♙</span><span>♙</span><span>◉</span><small>Find<br />Tournaments</small><small>Connect<br />with Players</small><small>Be Part of a<br />Bigger Community</small></div>
      </section>
    </main>
  )
}

export default RegisterPage
