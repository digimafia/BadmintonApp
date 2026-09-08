import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TournamentForm from '@/features/tournaments/components/TournamentForm';
import { useAuthStore } from '@/store/authStore';
import { Tournament } from '@/features/tournaments/types/tournament.types';

const CreateTournamentPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const isEditMode = !!tournamentId;

  const handleSubmitSuccess = (tournament: Tournament) => {
    navigate(`/organizer/tournaments/${tournament.id}`);
  };

  const handleSubmitError = (error: unknown) => {
    console.error('Tournament creation/update failed:', error);
  };

  const handleSubmitForApprovalSuccess = (tournament: Tournament) => {
    navigate(`/organizer/tournaments/${tournament.id}`);
  };

  const handleSubmitForApprovalError = (error: unknown) => {
    console.error('Tournament submission for approval failed:', error);
  };

  if (!user) {
    return <div className="text-center py-10">Redirecting to login...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
      <TournamentForm
        onSubmitSuccess={handleSubmitSuccess}
        onSubmitError={handleSubmitError}
        onSubmitForApprovalSuccess={handleSubmitForApprovalSuccess}
        onSubmitForApprovalError={handleSubmitForApprovalError}
      />
    </div>
  );
};

export default CreateTournamentPage;
