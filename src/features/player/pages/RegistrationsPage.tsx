import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { usePlayerProfileStore } from '@/features/player/store/playerProfileStore'
import { useRegistrationStore } from '@/features/registrations/store/registrationStore'
import { useTournamentStore } from '@/features/tournaments/store/tournamentStore'

import { Registration } from '@/features/registrations/types/registration.types'
import { Tournament } from '@/features/tournaments/types/tournament.types'

const PlayerRegistrationsPage = () => {
  const { profile, hasProfile } = usePlayerProfileStore()

  const { getPlayerRegistrations } = useRegistrationStore()

  const {
    tournaments: allTournaments,
    loading: tournamentLoading,
    fetchTournaments,
  } = useTournamentStore()

  const navigate = useNavigate()

  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (hasProfile && profile) {
      setLoading(true)

      const playerRegistrations = getPlayerRegistrations(profile.id)

      setRegistrations(playerRegistrations)
      setLoading(false)
    } else {
      setRegistrations([])
      setLoading(false)
    }
  }, [hasProfile, profile, getPlayerRegistrations])

  useEffect(() => {
    if (allTournaments.length === 0 && !tournamentLoading) {
      void fetchTournaments()
    }
  }, [allTournaments.length, tournamentLoading, fetchTournaments])

  if (loading) {
    return (
      <div className="text-center py-8">
        Loading registrations...
      </div>
    )
  }

  if (!hasProfile || !profile) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">
          My Registrations
        </h1>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-center">
          <p className="text-yellow-700">
            Please complete your player profile to view your registrations.
          </p>
        </div>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => navigate('/player/profile')}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Complete Profile
          </button>
        </div>
      </div>
    )
  }

  if (registrations.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">
          My Registrations
        </h1>

        <div className="text-center py-8">
          <p className="text-gray-600">
            You have not registered for any tournaments yet.
          </p>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => navigate('/player/tournaments')}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Browse Tournaments
            </button>
          </div>
        </div>
      </div>
    )
  }

  const tournamentMap = new Map<string, Tournament>()

  allTournaments.forEach((tournament) => {
    tournamentMap.set(tournament.id, tournament)
  })

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        My Registrations
      </h1>

      <div className="space-y-4">
        {registrations.map((registration) => {
          const tournament = tournamentMap.get(registration.tournamentId)

          return (
            <div
              key={registration.id}
              className="border rounded-lg p-4"
            >
              <div className="flex justify-between items-start gap-4 mb-3">
                <div>
                  {tournament ? (
                    <>
                      <h3 className="text-lg font-semibold">
                        {tournament.name}
                      </h3>

                      <p className="text-sm text-gray-600">
                        Tournament Code: {tournament.tournamentCode}
                      </p>

                      <p className="text-sm text-gray-600">
                        Date:{' '}
                        {new Date(
                          tournament.tournamentDate
                        ).toLocaleDateString()}
                      </p>
                    </>
                  ) : (
                    <h3 className="text-lg font-semibold">
                      Tournament: {registration.tournamentId}
                    </h3>
                  )}

                  <p className="text-sm text-gray-600">
                    Category: {registration.categoryName}
                  </p>

                  <p className="text-sm text-gray-600">
                    Event Type: {registration.eventType}
                  </p>

                  <p className="text-sm text-gray-600">
                    Registration Code: {registration.registrationCode}
                  </p>

                  <p className="text-sm text-gray-600">
                    Status: {registration.status}
                  </p>

                  <p className="text-sm text-gray-600">
                    Registered:{' '}
                    {new Date(
                      registration.registeredAt
                    ).toLocaleDateString()}
                  </p>

                  {registration.status === 'CANCELLED' &&
                    registration.cancelledAt && (
                      <p className="text-sm text-red-600 mt-1">
                        Cancelled:{' '}
                        {new Date(
                          registration.cancelledAt
                        ).toLocaleDateString()}
                      </p>
                    )}
                </div>

                <div className="space-x-2">
                  {registration.status !== 'CANCELLED' && (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/player/tournaments/${registration.tournamentId}`
                        )
                      }
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      View Tournament
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PlayerRegistrationsPage