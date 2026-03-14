#!/bin/bash
# Validate Bash Command Hook
# Prevents dangerous commands from being executed

# Read input from stdin
INPUT=$(cat)

# Extract command from JSON input
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# If no command found, allow (not a Bash tool call)
if [ -z "$COMMAND" ]; then
  exit 0
fi

# Array of dangerous command patterns
DANGEROUS_PATTERNS=(
  "rm -rf /"
  "rm -rf ~"
  "rm -rf *"
  "> /dev/sda"
  "mkfs"
  "dd if="
  "DROP DATABASE"
  "DROP TABLE"
  ":(){:|:&"  # Fork bomb
  "chmod 777"
  "chmod -R 777"
  "chown -R root"
  "sudo rm"
  "curl.*|.*bash"
  "wget.*|.*bash"
  "eval \$"
)

# Check for dangerous patterns
for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if [[ "$COMMAND" =~ $pattern ]]; then
    echo "❌ BLOCKED: Dangerous command detected - $pattern" >&2
    echo "Command: $COMMAND" >&2
    echo "" >&2
    echo "This command has been blocked for safety reasons." >&2
    echo "If you believe this is a false positive, please review the command carefully." >&2
    exit 2  # Exit code 2 blocks the operation
  fi
done

# Warning for production commands
PRODUCTION_PATTERNS=(
  "production"
  "prod"
  "--force"
  "git push.*main"
  "git push.*master"
  "npm publish"
  "docker push.*latest"
)

for pattern in "${PRODUCTION_PATTERNS[@]}"; do
  if [[ "$COMMAND" =~ $pattern ]]; then
    echo "⚠️  WARNING: Production command detected" >&2
    echo "Command: $COMMAND" >&2
    echo "Please review carefully before proceeding." >&2
    echo "" >&2
  fi
done

# Check for potentially sensitive operations
SENSITIVE_PATTERNS=(
  "\.env"
  "secret"
  "password"
  "credentials"
  "token"
  "api_key"
  "private_key"
)

for pattern in "${SENSITIVE_PATTERNS[@]}"; do
  if [[ "$COMMAND" =~ $pattern ]]; then
    echo "🔐 INFO: Command involves sensitive data" >&2
    echo "Ensure no secrets are exposed in output or logs." >&2
    echo "" >&2
    break
  fi
done

# All checks passed
exit 0
