import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useTournamentStore } from '@/features/tournaments/store/tournamentStore'
import { usePlayerProfileStore } from '@/features/player/store/playerProfileStore'
import { useRegistrationStore } from '@/features/registrations/store/registrationStore'
import { registrationService } from '@/features/registrations/services/registrationService'

import { evaluatePlayerEligibility } from '@/features/eligibility/utils/eligibilityUtils'
import { EligibilityResult } from '@/features/eligibility/types/eligibility.types'

import {
  formatDateDisplay,
  formatTimeDisplay,
} from '@/features/tournaments/utils/tournamentHelpers'

const PlayerTournamentDetailPage = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>()
  const navigate = useNavigate()

  const {
    tournament,
    loading,
    error,
    fetchTournamentById,
  } = useTournamentStore()

  const { profile, hasProfile } = usePlayerProfileStore()

  const {
    registrations,
    getPlayerRegistrations,
    getTournamentRegistrations,
  } = useRegistrationStore()

  const [eligibilityResults, setEligibilityResults] = useState<
    Map<string, EligibilityResult>
  >(new Map())

  const [checkingEligibility, setCheckingEligibility] =
    useState<boolean>(false)

  const [registrationStatus, setRegistrationStatus] = useState<
    Record<string, { success: boolean; message: string }>
  >({})

  useEffect(() => {
    if (tournamentId) {
      void fetchTournamentById(tournamentId)
    }
  }, [tournamentId, fetchTournamentById])

  const playerRegistrations = useMemo(() => {
    if (!hasProfile || !profile || !tournamentId) {
      return []
    }

    return getPlayerRegistrations(profile.id).filter(
      (registration) =>
        registration.tournamentId === tournamentId &&
        registration.status === 'REGISTERED'
    )
  }, [
    hasProfile,
    profile,
    tournamentId,
    registrations,
    getPlayerRegistrations,
  ])

  useEffect(() => {
    if (
      !tournament ||
      !profile ||
      !hasProfile ||
      !tournamentId ||
      tournament.status !== 'PUBLISHED'
    ) {
      setEligibilityResults(new Map())
      return
    }

    let isCancelled = false

    const checkEligibility = async () => {
      setCheckingEligibility(true)

      try {
        const eligibilityMap = new Map<string, EligibilityResult>()

        const tournamentRegistrations =
          getTournamentRegistrations(tournament.id)

        for (const category of tournament.categories ?? []) {
          const currentRegistrations = tournamentRegistrations.filter(
            (registration) =>
              registration.categoryId === category.id &&
              registration.status === 'REGISTERED'
          ).length

          const eligibilityResult = evaluatePlayerEligibility(
            profile,
            tournament,
            category,
            currentRegistrations
          )

          eligibilityMap.set(category.id, eligibilityResult)
        }

        if (!isCancelled) {
          setEligibilityResults(eligibilityMap)
        }
      } finally {
        if (!isCancelled) {
          setCheckingEligibility(false)
        }
      }
    }

    void checkEligibility()

    return () => {
      isCancelled = true
    }
  }, [
    tournament,
    profile,
    hasProfile,
    tournamentId,
    registrations,
    getTournamentRegistrations,
  ])

  const handleRegister = async (categoryId: string) => {
    if (!hasProfile || !profile) {
      setRegistrationStatus((previous) => ({
        ...previous,
        [categoryId]: {
          success: false,
          message: 'Please complete your profile first',
        },
      }))
      return
    }

    if (!tournament || !tournamentId) {
      setRegistrationStatus((previous) => ({
        ...previous,
        [categoryId]: {
          success: false,
          message: 'Tournament not found',
        },
      }))
      return
    }

    const category = tournament.categories?.find(
      (item) => item.id === categoryId
    )

    if (!category) {
      setRegistrationStatus((previous) => ({
        ...previous,
        [categoryId]: {
          success: false,
          message: 'Category not found',
        },
      }))
      return
    }

    const alreadyRegistered = playerRegistrations.some(
      (registration) =>
        registration.categoryId === categoryId &&
        registration.status === 'REGISTERED'
    )

    if (alreadyRegistered) {
      setRegistrationStatus((previous) => ({
        ...previous,
        [categoryId]: {
          success: false,
          message: 'You are already registered for this category',
        },
      }))
      return
    }

    try {
      const registration = await registrationService.registerPlayer(
        tournamentId,
        categoryId,
        profile
      )

      setRegistrationStatus((previous) => ({
        ...previous,
        [categoryId]: {
          success: true,
          message: `Registration successful! Your registration code is: ${registration.registrationCode}`,
        },
      }))

      navigate('/player/registrations')
    } catch (errorValue: unknown) {
      const message =
        errorValue instanceof Error
          ? errorValue.message
          : 'Registration failed'

      setRegistrationStatus((previous) => ({
        ...previous,
        [categoryId]: {
          success: false,
          message,
        },
      }))
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        Loading tournament details...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading tournament: {error}
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="text-center py-8">
        Tournament not found
      </div>
    )
  }

  if (tournament.status !== 'PUBLISHED') {
    return (
      <div className="p-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-center">
          <p className="text-yellow-700">
            Tournament not available
          </p>
        </div>
      </div>
    )
  }

  if (!hasProfile || !profile) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">
          {tournament.name}
        </h1>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700">
            Please complete your player profile to view eligibility and
            register for tournaments.
          </p>
        </div>

        <div className="text-center">
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

  return (
    <div className="p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold">
            {tournament.name}
          </h1>

          <p className="text-sm text-gray-600">
            {tournament.venueName} •{' '}
            {formatDateDisplay(tournament.tournamentDate)}
          </p>
        </div>

        {playerRegistrations.length > 0 && (
          <button
            type="button"
            onClick={() => navigate('/player/registrations')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            My Registrations
          </button>
        )}
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">
          Tournament Information
        </h2>

        <p className="mb-2">
          <strong>Tournament Code:</strong>{' '}
          {tournament.tournamentCode}
        </p>

        <p className="mb-2">
          <strong>Date:</strong>{' '}
          {formatDateDisplay(tournament.tournamentDate)}
        </p>

        <p className="mb-2">
          <strong>Reporting Time:</strong>{' '}
          {formatTimeDisplay(tournament.reportingTime)}
        </p>

        <p className="mb-2">
          <strong>Registration Closes:</strong>{' '}
          {formatDateDisplay(tournament.registrationCloseDate)} at{' '}
          {formatTimeDisplay(tournament.registrationCloseTime)}
        </p>

        <p className="mb-2">
          <strong>Venue:</strong> {tournament.venueName}
        </p>

        <p className="mb-2">
          <strong>Venue Address:</strong>{' '}
          {tournament.venueAddress}
        </p>

        <p className="mb-2">
          <strong>Format:</strong> {tournament.format}
        </p>

        <p className="mb-2">
          <strong>Status:</strong>{' '}
          <span className="text-green-600 font-medium">
            {tournament.status}
          </span>
        </p>

        {tournament.mapLink && (
          <p className="mb-2">
            <strong>Map:</strong>{' '}
            <a
              href={tournament.mapLink}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              View Location
            </a>
          </p>
        )}

        {tournament.description && (
          <p className="mb-2">
            <strong>Description:</strong>{' '}
            {tournament.description}
          </p>
        )}

        {tournament.prizes && (
          <p className="mb-2">
            <strong>Prize Details:</strong>{' '}
            {tournament.prizes}
          </p>
        )}

        {tournament.shuttle && (
          <p className="mb-2">
            <strong>Shuttle:</strong> {tournament.shuttle}
          </p>
        )}

        {tournament.scoringFormat && (
          <p className="mb-2">
            <strong>Scoring:</strong>{' '}
            {tournament.scoringFormat}
          </p>
        )}
      </div>

      {tournament.generalRules &&
        tournament.generalRules.length > 0 && (
          <div className="mb-6 p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-3">
              General Rules
            </h2>

            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              {tournament.generalRules.map((rule, index) => (
                <li key={`${rule}-${index}`}>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        )}

      {tournament.categories &&
      tournament.categories.length > 0 ? (
        <>
          <h2 className="text-xl font-semibold mb-4">
            Event Categories
          </h2>

          <div className="space-y-4">
            {tournament.categories.map((category) => {
              const eligibility =
                eligibilityResults.get(category.id)

              const isRegistered =
                playerRegistrations.some(
                  (registration) =>
                    registration.categoryId === category.id &&
                    registration.status === 'REGISTERED'
                )

              const regStatus =
                registrationStatus[category.id]

              return (
                <div
                  key={category.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold">
                      {category.name}
                    </h3>

                    <p className="text-sm text-gray-600">
                      {category.eventType}
                    </p>

                    {(category.minAge !== undefined ||
                      category.maxAge !== undefined) && (
                      <p className="text-sm text-gray-500">
                        Age:{' '}
                        {category.minAge ?? 'No minimum'} -{' '}
                        {category.maxAge ?? 'No maximum'}
                      </p>
                    )}

                    {category.maxTeams !== undefined && (
                      <p className="text-sm text-gray-500">
                        Max Entries:{' '}
                        {category.maxTeams}
                      </p>
                    )}

                    <p className="text-sm text-gray-500">
                      Medalists Allowed:{' '}
                      {category.medalistsAllowed
                        ? 'Yes'
                        : 'No'}
                    </p>

                    <p className="text-sm text-gray-500">
                      Open Players Allowed:{' '}
                      {category.openPlayersAllowed
                        ? 'Yes'
                        : 'No'}
                    </p>

                    <p className="text-sm text-gray-500">
                      Beginner Only:{' '}
                      {category.beginnerOnly
                        ? 'Yes'
                        : 'No'}
                    </p>

                    <p className="text-sm text-gray-500">
                      Pure Beginner Only:{' '}
                      {category.pureBeginnerOnly
                        ? 'Yes'
                        : 'No'}
                    </p>

                    {category.additionalRuleNotes && (
                      <p className="text-sm text-gray-500 italic mt-1">
                        {category.additionalRuleNotes}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 p-3 border-t border-gray-200">
                    {eligibility ? (
                      eligibility.eligible ? (
                        <>
                          <p className="text-sm font-medium text-green-600 mb-2">
                            Eligible
                          </p>

                          {!regStatus && (
                            <>
                              {category.eventType ===
                                'SINGLES' &&
                                !isRegistered && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRegister(
                                        category.id
                                      )
                                    }
                                    className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                  >
                                    Register
                                  </button>
                                )}

                              {category.eventType ===
                                'DOUBLES' &&
                                !isRegistered && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigate(`/player/tournaments/${tournamentId}/doubles/${category.id}/partner`);
                                    }}
                                    className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                  >
                                    Select Partner
                                  </button>
                                )}

                              {isRegistered && (
                                <p className="text-sm text-gray-500 mt-1">
                                  Already Registered
                                </p>
                              )}
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-red-600">
                            Not Eligible
                          </p>

                          <ul className="list-disc list-inside mt-1 text-sm text-red-500 space-y-1">
                            {eligibility.reasons.map(
                              (reason, index) => (
                                <li
                                  key={`${reason.code}-${index}`}
                                >
                                  {reason.message}
                                </li>
                              )
                            )}
                          </ul>
                        </>
                      )
                    ) : (
                      <p className="text-sm text-gray-500">
                        {checkingEligibility
                          ? 'Checking eligibility...'
                          : 'Eligibility unavailable'}
                      </p>
                    )}

                    {regStatus && (
                      <div className="mt-2">
                        {regStatus.success ? (
                          <div className="bg-green-50 border border-green-200 text-green-800 p-2 rounded">
                            {regStatus.message}
                          </div>
                        ) : (
                          <div className="bg-red-50 border border-red-200 text-red-800 p-2 rounded">
                            {regStatus.message}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <p className="text-center py-8">
          No categories available for this tournament.
        </p>
      )}
    </div>
  )
}

export default PlayerTournamentDetailPage