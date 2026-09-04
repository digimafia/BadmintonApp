import { useAuthStore } from '@/store/authStore'
import { usePlayerProfileStore } from '@/features/player/store/playerProfileStore'
import { useNavigate } from 'react-router-dom'

const PlayerDashboard = () => {
  const { user } = useAuthStore()
  const { profile, hasProfile } = usePlayerProfileStore()
  const navigate = useNavigate()

  const handleCreateProfile = () => {
    navigate('/player/profile')
  }

  const handleViewProfile = () => {
    navigate('/player/profile')
  }

  if (!user) {
    // This should not happen because of protection, but just in case
    return <div className="text-center">Please log in</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Player Dashboard</h1>
      {!hasProfile ? (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Complete Your Player Profile</h2>
          <p className="mb-6">
            Fill in your player details to unlock full platform features.
          </p>
          <button
            onClick={handleCreateProfile}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Profile
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Player Profile</h2>
          {profile && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <div className="bg-blue-100 text-blue-800 text-xl font-bold px-4 py-2 rounded">
                  {profile.playerCode}
                </div>
                <div>
                  <p className="font-semibold">{profile.fullName}</p>
                  <p className="text-sm text-gray-600">
                    {profile.experienceYears} years of experience
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Profile Status: {profile.profileStatus}
              </p>
              <button
                onClick={handleViewProfile}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                View Profile
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PlayerDashboard