import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tournamentService } from '@/features/tournaments/services/tournamentService';
import { TournamentStatus } from '@/features/tournaments/types/tournament.types';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    published: 0,
    rejected: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const tournaments = await tournamentService.getTournaments();
        const pending = tournaments.filter(t => t.status === 'PENDING_ADMIN_APPROVAL').length;
        const approved = tournaments.filter(t => t.status === 'APPROVED').length;
        const published = tournaments.filter(t => t.status === 'PUBLISHED').length;
        const rejected = tournaments.filter(t => t.status === 'REJECTED').length;
        const total = tournaments.length;
        setStats({ pending, approved, published, rejected, total });
      } catch (err) {
        console.error('Failed to fetch tournament stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Pending Approval</h3>
          <p className="text-3xl font-bold">{stats.pending}</p>
          <button
            onClick={() => navigate('/admin/tournaments?status=PENDING_ADMIN_APPROVAL')}
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Review
          </button>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Approved</h3>
          <p className="text-3xl font-bold">{stats.approved}</p>
          <button
            onClick={() => navigate('/admin/tournaments?status=APPROVED')}
            className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
          >
            View
          </button>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Published</h3>
          <p className="text-3xl font-bold">{stats.published}</p>
          <button
            onClick={() => navigate('/admin/tournaments?status=PUBLISHED')}
            className="mt-2 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
          >
            View
          </button>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Rejected</h3>
          <p className="text-3xl font-bold">{stats.rejected}</p>
          <button
            onClick={() => navigate('/admin/tournaments?status=REJECTED')}
            className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            View
          </button>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Total Tournaments</h3>
          <p className="text-3xl font-bold">{stats.total}</p>
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