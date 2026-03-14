#!/bin/bash
# Auto-Format Code Hook
# Automatically formats code after Edit or Write operations

# Read input from stdin
INPUT=$(cat)

# Extract file path from JSON input
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# If no file path found, skip
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Check if file exists
if [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

# Get file extension
EXT="${FILE_PATH##*.}"

# Format TypeScript/JavaScript files
if [[ "$EXT" == "ts" || "$EXT" == "tsx" || "$EXT" == "js" || "$EXT" == "jsx" ]]; then
  echo "📝 Formatting TypeScript/JavaScript file: $FILE_PATH" >&2

  # Check if prettier is available
  if command -v prettier &> /dev/null; then
    prettier --write "$FILE_PATH" 2>/dev/null || true
  fi

  # Check if eslint is available
  if command -v eslint &> /dev/null; then
    eslint --fix "$FILE_PATH" 2>/dev/null || true
  fi

  echo "✓ Formatted: $FILE_PATH" >&2
fi

# Format JSON files
if [[ "$EXT" == "json" ]]; then
  echo "📝 Formatting JSON file: $FILE_PATH" >&2

  if command -v prettier &> /dev/null; then
    prettier --write "$FILE_PATH" 2>/dev/null || true
    echo "✓ Formatted: $FILE_PATH" >&2
  elif command -v jq &> /dev/null; then
    # Fallback to jq
    TMP_FILE=$(mktemp)
    jq '.' "$FILE_PATH" > "$TMP_FILE" 2>/dev/null && mv "$TMP_FILE" "$FILE_PATH"
    echo "✓ Formatted: $FILE_PATH" >&2
  fi
fi

# Format Markdown files
if [[ "$EXT" == "md" ]]; then
  if command -v prettier &> /dev/null; then
    prettier --write "$FILE_PATH" 2>/dev/null || true
    echo "✓ Formatted: $FILE_PATH" >&2
  fi
fi

# Format YAML files
if [[ "$EXT" == "yaml" || "$EXT" == "yml" ]]; then
  if command -v prettier &> /dev/null; then
    prettier --write "$FILE_PATH" 2>/dev/null || true
    echo "✓ Formatted: $FILE_PATH" >&2
  fi
fi

# Format Prisma schema files
if [[ "$EXT" == "prisma" ]]; then
  echo "📝 Formatting Prisma schema: $FILE_PATH" >&2

  # Check if prisma is available
  if command -v prisma &> /dev/null; then
    prisma format --schema="$FILE_PATH" 2>/dev/null || true
    echo "✓ Formatted: $FILE_PATH" >&2
  elif command -v npx &> /dev/null; then
    # Fallback to npx prisma
    npx prisma format --schema="$FILE_PATH" 2>/dev/null || true
    echo "✓ Formatted: $FILE_PATH" >&2
  else
    echo "⚠️  Prisma CLI not found, skipping format" >&2
  fi
fi

# Always allow the operation
exit 0
