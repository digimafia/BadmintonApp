import { EventType } from '@/features/tournaments/types/tournament.types';
import { PlayerProfile } from '@/features/player/types/player.types';
import { GuestPlayer } from '@/features/player/types/guest.player.types';

export type MedalPosition = 'WINNER' | 'RUNNER_UP';

export type MedalType = 'GOLD' | 'SILVER';

export type MedalHistoryPlayerType = 'REGISTERED' | 'GUEST';

export interface MedalHistory {
  id: string;
  playerId: string; // PlayerProfile.id or GuestPlayer.id
  playerCode: string; // playerCode or guestCode
  playerName: string;
  tournamentId: string;
  tournamentCode: string;
  tournamentName: string;
  categoryId: string;
  categoryName: string;
  eventType: EventType;
  position: MedalPosition;
  medalType: MedalType;
  achievedAt: string; // ISO timestamp
  playerType?: MedalHistoryPlayerType; // REGISTERED or GUEST
}