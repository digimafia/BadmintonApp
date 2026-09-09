import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { usePlayerProfileStore } from '@/features/player/store/playerProfileStore'
import { useNotifications } from '@/features/notifications/hooks/useNotifications'
import { useTournamentStore } from '@/features/tournaments/store/tournamentStore'
import { useRegistrationStore } from '@/features/registrations/store/registrationStore'
import { formatDateDisplay } from '@/features/tournaments/utils/tournamentHelpers'
import { AppIcon } from '@/components/mobile/MobileAppShell'
import ref1Image from '@/assets/ref1.png'
import ref3Image from '@/assets/ref3.png'

const upcomingArt = [ref1Image, ref3Image, ref3Image]

const PlayerDashboard = () => {
  const user = useAuthStore(state => state.user)
  const { profile, hasProfile } = usePlayerProfileStore()
  const navigate = useNavigate()
  const { unreadCount } = useNotifications()
  const tournaments = useTournamentStore(state => state.tournaments)
  const ensureDemoTournaments = useTournamentStore(state => state.ensureDemoTournaments)
  const registrations = useRegistrationStore(state => state.registrations)
  const [query, setQuery] = useState('')
  const availableTournaments = useMemo(() => tournaments
    .filter(t => t.status === 'PUBLISHED')
    .filter(t => t.categories.some(c => c.registrationPhase === 'OPEN' && !registrations.some(r => r.tournamentId === t.id && r.categoryId === c.id && r.status === 'REGISTERED')))
    .filter(t => !query || `${t.name} ${t.venueName} ${t.venueAddress}`.toLowerCase().includes(query.toLowerCase())), [tournaments, registrations, query])
  const userRegistrations = useMemo(() => registrations.filter(r => r.playerId === profile?.id && r.status === 'REGISTERED'), [registrations, profile])
  const initials = profile?.fullName.split(' ').map(name => name[0]).join('').slice(0, 2).toUpperCase() ?? 'SP'

  useEffect(() => { ensureDemoTournaments() }, [ensureDemoTournaments])

  if (!user) return <div className="p-6 text-center">Please log in</div>

  return <div className="player-dashboard">
    <section className="player-dashboard-welcome"><div><p className="player-kicker">Good morning,</p><h1>Hello, {profile?.fullName?.split(' ')[0] || 'Sherri'}! <span>👋</span></h1><span>Let&apos;s play, connect and grow.</span></div><button className="player-dashboard-avatar" onClick={() => navigate('/player/profile')} aria-label="Open profile">{profile?.profilePhoto ? <img src={profile.profilePhoto} alt="Profile" /> : initials}</button></section>

    <div className="player-dashboard-search"><span aria-hidden="true">⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search tournaments, players, venues..." aria-label="Search tournaments, players, venues" /><button type="button" onClick={() => navigate('/player/tournaments')} aria-label="Open tournament filters">☷</button></div>

    {!hasProfile && <button type="button" onClick={() => navigate('/player/profile')} className="player-profile-prompt">Complete your player profile <span>→</span></button>}

    <section className="player-dashboard-quick-grid" aria-label="Quick access">
      <button onClick={() => navigate('/player/tournaments')}><AppIcon name="trophy" /><span>Tournaments</span></button>
      <button onClick={() => navigate('/player/players')}><AppIcon name="user" /><span>Find Players</span></button>
      <button onClick={() => navigate('/player/venues')}><AppIcon name="home" /><span>Venues</span></button>
      <button onClick={() => navigate('/player/registrations')}><AppIcon name="clipboard" /><span>My Bookings</span></button>
      <button onClick={() => navigate('/player/profile')}><AppIcon name="menu" /><span>More</span></button>
    </section>

    <button type="button" className="player-dashboard-promo" onClick={() => navigate('/player/tournaments')}><div><p>PLAY MORE</p><strong>TOGETHER</strong><span>Find partners, join tournaments.<br />Be part of the badminton community.</span><b>Explore Now <i>→</i></b></div><div className="player-promo-court" /></button>

    <section className="player-dashboard-section"><div className="player-dashboard-heading"><div><p>Find your next match</p><h2>Upcoming Tournaments</h2></div><button type="button" onClick={() => navigate('/player/tournaments')}>See All</button></div><div className="player-dashboard-tournaments">{availableTournaments.slice(0, 3).map((tournament, index) => <button key={tournament.id} type="button" onClick={() => navigate(`/player/tournaments/${tournament.id}`)} className="player-tournament-preview" style={{ backgroundImage: `linear-gradient(90deg, rgb(8 28 29 / .92), rgb(8 28 29 / .58)), url(${upcomingArt[index % upcomingArt.length]})` }}><div className="player-date-block"><b>{new Date(`${tournament.tournamentDate}T00:00:00`).getDate()}</b><span>{new Date(`${tournament.tournamentDate}T00:00:00`).toLocaleDateString('en-IN', { month: 'short' })}</span></div><div className="min-w-0 flex-1 text-left"><h3>{tournament.name}</h3><p>⌖ {tournament.venueName}, {tournament.venueAddress}</p><small>{tournament.categories.slice(0, 2).map(category => category.name).join(' · ')}</small></div><span className="player-preview-arrow">›</span></button>)}{availableTournaments.length === 0 && <div className="player-dashboard-empty"><AppIcon name="trophy" /><p>No open tournaments right now.</p><button type="button" onClick={() => navigate('/player/tournaments')}>Browse events</button></div>}</div></section>

    <section className="player-dashboard-section"><div className="player-dashboard-heading"><div><p>Stay in the game</p><h2>Quick Actions</h2></div></div><div className="player-dashboard-action-grid"><button onClick={() => navigate('/player/players')}><AppIcon name="user" /><span>Find Players</span><small>Near you</small></button><button onClick={() => navigate('/player/play-request')}><AppIcon name="plus" /><span>Create Play</span><small>Request</small></button><button onClick={() => navigate('/player/venues')}><AppIcon name="home" /><span>Browse</span><small>Venues</small></button><button onClick={() => navigate('/player/players')}><AppIcon name="bell" /><span>Join</span><small>Community</small></button></div></section>

    <section className="player-dashboard-section player-dashboard-registration"><div className="player-dashboard-heading"><div><p>Your tournament journey</p><h2>My Bookings</h2></div><button type="button" onClick={() => navigate('/player/registrations')}>See All</button></div>{userRegistrations.length ? <div className="player-registration-preview">{userRegistrations.slice(0, 2).map(registration => <div key={registration.id}><span>CONFIRMED</span><h3>{registration.categoryName}</h3><p>{registration.tournamentCode} · Registered {formatDateDisplay(registration.registeredAt)}</p></div>)}</div> : <div className="player-dashboard-empty compact"><AppIcon name="clipboard" /><p>Your confirmed entries will show here.</p></div>}</section>
  </div>
}

export default PlayerDashboard
