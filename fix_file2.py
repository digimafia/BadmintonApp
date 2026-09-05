import re

file_path = '/Users/apple/Documents/BadmintonApp/src/features/player/pages/GuestPartnerFormPage.tsx'

with open(file_path, 'r') as f:
    content = f.read()

# Fix import lines: replace patterns like from '@/.../something> with from '@/.../something'
# We'll do a global replacement for each pattern, but we can do one regex that matches the import lines.
# Instead, we'll do multiple replacements for each known import.
# But we can do: replace all occurrences of '>'. at the end of the line in import statements? Simpler: replace '>' with ''' when it appears after a string literal in an import line.
# We'll use a regex that matches from '@/.../something> and replaces the > with '
# We'll do it for the whole content.

# Pattern: from '@/[^']*'>
def fix_imports(match):
    # match group 0 is the whole match, we want to replace the > at the end with '
    s = match.group(0)
    if s.endswith('>'):
        s = s[:-1] + "'"
    return s

content = re.sub(r"from '@/[^']*'>", fix_imports, content)

# Now fix the return statement: replace from "  return (" to the next "  }" that is the function's closing brace.
# We'll use a regex that matches from "  return (" hasta la siguiente "  }" que esté al mismo nivel de indentación?
# Instead, we'll do: find the index of "  return (" and then find the next "  }" after that.
import_string = "  return ("
start = content.find(import_string)
if start == -1:
    print("Could not find return statement start")
    sys.exit(1)

# Find the closing brace of the function after the return statement.
# We'll look for the pattern "\n  }" after the start.
# We need to find the matching brace? But we know the function's closing brace is at the same indentation as the function body (two spaces).
# We'll search for "\n  }" after start.
# However, there might be other "  }" inside the JSX? We'll assume the first one after the return statement is the function's closing brace.
# We'll find the index of "\n  }" after start.
end_search = content.find("\n  }", start)
if end_search == -1:
    print("Could not find function closing brace")
    sys.exit(1)
# The end index is the position of the '\n' before the "  }"? We want to replace from start to the end of the "  }" line.
# We'll set end to the index after the closing brace.
end = end_search + len("\n  }")  # points after the closing brace

# Now we want to replace content[start:end] with our fixed return statement block.
fixed_return = """  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {tournament.name}
        </h1>
        <p className="text-sm text-gray-600">
          {formatDateDisplay(tournament.tournamentDate)} • {tournament.venueName}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          Add Guest Player Partner
        </h2>
        <p className="text-sm text-gray-600">
          Category: {category.name}
        </p>
      </div>

      {existingPlayerError ? (
        <div className="bg-red-50 border border-red-200 text-red-800 p-2 rounded mb-4">
          {existingPlayerError}
        </div>
      ) : null}

      {errors.submit ? (
        <div className="bg-red-50 border border-red-200 text-red-800 p-2 rounded mb-4">
          {errors.submit}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter full name"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.fullName}
            )
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth (YYYY-MM-DD)
          </label>
          <input
            type="date"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, datum: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.dob && (
            <p className="mt-1 text-sm text-red-600">
              {errors.dob}
            )
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number
          </label>
          <input
            type="tel"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter mobile number (e.g., 9876543210)"
          />
          {errors.mobile && (
            <p className="mt-1 text-sm text-red-600">
              {errors.mobile}
            )
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter location"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">
              {errors.location}
            )
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year Started Playing
          </label>
          <input
            type="number"
            value={formData.playingSince}
            onChange={(e) => setFormData({ ...formData, playingSince: Number(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1900"
            max="${new Date().getFullYear()}"
          />
          {errors.playingSince && (
            <p className="mt-1 text-sm text-red-600">
              {errors.playingSince}
            )
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Regular Player?
          </label>
          <select
            value={formData.regularPlayer ? 'true' : 'false'}
            onChange={(e) => setFormData({ ...formData, regularPlayer: e.target.value === 'true' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Court/Academy (Optional)
          </label>
          <input
            type="text"
            value={formData.courtAcademy}
            onChange={(e) => setFormData({ ...formData, courtAcademy: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter court or academy name"
          />
        </div>

        <button
          type="submit"
          disabled={creatingGuest}
          className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {creatingGuest ? 'Creating...' : 'Create Guest Player'}
          </button>
      </form>

      {checkingEligibility ? (
        <p className="text-center text-sm text-gray-500">
          Checking eligibility...
        </p>
      ) : eligibilityResult ? (
        eligibilityResult.eligible ? (
          <>
            <p className="text-sm font-medium text-green-600">
              You are eligible for this category.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-red-600">
              Not Eligible
            </p>
            <ul className="list-disc list-inside mt-2 text-sm text-red-500 space-y-1">
              {eligibilityResult.reasons.map(
                (reason, index) => (
                  <li key={`${reason.code}-${index}`}>
                    {reason.message}
                  </li>
                )
              )}
            </ul>
          </>
        )
      ) : (
        <p className="text-center text-sm text-gray-500">
          Eligibility unknown
        </p>
      )}
    </div>
  )
}"""

# Replace
new_content = content[:start] + fixed_return + content[end:]

with open(file_path, 'w') as f:
    f.write(new_content)