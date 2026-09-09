import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PlayerPlayRequestPage = () => {
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  const [details, setDetails] = useState({ location: '', date: '', level: 'Any level', note: '' })
  const update = (key: keyof typeof details, value: string) => setDetails(current => ({ ...current, [key]: value }))

  if (submitted) return <div className="player-directory-page"><div className="player-directory-empty player-request-success"><div>✓</div><h2>Play request created</h2><p>We&apos;ll help you find badminton players for your session.</p><button type="button" onClick={() => navigate('/player/players')}>Find Players</button></div></div>

  return <div className="player-directory-page"><section className="player-directory-heading-block"><button type="button" onClick={() => navigate(-1)} className="player-page-back">←</button><p>PLAY TOGETHER</p><h1>Create Play Request</h1><span>Tell the community when and where you want to play.</span></section><form className="player-play-form" onSubmit={event => { event.preventDefault(); setSubmitted(true) }}><label>Location<input required value={details.location} onChange={event => update('location', event.target.value)} placeholder="Example: Chennai" /></label><label>Preferred date<input required type="date" value={details.date} onChange={event => update('date', event.target.value)} /></label><label>Playing level<select value={details.level} onChange={event => update('level', event.target.value)}><option>Any level</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label><label>Message<textarea value={details.note} onChange={event => update('note', event.target.value)} placeholder="Add a note for players (optional)" /></label><button className="player-request-submit" type="submit">Post Play Request <span>→</span></button></form></div>
}

export default PlayerPlayRequestPage
