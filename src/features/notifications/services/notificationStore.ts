import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AppNotification, NotificationType } from '@/features/notifications/types/notification.types'

interface NotificationState {
  notifications: AppNotification[]
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'isRead' | 'readAt'>) => void
  getNotificationsForRecipient: (recipientId: string, recipientRole: 'PLAYER' | 'ORGANIZER' | 'ADMIN') => AppNotification[]
  getUnreadCount: (recipientId: string, recipientRole: 'PLAYER' | 'ORGANIZER' | 'ADMIN') => number
  markAsRead: (notificationId: string) => void
  markAllAsRead: (recipientId: string, recipientRole: 'PLAYER' | 'ORGANIZER' | 'ADMIN') => void
  removeNotification: (notificationId: string) => void
  clearRecipientNotifications: (recipientId: string, recipientRole: 'PLAYER' | 'ORGANIZER' | 'ADMIN') => void
}

const generateId = () => Math.random().toString(36).substr(2, 9)

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],

      addNotification: (notificationData) => {
        // Check for duplicate notifications based on dedupeKey
        if (notificationData.dedupeKey) {
          const existingNotification = get().notifications.find(
            n => n.dedupeKey === notificationData.dedupeKey &&
                 n.recipientId === notificationData.recipientId &&
                 n.recipientRole === notificationData.recipientRole
          )

          // If a notification with the same dedupeKey and recipient already exists, don't add a new one
          if (existingNotification) {
            return
          }
        }

        const newNotification: AppNotification = {
          ...notificationData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          isRead: false,
          readAt: null
        }

        set(state => ({
          notifications: [...state.notifications, newNotification]
        }))
      },

      getNotificationsForRecipient: (recipientId, recipientRole) => {
        return get().notifications.filter(
          n => n.recipientId === recipientId && n.recipientRole === recipientRole
        ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      },

      getUnreadCount: (recipientId, recipientRole) => {
        return get().notifications.filter(
          n => n.recipientId === recipientId &&
               n.recipientRole === recipientRole &&
               !n.isRead
        ).length
      },

      markAsRead: (notificationId) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
          )
        }))
      },

      markAllAsRead: (recipientId, recipientRole) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.recipientId === recipientId && n.recipientRole === recipientRole && !n.isRead
              ? { ...n, isRead: true, readAt: new Date().toISOString() }
              : n
          )
        }))
      },

      removeNotification: (notificationId) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== notificationId)
        }))
      },

      clearRecipientNotifications: (recipientId, recipientRole) => {
        set(state => ({
          notifications: state.notifications.filter(
            n => !(n.recipientId === recipientId && n.recipientRole === recipientRole)
          )
        }))
      }
    }),
    {
      name: 'badminton-notifications'
    }
  )
)