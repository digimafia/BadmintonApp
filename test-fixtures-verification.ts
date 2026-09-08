// Verification test for the fixed generateKnockoutFixture
// Tests the specific assertions requested in the feedback

import { Tournament, TournamentCategory } from './src/features/tournaments/types/tournament.types';
import { Fixture, FixtureMatch, FixtureParticipant } from './src/features/fixtures/types/fixture.types';
import { fixtureService } from './src/features/fixtures/services/fixture.service';

// Helper to find participant by id
const findParticipantById = (participants: FixtureParticipant[], id: string): FixtureParticipant | undefined => {
  for (const p of participants) {
    if (p.id === id) return p;
  }
  return undefined;
};

// Helper to create a mock tournament
const createMockTournament = (id: string): Tournament => ({
  id,
  tournamentCode: 'TRN001',
  organizerId: 'org1',
  organizerName: 'Test Organizer',
  name: 'Test Tournament',
  description: 'A test tournament',
  tournamentDate: new Date().toISOString().split('T')[0],
  reportingTime: '09:00',
  registrationCloseDate: new Date().toISOString().split('T')[0],
  registrationCloseTime: '18:00',
  venueName: 'Test Venue',
  venueAddress: '123 Test Street',
  format: 'KNOCKOUT',
  categories: [],
  generalRules: ['Rule 1', 'Rule 2'],
  status: 'PUBLISHED',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// Helper to create a mock category
const createMockCategory = (id: string, eventType: 'SINGLES' | 'DOUBLES'): TournamentCategory => ({
  id,
  name: 'Test Category',
  eventType,
  medalistsAllowed: false,
  openPlayersAllowed: false,
  beginnerOnly: false,
  pureBeginnerOnly: false,
  registrationPhase: 'CLOSED',
  registrationClosedAt: new Date().toISOString()
});

// Helper to create a mock participant
const createMockParticipant = (id: string, name: string, code: string, type: 'PLAYER' | 'TEAM'): FixtureParticipant => ({
  id,
  name,
  code,
  type
});

// Assertion helper
const assert = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
};

const runTests = () => {
  console.log('Starting fixture verification tests...\n');

  // ==================== 3 PLAYERS ====================
  console.log('Testing 3 players bracket...');
  const tournament3 = createMockTournament('t3');
  const category3 = createMockCategory('c3', 'SINGLES');
  const participants3: FixtureParticipant[] = [
    createMockParticipant('p1', 'Player 1', 'P001', 'PLAYER'),
    createMockParticipant('p2', 'Player 2', 'P002', 'PLAYER'),
    createMockParticipant('p3', 'Player 3', 'P003', 'PLAYER')
  ];

  const fixture3 = fixtureService.generateKnockoutFixture(tournament3, category3, participants3);

  // Total matches should be 3
  assert(fixture3.matches.length === 3, '3 players: total matches should be 3');

  // Separate rounds
  const round0Matches3 = fixture3.matches.filter(m => m.roundNumber === 0);
  const round1Matches3 = fixture3.matches.filter(m => m.roundNumber === 1);

  assert(round0Matches3.length === 2, '3 players: should have 2 first round matches');
  assert(round1Matches3.length === 1, '3 players: should have 1 final match');

  // Count BYE and normal matches in round 0
  const byeMatches3 = round0Matches3.filter(m => m.status === 'COMPLETED' && m.winnerId !== null);
  const normalMatches3 = round0Matches3.filter(m => m.status === 'SCHEDULED' && m.winnerId === null);

  assert(byeMatches3.length === 1, '3 players: should have exactly one BYE completed match');
  assert(normalMatches3.length === 1, '3 players: should have exactly one normal match');

  // BYE match checks
  const byeMatch3 = byeMatches3[0];
  assert(byeMatch3.winnerId !== null, '3 players: BYE match should have a winnerId');
  const winnerParticipant3 = findParticipantById(participants3, byeMatch3.winnerId!);
  assert(winnerParticipant3 !== undefined, '3 players: winner should be a valid participant');
  assert(byeMatch3.nextMatchId !== null, '3 players: BYE match should have nextMatchId');
  assert(byeMatch3.nextMatchSlot === 'PARTICIPANT_1' || byeMatch3.nextMatchSlot === 'PARTICIPANT_2', '3 players: BYE match should have nextMatchSlot');

  // Normal match checks
  const normalMatch3 = normalMatches3[0];
  assert(normalMatch3.participant1 !== null && normalMatch3.participant2 !== null, '3 players: normal match should have two participants');
  assert(normalMatch3.winnerId === null, '3 players: normal match should have no winner');
  assert(normalMatch3.nextMatchId !== null, '3 players: normal match should have nextMatchId');
  assert(normalMatch3.nextMatchSlot === 'PARTICIPANT_1' || normalMatch3.nextMatchSlot === 'PARTICIPANT_2', '3 players: normal match should have nextMatchSlot');

  // Final match checks
  const finalMatch3 = round1Matches3[0];
  assert(finalMatch3 !== undefined, '3 players: final match should exist');
  const finalHasP1 = finalMatch3.participant1 !== null;
  const finalHasP2 = finalMatch3.participant2 !== null;
  assert(finalHasP1 + finalHasP2 === 1, '3 players: final should have exactly one known participant');
  if (finalMatch3.participant1) {
    assert(finalMatch3.participant1.id === byeMatch3.winnerId, '3 players: known participant in final should be the BYE winner');
  } else if (finalMatch3.participant2) {
    assert(finalMatch3.participant2.id === byeMatch3.winnerId, '3 players: known participant in final should be the BYE winner');
  }
  assert(finalMatch3.winnerId === null, '3 players: final should have no winner');
  assert(finalMatch3.status === 'SCHEDULED', '3 players: final should be scheduled');

  console.log('✓ 3 players test passed\n');

  // ==================== 4 PLAYERS ====================
  console.log('Testing 4 players bracket...');
  const tournament4 = createMockTournament('t4');
  const category4 = createMockCategory('c4', 'SINGLES');
  const participants4: FixtureParticipant[] = [
    createMockParticipant('p1', 'Player 1', 'P001', 'PLAYER'),
    createMockParticipant('p2', 'Player 2', 'P002', 'PLAYER'),
    createMockParticipant('p3', 'Player 3', 'P003', 'PLAYER'),
    createMockParticipant('p4', 'Player 4', 'P004', 'PLAYER')
  ];

  const fixture4 = fixtureService.generateKnockoutFixture(tournament4, category4, participants4);

  // Total matches should be 3
  assert(fixture4.matches.length === 3, '4 players: total matches should be 3');

  const round0Matches4 = fixture4.matches.filter(m => m.roundNumber === 0);
  const round1Matches4 = fixture4.matches.filter(m => m.roundNumber === 1);

  assert(round0Matches4.length === 2, '4 players: should have 2 first round matches (semifinals)');
  assert(round1Matches4.length === 1, '4 players: should have 1 final match');

  // All first round matches should be scheduled with no winner
  round0Matches4.forEach(match => {
    assert(match.status === 'SCHEDULED', '4 players: first round match should be scheduled');
    assert(match.winnerId === null, '4 players: first round match should have no winner');
    assert(match.participant1 !== null && match.participant2 !== null, '4 players: first round match should have two participants');
    assert(match.nextMatchId !== null, '4 players: first round match should have nextMatchId');
    assert(match.nextMatchSlot === 'PARTICIPANT_1' || match.nextMatchSlot === 'PARTICIPANT_2', '4 players: first round match should have nextMatchSlot');
  });

  // Check that semifinals point to the final
  const finalMatch4 = round1Matches4[0];
  assert(finalMatch4 !== undefined, '4 players: final match should exist');
  round0Matches4.forEach((match, index) => {
    assert(match.nextMatchId === finalMatch4.id, `4 players: semifinal ${index} should point to final`);
    const expectedSlot = index === 0 ? 'PARTICIPANT_1' : 'PARTICIPANT_2';
    assert(match.nextMatchSlot === expectedSlot, `4 players: semifinal ${index} should have nextMatchSlot ${expectedSlot}`);
  });

  // Final match should have null participants initially
  assert(finalMatch4.participant1 === null && finalMatch4.participant2 === null, '4 players: final match should have null participants');
  assert(finalMatch4.winnerId === null, '4 players: final should have no winner');
  assert(finalMatch4.status === 'SCHEDULED', '4 players: final should be scheduled');

  console.log('✓ 4 players test passed\n');

  // ==================== 5 PLAYERS ====================
  console.log('Testing 5 players bracket...');
  const tournament5 = createMockTournament('t5');
  const category5 = createMockCategory('c5', 'SINGLES');
  const participants5: FixtureParticipant[] = [
    createMockParticipant('p1', 'Player 1', 'P001', 'PLAYER'),
    createMockParticipant('p2', 'Player 2', 'P002', 'PLAYER'),
    createMockParticipant('p3', 'Player 3', 'P003', 'PLAYER'),
    createMockParticipant('p4', 'Player 4', 'P004', 'PLAYER'),
    createMockParticipant('p5', 'Player 5', 'P005', 'PLAYER')
  ];

  const fixture5 = fixtureService.generateKnockoutFixture(tournament5, category5, participants5);

  // Bracket size should be 8, so total matches = 7
  assert(fixture5.matches.length === 7, '5 players: total matches should be 7');

  const round0Matches5 = fixture5.matches.filter(m => m.roundNumber === 0);
  const round1Matches5 = fixture5.matches.filter(m => m.roundNumber === 1);
  const round2Matches5 = fixture5.matches.filter(m => m.roundNumber === 2);

  assert(round0Matches5.length === 4, '5 players: should have 4 first round matches');
  assert(round1Matches5.length === 2, '5 players: should have 2 semifinal matches');
  assert(round2Matches5.length === 1, '5 players: should have 1 final match');

  // Count BYEs and normal matches in first round
  const byeMatches5 = round0Matches5.filter(m => m.status === 'COMPLETED' && m.winnerId !== null);
  const normalMatches5 = round0Matches5.filter(m => m.status === 'SCHEDULED' && m.winnerId === null);

  assert(byeMatches5.length === 3, '5 players: should have exactly 3 BYE completed matches');
  assert(normalMatches5.length === 1, '5 players: should have exactly 1 normal match');

  // The normal match should have two participants
  normalMatches5.forEach(match => {
    assert(match.participant1 !== null && match.participant2 !== null, '5 players: normal match should have two participants');
    assert(match.winnerId === null, '5 players: normal match should have no winner');
  });

  // The BYE matches should have one participant and a winner
  byeMatches5.forEach(match => {
    // Exactly one of participant1 or participant2 should be null
    const hasP1 = match.participant1 !== null;
    const hasP2 = match.participant2 !== null;
    assert(hasP1 + hasP2 === 1, '5 players: BYE match should have exactly one participant');
    assert(match.winnerId !== null, '5 players: BYE match should have a winnerId');
    const winnerId = match.winnerId;
    // The winner should be the non-null participant
    if (match.participant1) {
      assert(match.participant1.id === winnerId, '5 players: winner should be participant1');
    } else if (match.participant2) {
      assert(match.participant2.id === winnerId, '5 players: winner should be participant2');
    }
    assert(match.nextMatchId !== null, '5 players: BYE match should have nextMatchId');
    assert(match.nextMatchSlot === 'PARTICIPANT_1' || match.nextMatchSlot === 'PARTICIPANT_2', '5 players: BYE match should have nextMatchSlot');
  });

  // Check that the winners of the BYE matches have advanced to the semifinals
  // We expect that the semifinals have a total of 3 known participants (the three BYE winners)
  const totalKnownInSemis = round1Matches5.reduce((sum, m) => {
    return sum + (m.participant1 !== null ? 1 : 0) + (m.participant2 !== null ? 1 : 0);
  }, 0);
  assert(totalKnownInSemis === 3, '5 players: semifinals should have a total of 3 known participants (the BYE winners)');

  // The final should be empty initially
  const finalMatch5 = round2Matches5[0];
  assert(finalMatch5 !== undefined, '5 players: final match should exist');
  assert(finalMatch5.participant1 === null && finalMatch5.participant2 === null, '5 players: final should have null participants initially');
  assert(finalMatch5.status === 'SCHEDULED', '5 players: final should be scheduled');
  assert(finalMatch5.winnerId === null, '5 players: final should have no winner');

  console.log('✓ 5 players test passed\n');

  // ==================== 8 PLAYERS ====================
  console.log('Testing 8 players bracket...');
  const tournament8 = createMockTournament('t8');
  const category8 = createMockCategory('c8', 'SINGLES');
  const participants8: FixtureParticipant[] = [
    createMockParticipant('p1', 'Player 1', 'P001', 'PLAYER'),
    createMockParticipant('p2', 'Player 2', 'P002', 'PLAYER'),
    createMockParticipant('p3', 'Player 3', 'P003', 'PLAYER'),
    createMockParticipant('p4', 'Player 4', 'P004', 'PLAYER'),
    createMockParticipant('p5', 'Player 5', 'P005', 'PLAYER'),
    createMockParticipant('p6', 'Player 6', 'P006', 'PLAYER'),
    createMockParticipant('p7', 'Player 7', 'P007', 'PLAYER'),
    createMockParticipant('p8', 'Player 8', 'P008', 'PLAYER')
  ];

  const fixture8 = fixtureService.generateKnockoutFixture(tournament8, category8, participants8);

  // Total matches should be 7
  assert(fixture8.matches.length === 7, '8 players: total matches should be 7');

  const round0Matches8 = fixture8.matches.filter(m => m.roundNumber === 0);
  const round1Matches8 = fixture8.matches.filter(m => m.roundNumber === 1);
  const round2Matches8 = fixture8.matches.filter(m => m.roundNumber === 2);

  assert(round0Matches8.length === 4, '8 players: should have 4 first round matches (quarterfinals)');
  assert(round1Matches8.length === 2, '8 players: should have 2 semifinal matches');
  assert(round2Matches8.length === 1, '8 players: should have 1 final match');

  // All first round matches should be scheduled with no winner and two participants
  round0Matches8.forEach(match => {
    assert(match.status === 'SCHEDULED', '8 players: first round match should be scheduled');
    assert(match.winnerId === null, '8 players: first round match should have no winner');
    assert(match.participant1 !== null && match.participant2 !== null, '8 players: first round match should have two participants');
    assert(match.nextMatchId !== null, '8 players: first round match should have nextMatchId');
    assert(match.nextMatchSlot === 'PARTICIPANT_1' || match.nextMatchSlot === 'PARTICIPANT_2', '8 players: first round match should have nextMatchSlot');
  });

  // All semifinal matches should be scheduled with no winner and two participants
  round1Matches8.forEach(match => {
    assert(match.status === 'SCHEDULED', '8 players: semifinal match should be scheduled');
    assert(match.winnerId === null, '8 players: semifinal match should have no winner');
    assert(match.participant1 !== null && match.participant2 !== null, '8 players: semifinal match should have two participants');
    assert(match.nextMatchId !== null, '8 players: semifinal match should have nextMatchId');
    assert(match.nextMatchSlot === 'PARTICIPANT_1' || match.nextMatchSlot === 'PARTICIPANT_2', '8 players: semifinal match should have nextMatchSlot');
  });

  // The final should be scheduled with no winner and two null participants
  const finalMatch8 = round2Matches8[0];
  assert(finalMatch8 !== undefined, '8 players: final match should exist');
  assert(finalMatch8.status === 'SCHEDULED', '8 players: final match should be scheduled');
  assert(finalMatch8.winnerId === null, '8 players: final match should have no winner');
  assert(finalMatch8.participant1 === null && finalMatch8.participant2 === null, '8 players: final match should have null participants');

  // Check that the semifinals point to the final
  round1Matches8.forEach((match, index) => {
    assert(match.nextMatchId === finalMatch8.id, `8 players: semifinal ${index} should point to final`);
    const expectedSlot = index === 0 ? 'PARTICIPANT_1' : 'PARTICIPANT_2';
    assert(match.nextMatchSlot === expectedSlot, `8 players: semifinal ${index} should have nextMatchSlot ${expectedSlot}`);
  });

  console.log('✓ 8 players test passed\n');

  // ==================== DOUBLES TEAMS INTACT ====================
  console.log('Testing doubles teams remain intact...');
  const tournamentDoubles = createMockTournament('td');
  const categoryDoubles = createMockCategory('cd', 'DOUBLES');
  const participantsDoubles: FixtureParticipant[] = [
    createMockParticipant('t1', 'Team 1', 'T001', 'TEAM'),
    createMockParticipant('t2', 'Team 2', 'T002', 'TEAM'),
    createMockParticipant('t3', 'Team 3', 'T003', 'TEAM'),
    createMockParticipant('t4', 'Team 4', 'T004', 'TEAM')
  ];

  const fixtureDoubles = fixtureService.generateKnockoutFixture(tournamentDoubles, categoryDoubles, participantsDoubles);

  // Check that all participants in the fixture are of type TEAM
  fixtureDoubles.matches.forEach(match => {
    if (match.participant1) {
      assert(match.participant1.type === 'TEAM', 'Doubles: participant1 should be TEAM');
    }
    if (match.participant2) {
      assert(match.participant2.type === 'TEAM', 'Doubles: participant2 should be TEAM');
    }
  });

  console.log('✓ Doubles test passed\n');

  console.log('All tests passed!');
};

try {
  runTests();
} catch (error) {
  console.error('Test failed:', error);
  process.exit(1);
}