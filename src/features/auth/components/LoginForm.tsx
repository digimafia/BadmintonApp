import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import { mockLogin } from '@/features/auth/services/authService'
import { Role } from '@/types/auth.types'
import { usePlayerDirectoryStore } from '@/features/player/store/playerDirectoryStore'
import { usePlayerProfileStore } from '@/features/player/store/playerProfileStore'

const roles: { value: Role; label: string; icon: string }[] = [
  { value: 'PLAYER', label: 'Player', icon: '♙' },
  { value: 'ORGANIZER', label: 'Organizer', icon: '▥' },
]

const LoginForm = () => {
  const [mobile, setMobile] = useState('')
  const [role, setRole] = useState<Role>('PLAYER')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!mobile) return setError('Enter your mobile number to continue.')
    if (!/^[6-9]\d{9}$/.test(mobile)) return setError('Enter a valid 10-digit mobile number.')
    if (!password) return setError('Enter your password to continue.')
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
    <div className="auth-form">
      <div className="auth-welcome"><h1>Good<br />to see you<br /><em>again!</em></h1><p>Login to continue your<br />badminton journey.</p></div>
      <form onSubmit={handleSubmit}>
        <div className="auth-role-toggle">
          {roles.map((item) => <label key={item.value}><input type="radio" value={item.value} checked={role === item.value} onChange={() => setRole(item.value)} /><span><b>{item.icon}</b>{item.label}</span></label>)}
        </div>
        <label className="auth-input"><span>✉</span><input id="mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
            maxLength={10}
            placeholder="Email or Mobile Number"
          /></label>
        <label className="auth-input"><span>♙</span><input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" /><b>◉</b></label>
        <div className="auth-options"><label><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /><span>Remember me</span></label><button type="button">Forgot Password?</button></div>
        <button type="submit" disabled={loading} className="auth-submit">{loading ? 'Signing in...' : 'Login'} <b>→</b></button>
        
        {error && (
          <p role="alert" className="auth-error">
            {error}
          </p>
        )}
      </form>
      <div className="auth-divider"><span>OR CONTINUE WITH</span></div>
      <div className="auth-social"><button type="button">G</button><button type="button">●</button><button type="button">f</button></div>
      <p className="auth-bottom-link">Don’t have an account? <button type="button" onClick={() => navigate('/register')}>Sign Up</button></p>
    </div>
  )
}

export default LoginForm
