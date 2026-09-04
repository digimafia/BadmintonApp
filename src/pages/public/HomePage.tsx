import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const handleGoToDashboard = () => {
    if (!user) {
      navigate('/login')
      return
    }
    switch (user.role) {
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
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Badminton Tournament Platform
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage your tournaments with ease
          </p>
          <button
            onClick={handleGoToDashboard}
            className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.displayName || user.mobile}!
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          You are logged in as a {user.role}.
        </p>
        <button
          onClick={handleGoToDashboard}
          className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  )
}

export default HomePage
