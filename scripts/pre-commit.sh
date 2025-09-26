#!/bin/bash

echo "🔍 Running pre-commit checks..."

# Run Prettier
echo "📝 Formatting code with Prettier..."
pnpm exec prettier --write .

# Run TypeScript type checking
echo "🔧 Running TypeScript type check..."
pnpm run type-check
if [ $? -ne 0 ]; then
  echo "❌ TypeScript type check failed"
  exit 1
fi

# Run ESLint (optional - don't fail if it has issues)
echo "🧹 Running ESLint..."
pnpm run lint || echo "⚠️  ESLint had issues but continuing..."

# Run tests
echo "🧪 Running tests..."
pnpm run test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed"
  exit 1
fi

echo "✅ All pre-commit checks passed!"
