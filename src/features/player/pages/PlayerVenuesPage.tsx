import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTournamentStore } from '@/features/tournaments/store/tournamentStore'

const PlayerVenuesPage = () => {
  const navigate = useNavigate()
  const tournaments = useTournamentStore(state => state.tournaments)
  const [query, setQuery] = useState('')
  const venues = useMemo(() => Array.from(new Map(tournaments.filter(t => t.status === 'PUBLISHED').map(t => [t.venueName, t])).values()).filter(t => !query || `${t.venueName} ${t.venueAddress}`.toLowerCase().includes(query.toLowerCase())), [tournaments, query])

  return <div className="player-directory-page"><section className="player-directory-heading-block"><button type="button" onClick={() => navigate(-1)} className="player-page-back">←</button><p>PLAY NEAR YOU</p><h1>Browse Venues</h1><span>Find courts hosting your next badminton match.</span></section><label className="player-directory-search"><span>⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search venues or locations" aria-label="Search venues" /></label><div className="player-directory-count">{venues.length} venues available</div><section className="player-directory-list">{venues.map(venue => <article className="player-directory-card" key={venue.venueName}><div className="player-directory-avatar">⌖</div><div><h2>{venue.venueName}</h2><p>{venue.venueAddress}</p><small>{venue.categories.length} event categories</small></div><a href={venue.mapLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue.venueName} ${venue.venueAddress}`)}`} target="_blank" rel="noreferrer" aria-label={`Open ${venue.venueName} in maps`}>↗</a></article>)}{venues.length === 0 && <div className="player-directory-empty"><h2>No venues found</h2><p>Published tournament venues will appear here.</p></div>}</section></div>
}

export default PlayerVenuesPage
