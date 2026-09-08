import { useNotificationStore } from './notificationStore'
import { usePlayerDirectoryStore } from '@/features/player/store/playerDirectoryStore'
import { useTeamStore } from '@/features/teams/store/teamStore'
import { useTournamentStore } from '@/features/tournaments/store/tournamentStore'
import { useFixtureStore } from '@/features/fixtures/store/fixtureStore'
import { useMedalHistoryStore } from '@/features/medals/store/medalHistoryStore'
import { useAuthStore } from '@/store/authStore'
import { AppNotification, NotificationType } from '@/features/notifications/types/notification.types'
import { Role } from '@/types/auth.types'
import { Fixture } from '@/features/fixtures/types/fixture.types'
import { FixtureMatch } from '@/features/fixtures/types/fixture.types'
import { FixtureParticipant } from '@/features/fixtures/types/fixture.types'

// Helper to get current user ID
const getCurrentUserId = (): string | null => {
  const { user } = useAuthStore.getState()
  return user ? user.id : null
}

// Helper to get current user role
const getCurrentUserRole = (): Role | null => {
  const { user } = useAuthStore.getState()
  return user ? user.role : null
}

// Helper to get current auth user (for notifications)
const getCurrentAuthUser = () => {
  const { user } = useAuthStore.getState()
  return user
}

// Helper to check if a player is registered (not guest)
const isPlayerRegistered = (playerId: string): boolean => {
  const playerDirectoryStore = usePlayerDirectoryStore.getState()
  if (!playerDirectoryStore) return false
  const profile = playerDirectoryStore.getProfileById(playerId)
  return !!profile
}

// Helper to resolve participant details for notifications
const resolveParticipantDetails = (participantId: string) => {
  const playerDirectoryStore = usePlayerDirectoryStore.getState()
  if (playerDirectoryStore) {
    const profile = playerDirectoryStore.getProfileById(participantId)
    if (profile) {
      return {
        playerCode: profile.playerCode,
        playerName: profile.fullName,
        playerType: 'REGISTERED' as const
      }
    }
  }

  // If not found in player directory, treat as guest (no app notification)
  return {
    playerCode: '', // Will be filled from participant data if available
    playerName: '', // Will be filled from participant data if available
    playerType: 'GUEST' as const
  }
}

