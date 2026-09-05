import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useTournamentStore } from '@/features/tournaments/store/tournamentStore'
import { usePlayerProfileStore } from '@/features/player/store/playerProfileStore'
import { useGuestPlayerStore } from '@/features/player/store/guestPlayerStore'
import { usePlayerDirectoryStore } from '@/features/player/store/playerDirectoryStore'
import { useRegistrationStore } from '@/features/registrations/store/registrationStore'
import { useTeamStore } from '@/features/teams/store/teamStore'
import { useDoublesRegistrationDraftStore } from '@/features/teams/store/doublesRegistrationDraftStore'

import { registrationService } from '@/features/registrations/services/registrationService'
import { teamService } from '@/features/teams/services/teamService'
import { guestPlayerService } from '@/features/player/services/guestPlayerService'

import { TournamentCategory } from '@/features/tournaments/types/tournament.types'
import { PlayerProfile } from '@/features/player/types/player.types'
import { GuestPlayer } from '@/features/player/types/guest.player.types'
import { formatDateDisplay } from '@/features/tournaments/utils/tournamentHelpers'

import { evaluatePlayerEligibility } from '@/features/eligibility/utils/eligibilityUtils'
import { EligibilityResult } from '@/features/eligibility/types/eligibility.types'

const DoubleRegistrationConfirmationPage = () => {
  const {
    tournamentId,
    categoryId,
  } = useParams<{ tournamentId: string; categoryId: string }>()
  const navigate = useNavigate()

  const {
    tournament,
    loading: tournamentLoading,
    error: tournamentError,
  } = useTournamentStore()

  const { profile: currentProfile, hasProfile } = usePlayerProfileStore()

  const {
    guests,
    getGuestByMobile,
  } = useGuestPlayerStore()

  const {
    profiles: allProfiles,
  } = usePlayerDirectoryStore()

  const {
    registrations,
    getTournamentRegistrations,
  } = useRegistrationStore()

  const {
    teams: allTeams,
  } = useTeamStore()

  const {
    tournamentId: draftTournamentId,
    categoryId: draftCategoryId,
    currentPlayerId,
    partnerId,
    partnerCode,
    partnerName,
    partnerType,
    partnerStatus,
    setEligibility,
    clear: clearDraft
  } = useDoublesRegistrationDraftStore()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [showPartnerAcceptButton, setShowPartnerAcceptButton] = useState<boolean>(false)
  const [partnerAccepted, setPartnerAccepted] = useState<boolean>(false)
  const [currentPlayerEligibility, setCurrentPlayerEligibility] = useState<boolean | null>(null)
  const [partnerEligibility, setPartnerEligibility] = useState<boolean | null>(null)
  const [currentPlayerRejectionReasons, setCurrentPlayerRejectionReasons] = useState<string[]>([])
  const [partnerRejectionReasons, setPartnerRejectionReasons] = useState<string[]>([])

  useEffect(() => {
    // Validate that we have the required data in the draft store
    if (!draftTournamentId || !draftCategoryId || !currentPlayerId) {
      navigate('/player')
      return
    }

    // If the draft store data doesn't match the route, we might have a mismatch.
    // We'll trust the route over the draft store for tournament and category.
    // But we'll use the draft store for partner and player data.
  }, [draftTournamentId, draftCategoryId, currentPlayerId, tournamentId, categoryId, navigate])

  useEffect(() => {
    // Fetch tournament if not already loaded
    if (tournamentId && categoryId) {
      const fetchTournament = async () => {
        const tournamentStore = useTournamentStore.getState()
        if (!tournamentStore.tournament || tournamentStore.tournament.id !== tournamentId) {
          await tournamentStore.fetchTournamentById(tournamentId)
        }
      }
      fetchTournament()
    }
  }, [tournamentId, categoryId])

  useEffect(() => {
    // Check current player eligibility if not already checked
    if (currentPlayerEligibility === null && hasProfile && currentProfile && tournamentId && categoryId) {
      void checkCurrentPlayerEligibility()
    }
  }, [hasProfile, currentProfile, tournamentId, categoryId, currentPlayerEligibility])

  const checkCurrentPlayerEligibility = async () => {
    if (!tournamentId || !categoryId) return

    const tournamentStore = useTournamentStore.getState()
    if (!tournamentStore.tournament || tournamentStore.tournament.id !== tournamentId) {
      await tournamentStore.fetchTournamentById(tournamentId)
    }

    const { tournament } = tournamentStore
    if (!tournament) return

    const { profile, hasProfile } = usePlayerProfileStore.getState()
    if (!hasProfile || !profile) return

    try {
      const tournamentRegistrations = getTournamentRegistrations(tournament.id)
      const currentRegistrations = tournamentRegistrations.filter(
        (reg) =>
          reg.categoryId === categoryId &&
          reg.status === 'REGISTERED'
      ).length

      const eligibility = evaluatePlayerEligibility(
        profile,
        tournament,
        tournament.categories.find(c => c.id === categoryId)!,
        currentRegistrations
      )
      setCurrentPlayerEligibility(eligibility.eligible)
      setCurrentPlayerRejectionReasons((eligibility.reasons ?? []).map(reason => reason.message))
      // Update eligibility in draft store
      setEligibility(eligibility.eligible, partnerEligibility)
    } catch (err) {
      setError('Failed to check eligibility. Please try again.')
    }
  }

  const checkPartnerEligibility = async () => {
    if (!partnerId || !tournamentId || !categoryId) return

    const tournamentStore = useTournamentStore.getState()
    if (!tournamentStore.tournament || tournamentStore.tournament.id !== tournamentId) {
      await tournamentStore.fetchTournamentById(tournamentId)
    }

    const { tournament } = tournamentStore
    if (!tournament) return

    const category = tournament.categories.find(c => c.id === categoryId)
    if (!category) return

    const registrationStore = useRegistrationStore.getState()
    let tournamentRegistrations: any[] = []
    try {
      tournamentRegistrations = getTournamentRegistrations(tournament.id)
    } catch (err) {
      setError('Failed to get tournament registrations. Please try again.')
      return
    }

    const currentRegistrations = tournamentRegistrations.filter(
      (reg) =>
        reg.categoryId === categoryId &&
        reg.status === 'REGISTERED'
    ).length

    let partnerEligibilityResult: EligibilityResult | null = null
    try {
      // We need to get the partner profile (either PlayerProfile or GuestPlayer)
      let partnerProfile: PlayerProfile | GuestPlayer | null = null
      if (partnerType === 'FULL') {
        partnerProfile = usePlayerDirectoryStore.getState().getProfileById(partnerId)
      } else if (partnerType === 'GUEST') {
        partnerProfile = useGuestPlayerStore.getState().getGuestById(partnerId)
      }

      if (!partnerProfile) {
        setError('Partner not found')
        return
      }

      partnerEligibilityResult = evaluatePlayerEligibility(
        partnerProfile,
        tournament,
        category,
        currentRegistrations
      )
      setPartnerEligibility(partnerEligibilityResult.eligible)
      setPartnerRejectionReasons((partnerEligibilityResult.reasons ?? []).map(reason => reason.message))
      // Update eligibility in draft store
      setEligibility(currentPlayerEligibility, partnerEligibilityResult.eligible)
    } catch (err) {
      setError('Failed to check partner eligibility. Please try again.')
    }
  }

  // Check partner eligibility when partner data changes
  useEffect(() => {
    if (partnerId && partnerType && partnerStatus !== null && currentPlayerEligibility !== null) {
      void checkPartnerEligibility()
    }
  }, [partnerId, partnerType, partnerStatus, currentPlayerEligibility, checkPartnerEligibility])

  // Determine if we should show the partner accept button
  useEffect(() => {
    if (partnerType === 'FULL' && partnerStatus === 'PENDING_CONFIRMATION') {
      setShowPartnerAcceptButton(true)
      setPartnerAccepted(false)
    } else if (partnerType === 'GUEST') {
      setShowPartnerAcceptButton(false)
      setPartnerAccepted(true) // Guest is always accepted
    } else if (partnerType === 'FULL' && partnerStatus === 'ACCEPTED') {
      setShowPartnerAcceptButton(false)
      setPartnerAccepted(true)
    } else {
      setShowPartnerAcceptButton(false)
      setPartnerAccepted(false)
    }
  }, [partnerType, partnerStatus])

  const handleSimulatePartnerAccept = async () => {
    // Update partner status to ACCEPTED in draft store
    setEligibility(currentPlayerEligibility, true) // This sets partnerEligibility to true
    // Also update the partner status in the draft store? We don't have a setter for just partner status.
    // We'll update the draft store by setting the partner again with accepted status.
    // But we don't have the partner profile object here. We'll skip updating the partner status in the draft store for now.
    // Instead, we'll just set a local state to indicate acceptance and use that for confirmation.
    setPartnerAccepted(true)
  }

  const handleConfirmAndRegister = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Validate all conditions
      if (!tournamentId || !categoryId) {
        throw new Error('Missing tournament or category')
      }

      const tournamentStore = useTournamentStore.getState()
      const tournament = tournamentStore.tournament
      if (!tournament) {
        throw new Error('Tournament not found')
      }
      if (tournament.status !== 'PUBLISHED') {
        throw new Error('Tournament is not published')
      }

      const category = tournament.categories.find(c => c.id === categoryId)
      if (!category) {
        throw new Error('Category not found')
      }
      if (category.eventType !== 'DOUBLES') {
        throw new Error('Invalid category type for doubles registration')
      }

      // Check registration open
      const now = new Date()
      const closeDate = new Date(tournament.registrationCloseDate)
      const closeTime = tournament.registrationCloseTime.split(':')
      closeDate.setHours(parseInt(closeTime[0]), parseInt(closeTime[1]), 0, 0)
      if (now >= closeDate) {
        throw new Error('Registration is closed')
      }

      // Check current player eligibility
      if (currentPlayerEligibility === false) {
        throw new Error('You are not eligible for this category')
      }

      // Check partner eligibility
      if (partnerEligibility === false) {
        throw new Error('Partner is not eligible for this category')
      }

      // Check partner status
      if (partnerType === 'FULL' && partnerStatus !== 'ACCEPTED') {
        throw new Error('Partner has not accepted the invitation')
      }

      // Check duplicate registration for current player
      const registrationStore = useRegistrationStore.getState()
      const currentPlayerDuplicate = registrationStore.isAlreadyRegistered(
        currentProfile!.id,
        tournamentId,
        categoryId
      )
      if (currentPlayerDuplicate) {
        throw new Error('You are already registered for this category')
      }

      // Check duplicate registration for partner
      let partnerDuplicate = false
      if (partnerType === 'FULL') {
        const partnerProfile = usePlayerDirectoryStore.getState().getProfileById(partnerId)
        if (partnerProfile) {
          partnerDuplicate = registrationStore.isAlreadyRegistered(
            partnerProfile.id,
            tournamentId,
            categoryId
          )
        }
      } else if (partnerType === 'GUEST') {
        const guest = useGuestPlayerStore.getState().getGuestById(partnerId)
        if (guest) {
          partnerDuplicate = registrationStore.isAlreadyRegistered(
            guest.id,
            tournamentId,
            categoryId
          )
        }
      }
      if (partnerDuplicate) {
        throw new Error('Partner is already registered for this category')
      }

      // Check if current player is already in another active team for same tournament/category
      const teamStore = useTeamStore.getState()
      const currentPlayerTeams = teamStore.getPlayerTeams(currentProfile!.id)
      const currentPlayerInAnotherTeam = currentPlayerTeams.some(team =>
        team.tournamentId === tournamentId &&
        team.categoryId === categoryId &&
        team.status === 'CONFIRMED'
      )
      if (currentPlayerInAnotherTeam) {
        throw new Error('You are already in another team for this category')
      }

      // Check if partner is already in another active team for same tournament/category
      let partnerInAnotherTeam = false
      if (partnerType === 'FULL') {
        const partnerProfile = usePlayerDirectoryStore.getState().getProfileById(partnerId)
        if (partnerProfile) {
          const partnerTeams = teamStore.getPlayerTeams(partnerProfile.id)
          partnerInAnotherTeam = partnerTeams.some(team =>
            team.tournamentId === tournamentId &&
            team.categoryId === categoryId &&
            team.status === 'CONFIRMED'
          )
        }
      } else if (partnerType === 'GUEST') {
        const guest = useGuestPlayerStore.getState().getGuestById(partnerId)
        if (guest) {
          const guestTeams = teamStore.getPlayerTeams(guest.id)
          partnerInAnotherTeam = guestTeams.some(team =>
            team.tournamentId === tournamentId &&
            team.categoryId === categoryId &&
            team.status === 'CONFIRMED'
          )
        }
      }
      if (partnerInAnotherTeam) {
        throw new Error('Partner is already in another team for this category')
      }

      // Check if the pair already exists as a team
      let teamExists = false
      try {
        teamExists = await teamService.teamExists(
          tournamentId,
          categoryId,
          currentProfile!.id,
          partnerId
        )
      } catch (err) {
        setError('Failed to check if team already exists. Please try again.')
        return
      }
      if (teamExists) {
        throw new Error('A team with these two players already exists for this category')
      }

      // Check category capacity (for doubles, we count CONFIRMED teams)
      const confirmedTeams = teamStore.getCategoryTeams(tournamentId, categoryId)
        .filter(team => team.status === 'CONFIRMED')
      if (category.maxTeams !== undefined && confirmedTeams.length >= category.maxTeams) {
        throw new Error('Category is full')
      }

      // All checks passed, proceed to create team and registration via service
      const isGuest = partnerType === 'GUEST'
      const partnerStatusValue = 'ACCEPTED' // We only proceed if partner is accepted (guest or simulated accept)

      const registration = await registrationService.registerDoublesTeam(
        tournamentId,
        categoryId,
        currentProfile!,
        partnerType === 'FULL'
          ? usePlayerDirectoryStore.getState().getProfileById(partnerId)!
          : useGuestPlayerStore.getState().getGuestById(partnerId)!,
        partnerStatusValue
      )

      setSuccess(true)
      // Clear the draft store
      clearDraft()
      // Navigate to registrations page after a short delay
      setTimeout(() => {
        navigate('/player/registrations')
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (tournamentLoading || !tournament) {
    return (
      <div className="text-center py-8">
        Loading tournament details...
      </div>
    )
  }

  if (tournamentError) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading tournament: {tournamentError}
      </div>
    )
  }

  if (!hasProfile || !currentProfile) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">
          {tournament.name}
        </h1>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-center">
          <p className="text-yellow-700">
            Please complete your player profile to continue.
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

  const category = tournament.categories.find(c => c.id === categoryId)
  if (!category) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">
          {tournament.name}
        </h1>
        <p className="text-red-500">
          Category not found
        </p>
      </div>
    )
  }

  if (category.eventType !== 'DOUBLES') {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">
          {tournament.name}
        </h1>
        <p className="text-red-500">
          Invalid category type for doubles registration
        </p>
      </div>
    )
  }

  // Helper functions to render eligibility status
  const renderEligibilityStatus = (eligible: boolean | null, reasons: string[]) => {
    if (eligible === null) {
      return <p className="text-sm text-gray-500">Checking...</p>
    }
    if (eligible === true) {
      return (
        <p className="text-sm font-medium text-green-600">
          Eligible
          {reasons.length > 0 && (
            <>
              <br />
              <span className="text-xs text-red-500">
                ({reasons.join(', ')})
              </span>
            </>
          )}
        </p>
      )
    }
    return (
      <p className="text-sm font-medium text-red-600">
        Not Eligible
        {reasons.length > 0 && (
          <>
            <br />
            <span className="text-xs text-red-500">
              ({reasons.join(', ')})
            </span>
          </>
        )}
      </p>
    )
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {tournament.name}
        </h1>
        <p className="text-sm text-gray-600">
          {formatDateDisplay(tournament.tournamentDate)} • {tournament.venueName}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-2 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-2 rounded mb-4">
          Registration successful! Redirecting to your registrations...
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          Confirm Doubles Registration
        </h2>
        <p className="text-sm text-gray-600">
          Category: {category.name}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Your Information
        </h3>
        <div className="border rounded-lg p-4">
          <p className="font-medium text-gray-800">
            Name:
          </p>
          <p className="text-sm text-gray-500">
            {currentProfile?.fullName}
          </p>
          <p className="font-medium text-gray-800">
            Player Code:
          </p>
          <p className="text-sm text-gray-500">
            {currentProfile?.playerCode}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Partner Information
        </h3>
        {partnerId && partnerName && partnerCode ? (
          <div className="border rounded-lg p-4">
            <p className="font-medium text-gray-800">
              Name:
            </p>
            <p className="text-sm text-gray-500">
              {partnerName}
            </p>
            <p className="font-medium text-gray-800">
              {partnerType === 'FULL' ? 'Player Code:' : 'Guest Code:'}
            </p>
            <p className="text-sm text-gray-500">
              {partnerCode}
            </p>
            <p className="font-medium text-gray-800">
              Type:
            </p>
            <p className="text-sm text-gray-500">
              {partnerType === 'FULL' ? 'Full Player' : 'Guest Player'}
            </p>
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500">
            Partner information not available
          </p>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Eligibility Status
        </h3>
        <div className="space-y-4">
          <div>
            <p className="font-medium text-gray-800">
              You:
            </p>
            {renderEligibilityStatus(currentPlayerEligibility, currentPlayerRejectionReasons)}
          </div>
          <div>
            <p className="font-medium text-gray-800">
              Partner:
            </p>
            {renderEligibilityStatus(partnerEligibility, partnerRejectionReasons)}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Partner Status
        </h3>
        <p className="text-sm text-gray-500">
          {partnerType === 'FULL'
            ? partnerStatus === 'PENDING_CONFIRMATION'
              ? 'Waiting for partner to accept'
              : partnerStatus === 'ACCEPTED'
                ? 'Partner has accepted'
                : 'Unknown'
            : 'Guest partner (automatically accepted)'}
          </p>
      </div>

      {showPartnerAcceptButton && !partnerAccepted && (
        <div className="mb-6">
          <button
            type="button"
            onClick={handleSimulatePartnerAccept}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Simulate Partner Accept
          </button>
        </div>
      )}

      <div className="mt-8">
        <button
          type="button"
          onClick={() => navigate(`/player/tournaments/${tournamentId}/doubles/${categoryId}/partner`)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Back to Partner Selection
        </button>
        <button
          type="button"
          onClick={handleConfirmAndRegister}
          className="ml-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          disabled={
            isLoading ||
            currentPlayerEligibility !== true ||
            partnerEligibility !== true ||
            (partnerType === 'FULL' && !partnerAccepted) ||
            error !== null
          }
        >
          Confirm Team & Register
        </button>
      </div>
    </div>
  )
}

export default DoubleRegistrationConfirmationPage