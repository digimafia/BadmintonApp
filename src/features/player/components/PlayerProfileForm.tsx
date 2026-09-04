import { useState, useEffect } from 'react'
import { usePlayerProfileStore } from '@/features/player/store/playerProfileStore'
import { useAuthStore } from '@/store/authStore'
import { useNavigate, useLocation } from 'react-router-dom'
import { PlayerProfile } from '@/features/player/types/player.types'
import { calculateAge, calculateExperience, isPlayerProfileComplete } from '@/features/player/utils/profileHelpers'
import { createPlayerProfile, updatePlayerProfile } from '@/features/player/services/playerProfileService'

type Props = {
  onProfileCreated: (profile: PlayerProfile) => void
  profile?: PlayerProfile // PlayerProfile for editing
}

// Form-specific types matching PlayerProfileFormValues but with nullable fields for unselected state
type PlayerProfileFormValues = {
  fullName: string
  dob: string
  location: string
  playingSince: number | null
  regularPlayer: boolean | null
  courtAcademy: string | null
  profilePhoto: File | string | null
}

const PlayerProfileForm = ({ onProfileCreated, profile }: Props) => {
  const { updateProfile: updateProfileInStore } = usePlayerProfileStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const [formValues, setFormValues] = useState<PlayerProfileFormValues>({
    fullName: '',
    dob: '',
    location: '',
    playingSince: null,
    regularPlayer: null,
    courtAcademy: null,
    profilePhoto: null
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Determine if we are editing based on whether a profile was passed
  useEffect(() => {
    if (profile) {
      setIsEditing(true)
      // Initialize form with existing profile values
      setFormValues({
        fullName: profile.fullName,
        dob: profile.dob,
        location: profile.location,
        playingSince: profile.playingSince,
        regularPlayer: profile.regularPlayer,
        courtAcademy: profile.courtAcademy ?? null,
        profilePhoto: profile.profilePhoto
      })
    }
  }, [profile])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formValues.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (formValues.fullName.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters'
    }

    if (!formValues.dob) {
      newErrors.dob = 'Date of birth is required'
    } else {
      const dobDate = new Date(formValues.dob)
      const today = new Date()
      if (dobDate > today) {
        newErrors.dob = 'Date of birth cannot be in the future'
      } else {
        // Optional: check if too young (e.g., less than 5 years)
        const age = calculateAge(formValues.dob)
        if (age < 5) {
          newErrors.dob = 'Player must be at least 5 years old'
        }
      }
    }

    if (!formValues.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (formValues.playingSince === null) {
      newErrors.playingSince = 'Playing since is required'
    } else {
      const currentYear = new Date().getFullYear()
      if (formValues.playingSince > currentYear) {
        newErrors.playingSince = 'Playing since cannot be in the future'
      } else if (formValues.playingSince < 1900) {
        newErrors.playingSince = 'Playing since year seems too old'
      }
    }

    if (formValues.regularPlayer === null) {
      newErrors.regularPlayer = 'Please select whether you are a regular player'
    } else if (formValues.regularPlayer && (!formValues.courtAcademy || !formValues.courtAcademy.trim())) {
      newErrors.courtAcademy = 'Court/Academy is required when Regular Player is Yes'
    }

    // Profile photo validation (optional in Phase 3)
    if (formValues.profilePhoto instanceof File) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(formValues.profilePhoto.type)) {
        newErrors.profilePhoto = 'Please upload a valid image file (JPEG, PNG, WebP)'
      }

      // Validate file size
      if (formValues.profilePhoto.size > 5 * 1024 * 1024) {
        newErrors.profilePhoto = 'File size must be less than 5 MB'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null) // clear any previous submit error
    if (!validate()) {
      return
    }

    setLoading(true)
    try {
      let playerProfile: PlayerProfile
      if (isEditing && profile) {
        // Update existing profile
        playerProfile = await updatePlayerProfile(formValues, profile)
        // Update the store
        updateProfileInStore(playerProfile)
      } else {
        // Create new profile
        if (!user) {
          throw new Error('User not authenticated')
        }
        playerProfile = await createPlayerProfile(formValues, user.id, user.mobile)
        // Update the store
        const store = usePlayerProfileStore.getState()
        store.createProfile(playerProfile)
      }

      onProfileCreated(playerProfile)
      navigate('/player/profile')
    } catch (err: unknown) {
      // Handle error without using any
      console.error(err)
      const message = err instanceof Error ? err.message : 'Unknown error'
      setSubmitError(`Unable to save profile: ${message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/player/profile', { replace: true })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setFormValues(prev => ({ ...prev, profilePhoto: null }))
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.profilePhoto
        return newErrors
      })
      return
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, profilePhoto: 'Please upload a valid image file (JPEG, PNG, WebP)' }))
      return
    }

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, profilePhoto: 'File size must be less than 5 MB' }))
      return
    }

    // Clear any existing image error
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors.profilePhoto
      return newErrors
    })

    setFormValues(prev => ({ ...prev, profilePhoto: file }))
  }

  const handleRemoveImage = () => {
    setFormValues(prev => ({ ...prev, profilePhoto: null }))
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors.profilePhoto
      return newErrors
    })
  }

  return (
    <div className="w-full max-w-md mx-auto py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-center mb-6">
          {isEditing ? 'Edit Player Profile' : 'Create Player Profile'}
        </h2>
        {submitError && (
          <p className="mb-4 text-sm text-red-600">
            {submitError}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Profile Photo</label>
            <div className="flex items-center space-x-4">
              {formValues.profilePhoto instanceof File ? (
                <img
                  src={URL.createObjectURL(formValues.profilePhoto)}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-200"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-500">No Photo</span>
                </div>
              )}
              <div>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="mb-2"
                  onChange={handleImageChange}
                />
                {formValues.profilePhoto instanceof File && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            {errors.profilePhoto && (
              <p className="mt-2 text-sm text-red-600">{errors.profilePhoto}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={formValues.fullName}
              onChange={(e) => setFormValues(prev => ({ ...prev, fullName: e.target.value }))}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date of Birth</label>
            <input
              type="date"
              value={formValues.dob}
              onChange={(e) => setFormValues(prev => ({ ...prev, dob: e.target.value }))}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.dob && (
              <p className="mt-2 text-sm text-red-600">{errors.dob}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Age (auto-calculated)</label>
              <p className="text-lg font-medium text-gray-600 bg-gray-50 rounded p-2">
                {formValues.dob ? calculateAge(formValues.dob) : 0} years
              </p>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Experience (auto-calculated)</label>
              <p className="text-lg font-medium text-gray-600 bg-gray-50 rounded p-2">
                {formValues.playingSince !== null ? calculateExperience(formValues.playingSince) : 0} Years
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mobile Number</label>
            <input
              type="tel"
              value={user?.mobile ?? ''}
              readOnly
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="From your account"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={formValues.location}
              onChange={(e) => setFormValues(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your location (e.g., Tambaram, Chennai)"
            />
            {errors.location && (
              <p className="mt-2 text-sm text-red-600">{errors.location}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Playing Since (Year)</label>
            <select
              value={formValues.playingSince ?? ''}
              onChange={(e) => {
                const value = e.target.value
                setFormValues(prev => ({
                  ...prev,
                  playingSince: value === '' ? null : parseInt(value)
                }))
              }}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Year --</option>
              {[...Array(new Date().getFullYear() - 1900 + 1)].map((_, i) => {
                const year = 1900 + i
                return <option key={year} value={year}>{year}</option>
              })}
            </select>
            {errors.playingSince && (
              <p className="mt-2 text-sm text-red-600">{errors.playingSince}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Regular Player</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="true"
                  checked={formValues.regularPlayer === true}
                  onChange={(e) => {
                    setFormValues(prev => ({
                      ...prev,
                      regularPlayer: e.target.value === 'true'
                    }))
                    // If switching to No, clear courtAcademy
                    if (e.target.value === 'false') {
                      setFormValues(prev => ({ ...prev, courtAcademy: null }))
                    }
                  }}
                  className="h-4 w-4 text-blue-600"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="false"
                  checked={formValues.regularPlayer === false}
                  onChange={(e) => {
                    setFormValues(prev => ({
                      ...prev,
                      regularPlayer: e.target.value === 'true'
                    }))
                    // If switching to No, clear courtAcademy
                    if (e.target.value === 'false') {
                      setFormValues(prev => ({ ...prev, courtAcademy: null }))
                    }
                  }}
                  className="h-4 w-4 text-blue-600"
                />
                <span>No</span>
              </label>
            </div>
          </div>

          {formValues.regularPlayer && (
            <div>
              <label className="block text-sm font-medium mb-2">Court / Academy</label>
              <input
                type="text"
                value={formValues.courtAcademy ?? ''}
                onChange={(e) => setFormValues(prev => ({ ...prev, courtAcademy: e.target.value || null }))}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your regular court or academy name"
              />
              {errors.courtAcademy && (
                <p className="mt-2 text-sm text-red-600">{errors.courtAcademy}</p>
              )}
            </div>
          )}

          <div className="flex justify-between space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              {isEditing ? 'Cancel' : 'Reset'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
            >
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PlayerProfileForm