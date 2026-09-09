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
    <div className="organizer-form-shell">
      <div className="organizer-form-topbar"><button type="button" onClick={() => navigate(-1)} aria-label="Go back">←</button><h1>{isEditMode ? 'Edit Tournament' : 'Create Tournament'}</h1><span>⋯</span></div>
      <div className="organizer-form-steps"><div className="organizer-form-step is-active"><b>1</b>Basic Info</div><div className="organizer-form-step"><b>2</b>Events &amp; Categories</div><div className="organizer-form-step"><b>3</b>Venue &amp; Schedule</div><div className="organizer-form-step"><b>4</b>Review &amp; Publish</div></div>
      <section className="organizer-form-card"><h2>Basic Information</h2><p>Set up the details players will see on your tournament page.</p>
      <TournamentForm
        onSubmitSuccess={handleSubmitSuccess}
        onSubmitError={handleSubmitError}
        onSubmitForApprovalSuccess={handleSubmitForApprovalSuccess}
        onSubmitForApprovalError={handleSubmitForApprovalError}
      />
      </section>
    </div>
  );
};

export default CreateTournamentPage;
