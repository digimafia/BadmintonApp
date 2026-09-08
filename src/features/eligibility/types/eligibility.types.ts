// Eligibility reason codes
export type EligibilityReasonCode =
  | 'PROFILE_INCOMPLETE'
  | 'TOURNAMENT_NOT_PUBLISHED'
  | 'REGISTRATION_CLOSED'
  | 'AGE_BELOW_MINIMUM'
  | 'AGE_ABOVE_MAXIMUM'
  | 'MEDALIST_NOT_ALLOWED'
  | 'OPEN_PLAYER_NOT_ALLOWED'
  | 'BEGINNER_ONLY'
  | 'PURE_BEGINNER_ONLY'
  | 'CATEGORY_FULL'
  | 'ALREADY_REGISTERED'
  | 'GENDER_NOT_ELIGIBLE';

export interface EligibilityReason {
  code: EligibilityReasonCode;
  message: string;
}

export interface EligibilityResult {
  eligible: boolean;
  reasons: EligibilityReason[];
}
