import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tournamentService } from '@/features/tournaments/services/tournamentService';
import TournamentListItem from '@/features/tournaments/components/TournamentListItem';
import { Tournament } from '@/features/tournaments/types/tournament.types';
import { useAuthStore } from '@/store/authStore';

const TournamentListPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      try {
        setLoading(true);
        const data = await tournamentService.getTournamentsByOrganizer(user.id);
        setTournaments(data);
      } catch (err) {
        setError('Failed to load tournaments');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, [user, navigate]);

  if (loading) {
    return <div className="text-center py-10">Loading tournaments...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-10">{error}</div>;
  }

  return (
    <div className="organizer-tournament-list">
      <div className="organizer-list-heading">
        <div><p>EVENT CONTROL CENTER</p><h1>My Tournaments</h1><span>Manage every tournament from one place.</span></div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/organizer/tournaments/new')}
            className="organizer-list-create"
          >
            Create Tournament
          </button>
        </div>
      </div>

      {tournaments.length === 0 ? (
        <div className="organizer-empty">
          <p>You haven't created any tournaments yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {/* Responsive grid: 1 column on small screens, 2 on medium, 3 on large */}
          <div className="organizer-tournament-grid">
            {tournaments.map((tournament) => (
              <TournamentListItem
                key={tournament.id}
                tournament={tournament}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentListPage;