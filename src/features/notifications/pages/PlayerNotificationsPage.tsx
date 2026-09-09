import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotificationStore } from '@/features/notifications/services/notificationStore'
import { useAuthStore } from '@/store/authStore'

const sampleMessages = [
  { id: 'sample-arun', name: 'Arun Kumar', message: 'Hey! Are you available for doubles this weekend?', time: '2 min ago', unread: 2, avatar: 'AK', type: 'Players' },
  { id: 'sample-priya', name: 'Priya S', message: 'That sounds great! 👍', time: '10 min ago', unread: 0, avatar: 'PS', type: 'Players' },
  { id: 'sample-league', name: 'Chennai Smash League', message: 'Your registration has been confirmed for Chennai Smash League!', time: '1 hour ago', unread: 0, avatar: 'CS', type: 'Organizers' },
  { id: 'sample-vignesh', name: 'Vignesh R', message: 'Shall we practice tomorrow at 7 PM?', time: '2 hours ago', unread: 0, avatar: 'VR', type: 'Players' },
  { id: 'sample-sneha', name: 'Sneha K', message: 'Looking for a mixed doubles partner for Riverside Open.', time: '3 hours ago', unread: 0, avatar: 'SK', type: 'Players' },
  { id: 'sample-riverside', name: 'Riverside Open 2025', message: 'Important update: Venue details and match schedule released.', time: '5 hours ago', unread: 0, avatar: 'RO', type: 'Organizers' },
  { id: 'sample-karthik', name: 'Karthik M', message: 'Nice game today! Let’s play again next week.', time: '1 day ago', unread: 0, avatar: 'KM', type: 'Players' },
]

const PlayerNotificationsPage = () => {
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)
  const notifications = useNotificationStore(state => state.notifications)
  const markAsRead = useNotificationStore(state => state.markAsRead)
  const [tab, setTab] = useState('All')
  const [readIds, setReadIds] = useState<string[]>([])
  const realMessages = useMemo(() => notifications.filter(item => item.recipientId === user?.id && item.recipientRole === 'PLAYER').map(item => ({ id: item.id, name: 'SmashPoint Updates', message: item.message, time: 'Recently', unread: item.isRead ? 0 : 1, avatar: 'SP', type: 'Organizers' })), [notifications, user])
  const messages = [...realMessages, ...sampleMessages].filter(item => tab === 'All' || item.type === tab || (tab === 'Groups' && item.type === 'Organizers'))

  return <div className="player-messages-page"><header className="player-messages-header"><div><h1>Messages</h1><span>Stay connected with your badminton community.</span></div><div><button type="button" aria-label="Search messages">⌕</button><button type="button" aria-label="More options">•••</button></div></header><div className="player-message-tabs">{['All', 'Players', 'Organizers', 'Groups'].map(item => <button key={item} className={tab === item ? 'is-active' : ''} onClick={() => setTab(item)}>{item}{item === 'All' && <b>3</b>}</button>)}</div><section className="player-message-list">{messages.map(message => <button key={message.id} type="button" className={`player-message-row ${message.unread && !readIds.includes(message.id) ? 'is-unread' : ''}`} onClick={() => { setReadIds(current => [...current, message.id]); if (!message.id.startsWith('sample-')) markAsRead(message.id) }}><span className="player-message-avatar">{message.avatar}<i /></span><span className="player-message-copy"><strong>{message.name}</strong><small>{message.message}</small></span><span className="player-message-meta"><small>{message.time}</small>{message.unread > 0 && !readIds.includes(message.id) && <b>{message.unread}</b>}</span></button>)} </section><button type="button" className="player-message-compose" onClick={() => navigate('/player/players')}>＋</button></div>
}

export default PlayerNotificationsPage
