import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useTournamentStore } from '@/features/tournaments/store/tournamentStore'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDoublesFixtureDemo } from '@/features/tournaments/services/demoTournamentService'
import { useRegistrationStore } from '@/features/registrations/store/registrationStore'
import { AppIcon } from '@/components/mobile/MobileAppShell'

const OrganizerDashboard = () => {
  const user = useAuthStore(state => state.user)
  const tournaments = useTournamentStore(state => state.tournaments)
  const navigate = useNavigate()
  const ensureDemoTournaments = useTournamentStore(state => state.ensureDemoTournaments)

  useEffect(() => {
    if (user) ensureDemoTournaments(user)
  }, [user, ensureDemoTournaments])

  // Get tournaments for the current organizer
  const organizerTournaments = useMemo(() => {
    if (!user) {
      return []
    }

    return tournaments.filter(
      tournament => tournament.organizerId === user.id
    )
  }, [tournaments, user])

  // Calculate stats
  const totalTournaments = organizerTournaments.length
  const draftTournaments = organizerTournaments.filter(t => t.status === 'DRAFT').length
  const pendingApprovalTournaments = organizerTournaments.filter(t => t.status === 'PENDING_ADMIN_APPROVAL').length
  const publishedTournaments = organizerTournaments.filter(t => t.status === 'PUBLISHED').length
  const registrations = useRegistrationStore(state => state.registrations)
  const totalRegistrations = registrations.filter(registration => organizerTournaments.some(tournament => tournament.id === registration.tournamentId) && registration.status === 'REGISTERED').length
  const upcomingTournaments = organizerTournaments.filter(tournament => tournament.status !== 'REJECTED').sort((first, second) => first.tournamentDate.localeCompare(second.tournamentDate)).slice(0, 3)

  return <div className="organizer-dashboard">
    <section className="organizer-dashboard-welcome"><div><p>Welcome back,</p><h1>{user?.displayName || 'Organizer'}!</h1><span>Create. Manage. Grow. 🏸</span></div><Link to="/organizer/tournaments/new" className="organizer-create-button"><b>＋</b>Create Tournament</Link></section>
    <section className="organizer-dashboard-stats"><div><AppIcon name="trophy" /><b>{totalTournaments}</b><span>Total<br />Tournaments</span></div><div><AppIcon name="user" /><b>{totalRegistrations}</b><span>Total<br />Players</span></div><div><AppIcon name="clipboard" /><b>₹{totalRegistrations * 1250 || '1.25L'}</b><span>Total<br />Collections</span></div><div><span className="organizer-star">★</span><b>4.8</b><span>Avg. Rating</span></div></section>
    <section className="organizer-dashboard-section"><div className="organizer-section-heading"><h2>Upcoming Tournaments</h2><Link to="/organizer/tournaments">View All</Link></div><div className="organizer-event-list">{upcomingTournaments.map(tournament => <button key={tournament.id} type="button" onClick={() => navigate(`/organizer/tournaments/${tournament.id}`)} className="organizer-event-card"><div className="organizer-event-date"><b>{new Date(`${tournament.tournamentDate}T00:00:00`).getDate()}</b><span>{new Date(`${tournament.tournamentDate}T00:00:00`).toLocaleDateString('en-IN', { month: 'short' })}</span></div><div><h3>{tournament.name}</h3><p>⌖ {tournament.venueName}, {tournament.venueAddress}</p><small>{tournament.categories.length} categories · {tournament.status === 'PUBLISHED' ? 'Live' : tournament.status === 'DRAFT' ? 'Draft' : 'Registration'}</small></div><span>›</span></button>)}{upcomingTournaments.length === 0 && <div className="organizer-empty">Create your first tournament to see it here.</div>}</div></section>
    <section className="organizer-dashboard-section"><div className="organizer-section-heading"><h2>Quick Actions</h2></div><div className="organizer-action-grid"><Link to="/organizer/tournaments"><AppIcon name="trophy" /><span>Manage<br />Tournaments</span></Link><Link to="/organizer/tournaments"><AppIcon name="user" /><span>Players &<br />Registrations</span></Link><Link to="/organizer/tournaments"><AppIcon name="clipboard" /><span>Payments &<br />Payouts</span></Link><Link to="/organizer/tournaments"><AppIcon name="bracket" /><span>Reports &<br />Analytics</span></Link></div></section>
    <button type="button" onClick={() => navigate('/organizer/tournaments')} className="organizer-analytics-banner"><div><strong>Organize Bigger.</strong><span>Build a stronger badminton community.</span></div><span className="organizer-banner-shuttle">🏸</span></button>
    <button type="button" onClick={async () => { if (!user) return; const id = await createDoublesFixtureDemo(user); navigate(`/organizer/tournaments/${id}`) }} className="organizer-demo-button">Create 16-team doubles test tournament</button>
  </div>
}

export default OrganizerDashboard
