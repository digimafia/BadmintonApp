import { useNavigate } from 'react-router-dom';
import { useTournamentStore } from '@/features/tournaments/store/tournamentStore';
import { useMemo } from 'react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const tournaments = useTournamentStore(state => state.tournaments);

  // Calculate stats from tournaments
  const pending = useMemo(() => {
    return tournaments.filter(t => t.status === 'PENDING_ADMIN_APPROVAL').length;
  }, [tournaments]);

  const approved = useMemo(() => {
    return tournaments.filter(t => t.status === 'APPROVED').length;
  }, [tournaments]);

  const published = useMemo(() => {
    return tournaments.filter(t => t.status === 'PUBLISHED').length;
  }, [tournaments]);

  const rejected = useMemo(() => {
    return tournaments.filter(t => t.status === 'REJECTED').length;
  }, [tournaments]);

  const total = useMemo(() => {
    return tournaments.length;
  }, [tournaments]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Pending Approval</h3>
          <p className="text-3xl font-bold">{pending}</p>
          <button
            onClick={() => navigate('/admin/tournaments?status=PENDING_ADMIN_APPROVAL')}
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Review
          </button>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Approved</h3>
          <p className="text-3xl font-bold">{approved}</p>
          <button
            onClick={() => navigate('/admin/tournaments?status=APPROVED')}
            className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
          >
            View
          </button>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Published</h3>
          <p className="text-3xl font-bold">{published}</p>
          <button
            onClick={() => navigate('/admin/tournaments?status=PUBLISHED')}
            className="mt-2 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
          >
            View
          </button>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Rejected</h3>
          <p className="text-3xl font-bold">{rejected}</p>
          <button
            onClick={() => navigate('/admin/tournaments?status=REJECTED')}
            className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            View
          </button>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Total Tournaments</h3>
          <p className="text-3xl font-bold">{total}</p>
        </div>
      </div>
      <div className="space-x-3">
        <button
          onClick={() => navigate('/admin/tournaments')}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          View All Tournaments
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;