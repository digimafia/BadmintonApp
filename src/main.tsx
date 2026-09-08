import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import './styles/globals.css'

// This is a mock-only application. Bump the reset version whenever a clean
// test database is needed so stale demo fixtures and registrations cannot leak
// into a new test run.
const freshDataResetVersion = '2'
const freshDataResetKey = 'badminton-fresh-data-reset-version'
const persistedStoreKeys = [
  'badminton-auth',
  'badminton-tournaments',
  'badminton-registrations',
  'badminton-fixtures',
  'badminton-results',
  'badminton-teams',
  'badminton-doubles-registration-draft',
  'badminton-player-profile',
  'badminton-player-directory',
  'badminton-guest-players',
  'badminton-medal-history',
  'badminton-notifications',
]

if (window.localStorage.getItem(freshDataResetKey) !== freshDataResetVersion) {
  persistedStoreKeys.forEach((key) => window.localStorage.removeItem(key))
  window.localStorage.setItem(freshDataResetKey, freshDataResetVersion)
  window.location.reload()
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
