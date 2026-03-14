#!/bin/bash
# Check Environment Variables Hook
# Prevents accidental exposure of secrets in .env files

# Read input from stdin
INPUT=$(cat)

# Extract file path from JSON input
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# If no file path found, skip
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Check if file is an environment file
if [[ ! "$FILE_PATH" =~ \.env ]]; then
  exit 0
fi

# Block production .env files from direct editing
if [[ "$FILE_PATH" =~ \.env\.production ]]; then
  echo "❌ BLOCKED: Direct editing of production .env files is not allowed" >&2
  echo "File: $FILE_PATH" >&2
  echo "" >&2
  echo "Production environment variables should be managed through:" >&2
  echo "  - Secure secrets management (AWS Secrets Manager, Vault, etc.)" >&2
  echo "  - CI/CD pipeline environment variables" >&2
  echo "  - Container orchestration secrets (Kubernetes Secrets)" >&2
  exit 2
fi

# Warn about .env file modifications
echo "⚠️  WARNING: Modifying environment file" >&2
echo "File: $FILE_PATH" >&2
echo "" >&2

# Check if file exists to read content
if [ -f "$FILE_PATH" ]; then
  # Check for potential issues
  HAS_SPACES=$(grep -c "= " "$FILE_PATH" 2>/dev/null || echo "0")

  if [ "$HAS_SPACES" -gt 0 ]; then
    echo "⚠️  Warning: Environment variables contain spaces after '='" >&2
    echo "   This may cause issues. Format should be: KEY=value (no spaces)" >&2
    echo "" >&2
  fi

  # Check for obviously fake/example values
  if grep -qE "(YOUR_|EXAMPLE_|CHANGE_ME|TODO|xxx|123)" "$FILE_PATH" 2>/dev/null; then
    echo "ℹ️  Info: File contains placeholder values" >&2
    echo "   Remember to replace with actual values" >&2
    echo "" >&2
  fi

  # Warn if file might contain real secrets
  if grep -qE "^[A-Z_]+=[a-zA-Z0-9]{20,}" "$FILE_PATH" 2>/dev/null; then
    echo "🔐 Security Reminder:" >&2
    echo "   - Never commit .env files with real secrets" >&2
    echo "   - Ensure .env is in .gitignore" >&2
    echo "   - Use .env.example for templates" >&2
    echo "" >&2
  fi
fi

# Check if .env is in .gitignore
if [ -f ".gitignore" ]; then
  if ! grep -q "^\.env$" .gitignore 2>/dev/null; then
    echo "⚠️  WARNING: .env is not in .gitignore!" >&2
    echo "   Add it to prevent accidental commits of secrets" >&2
    echo "" >&2
  fi
fi

# Always allow the operation (just warnings)
exit 0
