import sys

file_path = sys.argv[1]

with open(file_path, 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if 'from @' in line:
        # Replace the first '>' with a single quote
        if '>' in line:
            line = line.replace('>', "'", 1)
    new_lines.append(line)

with open(file_path, 'w') as f:
    f.writelines(new_lines)