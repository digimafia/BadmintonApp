import { Tournament, TournamentFormValues, TournamentStatus } from '@/features/tournaments/types/tournament.types';
import { User, Role } from '@/types/auth.types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mock delay function to simulate API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Create a standalone tournament store with persistence (can be used outside React components)
const createTournamentStore = () => {
  return create<TournamentStoreState>()(
    persist(
      (set, get) => ({
        tournaments: [],

        createTournament: (tournamentData: TournamentFormValues, organizer: { id: string; displayName?: string; mobile: string; role: string }) => {
          // Validate organizer role
          if (organizer.role !== 'ORGANIZER') {
            throw new Error('Only organizers can create tournaments');
          }

          const newTournament: Tournament = {
            id: Math.random().toString(36).substr(2, 9),
            tournamentCode: `TRN-${String(get().tournaments.length + 1).padStart(4, '0')}`,
            organizerId: organizer.id,
            organizerName: organizer.displayName || organizer.mobile,
            ...tournamentData,
            status: 'DRAFT' as TournamentStatus, // Start as draft
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set(state => ({
            tournaments: [...state.tournaments, newTournament]
          }));

          return newTournament;
        },

        updateTournament: (id: string, tournamentData: Partial<TournamentFormValues>) => {
          const state = get();
          const index = state.tournaments.findIndex(t => t.id === id);
          if (index === -1) {
            throw new Error('Tournament not found');
          }

          const updatedTournament = {
            ...state.tournaments[index],
            ...tournamentData,
            updatedAt: new Date().toISOString(),
          };

          set(state => {
            const updatedTournaments = [...state.tournaments];
            updatedTournaments[index] = updatedTournament;
            return { tournaments: updatedTournaments };
          });

          return updatedTournament;
        },

        getTournamentById: (id: string) => {
          const tournament = get().tournaments.find(t => t.id === id);
          return tournament ? { ...tournament } : null;
        },

        submitTournamentForApproval: (id: string) => {
          const state = get();
          const index = state.tournaments.findIndex(t => t.id === id);
          if (index === -1) {
            throw new Error('Tournament not found');
          }

          const tournament = state.tournaments[index];
          if (tournament.status !== 'DRAFT') {
            throw new Error('Only draft tournaments can be submitted for approval');
          }

          const updatedTournament = {
            ...tournament,
            status: 'PENDING_ADMIN_APPROVAL' as TournamentStatus,
            submittedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set(state => {
            const updatedTournaments = [...state.tournaments];
            updatedTournaments[index] = updatedTournament;
            return { tournaments: updatedTournaments };
          });

          return updatedTournament;
        },

        getTournamentsByOrganizer: (organizerId: string) => {
          return get().tournaments
            .filter(t => t.organizerId === organizerId)
            .map(t => ({ ...t }));
        }
      }),
      {
        name: 'badminton-tournaments', // Persistence key
      }
    )
  );
};

// Define the store state interface
interface TournamentStoreState {
  tournaments: Tournament[];
  createTournament: (tournamentData: TournamentFormValues, organizer: { id: string; displayName?: string; mobile: string; role: string }) => Tournament;
  updateTournament: (id: string, tournamentData: Partial<TournamentFormValues>) => Tournament;
  getTournamentById: (id: string) => Tournament | null;
  submitTournamentForApproval: (id: string) => Tournament;
  getTournamentsByOrganizer: (organizerId: string) => Tournament[];
}

// Create a singleton store instance
const tournamentStore = createTournamentStore();

export const tournamentService = {
  /**
   * Get all tournaments
   */
  getTournaments: async (): Promise<Tournament[]> => {
    await delay(500);
    return [...tournamentStore.getState().tournaments];
  },

  /**
   * Get a tournament by ID
   */
  getTournamentById: async (id: string): Promise<Tournament | null> => {
    await delay(500);
    const tournament = tournamentStore.getState().tournaments.find(t => t.id === id);
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

    return tournamentStore.getState().createTournament(tournamentData, {
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
    return tournamentStore.getState().updateTournament(id, tournamentData);
  },

  /**
   * Submit a tournament for admin approval
   * Changes status from DRAFT to PENDING_ADMIN_APPROVAL
   */
  submitTournamentForApproval: async (id: string): Promise<Tournament> => {
    await delay(500);
    return tournamentStore.getState().submitTournamentForApproval(id);
  },

  /**
   * Get tournaments created by a specific organizer
   */
  getTournamentsByOrganizer: async (organizerId: string): Promise<Tournament[]> => {
    await delay(500);
    return tournamentStore.getState().getTournamentsByOrganizer(organizerId);
  },
};