export const notificationService = {
  // Tournament notifications
  notifyTournamentPublished: async (tournamentId: string) => {
    const tournamentStore = useTournamentStore.getState()
    // Ensure tournament is loaded
    if (!tournamentStore.tournament || tournamentStore.tournament.id !== tournamentId) {
      await tournamentStore.fetchTournamentById(tournamentId)
    }
    const tournament = useTournamentStore.getState().tournament
    if (!tournament) return

    // Notify organizer
    if (tournament.organizerId) {
      useNotificationStore.getState().addNotification({
        recipientId: tournament.organizerId, // This is the auth user ID of the organizer
        recipientRole: 'ORGANIZER',
        type: 'TOURNAMENT_APPROVED',
        title: 'Tournament Approved',
        message: `${tournament.name} has been approved and published.`,
        link: `/organizer/tournaments/${tournamentId}`
      })
    }

    // Notify registered players
    const playerDirectoryStore = usePlayerDirectoryStore.getState()
    if (playerDirectoryStore) {
      const registeredProfiles = playerDirectoryStore.profiles.filter(
        p => p.profileStatus === 'ACTIVE'
      )

      for (const profile of registeredProfiles) {
        useNotificationStore.getState().addNotification({
          recipientId: profile.userId, // Use auth user ID instead of profile ID
          recipientRole: 'PLAYER',
          type: 'TOURNAMENT_PUBLISHED',
          title: 'New Tournament Available',
          message: `${tournament.name} is now open for players.`,
          link: `/player/tournaments/${tournamentId}`
        })
      }
    }
  },

  notifyTournamentRejected: async (tournamentId: string, reason: string) => {
    const tournamentStore = useTournamentStore.getState()
    // Ensure tournament is loaded
    if (!tournamentStore.tournament || tournamentStore.tournament.id !== tournamentId) {
      await tournamentStore.fetchTournamentById(tournamentId)
    }
    const tournament = useTournamentStore.getState().tournament
    if (!tournament) return

    if (tournament.organizerId) {
      useNotificationStore.getState().addNotification({
        recipientId: tournament.organizerId, // This is the auth user ID of the organizer
        recipientRole: 'ORGANIZER',
        type: 'TOURNAMENT_REJECTED',
        title: 'Tournament Rejected',
        message: `${tournament.name} was rejected. Reason: ${reason}`,
        link: `/organizer/tournaments/${tournamentId}`
      })
    }
  },

  notifyTournamentSubmitted: async (tournamentId: string) => {
    const tournamentStore = useTournamentStore.getState()
    // Ensure tournament is loaded
    if (!tournamentStore.tournament || tournamentStore.tournament.id !== tournamentId) {
      await tournamentStore.fetchTournamentById(tournamentId)
    }
    const tournament = useTournamentStore.getState().tournament
    if (!tournament) return

    // Notify admins - in a production app, we would query for all admin users
    // For this frontend-only mocked architecture, we'll skip actual admin notifications
    // TODO: Implement proper admin user lookup when backend/user store is available
  },

  // Registration notifications
  notifyRegistrationConfirmed: async (playerId: string, tournamentId: string, categoryId: string) => {
    const tournamentStore = useTournamentStore.getState()
    // Ensure tournament is loaded
    if (!tournamentStore.tournament || tournamentStore.tournament.id !== tournamentId) {
      await tournamentStore.fetchTournamentById(tournamentId)
    }
    const tournament = useTournamentStore.getState().tournament
    if (!tournament) return

    const category = tournament.categories.find(c => c.id === categoryId)
    if (!category) return

    // Notify the player
    useNotificationStore.getState().addNotification({
      recipientId: playerId,
      recipientRole: 'PLAYER',
      type: 'REGISTRATION_CONFIRMED',
      title: 'Registration Confirmed',
      message: `You are registered for ${tournament.name} - ${category.name}.`,
      link: `/player/registrations`
    })

    // Notify organizer (if not a guest player)
    const isRegistered = isPlayerRegistered(playerId)
    if (isRegistered && tournament.organizerId) {
      const playerDirectoryStore = usePlayerDirectoryStore.getState()
      let playerName = 'A player'
      if (playerDirectoryStore) {
        const profile = playerDirectoryStore.getProfileById(playerId)
        if (profile) {
          playerName = profile.fullName
        }
      }

      useNotificationStore.getState().addNotification({
        recipientId: tournament.organizerId,
        recipientRole: 'ORGANIZER',
        type: 'REGISTRATION_CONFIRMED',
        title: 'New Registration',
        message: `${playerName} registered for ${tournament.name} - ${category.name}.`,
        link: `/organizer/tournaments/${tournamentId}/categories/${categoryId}/registrations`
      })
    }
  },

  // Fixture notifications
  notifyFixturePublished: async (tournamentId: string, categoryId: string) => {
    const tournamentStore = useTournamentStore.getState()
    // Ensure tournament is loaded
    if (!tournamentStore.tournament || tournamentStore.tournament.id !== tournamentId) {
      await tournamentStore.fetchTournamentById(tournamentId)
    }
    const tournament = useTournamentStore.getState().tournament
    if (!tournament) return

    const category = tournament.categories.find(c => c.id === categoryId)
    if (!category) return

    const fixtureStore = useFixtureStore.getState()
    if (!fixtureStore) return

    const fixture = fixtureStore.getFixtureByTournamentCategory(tournamentId, categoryId)
    if (!fixture) return

    // Notify organizer
    if (tournament.organizerId) {
      useNotificationStore.getState().addNotification({
        recipientId: tournament.organizerId,
        recipientRole: 'ORGANIZER',
        type: 'FIXTURE_PUBLISHED',
        title: 'Fixture Published',
        message: `Fixture for ${tournament.name} - ${category.name} is now available.`,
        link: `/organizer/tournaments/${tournamentId}/categories/${categoryId}`
      })
    }

    // Notify participants (only registered players get app notifications)
    const playerDirectoryStore = usePlayerDirectoryStore.getState()
    if (!playerDirectoryStore) return

    // Collect unique participant IDs
    const participantIds = new Set<string>()
    fixture.matches.forEach(match => {
      if (match.participant1) participantIds.add(match.participant1.id)
      if (match.participant2) participantIds.add(match.participant2.id)
    })

    // Notify each participant
    for (const participantId of participantIds) {
      const profile = playerDirectoryStore.getProfileById(participantId)
      if (profile) { // Only notify registered players
        useNotificationStore.getState().addNotification({
          recipientId: participantId,
          recipientRole: 'PLAYER',
          type: 'FIXTURE_PUBLISHED',
          title: 'Fixture Published',
          message: `Fixture for ${tournament.name} - ${category.name} is now available.`,
          link: `/player/tournaments/${tournamentId}/categories/${categoryId}/fixture`
        })
      }
    }
  },

  // Match notifications
  notifyMatchReady: async (fixtureId: string, matchId: string) => {
    const fixtureStore = useFixtureStore.getState()
    if (!fixtureStore) return

    const fixture = fixtureStore.getFixtureById(fixtureId)
    if (!fixture) return

    const match = fixture.matches.find(m => m.id === matchId)
    if (!match) return

    // Check if match is ready (both participants present)
    if (!match.participant1 || !match.participant2) return

    // Notify both participants (only registered players)
    const participants = [match.participant1, match.participant2]
    const playerDirectoryStore = usePlayerDirectoryStore.getState()
    const tournamentStore = useTournamentStore.getState()
    if (!playerDirectoryStore || !tournamentStore) return

    // Ensure tournament is loaded
    if (!tournamentStore.tournament || tournamentStore.tournament.id !== fixture.tournamentId) {
      await tournamentStore.fetchTournamentById(fixture.tournamentId)
    }
    const tournament = useTournamentStore.getState().tournament
    if (!tournament) return

    for (const participant of participants) {
      const profile = playerDirectoryStore.getProfileById(participant.id)
      if (profile) { // Only notify registered players
        useNotificationStore.getState().addNotification({
          recipientId: participant.id,
          recipientRole: 'PLAYER',
          type: 'MATCH_READY',
          title: 'Your Match Is Ready',
          message: `Your next match in ${tournament.name} - ${(fixture.categoryId ? tournament.categories.find(c => c.id === fixture.categoryId)?.name : "Unknown Category")} is ready.`,
          link: `/player/tournaments/${fixture.tournamentId}/categories/${fixture.categoryId}/fixture`
        })
      }
    }
  },

  notifyMatchCompleted: async (fixtureId: string, matchId: string, winnerId: string) => {
    const fixtureStore = useFixtureStore.getState()
    if (!fixtureStore) return

    const fixture = fixtureStore.getFixtureById(fixtureId)
    if (!fixture) return

    const match = fixture.matches.find(m => m.id === matchId)
    if (!match) return

    const loserId = match.participant1?.id === winnerId ? match.participant2?.id : match.participant1?.id
    if (!loserId) return

    // Notify winner
    await notificationService._notifyMatchResult(
      winnerId,
      fixture,
      match,
      'WON',
      'Match Won'
    )

    // Notify loser
    await notificationService._notifyMatchResult(
      loserId,
      fixture,
      match,
      'LOST',
      'Match Result'
    )
  },

  // Helper for match result notifications
  _notifyMatchResult: async (
    participantId: string,
    fixture: Fixture,
    match: FixtureMatch,
    resultType: 'WON' | 'LOST',
    title: string
  ) => {
    const tournamentStore = useTournamentStore.getState()
    if (!tournamentStore.tournament) return
    const tournament = tournamentStore.tournament
    if (!tournament) return

    const playerDirectoryStore = usePlayerDirectoryStore.getState()
    if (!playerDirectoryStore) return

    const profile = playerDirectoryStore.getProfileById(participantId)
    if (!profile) return // Only notify registered players

    const categoryId = fixture.categoryId
    const category = tournament.categories.find(c => c.id === categoryId)
    const categoryName = category ? category.name : 'Unknown'

    useNotificationStore.getState().addNotification({
      recipientId: participantId,
      recipientRole: 'PLAYER',
      type: 'MATCH_COMPLETED',
      title: title,
      message: `Your match in ${tournament.name} - ${categoryName} has been completed. You ${resultType.toLowerCase()}.`,
      link: `/player/tournaments/${fixture.tournamentId}/categories/${fixture.categoryId}/fixture`
    })
  },

  // Medal notifications
  notifyMedalAwarded: async (participantId: string, tournamentId: string, categoryId: string, medalType: 'GOLD' | 'SILVER', position: 'WINNER' | 'RUNNER_UP') => {
    const tournamentStore = useTournamentStore.getState()
    // Ensure tournament is loaded
    if (!tournamentStore.tournament || tournamentStore.tournament.id !== tournamentId) {
      await tournamentStore.fetchTournamentById(tournamentId)
    }
    const tournament = useTournamentStore.getState().tournament
    if (!tournament) return

    const category = tournament.categories.find(c => c.id === categoryId)
    if (!category) return

    // Resolve participant details
    const playerDirectoryStore = usePlayerDirectoryStore.getState()
    if (!playerDirectoryStore) return

    const profile = playerDirectoryStore.getProfileById(participantId)
    if (!profile) return // Only notify registered players, not guests

    let message = ''
    if (medalType === 'GOLD' && position === 'WINNER') {
      message = `Gold - Winner in ${tournament.name} - ${category.name}`
    } else if (medalType === 'SILVER' && position === 'RUNNER_UP') {
      message = `Silver - Runner-up in ${tournament.name} - ${category.name}`
    }

    useNotificationStore.getState().addNotification({
      recipientId: participantId,
      recipientRole: 'PLAYER',
      type: 'MEDAL_AWARDED',
      title: 'Achievement Unlocked',
      message: message,
      link: `/player/profile`
    })
  }
}