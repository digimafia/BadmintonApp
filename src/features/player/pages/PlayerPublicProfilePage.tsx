import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usePlayerDirectoryStore } from '@/features/player/store/playerDirectoryStore'

const PlayerPublicProfilePage = () => {
  const navigate = useNavigate()
  const { playerId } = useParams()
  const profile = usePlayerDirectoryStore(state => state.getProfileById(playerId || ''))
  const ensureDemoProfiles = usePlayerDirectoryStore(state => state.ensureDemoProfiles)
  const [connected, setConnected] = useState(false)
  const [messageSent, setMessageSent] = useState(false)

  useEffect(() => { ensureDemoProfiles() }, [ensureDemoProfiles])

  if (!profile) return <div className="player-directory-empty"><h2>Player not found</h2><button type="button" onClick={() => navigate('/player/players')}>Back to Players</button></div>

  return <div className="player-public-page"><div className="player-public-cover"><button type="button" className="player-public-back" onClick={() => navigate(-1)}>←</button><button type="button" className="player-public-menu">•••</button><div className="player-public-shuttle" aria-hidden="true">🏸</div></div><section className="player-public-content"><div className="player-public-heading"><div className="player-public-avatar">{profile.fullName.split(' ').map(name => name[0]).join('').slice(0, 2).toUpperCase()}<i /></div><h1>{profile.fullName} <b>✓</b></h1><p>⌖ {profile.location}</p><div className="player-public-actions"><button className={connected ? 'is-connected' : ''} type="button" onClick={() => setConnected(current => !current)}>{connected ? 'Connected' : 'Connect'}</button><button type="button" onClick={() => setMessageSent(true)} aria-label="Send message">▢</button><button type="button" onClick={() => setConnected(true)} aria-label="Add player">♙+</button></div></div><div className="player-public-stats"><span><b>4.8</b>Rating</span><span><b>{profile.age}</b>Age</span><span><b>{profile.experienceYears >= 6 ? 'Intermediate' : 'Beginner'}</b>Skill Level</span><span><b>Right Handed</b>Play Style</span></div><section className="player-public-section"><h2>About Me</h2><p>Passionate about badminton and always up for friendly matches or tournament practice. Looking for doubles partners to play and improve together!</p></section><section className="player-public-section"><h2>Preferred Play</h2><div className="player-public-pills"><b>{profile.gender === 'FEMALE' ? "Women's Doubles" : "Men's Doubles"}</b><span>Mixed Doubles</span><span>Friendly Match</span></div></section><section className="player-public-section"><h2>Availability</h2><div className="player-public-days"><span>Mon</span><b>Tue</b><span>Wed</span><b>Thu</b><span>Fri</span><b>Sat</b><span>Sun</span></div></section><section className="player-public-section"><h2>Location <button type="button">⌖ View on Map</button></h2><p>⌖ {profile.location}</p></section><section className="player-public-section"><h2>Achievements</h2><div className="player-public-achievements"><span>🥇<b>50+</b><small>Matches Played</small></span><span>🥇<b>5</b><small>Tournaments</small></span><span>🏆<b>3</b><small>Podiums</small></span><span>🏅<b>4.8</b><small>Player Rating</small></span></div></section><button className="player-public-message" type="button" onClick={() => setMessageSent(true)}>▢ {messageSent ? 'Message Ready' : 'Send Message'}</button></section></div>
}

export default PlayerPublicProfilePage
