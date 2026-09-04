import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Role } from '@/types/auth.types'

interface RoleRouteProps {
  roles: Role[]
  children: React.ReactNode
}

const RoleRoute = ({ roles, children }: RoleRouteProps) => {
  const { user } = useAuthStore()
  const userRole = user?.role

  if (!userRole || !roles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default RoleRoute
