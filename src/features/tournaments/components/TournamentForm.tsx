import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  TournamentFormValues,
  TournamentCategory,
  TournamentStatus,
  TournamentFormat,
  EventType,
  Tournament
} from '@/features/tournaments/types/tournament.types';
import { tournamentService } from '@/features/tournaments/services/tournamentService';
import {
  validateTournamentDates,
  validateCategories,
  validateCategoryEventTypes,
  validateTimeFormat,
  getStatusLabel
} from '@/features/tournaments/utils/tournamentHelpers';
import { useAuthStore } from '@/store/authStore';
import { useNavigate, useParams } from 'react-router-dom';

interface TournamentFormProps {
  onSubmitSuccess?: (tournament: Tournament) => void;
  onSubmitError?: (error: unknown) => void;
  onSubmitForApprovalSuccess?: (tournament: Tournament) => void;
  onSubmitForApprovalError?: (error: unknown) => void;
}

const TournamentForm = ({
  onSubmitSuccess,
  onSubmitError,
  onSubmitForApprovalSuccess,
  onSubmitForApprovalError
}: TournamentFormProps = {}) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const isEditMode = !!tournamentId;

  const [initialCategories, setInitialCategories] = useState<TournamentCategory[]>([
    {
      id: '', // Will be removed in form values
      name: '',
      eventType: 'SINGLES' as EventType,
      medalistsAllowed: false,
      openPlayersAllowed: false,
      beginnerOnly: false,
      pureBeginnerOnly: false,
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitForApprovalError, setSubmitForApprovalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    control,
    setValue,
    watch,
    getValues,
    setError: setFormError,
    clearErrors
  } = useForm<TournamentFormValues>({
    defaultValues: {
      name: '',
      description: '',
      tournamentDate: '',
      reportingTime: '',
      registrationCloseDate: '',
      registrationCloseTime: '',
      venueName: '',
      venueAddress: '',
      mapLink: '',
      format: 'KNOCKOUT' as TournamentFormat,
      categories: initialCategories,
      generalRules: [],
    },
    mode: 'onBlur',
  });

  // Fetch tournament data if editing
  useEffect(() => {
    if (isEditMode && tournamentId) {
      const fetchTournament = async () => {
        try {
          setLoading(true);
          const data = await tournamentService.getTournamentById(tournamentId);
          if (data) {
            // Check if the organizer owns this tournament
            if (data.organizerId !== user.id) {
              navigate('/unauthorized');
              return;
            }
            // Check if the tournament is DRAFT for editing
            if (data.status !== 'DRAFT') {
              // If we are trying to edit a non-DRAFT tournament, redirect to detail page
              navigate(`/organizer/tournaments/${data.id}`);
              return;
            }
            // Convert tournament to form values
            const formValues = {
              name: data.name,
              description: data.description,
              tournamentDate: data.tournamentDate,
              reportingTime: data.reportingTime,
              registrationCloseDate: data.registrationCloseDate,
              registrationCloseTime: data.registrationCloseTime,
              venueName: data.venueName,
              venueAddress: data.venueAddress,
              mapLink: data.mapLink || '',
              format: data.format,
              categories: data.categories.map((cat) => ({
                name: cat.name,
                eventType: cat.eventType,
                minAge: cat.minAge,
                maxAge: cat.maxAge,
                maxTeams: cat.maxTeams,
                medalistsAllowed: cat.medalistsAllowed,
                openPlayersAllowed: cat.openPlayersAllowed,
                beginnerOnly: cat.beginnerOnly,
                pureBeginnerOnly: cat.pureBeginnerOnly,
                additionalRuleNotes: cat.additionalRuleNotes || undefined,
              })),
              generalRules: data.generalRules,
            };
            reset(formValues);
          } else {
            // Tournament not found
            navigate('/organizer/tournaments');
            return;
          }
        } catch (err) {
          console.error('Failed to fetch tournament:', err);
          navigate('/organizer/tournaments');
          return;
        } finally {
          setLoading(false);
        }
      };
      fetchTournament();
    }
  }, [isEditMode, tournamentId, navigate, reset]);

  // Watch for category changes to validate (optional, for live validation if desired)
  const categories = watch('categories');

  useEffect(() => {
    if (categories.length > 0) {
      const categoriesValidation = validateCategories(categories);
      if (!categoriesValidation.isValid) {
        // We could set a form error here, but for simplicity we'll just log
        console.warn('Categories validation failed:', categoriesValidation.error);
      }

      const eventTypesValidation = validateCategoryEventTypes(categories);
      if (!eventTypesValidation.isValid) {
        console.warn('Category event types validation failed:', eventTypesValidation.error);
      }
    }
  }, [categories]);

  const validateForSubmission = (data: TournamentFormValues): Record<string, string> => {
    const fieldErrors: Record<string, string> = {};

    // Validate required fields
    if (!data.name) {
      fieldErrors.name = 'Tournament name is required';
    }
    if (!data.tournamentDate) {
      fieldErrors.tournamentDate = 'Tournament date is required';
    }
    if (!data.reportingTime) {
      fieldErrors.reportingTime = 'Reporting time is required';
    }
    if (!data.registrationCloseDate) {
      fieldErrors.registrationCloseDate = 'Registration close date is required';
    }
    if (!data.registrationCloseTime) {
      fieldErrors.registrationCloseTime = 'Registration close time is required';
    }
    if (!data.venueName) {
      fieldErrors.venueName = 'Venue name is required';
    }
    if (!data.venueAddress) {
      fieldErrors.venueAddress = 'Venue address is required';
    }
    if (!data.format) {
      fieldErrors.format = 'Format is required';
    }
    if (!data.categories || data.categories.length === 0) {
      fieldErrors.categories = 'At least one category is required';
    } else {
      // Validate each category
      data.categories.forEach((category, index) => {
        if (!category.name) {
          fieldErrors[`categories.${index}.name`] = 'Category name is required';
        }
        if (!category.eventType) {
          fieldErrors[`categories.${index}.eventType`] = 'Event Type is required';
        }
        const validEventTypes = ['SINGLES', 'DOUBLES'];
        if (!validEventTypes.includes(category.eventType)) {
          fieldErrors[`categories.${index}.eventType`] = `Invalid event type. Must be 'SINGLES' or 'DOUBLES'`;
        }
        // Validate minAge and maxAge
        if (category.minAge !== undefined && category.maxAge !== undefined) {
          if (category.minAge > category.maxAge) {
            fieldErrors[`categories.${index}.minAge`] = 'Min age must be less than or equal to max age';
            fieldErrors[`categories.${index}.maxAge`] = 'Max age must be greater than or equal to min age';
          }
        }
        // Validate maxTeams
        if (category.maxTeams !== undefined && category.maxTeams <= 0) {
          fieldErrors[`categories.${index}.maxTeams`] = 'Max teams must be positive';
        }
      });
    }

    // Validate dates
    if (data.tournamentDate && data.registrationCloseDate) {
      const dateValidation = validateTournamentDates(data.tournamentDate, data.registrationCloseDate);
      if (!dateValidation.isValid) {
        fieldErrors.registrationCloseDate = dateValidation.error;
      }
    }

    // Validate times
    const timeFormat = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (data.reportingTime && !timeFormat.test(data.reportingTime)) {
      fieldErrors.reportingTime = 'Please enter a valid time in HH:mm format';
    }
    if (data.registrationCloseTime && !timeFormat.test(data.registrationCloseTime)) {
      fieldErrors.registrationCloseTime = 'Please enter a valid time in HH:mm format';
    }

    return fieldErrors;
  };

  const onSaveDraft = async (data: TournamentFormValues) => {
    setSubmitError(null);
    setSubmitForApprovalError(null);
    try {
      setLoading(true);

      let result;
      if (isEditMode && tournamentId) {
        result = await tournamentService.updateTournament(tournamentId, data);
      } else {
        if (!user) {
          throw new Error('User not authenticated');
        }
        result = await tournamentService.createTournament(data, user);
      }

      if (onSubmitSuccess) {
        onSubmitSuccess(result);
      }

      // Reset form after successful submission
      reset({
        name: '',
        description: '',
        tournamentDate: '',
        reportingTime: '',
        registrationCloseDate: '',
        registrationCloseTime: '',
        venueName: '',
        venueAddress: '',
        mapLink: '',
        format: 'KNOCKOUT' as TournamentFormat,
        categories: [
          {
            id: '',
            name: '',
            eventType: 'SINGLES' as EventType,
            medalistsAllowed: false,
            openPlayersAllowed: false,
            beginnerOnly: false,
            pureBeginnerOnly: false,
          }
        ],
        generalRules: [],
      });

      // Navigate to dashboard or tournament list on success
      navigate('/organizer/dashboard');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setSubmitError(errorMessage);
      if (onSubmitError) {
        onSubmitError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmitForApproval = async () => {
    setSubmitError(null);
    setSubmitForApprovalError(null);
    try {
      setLoading(true);

      const data = getValues();
      const fieldErrors = validateForSubmission(data);

      // If there are field errors, set them in the form
      if (Object.keys(fieldErrors).length > 0) {
        Object.entries(fieldErrors).forEach(([field, message]) => {
          setFormError(field as keyof TournamentFormValues, { type: 'manualSubmit', message });
        });
        throw new Error('Please fix the errors in the form');
      }

      // Clear any existing form errors
      clearErrors();

      // Submit for approval
      await tournamentService.submitTournamentForApproval(tournamentId);

      // Refetch the tournament to update status
      const updated = await tournamentService.getTournamentById(tournamentId);
      if (updated) {
        if (onSubmitForApprovalSuccess) {
          onSubmitForApprovalSuccess(updated);
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit tournament for approval';
      setSubmitForApprovalError(errorMessage);
      if (onSubmitForApprovalError) {
        onSubmitForApprovalError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{isEditMode ? 'Edit Tournament' : 'Create Tournament'}</h2>
      <form onSubmit={handleSubmit(onSaveDraft)} className="space-y-6">
        {/* Tournament Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tournament Name</label>
            <input
              {...register('name')}
              type="text"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter tournament name"
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter tournament description"
            />
          </div>
        </div>

        {/* Dates and Times */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tournament Date</label>
            <input
              {...register('tournamentDate')}
              type="date"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.tournamentDate && <p className="text-sm text-red-600">{errors.tournamentDate.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Reporting Time (HH:mm)</label>
            <input
              {...register('reportingTime')}
              type="text"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="HH:mm (24-hour format)"
            />
            {errors.reportingTime && <p className="text-sm text-red-600">{errors.reportingTime.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Registration Close Date</label>
            <input
              {...register('registrationCloseDate')}
              type="date"
              className="w-full px_4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.registrationCloseDate && <p className="text-sm text-red-600">{errors.registrationCloseDate.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Registration Close Time (HH:mm)</label>
            <input
              {...register('registrationCloseTime')}
              type="text"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="HH:mm (24-hour format)"
            />
            {errors.registrationCloseTime && <p className="text-sm text-red-600">{errors.registrationCloseTime.message}</p>}
          </div>
        </div>

        {/* Venue Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Venue Name</label>
            <input
              {...register('venueName')}
              type="text"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter venue name"
            />
            {errors.venueName && <p className="text-sm text-red-600">{errors.venueName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Venue Address</label>
            <input
              {...register('venueAddress')}
              type="text"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter venue address"
            />
            {errors.venueAddress && <p className="text-sm text-red-600">{errors.venueAddress.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Map Link (Optional)</label>
            <input
              {...register('mapLink')}
              type="text"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Google Maps link or other URL"
            />
          </div>
        </div>

        {/* Tournament Format */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium mb-2">Format</label>
            <select
              {...register('format')}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="KNOCKOUT">Knockout</option>
              <option value="LEAGUE">League</option>
              <option value="LEAGUE_KNOCKOUT">League + Knockout</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-2">Categories</h3>
          <div id="categories-container" className="space-y-3">
            {categories.map((category, index) => (
              <div key={index} className="border rounded p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">Category {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newCategories = [...categories];
                      newCategories.splice(index, 1);
                      setValue('categories', newCategories);
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                    disabled={categories.length <= 1}
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category Name</label>
                    <input
                      {...register(`categories.${index}.name`)}
                      type="text"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors[`categories[${index}].name`] && (
                      <p className="text-sm text-red-600">{errors[`categories[${index}].name`].message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Event Type</label>
                    <select
                      {...register(`categories.${index}.eventType`)}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="SINGLES">Singles</option>
                      <option value="DOUBLES">Doubles</option>
                    </select>
                    {errors[`categories[${index}].eventType`] && (
                      <p className="text-sm text-red-600">{errors[`categories[${index}].eventType`].message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      {...register(`categories.${index}.medalistsAllowed`)}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600"
                    />
                    <label className="text-sm font-medium">Medalists Allowed</label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      {...register(`categories.${index}.openPlayersAllowed`)}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600"
                    />
                    <label className="text-sm font-medium">Open Players Allowed</label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      {...register(`categories.${index}.beginnerOnly`)}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600"
                    />
                    <label className="text-sm font-medium">Beginner Only</label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      {...register(`categories.${index}.pureBeginnerOnly`)}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600"
                    />
                    <label className="text-sm font-medium">Pure Beginner Only</label>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium mb-1">Additional Rule Notes (Optional)</label>
                  <textarea
                    {...register(`categories.${index}.additionalRuleNotes`)}
                    rows={2}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setValue('categories', [
                    ...categories,
                    {
                      id: '',
                      name: '',
                      eventType: 'SINGLES' as EventType,
                      medalistsAllowed: false,
                      openPlayersAllowed: false,
                      beginnerOnly: false,
                      pureBeginnerOnly: false,
                    }
                  ]);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>

        {/* General Rules */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">General Rules (One per line)</label>
            <textarea
              {...register('generalRules')}
              rows={4}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter each rule on a new line"
            />
          </div>
          <p className="text-sm text-gray-500">
            Each line will be treated as a separate rule
          </p>
        </div>

        {/* Prizes and Shuttle Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Prizes (Optional)</label>
            <input
              {...register('prizes')}
              type="text"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe prizes"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Shuttle Type (Optional)</label>
            <input
              {...register('shuttle')}
              type="text"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Yonex Aerosena"
            />
          </div>
        </div>

        {/* Scoring Format */}
        <div className="space-y-4">
          <label className="block text-sm font-medium mb-2">Scoring Format (Optional)</label>
          <input
            {...register('scoringFormat')}
            type="text"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 21 points, best of 3"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className={`w-auto px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
          >
            {isSubmitting || loading ? 'Saving...' : isEditMode ? 'Update Tournament' : 'Create Tournament'}
          </button>

          <button
            type="button"
            onClick={onSubmitForApproval}
            disabled={isSubmitting || loading}
            className={`w-auto px-6 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
          >
            {isSubmitting || loading ? 'Submitting...' : 'Submit for Approval'}
          </button>

          {submitError && (
            <p className="mt-2 text-sm text-red-600 w-full text-center">
              {submitError}
            </p>
          )}

          {submitForApprovalError && (
            <p className="mt-2 text-sm text-red-600 w-full text-center">
              {submitForApprovalError}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default TournamentForm;