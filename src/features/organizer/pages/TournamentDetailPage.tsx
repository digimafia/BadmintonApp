import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tournamentService } from '@/features/tournaments/services/tournamentService';
import { Tournament } from '@/features/tournaments/types/tournament.types';
import { formatDateDisplay, formatTimeDisplay, getStatusLabel } from '@/features/tournaments/utils/tournamentHelpers';
import { useAuthStore } from '@/store/authStore';
import { useRegistrationStore } from '@/features/registrations/store/registrationStore';

const TournamentDetailPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const registrations = useRegistrationStore(state => state.registrations)

  useEffect(() => {
    const fetchTournament = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      if (!tournamentId) {
        setError('Tournament ID is required');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await tournamentService.getTournamentById(tournamentId);
        if (data) {
          // Check if the organizer owns this tournament
          if (data.organizerId !== user.id) {
            navigate('/unauthorized');
            return;
          }
          setTournament(data);
        } else {
          setError('Tournament not found');
        }
      } catch (err) {
        setError('Failed to load tournament');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [user, navigate, tournamentId]);

  if (loading) {
    return <div className="text-center py-10">Loading tournament...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-10">{error}</div>;
  }

  if (!tournament) {
    return <div className="text-center py-10">No tournament data.</div>;
  }

  const { label, color } = getStatusLabel(tournament.status);

  const handleEdit = () => {
    navigate(`/organizer/tournaments/${tournament.id}/edit`);
  };

  const handleSubmitForApproval = async () => {
    setSubmitError(null);
    try {
      await tournamentService.submitTournamentForApproval(tournament.id);
      // Refetch the tournament to update status
      const updated = await tournamentService.getTournamentById(tournament.id);
      if (updated) {
        setTournament(updated);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit tournament for approval';
      setSubmitError(errorMessage);
      console.error('Failed to submit tournament for approval:', err);
    }
  };

  return (
    <div className="organizer-detail-page">
      <section className="organizer-detail-hero"><button type="button" onClick={() => navigate('/organizer/tournaments')} className="organizer-detail-back">←</button><span className="organizer-status-pill">{label}</span><h1>{tournament.name}</h1><p>PLAY · COMPETE · CONNECT</p><div className="organizer-detail-meta"><div><b>Event date</b><span>{formatDateDisplay(tournament.tournamentDate)}</span></div><div><b>Venue</b><span>{tournament.venueName}</span></div></div></section>
      <div className="organizer-detail-tabs"><button className="is-active">Overview</button><button onClick={() => navigate(`/organizer/tournaments/${tournament.id}/registrations`)}>Players</button><button onClick={() => navigate(`/organizer/tournaments/${tournament.id}/registrations`)}>Matches</button><button>Payments</button><button>More</button></div>
      <div className="organizer-detail-metrics"><div><b>{registrations.filter(item => item.tournamentId === tournament.id).length}</b><span>Registrations</span></div><div><b>₹{registrations.filter(item => item.tournamentId === tournament.id).length * 1250 || '42,500'}</b><span>Collected</span></div><div><b>{tournament.categories.length}</b><span>Events</span></div><div><b>{Math.max(0, Math.ceil((new Date(`${tournament.tournamentDate}T00:00:00`).getTime() - Date.now()) / 86400000))}</b><span>Days Left</span></div></div>
      <div className="organizer-detail-actions"><button onClick={handleEdit}>✎<span>Edit Details</span></button><button onClick={() => navigate(`/organizer/tournaments/${tournament.id}/registrations`)}>♙<span>View Players</span></button><button onClick={() => navigate(`/organizer/tournaments/${tournament.id}/registrations`)}>☷<span>Manage Events</span></button><button onClick={() => navigate('/organizer/notifications')}>⌁<span>Send Notifications</span></button></div>

      <div className="organizer-detail-body border rounded-lg p-6 bg-white mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-medium text-gray-700">Status</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
              {label}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            {/* Edit button - only show for draft tournaments */}
            {tournament.status === 'DRAFT' && (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Edit
              </button>
            )}

            {/* Submit for Approval button - only show for draft tournaments */}
            {tournament.status === 'DRAFT' && (
              <button
                onClick={handleSubmitForApproval}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Submit for Approval
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm text-gray-700">
          <div>
            <p className="font-medium mb-1">Date</p>
            <p>{formatDateDisplay(tournament.tournamentDate)}</p>
          </div>
          <div>
            <p className="font-medium mb-1">Reporting Time</p>
            <p>{formatTimeDisplay(tournament.reportingTime)}</p>
          </div>
          <div>
            <p className="font-medium mb-1">Venue</p>
            <p>{tournament.venueName}</p>
            <p className="mt-1 text-gray-500">{tournament.venueAddress}</p>
          </div>
          <div>
            <p className="font-medium mb-1">Format</p>
            <p>
              {tournament.format === 'KNOCKOUT' && 'Knockout'}
              {tournament.format === 'LEAGUE' && 'League'}
              {tournament.format === 'LEAGUE_KNOCKOUT' && 'League + Knockout'}
            </p>
          </div>
          <div>
            <p className="font-medium mb-1">Categories</p>
            <p>{tournament.categories.length} category{tournament.categories.length !== 1 && 'ies'}</p>
          </div>
          <div>
            <p className="font-medium mb-1">Registration Close Date</p>
            <p>{formatDateDisplay(tournament.registrationCloseDate)}</p>
          </div>
          <div>
            <p className="font-medium mb-1">Registration Close Time</p>
            <p>{formatTimeDisplay(tournament.registrationCloseTime)}</p>
          </div>
        </div>

        {tournament.description && (
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-700 mb-2">Description</h2>
            <p className="text-gray-600">{tournament.description}</p>
          </div>
        )}

        {Array.isArray(tournament.generalRules) && tournament.generalRules.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-700 mb-2">General Rules</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {tournament.generalRules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>
        )}

        {tournament.categories.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-700 mb-2">Categories</h2>
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
                  <button onClick={() => navigate(`/organizer/tournaments/${tournament.id}/categories/${category.id}`)} className="mt-4 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-600">
                    View registrations & fixture shuffle →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tournament.prizes && (
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-700 mb-2">Prizes</h2>
            <p className="text-gray-600">{tournament.prizes}</p>
          </div>
        )}

        {tournament.shuttle && (
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-700 mb-2">Shuttle Type</h2>
            <p className="text-gray-600">{tournament.shuttle}</p>
          </div>
        )}

        {tournament.scoringFormat && (
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-700 mb-2">Scoring Format</h2>
            <p className="text-gray-600">{tournament.scoringFormat}</p>
          </div>
        )}

        {submitError && (
          <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
            {submitError}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => navigate('/organizer/tournaments')}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mr-2"
        >
          Back to List
        </button>
      </div>
    </div>
  );
};

export default TournamentDetailPage;
