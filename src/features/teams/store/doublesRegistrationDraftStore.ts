import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PlayerProfile } from '@/features/player/types/player.types'
import { GuestPlayer } from '@/features/player/types/guest.player.types'

export type PartnerType = 'FULL' | 'GUEST'
export type PartnerStatus = 'PENDING_CONFIRMATION' | 'ACCEPTED'

interface DoublesRegistrationDraftState {
  tournamentId: string | null
  categoryId: string | null
  currentPlayerId: string | null

  partnerId: string | null
  partnerCode: string | null
  partnerName: string | null
  partnerType: PartnerType | null
  partnerStatus: PartnerStatus | null

  currentPlayerEligibility: boolean | null
  partnerEligibility: boolean | null

  setTournamentAndCategory: (tournamentId: string, categoryId: string) => void
  setCurrentPlayer: (playerId: string) => void
  setPartner: (partner: PlayerProfile | GuestPlayer, partnerType: PartnerType, partnerStatus: PartnerStatus) => void
  setEligibility: (currentPlayerEligible: boolean | null, partnerEligible: boolean | null) => void
  clear: () => void
}

export const useDoublesRegistrationDraftStore = create<DoublesRegistrationDraftState>()(
  persist(
    (set) => ({
      tournamentId: null,
      categoryId: null,
      currentPlayerId: null,
      partnerId: null,
      partnerCode: null,
      partnerName: null,
      partnerType: null,
      partnerStatus: null,
      currentPlayerEligibility: null,
      partnerEligibility: null,
      setTournamentAndCategory: (tournamentId: string, categoryId: string) => set({ tournamentId, categoryId }),
      setCurrentPlayer: (playerId: string) => set({ currentPlayerId: playerId }),
      setPartner: (partner: PlayerProfile | GuestPlayer, partnerType: PartnerType, partnerStatus: PartnerStatus) => {
        set({
          partnerId: partner.id,
          partnerCode: 'playerCode' in partner ? partner.playerCode : partner.guestCode,
          partnerName: partner.fullName,
          partnerType,
          partnerStatus
        })
      },
      setEligibility: (currentPlayerEligible: boolean | null, partnerEligible: boolean | null) => set({ currentPlayerEligibility: currentPlayerEligible, partnerEligibility: partnerEligible }),
      clear: () => set({
        tournamentId: null,
        categoryId: null,
        currentPlayerId: null,
        partnerId: null,
        partnerCode: null,
        partnerName: null,
        partnerType: null,
        partnerStatus: null,
        currentPlayerEligibility: null,
        partnerEligibility: null
      })
    }),
    {
      name: 'badminton-doubles-registration-draft'
    }
  )
)