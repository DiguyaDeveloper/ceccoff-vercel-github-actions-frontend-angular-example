#!/usr/bin/env python3
"""
Validate Prisma Migration Hook
Validates Prisma SQL migration files for safety and correctness
"""

import json
import sys
import re
from pathlib import Path

def main():
    try:
        # Read input from stdin
        input_data = json.load(sys.stdin)

        # Extract file path
        file_path = input_data.get('tool_input', {}).get('file_path', '')

        if not file_path:
            sys.exit(0)

        # Only validate Prisma migration files
        # Path pattern: prisma/migrations/YYYYMMDD_name/migration.sql
        if 'prisma/migrations' not in file_path or not file_path.endswith('migration.sql'):
            sys.exit(0)

        # Read file content
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except FileNotFoundError:
            # File might not exist yet (Write operation)
            sys.exit(0)

        migration_name = Path(file_path).parent.name
        print(f"🔍 Validating Prisma migration: {migration_name}", file=sys.stderr)

        # Basic SQL validation
        checks = {
            'has_sql_statements': bool(re.search(r'(CREATE|ALTER|DROP|INSERT|UPDATE|DELETE)', content, re.IGNORECASE)),
            'not_empty': len(content.strip()) > 0,
            'valid_sql_syntax': not re.search(r';\s*;\s*;', content),  # No triple semicolons
        }

        # Check for dangerous operations
        dangerous_patterns = [
            (r'\bDROP\s+TABLE\s+', 'DROP TABLE (potential data loss)', True),
            (r'\bDROP\s+COLUMN\s+', 'DROP COLUMN (potential data loss)', True),
            (r'\bTRUNCATE\s+', 'TRUNCATE (data loss)', True),
            (r'\bDELETE\s+FROM\s+\w+\s*;', 'DELETE without WHERE clause (deletes all rows!)', True),
            (r'\bUPDATE\s+\w+\s+SET\s+.*;\s*$', 'UPDATE without WHERE clause (updates all rows!)', True),
            (r'\bALTER\s+COLUMN\s+.*\s+DROP\s+NOT\s+NULL', 'Removing NOT NULL constraint', False),
            (r'\bALTER\s+COLUMN\s+.*\s+DROP\s+DEFAULT', 'Removing DEFAULT constraint', False),
        ]

        critical_issues = []
        warnings = []

        for pattern, description, is_critical in dangerous_patterns:
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                line_num = content[:match.start()].count('\n') + 1
                issue = {
                    'description': description,
                    'line': line_num,
                    'snippet': match.group(0)[:80],
                }

                if is_critical:
                    critical_issues.append(issue)
                else:
                    warnings.append(issue)

        # Check for good practices
        good_practices = []

        # Check for transaction comments (Prisma wraps in transaction by default)
        if '-- CreateTable' in content or '-- CreateIndex' in content:
            good_practices.append("Using Prisma-generated comments")

        # Check for IF NOT EXISTS (safe operations)
        if re.search(r'IF\s+NOT\s+EXISTS', content, re.IGNORECASE):
            good_practices.append("Using IF NOT EXISTS (safe)")

        # Check for IF EXISTS (safe cleanup)
        if re.search(r'IF\s+EXISTS', content, re.IGNORECASE):
            good_practices.append("Using IF EXISTS (safe)")

        # Check for CREATE INDEX CONCURRENTLY (PostgreSQL non-blocking)
        if re.search(r'CREATE\s+INDEX\s+CONCURRENTLY', content, re.IGNORECASE):
            good_practices.append("Using CONCURRENTLY (non-blocking index)")

        # Report critical issues (BLOCK)
        if critical_issues:
            print(f"\n❌ CRITICAL ISSUES DETECTED (BLOCKING):", file=sys.stderr)
            for issue in critical_issues:
                print(f"\n   ⛔ {issue['description']}", file=sys.stderr)
                print(f"      Line {issue['line']}: {issue['snippet']}", file=sys.stderr)

            print(f"\n   🚨 This migration contains DANGEROUS operations!", file=sys.stderr)
            print(f"   📋 Checklist before proceeding:", file=sys.stderr)
            print(f"      1. ✅ Database backup created", file=sys.stderr)
            print(f"      2. ✅ Tested in development environment", file=sys.stderr)
            print(f"      3. ✅ Reviewed SQL carefully", file=sys.stderr)
            print(f"      4. ✅ Rollback plan prepared", file=sys.stderr)
            print(f"\n   If you're sure, you can override with --force", file=sys.stderr)
            sys.exit(2)  # Block operation

        # Report basic validation failures
        failed_checks = [k for k, v in checks.items() if not v]
        if failed_checks:
            print(f"❌ Migration validation FAILED:", file=sys.stderr)
            for check in failed_checks:
                print(f"   - {check.replace('_', ' ').title()}", file=sys.stderr)
            sys.exit(2)

        # Report warnings (don't block, just inform)
        if warnings:
            print(f"\n⚠️  Migration contains potentially risky operations:", file=sys.stderr)
            for warning in warnings:
                print(f"\n   ⚠️  {warning['description']}", file=sys.stderr)
                print(f"      Line {warning['line']}: {warning['snippet']}", file=sys.stderr)

            print(f"\n   💡 Recommendations:", file=sys.stderr)
            print(f"      - Ensure you have a database backup", file=sys.stderr)
            print(f"      - Test this migration in dev/staging first", file=sys.stderr)
            print(f"      - Consider zero-downtime migration strategies", file=sys.stderr)
            print("", file=sys.stderr)

        # Report good practices
        if good_practices:
            print(f"✓ Good practices detected:", file=sys.stderr)
            for practice in good_practices:
                print(f"   ✓ {practice}", file=sys.stderr)

        # Prisma-specific checks
        print(f"\n📊 Migration info:", file=sys.stderr)

        # Count operations
        creates = len(re.findall(r'\bCREATE\s+', content, re.IGNORECASE))
        alters = len(re.findall(r'\bALTER\s+', content, re.IGNORECASE))
        drops = len(re.findall(r'\bDROP\s+', content, re.IGNORECASE))

        if creates > 0:
            print(f"   📝 CREATE operations: {creates}", file=sys.stderr)
        if alters > 0:
            print(f"   🔧 ALTER operations: {alters}", file=sys.stderr)
        if drops > 0:
            print(f"   🗑️  DROP operations: {drops}", file=sys.stderr)

        print(f"\n✅ Prisma migration validation passed: {migration_name}", file=sys.stderr)
        print(f"   💡 Apply with: npx prisma migrate deploy", file=sys.stderr)

        sys.exit(0)

    except json.JSONDecodeError:
        print("Error: Invalid JSON input", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error validating migration: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
