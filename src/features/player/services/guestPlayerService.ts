import { GuestPlayer } from '@/features/player/types/guest.player.types';
import { useGuestPlayerStore } from '@/features/player/store/guestPlayerStore';

// Mock delay function to simulate API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const guestPlayerService = {
  /**
   * Create a new guest player
   * @param guestData Guest player data without id, guestCode, createdAt, updatedAt, profileType, profileStatus
   */
  createGuest: async (guestData: Omit<GuestPlayer, 'id' | 'guestCode' | 'createdAt' | 'updatedAt' | 'profileType' | 'profileStatus'>): Promise<GuestPlayer> => {
    await delay(500);
    const storeState = useGuestPlayerStore.getState();
    // Check for duplicate by mobile
    const existingGuest = storeState.getGuestByMobile(guestData.mobile);
    if (existingGuest) {
      return existingGuest;
    }
    const guest = storeState.createGuest(guestData);
    return guest;
  },

  /**
   * Get guest player by ID
   */
  getGuestById: async (id: string): Promise<GuestPlayer | undefined> => {
    await delay(500);
    const storeState = useGuestPlayerStore.getState();
    return storeState.getGuestById(id);
  },

  /**
   * Get guest player by mobile
   */
  getGuestByMobile: async (mobile: string): Promise<GuestPlayer | undefined> => {
    await delay(500);
    const storeState = useGuestPlayerStore.getState();
    return storeState.getGuestByMobile(mobile);
  },

  /**
   * Update guest player
   */
  updateGuest: async (id: string, updates: Partial<GuestPlayer>): Promise<GuestPlayer | undefined> => {
    await delay(500);
    const storeState = useGuestPlayerStore.getState();
    const updatedGuest = storeState.updateGuest(id, updates);
    return updatedGuest;
  }
};