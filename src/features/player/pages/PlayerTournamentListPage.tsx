import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTournamentStore } from '@/features/tournaments/store/tournamentStore'
import { formatDateDisplay } from '@/features/tournaments/utils/tournamentHelpers'
import ref2Image from '@/assets/ref2.png'
import ref1Image from '@/assets/ref1.png'
import ref3Image from '@/assets/ref3.png'

const tournamentArt = [ref1Image, ref3Image, ref3Image]

const PlayerTournamentListPage = () => {
  const navigate = useNavigate()
  const tournaments = useTournamentStore(state => state.tournaments)
  const ensureDemoTournaments = useTournamentStore(state => state.ensureDemoTournaments)
  const [tab, setTab] = useState('Upcoming')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  useEffect(() => { ensureDemoTournaments() }, [ensureDemoTournaments])
  const events = useMemo(() => tournaments.filter(t => t.status === 'PUBLISHED').filter(t => !query || `${t.name} ${t.venueName}`.toLowerCase().includes(query.toLowerCase())).filter(t => filter === 'All' || t.categories.some(category => filter === 'Singles' ? category.eventType === 'SINGLES' : filter === 'Doubles' ? category.eventType === 'DOUBLES' : category.name.toLowerCase().includes(filter.toLowerCase()))), [tournaments, query, filter])

  return <div className="player-tournament-reference"><header className="player-tournament-header"><button type="button" onClick={() => navigate('/player/dashboard')}>←</button><div><p>⌖ Chennai⌄</p><h1>Tournaments</h1><span>Discover and join badminton tournaments<br />near you and across India.</span></div><button type="button" aria-label="Notifications">♧</button></header><div className="player-tournament-tabs">{['Upcoming', 'My Registrations', 'Past'].map(item => <button key={item} className={tab === item ? 'is-active' : ''} onClick={() => setTab(item)}>{item}</button>)}</div>{tab === 'Upcoming' && <><label className="player-tournament-search"><span>⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search tournaments..." /><button type="button">☷</button></label><div className="player-tournament-filters">{['All', 'Singles', 'Doubles', 'Mixed', 'Beginner'].map(item => <button key={item} className={filter === item ? 'is-active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div><section className="player-tournament-cards">{events.map((tournament, index) => <button key={tournament.id} type="button" className={`player-tournament-card player-tournament-card--${index % 3}`} style={{ backgroundImage: `linear-gradient(90deg, rgb(8 28 29 / .96) 0%, rgb(8 28 29 / .74) 43%, rgb(8 28 29 / .1) 100%), url(${tournamentArt[index % tournamentArt.length]})` }} onClick={() => navigate(`/player/tournaments/${tournament.id}`)}><div><span className="player-tournament-featured">{index === 0 ? 'Featured' : 'Live Registrations'}</span><h2>{tournament.name}</h2><p>▣ {formatDateDisplay(tournament.tournamentDate)}</p><p>⌖ {tournament.venueName}, {tournament.venueAddress}</p><div>{tournament.categories.slice(0, 3).map(category => <small key={category.id}>{category.name}</small>)}</div></div><strong>→</strong></button>)}{events.length === 0 && <div className="player-profile-placeholder"><h2>No tournaments found</h2><p>Try changing your search or filters.</p></div>}</section></>}{tab !== 'Upcoming' && <section className="player-profile-placeholder"><h2>{tab}</h2><p>Your {tab.toLowerCase()} will appear here.</p><button type="button" onClick={() => navigate('/player/registrations')}>Open My Registrations →</button></section>}</div>
}

export default PlayerTournamentListPage
