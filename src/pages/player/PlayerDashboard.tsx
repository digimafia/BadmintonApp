import { useAuthStore } from '@/store/authStore'
import { usePlayerProfileStore } from '@/features/player/store/playerProfileStore'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '@/features/notifications/hooks/useNotifications'
import { useTournamentStore } from '@/features/tournaments/store/tournamentStore'
import { useRegistrationStore } from '@/features/registrations/store/registrationStore'
import { useMemo } from 'react'

const PlayerDashboard = () => {
  const user = useAuthStore(state => state.user)
  const { profile, hasProfile } = usePlayerProfileStore()
  const navigate = useNavigate()
  const { unreadCount } = useNotifications()
  const tournaments = useTournamentStore(state => state.tournaments)
  const registrations = useRegistrationStore(state => state.registrations)

  // Get tournaments available for registration (published and open registration)
  const availableTournaments = useMemo(() => {
    return tournaments
      .filter(t => t.status === 'PUBLISHED')
      .filter(t =>
        t.categories.some(c =>
          c.registrationPhase === 'OPEN' &&
          !registrations.some(r =>
            r.tournamentId === t.id &&
            r.categoryId === c.id &&
            r.status === 'REGISTERED'
          )
        )
      )
  }, [tournaments, registrations])

  // Get upcoming registrations for this user
  const userRegistrations = useMemo(() => {
    return registrations.filter(r =>
      r.playerId === profile?.id &&
      r.status === 'REGISTERED'
    )
  }, [registrations, profile])

  const handleCreateProfile = () => {
    navigate('/player/profile')
  }

  const handleViewProfile = () => {
    navigate('/player/profile')
  }

  const handleBrowseTournaments = () => {
    navigate('/player/tournaments')
  }

  const handleViewRegistrations = () => {
    navigate('/player/registrations')
  }

  const handleViewFixtures = () => {
    navigate('/player/fixtures')
  }

  if (!user) {
    // This should not happen because of protection, but just in case
    return <div className="text-center">Please log in</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Player Dashboard</h1>
      <div className="grid gap-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Player Profile Card */}
          <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col h-full">
            <div className="flex items-center space-x-4 mb-4">
              {profile?.profilePhoto ? (
                <img
                  src={profile.profilePhoto}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-200"
                />
              ) : (
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-500 font-bold">
                    {profile?.fullName
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .toUpperCase()}
                  </span>
                </div>
              )}
              <div className="space-y-1">
                <p className="font-semibold text-gray-900">{profile?.fullName || 'No Profile'}</p>
                <p className="text-sm text-gray-500">
                  {profile ? `${profile.playerCode} • ${profile.experienceYears} yrs exp` : 'Complete your profile'}
                </p>
              </div>
            </div>
            <div className="mt-auto">
              {hasProfile ? (
                <button
                  onClick={handleViewProfile}
                  className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700"
                >
                  View Profile
                </button>
              ) : (
                <button
                  onClick={handleCreateProfile}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
                >
                  Create Profile
                </button>
              )}
            </div>
          </div>

          {/* Available Tournaments Card */}
          <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col h-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🏆</span>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-gray-900">Available Tournaments</p>
                <p className="text-sm text-gray-500">
                  {availableTournaments.length} tournaments open for registration
                </p>
              </div>
            </div>
            <div className="mt-auto">
              <button
                onClick={handleBrowseTournaments}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
              >
                Browse Tournaments
              </button>
            </div>
          </div>

          {/* My Registrations Card */}
          <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col h-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">📝</span>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-gray-900">My Registrations</p>
                <p className="text-sm text-gray-500">
                  {userRegistrations.length} active registrations
                </p>
              </div>
            </div>
            <div className="mt-auto">
              <button
                onClick={handleViewRegistrations}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
              >
                My Registrations
              </button>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col h-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🔔</span>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-gray-900">Notifications</p>
                <p className="text-sm text-gray-500">
                  {unreadCount} unread notifications
                </p>
              </div>
            </div>
            <div className="mt-auto">
              <button
                onClick={() => navigate('/player/notifications')}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
              >
                View Notifications
              </button>
            </div>
          </div>

          {/* Upcoming Fixtures Card */}
          <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col h-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">📅</span>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-gray-900">Upcoming Fixtures</p>
                <p className="text-sm text-gray-500">
                  View your registered tournaments and upcoming match schedules
                </p>
              </div>
            </div>
            <div className="mt-auto">
              <button
                onClick={handleViewFixtures}
                className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600"
              >
                View Fixtures
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerDashboard
