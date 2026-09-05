import { Tournament, TournamentCategory } from '@/features/tournaments/types/tournament.types';
import { PlayerProfile } from '@/features/player/types/player.types';
import { GuestPlayer } from '@/features/player/types/guest.player.types';
import { Registration } from '@/features/registrations/types/registration.types';
import { Team, TeamCreateInput, PartnerStatus } from '@/features/teams/types/team.types';
import { evaluatePlayerEligibility } from '@/features/eligibility/utils/eligibilityUtils';
import { useRegistrationStore } from '@/features/registrations/store/registrationStore';
import { tournamentService } from '@/features/tournaments/services/tournamentService';
import { teamService } from '@/features/teams/services/teamService';
import { guestPlayerService } from '@/features/player/services/guestPlayerService';

import { useTeamStore } from '@/features/teams/store/teamStore';
// Mock delay function to simulate API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const registrationService = {
  /**
   * Register a player for a tournament category
   * Enforces all business rules:
   * - Player has active profile
   * - Tournament is published
   * - Registration is open
   * - Category eligibility passes
   * - Not already registered
   * - Category not full (if maxTeams exists)
   * - Note: For DOUBLES categories, use registerDoublesTeam instead.
   */
  registerPlayer: async (
    tournamentId: string,
    categoryId: string,
    playerProfile: PlayerProfile
  ): Promise<Registration> => {
    await delay(500);

    // Get tournament details
    const tournament = await tournamentService.getTournamentById(tournamentId);
    if (!tournament) {
      throw new Error('Tournament not found');
    }

    // Find the category
    const category = tournament.categories.find(c => c.id === categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    // Get current registrations for this tournament/category to check capacity and duplicates
    const storeState = useRegistrationStore.getState();
    const currentRegistrations = storeState.getTournamentRegistrations(tournamentId)
      .filter(reg => reg.categoryId === categoryId && reg.status === 'REGISTERED')
      .length;

    // Check eligibility
    const eligibilityResult = evaluatePlayerEligibility(
      playerProfile,
      tournament,
      category,
      currentRegistrations
    );

    if (!eligibilityResult.eligible) {
      // Build error message from reasons
      const errorMessages = eligibilityResult.reasons.map(r => r.message).join('. ');
      throw new Error(`Not eligible: ${errorMessages}`);
    }

    // Check duplicate registration (only count active REGISTERED registrations)
    if (storeState.isAlreadyRegistered(playerProfile.id, tournamentId, categoryId)) {
      throw new Error('Already registered for this category');
    }

    // Prepare registration data with all details except id and registrationCode
    const registrationData: Omit<Registration, 'id' | 'registrationCode'> = {
      tournamentId,
      tournamentCode: tournament.tournamentCode,
      categoryId,
      categoryName: category.name,
      playerId: playerProfile.id, // Use profile.id as the stable player identity
      playerCode: playerProfile.playerCode,
      playerName: playerProfile.fullName,
      eventType: category.eventType === 'SINGLES' ? 'SINGLES' : 'DOUBLES',
      status: 'REGISTERED',
      registeredAt: new Date().toISOString(),
    };

    // Create registration in store (this will generate id and registrationCode)
    const registration = storeState.createRegistration(registrationData);

    return registration;
  },

  /**
   * Register a doubles team for a tournament category
   * Called only after partner acceptance (for existing players) or immediately for guests.
   * @param tournamentId Tournament ID
   * @param categoryId Category ID (must be DOUBLES)
   * @param playerProfile The logged-in player's profile
   * @param partner The partner (either PlayerProfile or GuestPlayer)
   * @param partnerStatus The status of the partner ('ACCEPTED' for both guest and accepted existing player)
   */
  registerDoublesTeam: async (
    tournamentId: string,
    categoryId: string,
    playerProfile: PlayerProfile,
    partner: PlayerProfile | GuestPlayer,
    partnerStatus: PartnerStatus // Only accepted partners can proceed to registration
  ): Promise<Registration> => {
    await delay(500);

    // Validate partner status
    if (partnerStatus !== 'ACCEPTED') {
      throw new Error('Partner has not accepted the invitation');
    }

    // Get tournament details
    const tournament = await tournamentService.getTournamentById(tournamentId);
    if (!tournament) {
      throw new Error('Tournament not found');
    }

    // Validate tournament is published
    if (tournament.status !== 'PUBLISHED') {
      throw new Error('Tournament is not published');
    }

    // Find the category
    const category = tournament.categories.find(c => c.id === categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    // Validate that the category is DOUBLES
    if (category.eventType !== 'DOUBLES') {
      throw new Error('Invalid category type for doubles registration');
    }

    // Get current registrations for this tournament/category to check capacity and duplicates
    const regStoreState = useRegistrationStore.getState();
    const currentRegistrations = regStoreState.getTournamentRegistrations(tournamentId)
      .filter(reg => reg.categoryId === categoryId && reg.status === 'REGISTERED')
      .length;

    // Check eligibility for the player
    const playerEligibility = evaluatePlayerEligibility(
      playerProfile,
      tournament,
      category,
      currentRegistrations
    );

    if (!playerEligibility.eligible) {
      // Build error message from reasons
      const errorMessages = playerEligibility.reasons.map(r => r.message).join('. ');
      throw new Error(`Player not eligible: ${errorMessages}`);
    }

    // Check eligibility for the partner
    const partnerEligibility = evaluatePlayerEligibility(
      partner,
      tournament,
      category,
      currentRegistrations
    );

    if (!partnerEligibility.eligible) {
      // Build error message from reasons
      const errorMessages = partnerEligibility.reasons.map(r => r.message).join('. ');
      throw new Error(`Partner not eligible: ${errorMessages}`);
    }

    // Check if the player is already registered for this category (active registration)
    if (regStoreState.isAlreadyRegistered(playerProfile.id, tournamentId, categoryId)) {
      throw new Error('You are already registered for this category');
    }

    // Check if the partner is already registered for this category (active registration)
    const partnerId = partner.id;
    if (regStoreState.isAlreadyRegistered(partnerId, tournamentId, categoryId)) {
      throw new Error('Partner is already registered for this category');
    }

    // Check if a team already exists for this tournament, category, and these two players
    const teamExists = await teamService.teamExists(tournamentId, categoryId, playerProfile.id, partnerId);
    if (teamExists) {
      throw new Error('Team already exists for this category');
    }

    // Check category capacity (if maxTeams exists)
    // For doubles, we count CONFIRMED teams (as per specification)
    const teamStoreState = useTeamStore.getState();
    const confirmedTeams = teamStoreState.getCategoryTeams(tournamentId, categoryId)
      .filter(team => team.status === 'CONFIRMED');
    if (category.maxTeams !== undefined && confirmedTeams.length >= category.maxTeams) {
      throw new Error('Category is full');
    }

    // Determine partner type
    const isGuest = 'guestCode' in partner;

    // Prepare team data for creation (pending partner)
    // partnerStatus: 'ACCEPTED' (since only accepted partners proceed)
    // status: 'PENDING_PARTNER' (will be confirmed after team confirmation)
    const teamData: Omit<Team, 'id' | 'teamCode' | 'createdAt' | 'confirmedAt' | 'cancelledAt'> = {
      tournamentId,
      tournamentCode: tournament.tournamentCode,
      categoryId,
      categoryName: category.name,
      player1Id: playerProfile.id,
      player1Code: playerProfile.playerCode,
      player1Name: playerProfile.fullName,
      player1Type: 'FULL',
      player2Id: partner.id,
      player2Code: isGuest ? partner.guestCode : partner.playerCode,
      player2Name: partner.fullName,
      player2Type: isGuest ? 'GUEST' : 'FULL',
      partnerStatus: 'ACCEPTED',
      status: 'PENDING_PARTNER',
    };

    // Create team
    let team: Team | undefined;
    try {
      team = await teamService.createTeam(teamData);
    } catch (err) {
      throw new Error('Failed to create team');
    }

    // Confirm team (sets status to CONFIRMED and confirmedAt)
    let confirmedTeam: Team | undefined;
    try {
      confirmedTeam = await teamService.confirmTeam(team.id);
      if (!confirmedTeam) {
        // Partner not accepted or other issue; clean up created team
        await teamService.cancelTeam(team.id).catch(() => {
          // Ignore errors in cleanup
        });
        throw new Error('Failed to confirm team');
      }
    } catch (err) {
      // Confirmation failed; clean up created team
      await teamService.cancelTeam(team.id).catch(() => {
        // Ignore errors in cleanup
      });
      throw new Error('Failed to confirm team');
    }

    // Prepare registration data using confirmed team details
    const registrationData: Omit<Registration, 'id' | 'registrationCode'> = {
      tournamentId,
      tournamentCode: tournament.tournamentCode,
      categoryId,
      categoryName: category.name,
      playerId: playerProfile.id,
      playerCode: playerProfile.playerCode,
      playerName: playerProfile.fullName,
      eventType: category.eventType,
      status: 'REGISTERED',
      registeredAt: new Date().toISOString(),
      teamId: confirmedTeam.id,
      teamCode: confirmedTeam.teamCode,
      partnerId: partner.id,
      partnerCode: isGuest ? partner.guestCode : partner.playerCode,
      partnerName: partner.fullName,
      partnerType: isGuest ? 'GUEST' : 'FULL',
    };

    // Create registration
    let registration: Registration | undefined;
    try {
      registration = regStoreState.createRegistration(registrationData);
    } catch (err) {
      // If registration creation fails, cancel the confirmed team to avoid ghost confirmed team
      if (confirmedTeam?.id) {
        await teamService.cancelTeam(confirmedTeam.id).catch(() => {
          // Ignore errors in cleanup
        });
      }
      throw new Error('Failed to create registration');
    }

    return registration;
  },

  /**
   * Get registrations for a player
   */
  getPlayerRegistrations: async (playerId: string): Promise<Registration[]> => {
    await delay(500);
    const storeState = useRegistrationStore.getState();
    return storeState.getPlayerRegistrations(playerId);
  },

  /**
   * Check if a player is already registered for a tournament category
   */
  isPlayerRegistered: async (
    playerId: string,
    tournamentId: string,
    categoryId: string
  ): Promise<boolean> => {
    await delay(500);
    const storeState = useRegistrationStore.getState();
    return storeState.isAlreadyRegistered(playerId, tournamentId, categoryId);
  },

  /**
   * Cancel a registration (optional - not exposed in UI for Phase 6)
   */
  cancelRegistration: async (registrationId: string): Promise<void> => {
    await delay(500);
    const storeState = useRegistrationStore.getState();
    storeState.cancelRegistration(registrationId);
  },

  /**
   * Create a registration (used for doubles registration after team confirmation)
   * @param registrationData Registration data without id and registrationCode
   */
  createRegistration: async (registrationData: Omit<Registration, 'id' | 'registrationCode'>): Promise<Registration> => {
    await delay(500);
    const storeState = useRegistrationStore.getState();
    return storeState.createRegistration(registrationData);
  },
};