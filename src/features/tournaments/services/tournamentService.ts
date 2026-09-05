import { Tournament, TournamentFormValues, TournamentStatus } from '@/features/tournaments/types/tournament.types';
import { User, Role } from '@/types/auth.types';
import { useTournamentStore } from '@/features/tournaments/store/tournamentStore';

// Mock delay function to simulate API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const tournamentService = {
  /**
   * Get all tournaments
   */
  getTournaments: async (): Promise<Tournament[]> => {
    await delay(500);
    const state = useTournamentStore.getState();
    return [...state.tournaments];
  },

  /**
   * Get a tournament by ID
   */
  getTournamentById: async (id: string): Promise<Tournament | null> => {
    await delay(500);
    const state = useTournamentStore.getState();
    const tournament = state.tournaments.find(t => t.id === id);
    return tournament ? { ...tournament } : null;
  },

  /**
   * Create a new tournament
   */
  createTournament: async (tournamentData: TournamentFormValues, organizer: User): Promise<Tournament> => {
    await delay(500);

    // Validate organizer role
    if (organizer.role !== 'ORGANIZER') {
      throw new Error('Only organizers can create tournaments');
    }

    const state = useTournamentStore.getState();
    return state.createTournament(tournamentData, {
      id: organizer.id,
      displayName: organizer.displayName,
      mobile: organizer.mobile,
      role: organizer.role
    });
  },

  /**
   * Update an existing tournament
   */
  updateTournament: async (id: string, tournamentData: Partial<TournamentFormValues>): Promise<Tournament> => {
    await delay(500);
    const state = useTournamentStore.getState();
    return state.updateTournament(id, tournamentData);
  },

  /**
   * Submit a tournament for admin approval
   * Changes status from DRAFT to PENDING_ADMIN_APPROVAL
   */
  submitTournamentForApproval: async (id: string): Promise<Tournament> => {
    await delay(500);
    const state = useTournamentStore.getState();
    return state.submitTournamentForApproval(id);
  },

  /**
   * Approve a tournament
   * Changes status from PENDING_ADMIN_APPROVAL to APPROVED
   */
  approveTournament: async (id: string, adminId?: string): Promise<Tournament> => {
    await delay(500);
    const state = useTournamentStore.getState();
    return state.approveTournament(id, adminId);
  },

  /**
   * Reject a tournament
   * Changes status from PENDING_ADMIN_APPROVAL to REJECTED
   */
  rejectTournament: async (id: string, rejectionReason: string, adminId?: string): Promise<Tournament> => {
    await delay(500);
    const state = useTournamentStore.getState();
    return state.rejectTournament(id, rejectionReason, adminId);
  },

  /**
   * Publish a tournament
   * Changes status from APPROVED to PUBLISHED
   */
  publishTournament: async (id: string): Promise<Tournament> => {
    await delay(500);
    const state = useTournamentStore.getState();
    return state.publishTournament(id);
  },

  /**
   * Get tournaments created by a specific organizer
   */
  getTournamentsByOrganizer: async (organizerId: string): Promise<Tournament[]> => {
    await delay(500);
    const state = useTournamentStore.getState();
    return state.getTournamentsByOrganizer(organizerId);
  },

  /**
   * Get tournaments for admin review (pending approval)
   */
  getAdminReviewTournaments: async (): Promise<Tournament[]> => {
    await delay(500);
    const state = useTournamentStore.getState();
    return state.tournaments
      .filter(t => t.status === 'PENDING_ADMIN_APPROVAL')
      .map(t => ({ ...t }));
  },
};