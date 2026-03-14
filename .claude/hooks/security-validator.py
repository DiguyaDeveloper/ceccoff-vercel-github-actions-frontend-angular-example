#!/usr/bin/env python3
"""
Security Validator Hook
Performs security checks on code files before they are written
"""

import json
import sys
import re
from pathlib import Path

# Security patterns to detect
SECURITY_PATTERNS = {
    'hardcoded_secrets': [
        (r'password\s*=\s*["\'][^"\']{3,}["\']', 'Potential hardcoded password'),
        (r'api_key\s*=\s*["\'][^"\']{10,}["\']', 'Potential hardcoded API key'),
        (r'secret\s*=\s*["\'][^"\']{10,}["\']', 'Potential hardcoded secret'),
        (r'token\s*=\s*["\'][^"\']{20,}["\']', 'Potential hardcoded token'),
        (r'AKIA[0-9A-Z]{16}', 'AWS Access Key ID detected'),
        (r'-----BEGIN (RSA |DSA )?PRIVATE KEY-----', 'Private key detected'),
    ],
    'sql_injection': [
        (r'query\s*\(\s*["\'].*\+', 'SQL query with string concatenation'),
        (r'query\s*\(\s*`.*\$\{', 'SQL query with template literal interpolation'),
        (r'query\s*\(\s*["\'].*%s', 'SQL query with string formatting'),
    ],
    'xss': [
        (r'innerHTML\s*=', 'Direct innerHTML assignment (XSS risk)'),
        (r'dangerouslySetInnerHTML', 'Dangerous HTML injection'),
        (r'document\.write\(', 'document.write() usage (XSS risk)'),
    ],
    'command_injection': [
        (r'exec\s*\(.*req\.', 'Command execution with user input'),
        (r'spawn\s*\(.*req\.', 'Process spawn with user input'),
        (r'system\s*\(', 'System command execution'),
    ],
    'dangerous_functions': [
        (r'\beval\s*\(', 'eval() usage (highly dangerous)'),
        (r'Function\s*\(', 'Function constructor (similar to eval)'),
        (r'setTimeout\s*\([^,]*string', 'setTimeout with string (similar to eval)'),
    ],
    'weak_crypto': [
        (r'md5\s*\(', 'MD5 hashing (cryptographically broken)'),
        (r'sha1\s*\(', 'SHA1 hashing (weak)'),
        (r'Math\.random\(\)', 'Math.random() (not cryptographically secure)'),
    ],
}

def check_security(content, file_path):
    """Check content for security issues"""
    issues = []
    warnings = []

    # Skip test files
    if '.spec.' in file_path or '.test.' in file_path:
        return issues, warnings

    # Check each security pattern category
    for category, patterns in SECURITY_PATTERNS.items():
        for pattern, description in patterns:
            matches = re.finditer(pattern, content, re.IGNORECASE)

            for match in matches:
                line_num = content[:match.start()].count('\n') + 1
                matched_text = match.group(0)[:50]  # First 50 chars

                issue = {
                    'category': category,
                    'description': description,
                    'line': line_num,
                    'snippet': matched_text,
                }

                # Critical issues that should block
                if category in ['hardcoded_secrets', 'dangerous_functions', 'command_injection']:
                    issues.append(issue)
                else:
                    warnings.append(issue)

    return issues, warnings

def main():
    try:
        # Read input from stdin
        input_data = json.load(sys.stdin)

        # Extract file path and content
        file_path = input_data.get('tool_input', {}).get('file_path', '')
        content = input_data.get('tool_input', {}).get('content', '')

        # If it's an Edit operation, we might not have content
        if not content and file_path:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
            except FileNotFoundError:
                pass  # File doesn't exist yet

        if not content:
            sys.exit(0)

        # Only check code files (including Prisma schema)
        ext = Path(file_path).suffix
        if ext not in ['.ts', '.js', '.tsx', '.jsx', '.py', '.prisma']:
            sys.exit(0)

        print(f"🔒 Security check: {Path(file_path).name}", file=sys.stderr)

        # Perform security checks
        issues, warnings = check_security(content, file_path)

        # Report critical issues
        if issues:
            print(f"\n❌ SECURITY ISSUES DETECTED (blocking):", file=sys.stderr)
            for issue in issues:
                print(f"\n   {issue['category'].upper()}: {issue['description']}", file=sys.stderr)
                print(f"   Location: Line {issue['line']}", file=sys.stderr)
                print(f"   Snippet: {issue['snippet']}", file=sys.stderr)

            print(f"\n   File: {file_path}", file=sys.stderr)
            print(f"\n   Please fix these security issues before proceeding.", file=sys.stderr)
            sys.exit(2)  # Block operation

        # Report warnings
        if warnings:
            print(f"\n⚠️  Security warnings (review recommended):", file=sys.stderr)
            for warning in warnings:
                print(f"\n   {warning['category'].upper()}: {warning['description']}", file=sys.stderr)
                print(f"   Location: Line {warning['line']}", file=sys.stderr)

            print(f"\n   Review these patterns to ensure they're safe.", file=sys.stderr)
            print("", file=sys.stderr)

        # Additional checks for specific file types
        if file_path.endswith('.ts') or file_path.endswith('.js'):
            # Check for console.log in production code (not in /test/ or /scripts/)
            if 'console.log' in content and '/test/' not in file_path and '/scripts/' not in file_path:
                if '/src/' in file_path:
                    print(f"ℹ️  Info: console.log() detected in source code", file=sys.stderr)
                    print(f"   Consider using a proper logger instead", file=sys.stderr)
                    print("", file=sys.stderr)

        # Check Prisma schema files for security best practices
        if file_path.endswith('.prisma'):
            # Check for missing @@map() on models (good practice)
            if re.search(r'model\s+\w+\s*\{', content):
                if not re.search(r'@@map\(["\']', content):
                    print(f"ℹ️  Info: Consider using @@map() for table names", file=sys.stderr)
                    print(f"   Example: @@map(\"users\") for snake_case DB tables", file=sys.stderr)
                    print("", file=sys.stderr)

            # Check for sensitive data without @db type hints
            sensitive_fields = ['password', 'token', 'secret', 'key']
            for field in sensitive_fields:
                if re.search(rf'\b{field}\s+String\s', content, re.IGNORECASE):
                    if not re.search(rf'\b{field}\s+String\s+@db\.', content, re.IGNORECASE):
                        print(f"ℹ️  Info: Sensitive field '{field}' without @db type", file=sys.stderr)
                        print(f"   Consider: {field} String @db.VarChar(255)", file=sys.stderr)
                        print("", file=sys.stderr)

        print(f"✓ Security check passed: {Path(file_path).name}", file=sys.stderr)
        sys.exit(0)

    except json.JSONDecodeError:
        print("Error: Invalid JSON input", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error during security validation: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
