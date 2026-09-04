// EventType and TournamentFormat are defined here for now.
// If they become shared across features, they can be moved to root types.

export type TournamentStatus =
  | 'DRAFT'
  | 'PENDING_ADMIN_APPROVAL'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'REJECTED';

export type TournamentFormat = 'KNOCKOUT' | 'LEAGUE' | 'LEAGUE_KNOCKOUT';

export type EventType = 'SINGLES' | 'DOUBLES';

export interface TournamentCategory {
  id: string;
  name: string;
  eventType: EventType;
  minAge?: number;
  maxAge?: number;
  maxTeams?: number;
  medalistsAllowed: boolean;
  openPlayersAllowed: boolean;
  beginnerOnly: boolean;
  pureBeginnerOnly: boolean;
  additionalRuleNotes?: string;
}

export interface Tournament {
  id: string;
  tournamentCode: string;
  organizerId: string;
  organizerName: string;
  name: string;
  description: string;
  tournamentDate: string; // ISO date string
  reportingTime: string; // HH:mm format
  registrationCloseDate: string; // ISO date string
  registrationCloseTime: string; // HH:mm format
  venueName: string;
  venueAddress: string;
  mapLink?: string;
  format: TournamentFormat;
  categories: TournamentCategory[];
  generalRules: string[]; // array of rule strings
  prizes?: string;
  shuttle?: string;
  scoringFormat?: string;
  status: TournamentStatus;
  rejectionReason?: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  submittedAt?: string; // ISO timestamp
}

// Form types for creating/updating tournament
export type TournamentFormValues = Omit<
  Tournament,
  | 'id'
  | 'tournamentCode'
  | 'organizerId'
  | 'organizerName'
  | 'createdAt'
  | 'updatedAt'
  | 'submittedAt'
  | 'status'
> & {
  categories: Omit<TournamentCategory, 'id'>[];
  generalRules: string[];
};

// We'll also define a type for the tournament without the id for creation
export type TournamentCreateInput = Omit<Tournament, 'id' | 'tournamentCode' | 'createdAt' | 'updatedAt' | 'submittedAt' | 'status'> & {
  categories: Omit<TournamentCategory, 'id'>[];
  generalRules: string[];
};