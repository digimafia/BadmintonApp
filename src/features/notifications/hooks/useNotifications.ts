import { useNotificationStore } from '@/features/notifications/services/notificationStore'
import { useAuthStore } from '@/store/authStore'
import { AppNotification } from '@/features/notifications/types/notification.types'
import { useMemo } from 'react'

export const useNotifications = () => {
  // Use Zustand selectors for reactivity - get stable references
  const user = useAuthStore(state => state.user)
  const notifications = useNotificationStore(state => state.notifications)
  const markAsRead = useNotificationStore(state => state.markAsRead)
  const markAllAsRead = useNotificationStore(state => state.markAllAsRead)
  const clearRecipientNotifications = useNotificationStore(state => state.clearRecipientNotifications)
  const getUnreadCount = useNotificationStore(state => state.getUnreadCount)

  // Derive user-specific notifications outside of Zustand selector
  const userNotifications = useMemo(() => {
    if (!user) {
      return []
    }

    return notifications
      .filter(notification =>
        notification.recipientId === user.id &&
        notification.recipientRole === user.role
      )
      .slice() // Create a shallow copy to avoid mutating original array
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
  }, [notifications, user])

  // Derive unread count from userNotifications
  const unreadCount = useMemo(() => {
    return userNotifications.filter(notification => !notification.isRead).length
  }, [userNotifications])

  return {
    notifications: userNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead: () => {
      if (user) {
        markAllAsRead(user.id, user.role)
      }
    },
    clear: () => {
      if (user) {
        clearRecipientNotifications(user.id, user.role)
      }
    }
  }
}