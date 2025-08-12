import json
from datetime import datetime

# File paths
input_path = "books.jsonl"
output_path = "books_epoch.jsonl"

# Read the input JSONL file and convert the 'created' field
output_lines = []
with open(input_path, "r") as infile:
    for line in infile:
        record = json.loads(line)
        if "_creationTime" in record:
            # Parse ISO date and convert to epoch ms
            dt = datetime.fromisoformat(record["_creationTime"])
            record["_creationTime"] = int(dt.timestamp() * 1000)
        if "publishDate" in record:
            # Parse ISO date and convert to epoch ms
            dt = datetime.fromisoformat(record["publishDate"])
            record["publishDate"] = int(dt.timestamp() * 1000)            
        output_lines.append(json.dumps(record))

# Write the updated records to a new JSONL file
with open(output_path, "w") as outfile:
    for line in output_lines:
        outfile.write(line + "\n")