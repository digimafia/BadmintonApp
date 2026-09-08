import { useTournamentStore } from '@/features/tournaments/store/tournamentStore'
import { usePlayerDirectoryStore } from '@/features/player/store/playerDirectoryStore'
import { useTeamStore } from '@/features/teams/store/teamStore'
import { useRegistrationStore } from '@/features/registrations/store/registrationStore'
import { PlayerProfile } from '@/features/player/types/player.types'

export const createDoublesFixtureDemo = async (organizer: { id: string; mobile: string; displayName?: string; role: string }) => {
  const tournamentStore = useTournamentStore.getState()
  const tournament = tournamentStore.createTournament({
    name: 'Chennai Doubles Open 2026',
    description: 'A 16-team doubles event, ready for fixture shuffle and match-flow testing.',
    tournamentDate: '2026-10-18', reportingTime: '08:00',
    registrationCloseDate: '2026-10-16', registrationCloseTime: '20:00',
    organizerMobile: organizer.mobile, venueName: 'SmashPoint Arena', venueAddress: 'Chennai Badminton Centre',
    mapLink: '', format: 'KNOCKOUT',
    categories: [{ id: '', name: 'Doubles', eventType: 'DOUBLES', maxTeams: 16, medalistsAllowed: true, openPlayersAllowed: true, beginnerOnly: false, pureBeginnerOnly: false, additionalRuleNotes: '16 confirmed teams ready for the shuffle draw' }],
    generalRules: ['Best of 3 games', '21 points per game', 'Report 30 minutes early'],
    prizes: 'Winner ₹10,000 · Runner-up ₹5,000', shuttle: 'Yonex Mavis 350', scoringFormat: '21 points, best of 3',
  }, organizer)

  tournamentStore.submitTournamentForApproval(tournament.id)
  tournamentStore.approveTournament(tournament.id, organizer.id)
  const published = tournamentStore.publishTournament(tournament.id)
  const category = published.categories[0]
  const now = new Date().toISOString()
  const playerNames = [
    'Arjun Kumar', 'Vikram Raj', 'Karthik Suresh', 'Pranav Iyer',
    'Rohan Mehta', 'Aditya Nair', 'Sanjay Krishnan', 'Hari Prasad',
    'Naveen Babu', 'Dinesh Kumar', 'Surya Venkatesh', 'Rahul Dev',
    'Ashwin Balaji', 'Manoj Kumar', 'Gokul Raj', 'Sathish Kumar',
    'Vishwa Prakash', 'Jeevan Anand', 'Rakesh Mohan', 'Vigneshwaran P',
    'Nithin Raj', 'Sriram Kannan', 'Bharath Kumar', 'Kiran Joseph',
    'Shankar Raman', 'Mithun Prakash', 'Akash Selvam', 'Yuvan Shankar',
    'Sanjay Raj', 'Karthikeya M', 'Vimal Kumar', 'Aravind S',
  ]
  const players: PlayerProfile[] = playerNames.map((fullName, index) => ({
    id: `demo-player-${index + 1}`, userId: `player-9${String(100000000 + index).padStart(9, '0')}`, playerCode: `DPL${String(index + 1).padStart(3, '0')}`,
    fullName, dob: '1998-06-15', age: 28, mobile: `9${String(100000000 + index).padStart(9, '0')}`,
    location: 'Chennai', playingSince: 2020, experienceYears: 6, regularPlayer: true, courtAcademy: 'SmashPoint Academy', profilePhoto: null, profileStatus: 'ACTIVE', createdAt: now, updatedAt: now,
  }))
  const directory = usePlayerDirectoryStore.getState()
  players.forEach(player => directory.upsertProfile(player))

  const teams = useTeamStore.getState()
  const registrations = useRegistrationStore.getState()
  for (let index = 0; index < players.length; index += 2) {
    const player1 = players[index]
    const player2 = players[index + 1]
    const team = teams.createTeam({ tournamentId: published.id, tournamentCode: published.tournamentCode, categoryId: category.id, categoryName: category.name, player1Id: player1.id, player1Code: player1.playerCode, player1Name: player1.fullName, player1Type: 'FULL', player2Id: player2.id, player2Code: player2.playerCode, player2Name: player2.fullName, player2Type: 'FULL', partnerStatus: 'PENDING_CONFIRMATION', status: 'PENDING_PARTNER' })
    teams.acceptPartner(team.id)
    const confirmed = teams.confirmTeam(team.id)!
    registrations.createRegistration({ tournamentId: published.id, tournamentCode: published.tournamentCode, categoryId: category.id, categoryName: category.name, playerId: player1.id, playerCode: player1.playerCode, playerName: player1.fullName, eventType: 'DOUBLES', status: 'REGISTERED', registeredAt: now, teamId: confirmed.id, teamCode: confirmed.teamCode, partnerId: player2.id, partnerCode: player2.playerCode, partnerName: player2.fullName, partnerType: 'FULL' })
  }
  await useTournamentStore.getState().closeCategoryRegistration(organizer.id, published.id, category.id)
  return published.id
}
