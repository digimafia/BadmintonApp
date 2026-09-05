import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tournament, TournamentFormValues, TournamentStatus } from '@/features/tournaments/types/tournament.types';

interface TournamentStoreState {
  tournaments: Tournament[];
  tournament: Tournament | null;
  loading: boolean;
  error: string | null;

  // Tournament operations
  fetchTournaments: () => Promise<void>;
  fetchTournamentById: (id: string) => Promise<void>;
  createTournament: (tournamentData: TournamentFormValues, organizer: { id: string; displayName?: string; mobile: string; role: string }) => Tournament;
  updateTournament: (id: string, tournamentData: Partial<TournamentFormValues>) => Tournament;
  submitTournamentForApproval: (id: string) => Tournament;
  approveTournament: (id: string, adminId?: string) => Tournament;
  rejectTournament: (id: string, rejectionReason: string, adminId?: string) => Tournament;
  publishTournament: (id: string) => Tournament;
  getTournamentsByOrganizer: (organizerId: string) => Tournament[];

  // Reset state
  reset: () => void;
}

export const useTournamentStore = create<TournamentStoreState>()(
  persist(
    (set, get) => ({
      tournaments: [],
      tournament: null,
      loading: false,
      error: null,

      fetchTournaments: async () => {
        set({ loading: true, error: null });
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          // In a real app, we would fetch from an API here
          // For now, we just use the persisted data
          set({ loading: false });
        } catch (err) {
          set({ loading: false, error: err instanceof Error ? err.message : 'An error occurred' });
        }
      },

      fetchTournamentById: async (id: string) => {
        set({ loading: true, error: null });
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          const tournament = get().tournaments.find(t => t.id === id);
          set({
            tournament: tournament ? { ...tournament } : null,
            loading: false
          });
        } catch (err) {
          set({ loading: false, error: err instanceof Error ? err.message : 'An error occurred' });
        }
      },

      createTournament: (tournamentData: TournamentFormValues, organizer: { id: string; displayName?: string; mobile: string; role: string }) => {
        const newTournament: Tournament = {
          id: Math.random().toString(36).substr(2, 9),
          tournamentCode: `TRN-${String(get().tournaments.length + 1).padStart(4, '0')}`,
          organizerId: organizer.id,
          organizerName: organizer.displayName || organizer.mobile,
          ...tournamentData,
          status: 'DRAFT',
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

      approveTournament: (id: string, adminId?: string) => {
        const state = get();
        const index = state.tournaments.findIndex(t => t.id === id);
        if (index === -1) {
          throw new Error('Tournament not found');
        }

        const tournament = state.tournaments[index];
        if (tournament.status !== 'PENDING_ADMIN_APPROVAL') {
          throw new Error('Only pending approval tournaments can be approved');
        }

        const updatedTournament = {
          ...tournament,
          status: 'APPROVED' as TournamentStatus,
          approvedAt: new Date().toISOString(),
          approvedBy: adminId ?? undefined,
          updatedAt: new Date().toISOString(),
        };

        set(state => {
          const updatedTournaments = [...state.tournaments];
          updatedTournaments[index] = updatedTournament;
          return { tournaments: updatedTournaments };
        });

        return updatedTournament;
      },

      rejectTournament: (id: string, rejectionReason: string, adminId?: string) => {
        const state = get();
        const index = state.tournaments.findIndex(t => t.id === id);
        if (index === -1) {
          throw new Error('Tournament not found');
        }

        const tournament = state.tournaments[index];
        if (tournament.status !== 'PENDING_ADMIN_APPROVAL') {
          throw new Error('Only pending approval tournaments can be rejected');
        }

        // Trim and check rejection reason
        const trimmedReason = rejectionReason.trim();
        if (!trimmedReason) {
          throw new Error('Rejection reason is required');
        }

        const updatedTournament = {
          ...tournament,
          status: 'REJECTED' as TournamentStatus,
          rejectionReason: trimmedReason,
          rejectedAt: new Date().toISOString(),
          rejectedBy: adminId ?? undefined,
          updatedAt: new Date().toISOString(),
        };

        set(state => {
          const updatedTournaments = [...state.tournaments];
          updatedTournaments[index] = updatedTournament;
          return { tournaments: updatedTournaments };
        });

        return updatedTournament;
      },

      publishTournament: (id: string) => {
        const state = get();
        const index = state.tournaments.findIndex(t => t.id === id);
        if (index === -1) {
          throw new Error('Tournament not found');
        }

        const tournament = state.tournaments[index];
        if (tournament.status !== 'APPROVED') {
          throw new Error('Only approved tournaments can be published');
        }

        const updatedTournament = {
          ...tournament,
          status: 'PUBLISHED' as TournamentStatus,
          publishedAt: new Date().toISOString(),
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
      },

      reset: () => {
        set({
          tournaments: [],
          tournament: null,
          loading: false,
          error: null
        });
      }
    }),
    {
      name: 'badminton-tournaments', // Persistence key
    }
  )
);