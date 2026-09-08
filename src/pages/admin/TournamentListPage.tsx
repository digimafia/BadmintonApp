import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { tournamentService } from '@/features/tournaments/services/tournamentService';
import { Tournament, TournamentStatus } from '@/features/tournaments/types/tournament.types';

const AdminTournamentListPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Admin-relevant statuses (excluding DRAFT)
  const adminStatuses: TournamentStatus[] = ['PENDING_ADMIN_APPROVAL', 'APPROVED', 'PUBLISHED', 'REJECTED'];

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        const data = await tournamentService.getTournaments();
        // Filter out DRAFT tournaments for admin list
        const filtered = data.filter(t => t.status !== 'DRAFT');
        setTournaments(filtered);
        // Apply status filter from URL
        const paramStatus = searchParams.get('status');
        if (paramStatus && adminStatuses.includes(paramStatus as TournamentStatus)) {
          setStatusFilter(paramStatus);
        }
      } catch (err) {
        console.error('Failed to fetch tournaments:', err);
        setError('Failed to load tournaments');
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, [searchParams]);

  const filteredTournaments = statusFilter === 'ALL'
    ? tournaments
    : tournaments.filter(t => t.status === statusFilter);

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    navigate(`/admin/tournaments?status=${status}`);
  };

  if (loading) {
    return <div className="p-4">Loading tournaments...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold">Tournament Review</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => handleStatusChange('ALL')}
            className={`px-3 py-1 bg-gray-200 rounded ${statusFilter === 'ALL' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-300'}`}
          >
            All
          </button>
          {adminStatuses.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-3 py-1 bg-gray-200 rounded ${statusFilter === status ? 'bg-indigo-600 text-white' : 'hover:bg-gray-300'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {filteredTournaments.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No tournaments found.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {filteredTournaments.map((tournament) => (
            <div key={tournament.id} className="p-4 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium">{tournament.name}</h3>
                <div className="flex flex-col text-sm text-gray-500 mt-1">
                  <div>Code: {tournament.tournamentCode}</div>
                  <div>Organizer: {tournament.organizerName}</div>
                  <div>Date: {new Date(tournament.tournamentDate).toLocaleDateString()}</div>
                  <div>Venue: {tournament.venueName}</div>
                  <div>Format: {tournament.format}</div>
                  <div>Categories: {tournament.categories.length}</div>
                  {tournament.submittedAt && (
                    <div>Submitted: {new Date(tournament.submittedAt).toLocaleString()}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tournament.status === 'PENDING_ADMIN_APPROVAL'
                      ? 'bg-yellow-100 text-yellow-800'
                      : tournament.status === 'APPROVED'
                      ? 'bg-green-100 text-green-800'
                      : tournament.status === 'PUBLISHED'
                      ? 'bg-blue-100 text-blue-800'
                      : tournament.status === 'REJECTED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {tournament.status}
                </span>
                {tournament.status === 'PENDING_ADMIN_APPROVAL' && (
                  <>
                    <button
                      onClick={() => navigate(`/admin/tournaments/${tournament.id}`)}
                      className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                    >
                      Review
                    </button>
                  </>
                )}
                {tournament.status === 'APPROVED' && (
                  <>
                    <button
                      onClick={() => navigate(`/admin/tournaments/${tournament.id}`)}
                      className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/admin/tournaments/${tournament.id}`)}
                      className="ml-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Publish
                    </button>
                  </>
                )}
                {(tournament.status === 'PUBLISHED' || tournament.status === 'REJECTED') && (
                  <button
                    onClick={() => navigate(`/admin/tournaments/${tournament.id}`)}
                    className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                  >
                    View
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTournamentListPage;