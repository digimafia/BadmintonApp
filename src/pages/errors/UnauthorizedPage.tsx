import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'

const UnauthorizedPage = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const handleGoToMyDashboard = () => {
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Access Denied
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          You do not have permission to view this page.
        </p>
        <button
          onClick={handleGoToMyDashboard}
          className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to My Dashboard
        </button>
      </div>
    </div>
  )
}

export default UnauthorizedPage
