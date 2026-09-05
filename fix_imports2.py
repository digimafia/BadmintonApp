import sys

file_path = sys.argv[1]

with open(file_path, 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.strip().startswith('import') and 'from @' in line:
        # Find the position of the last '>' in the line
        if '>' in line:
            # Replace the last '>' with a single quote
            # But we want to replace only the one that is after the string literal?
            # We'll just replace the first '>' from the end? Actually, there should be only one '>' at the end.
            line = line.replace('>', "'", 1)
    new_lines.append(line)

with open(file_path, 'w') as f:
    f.writelines(new_lines)