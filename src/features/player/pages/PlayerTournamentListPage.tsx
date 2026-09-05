import { useTournamentStore } from '@/features/tournaments/store/tournamentStore'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDateDisplay, formatTimeDisplay } from '@/features/tournaments/utils/tournamentHelpers'

const PlayerTournamentListPage = () => {
  const { tournaments, loading, error } = useTournamentStore()
  const navigate = useNavigate()

  useEffect(() => {
    // Store already fetches on initialization
  }, [])

  const publishedTournaments = tournaments.filter(t => t.status === 'PUBLISHED')

  if (loading) {
    return <div className="text-center py-8">Loading tournaments...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error loading tournaments: {error}</div>
  }

  if (publishedTournaments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No tournaments available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Available Tournaments</h1>
      <div className="space-y-4">
        {publishedTournaments.map(tournament => (
          <div key={tournament.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{tournament.name}</h2>
                <p className="text-sm text-gray-600 mb-2">
                  {tournament.venueName} • {formatDateDisplay(tournament.tournamentDate)}
                </p>
                <p className="text-sm text-gray-500">
                  Registration closes: {formatDateDisplay(tournament.registrationCloseDate)} at {formatTimeDisplay(tournament.registrationCloseTime)}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => navigate(`/player/tournaments/${tournament.id}`)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlayerTournamentListPage