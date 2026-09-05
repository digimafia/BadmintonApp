import { Team, TeamCreateInput } from '@/features/teams/types/team.types';
import { useTeamStore } from '@/features/teams/store/teamStore';
import { PlayerProfile } from '@/features/player/types/player.types';
import { GuestPlayer } from '@/features/player/types/guest.player.types';

// Mock delay function to simulate API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const teamService = {
  /**
   * Create a new team
   * @param teamData Team data without id, teamCode, createdAt, confirmedAt, cancelledAt
   */
  createTeam: async (teamData: Omit<Team, 'id' | 'teamCode' | 'createdAt' | 'confirmedAt' | 'cancelledAt'>): Promise<Team> => {
    await delay(500);
    const storeState = useTeamStore.getState();
    const team = storeState.createTeam(teamData);
    return team;
  },

  /**
   * Get team by ID
   */
  getTeamById: async (id: string): Promise<Team | undefined> => {
    await delay(500);
    const storeState = useTeamStore.getState();
    return storeState.getTeamById(id);
  },

  /**
   * Get teams for a player
   */
  getPlayerTeams: async (playerId: string): Promise<Team[]> => {
    await delay(500);
    const storeState = useTeamStore.getState();
    return storeState.getPlayerTeams(playerId);
  },

  /**
   * Get teams for a tournament
   */
  getTournamentTeams: async (tournamentId: string): Promise<Team[]> => {
    await delay(500);
    const storeState = useTeamStore.getState();
    return storeState.getTournamentTeams(tournamentId);
  },

  /**
   * Get teams for a tournament and category
   */
  getCategoryTeams: async (tournamentId: string, categoryId: string): Promise<Team[]> => {
    await delay(500);
    const storeState = useTeamStore.getState();
    return storeState.getCategoryTeams(tournamentId, categoryId);
  },

  /**
   * Accept partner for a team (changes partnerStatus from PENDING_CONFIRMATION to ACCEPTED)
   */
  acceptPartner: async (teamId: string): Promise<Team | undefined> => {
    await delay(500);
    const storeState = useTeamStore.getState();
    const updatedTeam = storeState.acceptPartner(teamId);
    return updatedTeam;
  },

  /**
   * Confirm a team (changes status to CONFIRMED)
   */
  confirmTeam: async (teamId: string): Promise<Team | undefined> => {
    await delay(500);
    const storeState = useTeamStore.getState();
    const updatedTeam = storeState.confirmTeam(teamId);
    return updatedTeam;
  },

  /**
   * Cancel a team
   */
  cancelTeam: async (teamId: string): Promise<Team | undefined> => {
    await delay(500);
    const storeState = useTeamStore.getState();
    const updatedTeam = storeState.cancelTeam(teamId);
    return updatedTeam;
  },

  /**
   * Check if a team already exists for the given tournament, category, and two players (order doesn't matter)
   */
  teamExists: async (tournamentId: string, categoryId: string, player1Id: string, player2Id: string): Promise<boolean> => {
    await delay(500);
    const storeState = useTeamStore.getState();
    return storeState.teamExists(tournamentId, categoryId, player1Id, player2Id);
  }
};