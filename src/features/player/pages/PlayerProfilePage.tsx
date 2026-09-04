import { usePlayerProfileStore } from '@/features/player/store/playerProfileStore'
import { useNavigate, useLocation } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import PlayerProfileForm from '@/features/player/components/PlayerProfileForm'
import { PlayerProfile } from '@/features/player/types/player.types'

const PlayerProfilePage = () => {
  const { profile, hasProfile } = usePlayerProfileStore()
  const navigate = useNavigate()
  const location = useLocation()
  const isEditRoute = location.pathname === '/player/profile/edit'

  // If there's no profile and we're on the edit route, redirect to the profile page
  if (!hasProfile && isEditRoute) {
    return <Navigate to="/player/profile" replace />
  }

  const handleProfileCreated = () => {
    // After creating or updating a profile, if we were on the edit route, go back to view
    if (isEditRoute) {
      navigate('/player/profile', { replace: true })
    }
  }

  if (!hasProfile) {
    // No profile, show the create form
    return <PlayerProfileForm onProfileCreated={handleProfileCreated} />
  }

  // We have a profile
  if (isEditRoute) {
    // Show the edit form with the existing profile
    return <PlayerProfileForm profile={profile} onProfileCreated={handleProfileCreated} />
  }

  // Show the profile view
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Player Profile
            </h1>
            <button
              onClick={() => navigate('/player/profile/edit')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </header>
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {profile && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                {profile.profilePhoto ? (
                  <img
                    src={profile.profilePhoto}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-blue-200"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-500">No Photo</span>
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold">{profile.fullName}</h2>
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 text-blue-800 text-lg font-bold px-3 py-1 rounded">
                      {profile.playerCode}
                    </div>
                    <span className="text-sm text-gray-600">
                      {profile.profileStatus === 'ACTIVE' ? 'Active' : 'Incomplete'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Age
                  </p>
                  <p className="text-lg font-medium">{profile.age}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Mobile
                  </p>
                  <p className="text-lg font-medium">{profile.mobile}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Location
                  </p>
                  <p className="text-lg font-medium">{profile.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Playing Since
                  </p>
                  <p className="text-lg font-medium">{profile.playingSince}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Experience
                  </p>
                  <p className="text-lg font-medium">
                    {profile.experienceYears} Years
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Regular Player
                  </p>
                  <p className="text-lg font-medium">
                    {profile.regularPlayer ? 'Yes' : 'No'}
                  </p>
                </div>
                {profile.regularPlayer && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Court/Academy
                    </p>
                    <p className="text-lg font-medium">{profile.courtAcademy}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default PlayerProfilePage