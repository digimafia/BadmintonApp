import re
import sys

file_path = sys.argv[1]

with open(file_path, 'r') as f:
    content = f.read()

# Pattern: from @'[^']*>
def fix(m):
    # m.group(0) is the entire match, e.g., "from '@/features/player/store/playerProfileStore>"
    # We want to replace the > at the end with a '
    return m.group(0).rstrip('>') + "'"

# Apply to each line? We'll do globally on the content.
# We'll use regex to find all occurrences.
new_content = re.sub(r"from @'[^']*>", fix, content)

with open(file_path, 'w') as f:
    f.write(new_content)