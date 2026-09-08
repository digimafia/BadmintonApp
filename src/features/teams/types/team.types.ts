export type TeamStatus = 'PENDING_PARTNER' | 'CONFIRMED' | 'CANCELLED';

export type PartnerStatus = 'PENDING_CONFIRMATION' | 'ACCEPTED';

export interface Team {
  id: string; // internal ID
  teamCode: string; // e.g., TEAM000001
  tournamentId: string;
  tournamentCode: string;
  categoryId: string;
  categoryName: string;
  player1Id: string; // references PlayerProfile.id or GuestPlayer.id
  player1Code: string; // from player/guest profile
  player1Name: string; // from player/guest profile
  player1Type: 'FULL'; // always FULL for player1 (the logged-in player)
  player2Id: string; // references PlayerProfile.id or GuestPlayer.id
  player2Code: string; // from player/guest profile
  player2Name: string; // from player/guest profile
  player2Type: 'FULL' | 'GUEST';
  partnerStatus: PartnerStatus; // status of the partnership (PENDING_CONFIRMATION, ACCEPTED)
  status: TeamStatus; // overall team status (PENDING_PARTNER, CONFIRMED, CANCELLED)
  createdAt: string; // ISO timestamp
  confirmedAt?: string; // ISO timestamp, when partnerStatus becomes ACCEPTED and team is confirmed
  cancelledAt?: string; // ISO timestamp, when status becomes CANCELLED
}

// Form values for creating a team (what the client sends to create a team)
export interface TeamCreateInput {
  tournamentId: string;
  categoryId: string;
  player1Id: string; // logged-in player's id
  player2Id: string; // selected partner's id (player or guest)
  // player1Code, player1Name, player1Type will be filled from profile
  // player2Code, player2Name, player2Type will be filled from profile/guest
  // tournamentCode, categoryName will be filled from tournament/category
  // teamCode will be generated
  // partnerStatus will be set to PENDING_CONFIRMATION (if player2 is existing player) or ACCEPTED (if player2 is guest)
  // status will be set to PENDING_PARTNER
  // createdAt will be set to now
}