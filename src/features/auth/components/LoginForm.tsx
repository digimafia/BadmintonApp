import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import { mockLogin } from '@/features/auth/services/authService'
import { Role } from '@/types/auth.types'

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
    
    if (!mobile) {
      setError('Mobile number is required')
      return
    }
    
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError('Enter a valid 10-digit mobile number')
      return
    }
    
    if (!role) {
      setError('Please select a role')
      return
    }
    
    setLoading(true)
    try {
      const user = await mockLogin(mobile, role)
      login(user)
      // Redirect based on role
      switch (role) {
        case 'PLAYER':
          navigate('/player/dashboard')
          break
        case 'ORGANIZER':
          navigate('/organizer/dashboard')
          break
        case 'ADMIN':
          navigate('/admin/dashboard')
          break
      }
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <h2 className="text-2xl font-bold text-center">Login to Badminton Platform</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Mobile Number</label>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
            maxLength={10}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your mobile number"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Role (for testing)</label>
          <div className="space-y-2">
            {[ 'PLAYER', 'ORGANIZER', 'ADMIN' ].map((r) => (
              <label key={r} className="flex items-center space-x-2">
                <input
                  type="radio"
                  value={r as Role}
                  checked={role === r}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="h-4 w-4 text-blue-600"
                />
                <span>{r}</span>
              </label>
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
        
        {error && (
          <p className="text-sm text-red-600 text-center">
            {error}
          </p>
        )}
      </form>
      <p className="text-sm text-center text-gray-500">
        * Role selection is temporary for development only
      </p>
    </div>
  )
}

export default LoginForm
