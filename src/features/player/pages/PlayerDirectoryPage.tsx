import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppIcon } from '@/components/mobile/MobileAppShell'
import { usePlayerDirectoryStore } from '@/features/player/store/playerDirectoryStore'

const PlayerDirectoryPage = () => {
  const navigate = useNavigate()
  const profiles = usePlayerDirectoryStore(state => state.profiles)
  const ensureDemoProfiles = usePlayerDirectoryStore(state => state.ensureDemoProfiles)
  const [query, setQuery] = useState('')
  const [gender, setGender] = useState('All')
  const [level, setLevel] = useState('Skill Level')
  const [connectedIds, setConnectedIds] = useState<string[]>([])

  useEffect(() => { ensureDemoProfiles() }, [ensureDemoProfiles])

  const activeProfiles = useMemo(() => profiles.filter(profile => profile.profileStatus === 'ACTIVE').filter(profile => !query || `${profile.fullName} ${profile.playerCode} ${profile.location}`.toLowerCase().includes(query.toLowerCase())).filter(profile => gender === 'All' || profile.gender === gender).filter(profile => level === 'Skill Level' || (level === 'Intermediate' ? profile.experienceYears >= 6 : profile.experienceYears < 6)), [profiles, query, gender, level])

  return (
    <div className="player-directory-page">
      <section className="player-directory-heading-block player-directory-heading-block--compact">
        <button type="button" onClick={() => navigate(-1)} className="player-page-back">←</button>
        <h1>Find Players</h1>
        <span>Connect with players who match your game.</span>
      </section>
      <div className="player-directory-tabs"><button className="is-active">Players</button><button onClick={() => navigate('/player/play-request')}>Play Requests <b>3</b></button></div>
      <label className="player-directory-search"><span>⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by name, location, or level..." aria-label="Search players" /><button type="button" aria-label="Open filters">☷</button></label>
      <div className="player-directory-filters"><button className="is-active">Near Me</button><select value={level} onChange={event => setLevel(event.target.value)} aria-label="Filter by skill level"><option>Skill Level</option><option>Beginner</option><option>Intermediate</option></select><button>Play Style⌄</button><select value={gender} onChange={event => setGender(event.target.value)} aria-label="Filter by gender"><option value="All">Gender</option><option value="MALE">Men</option><option value="FEMALE">Women</option></select></div>
      <div className="player-directory-count"><div><strong>Players Near You</strong><span>12+ players in Chennai</span></div><button type="button">Sort⌄</button></div>
      <section className="player-directory-list">
        {activeProfiles.map(profile => <article key={profile.id} className="player-directory-card"><div className="player-directory-avatar">{profile.profilePhoto ? <img src={profile.profilePhoto} alt="" /> : profile.fullName.split(' ').map(name => name[0]).join('').slice(0, 2).toUpperCase()}</div><div className="player-directory-card__copy"><h2>{profile.fullName}</h2><p>{profile.experienceYears >= 6 ? 'Intermediate' : 'Beginner'} <b>★ {4.5 + (profile.id.length % 5) / 10}</b> <span>⌖ {2 + (profile.id.length % 7)} km</span></p><div><small>{profile.gender === 'FEMALE' ? "Women's Doubles" : "Men's Doubles"}</small><small>{profile.experienceYears >= 6 ? 'Friendly Match' : 'Mixed'}</small></div></div><button className="player-directory-connect" type="button" onClick={() => setConnectedIds(current => current.includes(profile.id) ? current.filter(id => id !== profile.id) : [...current, profile.id])}>{connectedIds.includes(profile.id) ? 'Connected' : 'Connect'}</button><button className="player-directory-more" type="button" onClick={() => navigate(`/player/players/${profile.id}`)} aria-label={`View ${profile.fullName}`}>⋮</button></article>)}
        {activeProfiles.length === 0 && <div className="player-directory-empty"><AppIcon name="user" /><h2>No players found</h2><p>Try another name or complete your profile to appear in the directory.</p><button type="button" onClick={() => navigate('/player/profile')}>Open my profile</button></div>}
      </section>
    </div>
  )
}

export default PlayerDirectoryPage
