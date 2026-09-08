import { Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useNotifications } from '@/features/notifications/hooks/useNotifications'
import { Link } from 'react-router-dom'

const OrganizerLayout = () => {
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)
  const { unreadCount } = useNotifications()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <Link to="/organizer/dashboard" className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-900"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500 text-base">🏸</span>SmashPoint <span className="text-sm font-semibold text-emerald-600">Organizer</span></Link>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              {user && (
                <>
                  <Link to="/organizer/tournaments" className="text-sm font-semibold text-slate-600 hover:text-emerald-600">Tournaments</Link>
                  <span className="text-sm text-gray-600">
                    {user.mobile}
                  </span>
                  <Link
                    to="/organizer/notifications"
                    className="relative inline-flex min-h-10 items-center text-sm text-gray-600 hover:text-gray-900"
                  >
                    Notifications
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={logout}
                    className="min-h-10 text-sm text-gray-600 hover:text-gray-900"
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

export default OrganizerLayout
