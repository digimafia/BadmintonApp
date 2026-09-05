import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tournamentService } from '@/features/tournaments/services/tournamentService';
import { Tournament } from '@/features/tournaments/types/tournament.types';

const AdminTournamentReviewPage = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Helper to safely extract error message from unknown error
  const getErrorMessage = (error: unknown, fallback: string): string => {
    return error instanceof Error ? error.message : fallback;
  };

  useEffect(() => {
    const fetchTournament = async () => {
      if (!tournamentId) {
        setError('Tournament ID is required');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await tournamentService.getTournamentById(tournamentId);
        if (data) {
          setTournament(data);
        } else {
          setError('Tournament not found');
        }
      } catch (err) {
        console.error('Failed to fetch tournament:', err);
        setError(getErrorMessage(err, 'Failed to load tournament'));
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [tournamentId]);

  const handleApprove = async () => {
    if (!tournament) return;
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const updated = await tournamentService.approveTournament(tournamentId);
      setTournament(updated);
      setActionSuccess('Tournament approved successfully');
    } catch (err) {
      setActionError(getErrorMessage(err, 'Failed to approve tournament'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!tournament) return;
    const reason = rejectionReason.trim();
    if (!reason) {
      setActionError('Rejection reason is required');
      return;
    }
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const updated = await tournamentService.rejectTournament(tournamentId, reason);
      setTournament(updated);
      setActionSuccess('Tournament rejected successfully');
      setRejectionReason(''); // Clear the reason after success
    } catch (err) {
      setActionError(getErrorMessage(err, 'Failed to reject tournament'));
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!tournament) return;
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const updated = await tournamentService.publishTournament(tournamentId);
      setTournament(updated);
      setActionSuccess('Tournament published successfully');
    } catch (err) {
      setActionError(getErrorMessage(err, 'Failed to publish tournament'));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading tournament...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (!tournament) {
    return <div className="p-4 text-center">No tournament data.</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tournament Review</h1>
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
          <button
            onClick={() => navigate('/admin/tournaments')}
            className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
          >
            Back to List
          </button>
        </div>
      </div>

      {actionError && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
          {actionError}
        </div>
      )}

      {actionSuccess && (
        <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700">
          {actionSuccess}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-2">Tournament Details</h2>
          <p className="text-gray-600">{tournament.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Tournament Code</h3>
            <p className="text-gray-700">{tournament.tournamentCode}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">Organizer</h3>
            <p className="text-gray-700">{tournament.organizerName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">Status</h3>
            <p className="text-gray-700">{tournament.status}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">Description</h3>
            <p className="text-gray-700">{tournament.description}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">Tournament Date</h3>
            <p className="text-gray-700">{new Date(tournament.tournamentDate).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">Reporting Time</h3>
            <p className="text-gray-700">{tournament.reportingTime}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">Registration Closing Date</h3>
            <p className="text-gray-700">{new Date(tournament.registrationCloseDate).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">Registration Closing Time</h3>
            <p className="text-gray-700">{tournament.registrationCloseTime}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">Venue Name</h3>
            <p className="text-gray-700">{tournament.venueName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">Venue Address</h3>
            <p className="text-gray-700">{tournament.venueAddress}</p>
          </div>
          {tournament.mapLink && (
            <div>
              <h3 className="text-sm font-medium mb-1">Map Link</h3>
              <p className="text-gray-700 break-all">{tournament.mapLink}</p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium mb-1">Format</h3>
            <p className="text-gray-700">{tournament.format}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">Categories Count</h3>
            <p className="text-gray-700">{tournament.categories.length}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">Submitted At</h3>
            <p className="text-gray-700">
              {tournament.submittedAt ? new Date(tournament.submittedAt).toLocaleString() : 'Not submitted'}
            </p>
          </div>
          {tournament.approvedAt && (
            <div>
              <h3 className="text-sm font-medium mb-1">Approved At</h3>
              <p className="text-gray-700">{new Date(tournament.approvedAt).toLocaleString()}</p>
            </div>
          )}
          {tournament.rejectedAt && (
            <div>
              <h3 className="text-sm font-medium mb-1">Rejected At</h3>
              <p className="text-gray-700">{new Date(tournament.rejectedAt).toLocaleString()}</p>
            </div>
          )}
          {tournament.publishedAt && (
            <div>
              <h3 className="text-sm font-medium mb-1">Published At</h3>
              <p className="text-gray-700">{new Date(tournament.publishedAt).toLocaleString()}</p>
            </div>
          )}
        </div>

        {tournament.generalRules.length > 0 && (
          <div>
            <h2 className="text-lg font-medium mb-2">General Rules</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {tournament.generalRules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>
        )}

        {tournament.categories.length > 0 && (
          <div>
            <h2 className="text-lg font-medium mb-2">Categories</h2>
            <div className="space-y-4">
              {tournament.categories.map((category, index) => (
                <div key={index} className="border p-4 rounded bg-gray-50">
                  <h3 className="font-medium mb-2">{category.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium mb-1">Event Type</p>
                      <p>{category.eventType === 'SINGLES' ? 'Singles' : 'Doubles'}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Medalists Allowed</p>
                      <p>{category.medalistsAllowed ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Open Players Allowed</p>
                      <p>{category.openPlayersAllowed ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Beginner Only</p>
                      <p>{category.beginnerOnly ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Pure Beginner Only</p>
                      <p>{category.pureBeginnerOnly ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  {category.additionalRuleNotes && (
                    <div className="mt-3">
                      <p className="font-medium mb-1">Additional Rule Notes</p>
                      <p className="text-gray-600">{category.additionalRuleNotes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tournament.prizes && (
          <div>
            <h2 className="text-lg font-medium mb-2">Prize Details</h2>
            <p className="text-gray-600">{tournament.prizes}</p>
          </div>
        )}

        {tournament.shuttle && (
          <div>
            <h2 className="text-lg font-medium mb-2">Shuttle Details</h2>
            <p className="text-gray-600">{tournament.shuttle}</p>
          </div>
        )}

        {tournament.scoringFormat && (
          <div>
            <h2 className="text-lg font-medium mb-2">Scoring Format</h2>
            <p className="text-gray-600">{tournament.scoringFormat}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 pt-4 border-t">
        {tournament.status === 'PENDING_ADMIN_APPROVAL' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Actions</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className={`px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {actionLoading ? 'Approving...' : 'Approve'}
                </button>
                <div className="flex-1 space-x-3">
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter rejection reason (minimum 5 characters recommended)"
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                  />
                  <button
                    onClick={handleReject}
                    disabled={actionLoading}
                    className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {actionLoading ? 'Rejecting...' : 'Reject'}
                  </button>
                </div>
              </div>
              {tournament.rejectionReason && (
                <div className="mt-3 p-3 bg-red-50 rounded">
                  <p className="font-medium mb-1">Rejection Reason:</p>
                  <p className="text-gray-600">{tournament.rejectionReason}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {tournament.status === 'APPROVED' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-2">Actions</h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePublish}
                disabled={actionLoading}
                className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {actionLoading ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTournamentReviewPage;