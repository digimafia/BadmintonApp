import { Outlet, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useLocation } from 'react-router-dom'
import { useNotifications } from '@/features/notifications/hooks/useNotifications'

const PlayerLayout = () => {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const pathname = location.pathname
  const { unreadCount } = useNotifications()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4 w-full">
            {/* App Brand */}

            <div className="flex shrink-0 items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">B</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                BadmintonApp
              </h1>
            </div>

            {/* Navigation Links */}
            <nav aria-label="Player navigation" className="order-3 flex w-full flex-wrap items-center gap-2 xl:order-none xl:w-auto">
              <Link
                to="/player/dashboard"
                className={`
                  px-3 py-2 rounded-md text-sm font-medium
                  ${pathname === '/player/dashboard' || pathname.startsWith('/player/dashboard/')
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-gray-600 hover:bg-gray-50'}
                `}
              >
                Dashboard
              </Link>
              <Link
                to="/player/tournaments"
                className={`
                  px-3 py-2 rounded-md text-sm font-medium
                  ${pathname.startsWith('/player/tournaments')
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-gray-600 hover:bg-gray-50'}
                `}
              >
                Tournaments
              </Link>
              <Link
                to="/player/registrations"
                className={`
                  px-3 py-2 rounded-md text-sm font-medium
                  ${pathname.startsWith('/player/registrations')
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-gray-600 hover:bg-gray-50'}
                `}
              >
                My Registrations
              </Link>
              <Link
                to="/player/fixtures"
                className={`px-3 py-2 rounded-md text-sm font-medium ${pathname.startsWith('/player/fixtures') ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Fixtures
              </Link>
              <Link
                to="/player/profile"
                className={`
                  px-3 py-2 rounded-md text-sm font-medium
                  ${pathname.startsWith('/player/profile')
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-gray-600 hover:bg-gray-50'}
                `}
              >
                Profile
              </Link>
              <Link
                to="/player/notifications"
                className={`
                  px-3 py-2 rounded-md text-sm font-medium relative
                  ${pathname.startsWith('/player/notifications')
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-gray-600 hover:bg-gray-50'}
                `}
              >
                Notifications
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            </nav>

            {/* User Actions */}
            <div className="flex items-center gap-3 ml-auto">
              {user && (
                <>
                  <span className="hidden sm:block text-sm text-gray-600">
                    {user.mobile}
                  </span>
                  <button
                    onClick={logout}
                    className={
                      'px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50'
                    }
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
