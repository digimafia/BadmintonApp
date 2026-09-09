import { useMemo, useState } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { usePlayerProfileStore } from '@/features/player/store/playerProfileStore'
import { useMedalHistoryStore } from '@/features/medals/store/medalHistoryStore'
import PlayerProfileForm from '@/features/player/components/PlayerProfileForm'
import { AppIcon } from '@/components/mobile/MobileAppShell'
import ref2Image from '@/assets/ref2.png'
import playerCardImage from '@/assets/playercard.png'

const PlayerProfilePage = () => {
  const { profile, hasProfile } = usePlayerProfileStore()
  const navigate = useNavigate()
  const location = useLocation()
  const isEditRoute = location.pathname === '/player/profile/edit'
  const [tab, setTab] = useState('Profile')
  const medalHistory = useMedalHistoryStore(state => state.medalHistory)
  const medals = useMemo(() => profile ? medalHistory.filter(medal => medal.playerId === profile.id) : [], [medalHistory, profile?.id])

  if (!hasProfile && isEditRoute) return <Navigate to="/player/profile" replace />
  if (!hasProfile) return <PlayerProfileForm onProfileCreated={() => navigate('/player/profile', { replace: true })} />
  if (isEditRoute && profile) return <PlayerProfileForm profile={profile} onProfileCreated={() => navigate('/player/profile', { replace: true })} />
  if (!profile) return null

  const initials = profile.fullName.split(' ').map(name => name[0]).join('').slice(0, 2).toUpperCase()
  const stats = [
    ['28', 'Age'],
    [profile.location.split(',')[0] || 'Chennai', 'Location'],
    [profile.experienceYears >= 6 ? 'Intermediate' : 'Beginner', 'Skill Level'],
    ['Right Handed', 'Play Style'],
  ]

  return <div className="player-profile-reference">
    <section className="player-profile-hero" style={{ backgroundImage: `linear-gradient(90deg, rgb(5 24 26 / .8) 0%, rgb(5 24 26 / .2) 58%, rgb(5 24 26 / .05) 100%), url(${ref2Image})` }}><button type="button" onClick={() => navigate('/player/dashboard')} className="player-profile-back">←</button><button type="button" className="player-profile-share" aria-label="Share profile">⌯</button><div className="player-profile-hero-info"><div className="player-profile-photo">{profile.profilePhoto ? <img src={profile.profilePhoto} alt="Profile" /> : initials}<i /></div><div><h1>{profile.fullName} <b>✓</b></h1><p>Play · Connect · Compete</p><strong>{profile.playerCode}</strong></div></div></section>
    <div className="player-profile-stats">{stats.map(([value, label]) => <span key={label}><b>{value}</b>{label}</span>)}</div>
    <div className="player-profile-tabs">{['Profile', 'Registrations', 'Achievements'].map(item => <button key={item} className={tab === item ? 'is-active' : ''} onClick={() => setTab(item)}>{item}</button>)}</div>
    {tab === 'Profile' && <><section className="player-profile-section"><div className="player-profile-heading"><h2>About Me</h2><button type="button" onClick={() => navigate('/player/profile/edit')}>✎</button></div><p>Passionate about badminton and always up for friendly matches or tournament practice. Looking for doubles partners to play and improve together!</p></section><section className="player-profile-section"><h2>Preferred Events</h2><div className="player-profile-pills"><b>Men&apos;s Doubles</b><span>Mixed Doubles</span><span>Friendly Match</span></div></section><section className="player-profile-card" style={{ backgroundImage: `linear-gradient(90deg, rgb(5 24 26 / .5), rgb(5 24 26 / .18)), url(${playerCardImage})` }}><div className="player-profile-card-head"><strong>SMASH <em>POINT</em></strong><span>PLAYER CARD</span></div><div className="player-profile-card-main"><div className="player-profile-card-avatar">{initials}</div><div><h3>{profile.fullName} ✓</h3><p>Player ID: {profile.playerCode}</p><small>▥ Intermediate (3.5) &nbsp; ◇ Right Handed</small></div><div className="player-profile-qr">▦</div></div><div className="player-profile-card-footer">PLAY · CONNECT · COMPETE</div></section><div className="player-profile-card-actions"><button type="button">⇩ Download Player Card</button><button type="button">⌯ Share</button></div><section className="player-profile-menu">{[['Personal Information', 'Name, contact, location', 'user'], ['Playing Details', 'Skill level, playing style, preferred events', 'bracket'], ['Achievements', 'Tournaments, medals, ranking', 'trophy'], ['Bank & Payments', 'Receive prize money', 'clipboard'], ['Privacy Settings', 'Manage your visibility', 'user']].map(([title, detail, icon]) => <button key={title} type="button"><AppIcon name={icon as 'user'} /><span><b>{title}</b><small>{detail}</small></span><strong>›</strong></button>)}</section></>}
    {tab === 'Registrations' && <section className="player-profile-placeholder"><AppIcon name="clipboard" /><h2>My Registrations</h2><p>Manage your tournament entries and match schedule.</p><button type="button" onClick={() => navigate('/player/registrations')}>View Registrations →</button></section>}
    {tab === 'Achievements' && <section className="player-profile-placeholder"><AppIcon name="trophy" /><h2>Achievements</h2><p>{medals.length ? `${medals.length} tournament achievements recorded.` : 'Your medals and rankings will appear here.'}</p><button type="button" onClick={() => navigate('/player/registrations')}>Browse Tournaments →</button></section>}
  </div>
}

export default PlayerProfilePage
