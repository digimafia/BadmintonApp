import { Outlet, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const PlayerLayout = () => {
  const { user, logout } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Player Portal
            </h1>
            <div className="flex items-center space-x-4">
              {/* Navigation links */}
              <Link to="/player/dashboard" className="text-sm text-gray-600 hover:text-gray-900 mr-4">
                Dashboard
              </Link>
              <Link to="/player/profile" className="text-sm text-gray-600 hover:text-gray-900">
                Profile
              </Link>
              {user && (
                <>
                  <span className="text-sm text-gray-600 mr-4">
                    {user.mobile}
                  </span>
                  <button
                    onClick={logout}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default PlayerLayout