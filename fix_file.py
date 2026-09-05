import sys
import re

file_path = sys.argv[1]

with open(file_path, 'r') as f:
    lines = f.readlines()

# Fix import lines: lines 4 to 23 (0-indexed 3 to 22)
for i in range(3, 23):
    line = lines[i]
    # Replace malformed strings: remove trailing '>' and add closing quote
    # Pattern: from '@/.../something>
    # We want to change > to ' and then nothing after (assuming the line ends with >)
    # But there might be spaces? Actually, the line ends with > and then newline.
    # We'll replace >' with ''? Actually, we want to change the > to a ' and then the line ends.
    # So we replace '>': with \"'\"
    if 'from @' in line and '>' in line:
        # Find the position of the last '>' in the string (should be the one closing the import)
        # We'll replace from that '>' to the end of the line with a single quote and then newline?
        # Actually, we want to keep the rest of the line after the >? There is none.
        # So we can do:
        line = line.rstrip()
        if line.endswith('>'):
            line = line[:-1] + \"'\\n\"
        else:
            # If there is something after >, we just replace the first > with '
            line = line.replace('>', \"'\\n\", 1)
        lines[i] = line

# Now fix the return statement: find the line with "  return (" and the line with "  }" that is the function's closing brace
# We'll find the start and end indices.
start = None
end = None
for i, line in enumerate(lines):
    if line.rstrip() == "  return (":
        start = i
    if start is not None and line.rstrip() == "}":
        # This is the function's closing brace? We need to make sure it's the one after the return statement.
        # We'll assume the first '}' after start is the function's closing brace.
        end = i
        break

if start is not None and end is not None:
    # Replace lines[start:end+1] with our fixed return statement block
    fixed_return = [
        "  return (\n",
        "    <div className=\"p-4\">\n",
        "      <div className=\"mb-6\">\n",
        "        <h1 className=\"text-2xl font-bold\">\n",
        "          {tournament.name}\n",
        "        </h1>\n",
        "        <p className=\"text-sm text-gray-600\">\n",
        "          {formatDateDisplay(tournament.tournamentDate)} • {tournament.venueName}\n",
        "        </p>\n",
        "      </div>\n",
        "\n",
        "      <div className=\"mb-6\">\n",
        "        <h2 className=\"text-xl font-semibold mb-3\">\n",
        "          Add Guest Player Partner\n",
        "        </h2>\n",
        "        <p className=\"text-sm text-gray-600\">\n",
        "          Category: {category.name}\n",
        "        </p>\n",
        "      </div>\n",
        "\n",
        "      {existingPlayerError ? (\n",
        "        <div className=\"bg-red-50 border border-red-200 text-red-800 p-2 rounded mb-4\">\n",
        "          {existingPlayerError}\n",
        "        </div>\n",
        "      ) : null}\n",
        "\n",
        "      {errors.submit ? (\n",
        "        <div className=\"bg-red-50 border border-red-200 text-red-800 p-2 rounded mb-4\">\n",
        "          {errors.submit}\n",
        "        </div>\n",
        "      ) : null}\n",
        "\n",
        "      <form onSubmit={handleSubmit} className=\"space-y-4\">\n",
        "        <div>\n",
        "          <label className=\"block text-sm font-medium text-gray-700 mb-1\">\n",
        "            Full Name\n",
        "          </label>\n",
        "          <input\n",
        "            type=\"text\"\n",
        "            value={formData.fullName}\n",
        "            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}\n",
        "            className=\"w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500\"\n",
        "            placeholder=\"Enter full name\"\n",
        "          />\n",
        "          {errors.fullName && (\n",
        "            <p className=\"mt-1 text-sm text-red-600\">\n",
        "              {errors.fullName}\n",
        "            )\n",
        "          )}\n",
        "        </div>\n",
        "\n",
        "        <div>\n",
        "          <label className=\"block text-sm font-medium text-gray-700 mb-1\">\n",
        "            Date of Birth (YYYY-MM-DD)\n",
        "          </label>\n",
        "          <input\n",
        "            type=\"date\"\n",
        "            value={formData.dob}\n",
        "            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}\n",
        "            className=\"w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500\"\n",
        "          />\n",
        "          {errors.dob && (\n",
        "            <p className=\"mt-1 text-sm text-red-600\">\n",
        "              {errors.dob}\n",
        "            )\n",
        "          )}\n",
        "        </div>\n",
        "\n",
        "        <div>\n",
        "          <label className=\"block text-sm font-medium text-gray-700 mb-1\">\n",
        "            Mobile Number\n",
        "          </label>\n",
        "          <input\n",
        "            type=\"tel\"\n",
        "            value={formData.mobile}\n",
        "            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}\n",
        "            className=\"w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500\"\n",
        "            placeholder=\"Enter mobile number (e.g., 9876543210)\"\n",
        "          />\n",
        "          {errors.mobile && (\n",
        "            <p className=\"mt-1 text-sm text-red-600\">\n",
        "              {errors.mobile}\n",
        "            )\n",
        "          )}\n",
        "        </div>\n",
        "\n",
        "        <div>\n",
        "          <label className=\"block text-sm font-medium text-gray-700 mb-1\">\n",
        "            Location\n",
        "          </label>\n",
        "          <input\n",
        "            type=\"text\"\n",
        "            value={formData.location}\n",
        "            onChange={(e) => setFormData({ ...formData, location: e.target.value })}\n",
        "            className=\"w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500\"\n",
        "            placeholder=\"Enter location\"\n",
        "          />\n",
        "          {errors.location && (\n",
        "            <p className=\"mt-1 text-sm text-red-600\">\n",
        "              {errors.location}\n",
        "            )\n",
        "          )}\n",
        "        </div>\n",
        "\n",
        "        <div>\n",
        "          <label className=\"block text-sm font-medium text-gray-700 mb-1\">\n",
        "            Year Started Playing\n",
        "          </label>\n",
        "          <input\n",
        "            type=\"number\"\n",
        "            value={formData.playingSince}\n",
        "            onChange={(e) => setFormData({ ...formData, playingSince: Number(e.target.value) })}\n",
        "            className=\"w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500\"\n",
        "            min=\"1900\"\n",
        "            max=\"${new Date().getFullYear()}\"\n",
        "          />\n",
        "          {errors.playingSince && (\n",
        "            <p className=\"mt-1 text-sm text-red-600\">\n",
        "              {errors.playingSince}\n",
        "            )\n",
        "          )}\n",
        "        </div>\n",
        "\n",
        "        <div>\n",
        "          <label className=\"block text-sm font-medium text-gray-700 mb-1\">\n",
        "            Regular Player?\n",
        "          </label>\n",
        "          <select\n",
        "            value={formData.regularPlayer ? 'true' : 'false'}\n",
        "            onChange={(e) => setFormData({ ...formData, regularPlayer: e.target.value === 'true' })}\n",
        "            className=\"w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500\"\n",
        "          >\n",
        "            <option value=\"false\">No</option>\n",
        "            <option value=\"true\">Yes</option>\n",
        "          </select>\n",
        "        </div>\n",
        "\n",
        "        <div>\n",
        "          <label className=\"block text-sm font-medium text-gray-700 mb-1\">\n",
        "            Court/Academy (Optional)\n",
        "          </label>\n",
        "          <input\n",
        "            type=\"text\"\n",
        "            value={formData.courtAcademy}\n",
        "            onChange={(e) => setFormData({ ...formData, courtAcademy: e.target.value })}\n",
        "            className=\"w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500\"\n",
        "            placeholder=\"Enter court or academy name\"\n",
        "          />\n",
        "        </div>\n",
        "\n",
        "        <button\n",
        "          type=\"submit\"\n",
        "          disabled={creatingGuest}\n",
        "          className=\"w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600\"\n",
        "        >\n",
        "          {creatingGuest ? 'Creating...' : 'Create Guest Player'}\n",
        "          </button>\n",
        "      </form>\n",
        "\n",
        "      {checkingEligibility ? (\n",
        "        <p className=\"text-center text-sm text-gray-500\">\n",
        "          Checking eligibility...\n",
        "        </p>\n",
        "      ) : eligibilityResult ? (\n",
        "        eligibilityResult.eligible ? (\n",
        "          <>\n",
        "            <p className=\"text-sm font-medium text-green-600\">\n",
        "              You are eligible for this category.\n",
        "            </p>\n",
        "          </>\n",
        "        ) : (\n",
        "          <>\n",
        "            <p className=\"text-sm font-medium text-red-600\">\n",
        "              Not Eligible\n",
        "            </p>\n",
        "            <ul className=\"list-disc list-inside mt-2 text-sm text-red-500 space-y-1\">\n",
        "              {eligibilityResult.reasons.map(\n",
        "                (reason, index) => (\n",
        "                  <li key={`${reason.code}-${index}`}>\\n",
        "                    {reason.message}\\n",
        "                  </li>\n",
        "                )}\n",
        "              )}\n",
        "            </ul>\n",
        "          </>\n",
        "        )\n",
        "      ) : (\n",
        "        <p className=\"text-center text-sm text-gray-500\">\n",
        "          Eligibility unknown\n",
        "        </p>\n",
        "      )}\n",
        "    </div>\n",
        "  )\n",
        "}\n",
    ]
    # Replace the lines
    lines[start:end+1] = fixed_return

# Write back
with open(file_path, 'w') as f:
    f.writelines(lines)