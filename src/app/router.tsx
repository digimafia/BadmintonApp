import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/pages/public/HomePage'
import LoginPage from '@/pages/public/LoginPage'
import PlayerDashboard from '@/pages/player/PlayerDashboard'
import OrganizerDashboard from '@/pages/organizer/OrganizerDashboard'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import NotFoundPage from '@/pages/errors/NotFoundPage'
import UnauthorizedPage from '@/pages/errors/UnauthorizedPage'
import ProtectedRoute from '@/routes/ProtectedRoute'
import RoleRoute from '@/routes/RoleRoute'
import PlayerLayout from '@/layouts/PlayerLayout'
import OrganizerLayout from '@/layouts/OrganizerLayout'
import AdminLayout from '@/layouts/AdminLayout'
import PlayerProfilePage from '@/features/player/pages/PlayerProfilePage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/player',
    element: (
      <ProtectedRoute>
        <RoleRoute roles={[ 'PLAYER' ]}>
          <PlayerLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <PlayerDashboard /> },
      { path: 'dashboard', element: <PlayerDashboard /> },
      { path: 'profile', element: <PlayerProfilePage /> },
      { path: 'profile/edit', element: <PlayerProfilePage /> }
    ]
  },
  {
    path: '/organizer',
    element: (
      <ProtectedRoute>
        <RoleRoute roles={[ 'ORGANIZER' ]}>
          <OrganizerLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <OrganizerDashboard /> },
      { path: 'dashboard', element: <OrganizerDashboard /> }
    ]
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <RoleRoute roles={[ 'ADMIN' ]}>
          <AdminLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'dashboard', element: <AdminDashboard /> }
    ]
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router
