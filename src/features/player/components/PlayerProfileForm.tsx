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
  gender: 'MALE' | 'FEMALE' | 'OTHER' | ''
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
    gender: '',
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
        gender: profile.gender ?? '',
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
    if (!formValues.gender) newErrors.gender = 'Please select your gender'

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
        playerProfile = await updatePlayerProfile({ ...formValues, gender: formValues.gender || undefined }, profile)
        // Update the store
        updateProfileInStore(playerProfile)
      } else {
        // Create new profile
        if (!user) {
          throw new Error('User not authenticated')
        }
        playerProfile = await createPlayerProfile({ ...formValues, gender: formValues.gender || undefined }, user.id, user.mobile)
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
    <div className="profile-form w-full max-w-2xl mx-auto py-4">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 to-emerald-900 p-6 text-white sm:p-8"><div className="absolute -right-10 -top-12 h-40 w-40 rounded-full border-[18px] border-emerald-300/15" /><p className="relative text-xs font-bold uppercase tracking-[.2em] text-emerald-300">🏸 Player setup</p><h2 className="relative mt-2 text-3xl font-black">{isEditing ? 'Tune your player profile' : 'Create your player card'}</h2><p className="relative mt-2 text-sm text-slate-300">Your tournament identity starts here.</p></div>
        <div className="p-6 sm:p-8">
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
                  className="w-24 h-24 rounded-full object-cover border-4 border-emerald-200"
                />
              ) : (
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-700 font-bold text-2xl">🏸</span>
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

          <div><label className="block text-sm font-medium mb-2">Gender</label><select value={formValues.gender} onChange={(e) => setFormValues(prev => ({ ...prev, gender: e.target.value as PlayerProfileFormValues['gender'] }))} className="w-full px-4 py-2 border rounded"><option value="">Select gender</option><option value="MALE">Male</option><option value="FEMALE">Female</option><option value="OTHER">Other</option></select>{errors.gender && <p className="mt-2 text-sm text-red-600">{errors.gender}</p>}</div>

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

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl bg-slate-100 px-5 py-3 font-bold text-slate-700 hover:bg-slate-200"
            >
              {isEditing ? 'Cancel' : 'Reset'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  )
}

export default PlayerProfileForm
