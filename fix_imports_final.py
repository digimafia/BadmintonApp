import sys

file_path = sys.argv[1]

# Map of line numbers (1-indexed) to new line content
replacements = {
    4: "import { useTournamentStore } from '@/features/tournaments/store/tournamentStore'",
    5: "import { usePlayerProfileStore } from '@/features/player/store/playerProfileStore'",
    6: "import { useGuestPlayerStore } from '@/features/player/store/guestPlayerStore'",
    7: "import { usePlayerDirectoryStore } from '@/features/player/store/playerDirectoryStore'",
    8: "import { useRegistrationStore } from '@/features/registrations/store/registrationStore'",
    9: "import { useTeamStore } from '@/features/teams/store/teamStore'",
    10: "import { useDoublesRegistrationDraftStore } from '@/features/teams/store/doublesRegistrationDraftStore'",
    12: "import { registrationService } from '@/features/registrations/services/registrationService'",
    13: "import { teamService } from '@/features/teams/services/teamService'",
    14: "import { guestPlayerService } from '@/features/player/services/guestPlayerService'",
    16: "import { evaluatePlayerEligibility } from '@/features/eligibility/utils/eligibilityUtils'",
    17: "import { EligibilityResult } from '@/features/eligibility/types/eligibility.types'",
    19: "import { GuestPlayer } from '@/features/player/types/guest.player.types'",
    20: "import { PlayerProfile } from '@/features/player/types/player.types'",
    21: "import { TournamentCategory } from '@/features/tournaments/types/tournament.types'",
    23: "import { formatDateDisplay } from '@/features/tournaments/utils/tournamentHelpers'",
}

with open(file_path, 'r') as f:
    lines = f.readlines()

# Adjust for 0-indexed
for line_num, new_line in replacements.items():
    idx = line_num - 1
    if idx < len(lines):
        lines[idx] = new_line + '\n'

with open(file_path, 'w') as f:
    f.writelines(lines)