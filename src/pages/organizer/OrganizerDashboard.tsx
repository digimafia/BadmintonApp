import { Link } from 'react-router-dom'

const OrganizerDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Organizer Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-lg p-6 bg-white hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Tournaments</h2>
          <p className="text-gray-600 mb-4">
            Manage your badminton tournaments. Create new tournaments, view existing ones, and submit them for approval.
          </p>
          <Link
            to="/organizer/tournaments"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Manage Tournaments
          </Link>
        </div>

        <div className="border rounded-lg p-6 bg-white hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Tournaments</span>
              <span className="text-lg font-bold">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Draft Tournaments</span>
              <span className="text-lg font-bold">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Pending Approval</span>
              <span className="text-lg font-bold">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrganizerDashboard
