import { Tournament } from '@/features/tournaments/types/tournament.types';
import { formatDateDisplay, getStatusLabel } from '@/features/tournaments/utils/tournamentHelpers';

interface TournamentCardProps {
  tournament: Tournament;
  onClick?: () => void;
}

const TournamentCard = ({ tournament, onClick }: TournamentCardProps) => {
  const { label, color } = getStatusLabel(tournament.status);

  return (
    <div
      className={`border rounded-lg p-5 bg-white hover:shadow-lg transition-shadow cursor-pointer ${onClick ? 'hover:bg-gray-50' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{tournament.name}</h3>
          <p className="text-sm text-gray-600 truncate">
            {tournament.venueName}, {tournament.venueAddress.split(',')[0]}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${color} bg-${color.replace('text-', 'bg-')}/20`}>
            {label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
        <div>
          <p className="font-medium mb-0.5">Date</p>
          <p>{formatDateDisplay(tournament.tournamentDate)}</p>
        </div>
        <div>
          <p className="font-medium mb-0.5">Format</p>
          <p>
            {tournament.format === 'KNOCKOUT' && 'Knockout'}
            {tournament.format === 'LEAGUE' && 'League'}
            {tournament.format === 'LEAGUE_KNOCKOUT' && 'League + Knockout'}
          </p>
        </div>
        <div>
          <p className="font-medium mb-0.5">Categories</p>
          <p>{tournament.categories.length}</p>
        </div>
        <div>
          <p className="font-medium mb-0.5">Status</p>
          <p>{label}</p>
        </div>
      </div>
    </div>
  );
};

export default TournamentCard;