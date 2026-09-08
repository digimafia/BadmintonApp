import { Tournament, TournamentCategory } from './src/features/tournaments/types/tournament.types.ts';
import { Fixture, FixtureMatch, FixtureParticipant } from './src/features/fixtures/types/fixture.types.ts';
import { fixtureService } from './src/features/fixtures/services/fixtureService.ts';

// Helper to find participant by id
const findParticipantById = (participants: FixtureParticipant[], id: string): FixtureParticipant | undefined => {
  for (const p of participants) {
    if (p.id === id) return p;
  }
  return undefined;
};

// Mock tournament and category for testing
const createMockTournament = (id: string): Tournament => {
  return {
    id,
    tournamentCode: 'TRN001',
    organizerId: 'org1',
    organizerName: 'Test Organizer',
    name: 'Test Tournament',
    description: 'A test tournament',
    tournamentDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
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
  };
};

const createMockCategory = (id: string, eventType: 'SINGLES' | 'DOUBLES'): TournamentCategory => {
  return {
    id,
    name: 'Test Category',
    eventType,
    medalistsAllowed: false,
    openPlayersAllowed: false,
    beginnerOnly: false,
    pureBeginnerOnly: false,
    registrationPhase: 'CLOSED',
    registrationClosedAt: new Date().toISOString()
  };
};

// Helper to create a mock participant
const createMockParticipant = (id: string, name: string, code: string, type: 'PLAYER' | 'TEAM'): FixtureParticipant => ({
  id,
  name,
  code,
  type
});

const assert = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
};

try {
  console.log('Testing 3 players bracket...');
  // 3 players bracket
  const tournament = createMockTournament('t1');
  const category = createMockCategory('c1', 'SINGLES');
  const participants: FixtureParticipant[] = [
    createMockParticipant('p1', 'Player 1', 'P001', 'PLAYER'),
    createMockParticipant('p2', 'Player 2', 'P002', 'PLAYER'),
    createMockParticipant('p3', 'Player 3', 'P003', 'PLAYER')
  ];

  const fixture = fixtureService.generateKnockoutFixture(tournament, category, participants);

  assert(fixture.matches.length === 3, '3 players: total matches should be 3');

  const firstRoundMatches = fixture.matches.filter(m => m.roundNumber === 0);
  const finalMatch = fixture.matches.find(m => m.roundNumber === 1);

  assert(firstRoundMatches.length === 2, '3 players: should have 2 first round matches');
  assert(finalMatch !== undefined, '3 players: should have a final match');

  const byeMatches = firstRoundMatches.filter(m => m.status === 'COMPLETED' && m.winnerId !== null);
  const normalMatches = firstRoundMatches.filter(m => m.status === 'SCHEDULED' && m.winnerId === null);

  assert(byeMatches.length === 1, '3 players: should have exactly one BYE completed match');
  assert(normalMatches.length === 1, '3 players: should have exactly one normal match');

  const byeMatch = byeMatches[0];
  assert(byeMatch.winnerId !== null, '3 players: BYE match should have a winnerId');
  const winnerParticipant = findParticipantById(participants, byeMatch.winnerId!);
  assert(winnerParticipant !== undefined, '3 players: winner should be a valid participant');

  const normalMatch = normalMatches[0];
  assert(normalMatch.participant1 !== null && normalMatch.partner2 !== null, '3 players: normal match should have two participants');
  assert(normalMatch.winnerId === null, '3 players: normal match should have no winner');

  if (finalMatch) {
    const finalHasP1 = finalMatch.participant1 !== null;
    const finalHasP2 = finalMatch.participant2 !== null;
    assert(finalHasP1 + finalHasP2 === 1, '3 players: final should have exactly one known participant');
    if (finalMatch.participant1) {
      assert(finalMatch.participant1.id === byeMatch.winnerId, '3 players: known participant in final should be the BYE winner');
    } else if (finalMatch.participant2) {
      assert(finalMatch.participant2.id === byeMatch.winnerId, '3 players: known participant in final should be the BYE winner');
    }
  }

  console.log('3 players test passed!');

  console.log('Testing 4 players bracket...');
  // 4 players bracket
  const tournament2 = createMockTournament('t2');
  const category2 = createMockCategory('c2', 'SINGLES');
  const participants2: FixtureParticipant[] = [
    createMockParticipant('p1', 'Player 1', 'P001', 'PLAYER'),
    createParticipant('p2', 'Player 2', 'P002', 'PLAYER'),
    createParticipant('p3', 'Player 3', 'P003', 'PLAYER'),
    createParticipant('p4', 'Player 4', 'P004', 'PLAYER')
  ];

  const fixture2 = fixtureService.generateKnockoutFixture(tournament2, category2, participants2);

  assert(fixture2.matches.length === 3, '4 players: total matches should be 3');

  const firstRoundMatches2 = fixture2.matches.filter(m => m.roundNumber === 0);
  const finalMatch2 = fixture2.matches.find(m => m.roundNumber === 1);

  assert(firstRoundMatches2.length === 2, '4 players: should have 2 first round matches');
  assert(finalMatch2 !== undefined, '4 players: should have a final match');

  // All first round matches should be scheduled with no winner
  firstRoundMatches2.forEach(match => {
    assert(match.status === 'SCHEDULED', '4 players: first round match should be scheduled');
    assert(match.winnerId === null, '4 players: first round match should have no winner');
    assert(match.participant1 !== null && match.participant2 !== null, '4 players: first round match should have two participants');
  });

  // The final match should have null participants initially
  assert(finalMatch2 !== null, '4 players: final match should exist');
  if (finalMatch2) {
    assert(finalMatch2.participant1 === null && finalMatch2.participant2 === null, '4 players: final match should have null participants');
    assert(finalMatch2.status === 'SCHEDULED', '4 players: final match should be scheduled');
    assert(finalMatch2.winnerId === null, '4 players: final match should have no winner');

    // Check that the semifinals point to the final
    firstRoundMatches2.forEach((match, index) => {
      assert(match.nextMatchId === finalMatch2.id, `4 players: semifinal ${index} should point to final`);
      const expectedSlot = index === 0 ? 'PARTICIPANT_1' : 'PARTICIPANT_2';
      assert(match.nextMatchSlot === expectedSlot, `4 players: semifinal ${index} should have nextMatchSlot ${expectedSlot}`);
    });
  }

  console.log('4 players test passed!');

  console.log('Testing 5 players bracket...');
  // 5 players bracket
  const tournament3 = createMockTournament('t3');
  const category3 = createMockCategory('c3', 'SINGLES');
  const participants3: FixtureParticipant[] = [
    createParticipant('p1', 'Player 1', 'P001', 'PLAYER'),
    createParticipant('p2', 'Player 2', 'P002', 'PLAYER'),
    createParticipant('p3', 'Player 3', 'P003', 'PLAYER'),
    createParticipant('p4', 'Player 4', 'P004', 'PLAYER'),
    createParticipant('p5', 'Player 5', 'P005', 'PLAYER')
  ];

  const fixture3 = fixtureService.generateKnockoutFixture(tournament3, category3, participants3);

  // Bracket size should be 8, so total matches = 7
  assert(fixture3.matches.length === 7, '5 players: total matches should be 7');

  // We expect 4 first round matches, 2 semifinal matches, 1 final
  const firstRoundMatches3 = fixture3.matches.filter(m => m.roundNumber === 0);
  const semifinalMatches3 = fixture3.matches.filter(m => m.roundNumber === 1);
  const finalMatch3 = fixture3.matches.find(m => m.roundNumber === 2);

  assert(firstRoundMatches3.length === 4, '5 players: should have 4 first round matches');
  assert(semifinalMatches3.length === 2, '5 players: should have 2 semifinal matches');
  assert(finalMatch3 !== undefined, '5 players: should have a final match');

  // Count BYEs in the first round: should be 3
  const byeMatches3 = firstRoundMatches3.filter(m => m.status === 'COMPLETED' && m.winnerId !== null);
  const normalMatches3 = firstRoundMatches3.filter(m => m.status === 'SCHEDULED' && m.winnerId === null);

  assert(byeMatches3.length === 3, '5 players: should have exactly 3 BYE completed matches');
  assert(normalMatches3.length === 1, '5 players: should have exactly 1 normal match');

  // The normal match should have two participants
  normalMatches3.forEach(match => {
    assert(match.participant1 !== null && match.participant2 !== null, '5 players: normal match should have two participants');
    assert(match.winnerId === null, '5 players: normal match should have no winner');
  });

  // The BYE matches should have one participant and a winner
  byeMatches3.forEach(match => {
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
  });

  // Check that the winners of the BYE matches have advanced to the semifinals
  // We'll check that the semifinals have the correct number of known participants
  // We expect that the semifinals have a total of 3 known participants (the three BYE winners)
  const totalKnownInSemis = semifinalMatches3.reduce((sum, m) => {
    return sum + (m.participant1 !== null ? 1 : 0) + (m.participant2 !== null ? 1 : 0);
  }, 0);
  assert(totalKnownInSemis === 3, '5 players: semifinals should have a total of 3 known participants (the BYE winners)');

  // The final should be empty initially
  assert(finalMatch3 !== null, '5 players: final match should exist');
  if (finalMatch3) {
    assert(finalMatch3.participant1 === null && finalMatch3.participant2 === null, '5 players: final should have null participants initially');
    assert(finalMatch3.status === 'SCHEDULED', '5 players: final should be scheduled');
    assert(finalMatch3.winnerId === null, '5 players: final should have no winner');
  }

  console.log('5 players test passed!');

  console.log('Testing 8 players bracket...');
  // 8 players bracket
  const tournament4 = createMockTournament('t4');
  const category4 = createMockCategory('c4', 'SINGLES');
  const participants4: FixtureParticipant[] = [
    createParticipant('p1', 'Player 1', 'P001', 'PLAYER'),
    createParticipant('p2', 'Player 2', 'P002', 'PLAYER'),
    createParticipant('p3', 'Player 3', 'P003', 'PLAYER'),
    createParticipant('p5', 'Player 5', 'P005', 'PLAYER'),
    createParticipant('p6', 'Player 6', 'P006', 'PLAYER'),
    createParticipant('p7', 'Player 7', 'P007', 'PLAYER'),
    createParticipant('p8', 'Player 8', 'P008', 'PLAYER')
  ];

  const fixture4 = fixtureService.generateKnockoutFixture(tournament4, category4, participants4);

  // Total matches should be 7
  assert(fixture4.matches.length === 7, '8 players: total matches should be 7');

  // We expect 4 first round matches (quarterfinals), 2 semifinal matches, 1 final
  const firstRoundMatches4 = fixture4.matches.filter(m => m.roundNumber === 0);
  const semifinalMatches4 = fixture4.matches.filter(m => m.roundNumber === 1);
  const finalMatch4 = fixture4.matches.find(m => m.roundNumber === 2);

  assert(firstRoundMatches4.length === 4, '8 players: should have 4 first round matches');
  assert(semifinalMatches4.length === 2, '8 players: should have 2 semifinal matches');
  assert(finalMatch4 !== undefined, '8 players: should have a final match');

  // All first round matches should be scheduled with no winner and two participants
  firstRoundMatches4.forEach(match => {
    assert(match.status === 'SCHEDULED', '8 players: first round match should be scheduled');
    assert(match.winnerId === null, '8 players: first round match should have no winner');
    assert(match.participant1 !== null && match.participant2 !== null, '8 players: first round match should have two participants');
  });

  // All semifinal matches should be scheduled with no winner and two participants
  semifinalMatches4.forEach(match => {
    assert(match.status === 'SCHEDULED', '8 players: semifinal match should be scheduled');
    assert(match.winnerId === null, '8 players: semifinal match should have no winner');
    assert(match.participant1 !== null && match.participant2 !== null, '8 players: semifinal match should have two participants');
  });

  // The final should be scheduled with no winner and two null participants
  assert(finalMatch4 !== null, '8 players: final match should exist');
  if (finalMatch4) {
    assert(finalMatch4.status === 'SCHEDULED', '8 players: final match should be scheduled');
    assert(finalMatch4.winnerId === null, '8 players: final match should have no winner');
    assert(finalMatch4.participant1 === null && finalMatch4.participant2 === null, '8 players: final match should have null participants');

    // Check that the semifinals point to the final
    semifinalMatches4.forEach((match, index) => {
      assert(match.nextMatchId === finalMatch4.id, `8 players: semifinal ${index} should point to final`);
      const expectedSlot = index === 0 ? 'PARTICIPANT_1' : 'PARTICIPANT_2';
      assert(match.nextMatchSlot === expectedSlot, `8 players: semifinal ${index} should have nextMatchSlot ${expectedSlot}`);
    });
  }

  console.log('8 players test passed!');

  console.log('Testing doubles teams remain intact...');
  // Doubles teams remain intact
  const tournament5 = createMockTournament('t5');
  const category5 = createMockCategory('c5', 'DOUBLES');
  const participants5: FixtureParticipant[] = [
    createParticipant('t1', 'Team 1', 'T001', 'TEAM'),
    createParticipant('t2', 'Team 2', 'T002', 'TEAM'),
    createParticipant('t3', 'Team 3', 'T003', 'TEAM'),
    createParticipant('t4', 'Team 4', 'T004', 'TEAM')
  ];

  const fixture5 = fixtureService.generateKnockoutFixture(tournament5, category5, participants5);

  // Check that all participants in the fixture are of type TEAM
  fixture5.matches.forEach(match => {
    if (match.participant1) {
      assert(match.participant1.type === 'TEAM', 'Doubles: participant1 should be TEAM');
    }
    if (match.participant2) {
      assert(match.participant2.type === 'TEAM', 'Doubles: participant2 should be TEAM');
    }
  });

  console.log('Doubles test passed!');

  console.log('All tests passed!');
} catch (error) {
  console.error('Test failed:', error);
  // We don't call process.exit to avoid type issues; just let the error propagate.
  throw error;
}