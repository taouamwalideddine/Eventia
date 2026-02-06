@echo off
echo 🚀 Running Eventia Backend Tests...

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Run linting
echo 🔍 Running linter...
call npm run lint

REM Run unit tests
echo 🧪 Running unit tests...
call npm run test:unit

REM Run integration tests
echo 🔗 Running integration tests...
call npm run test:integration

REM Run e2e tests
echo 🎭 Running end-to-end tests...
call npm run test:e2e

REM Generate coverage report
echo 📊 Generating coverage report...
call npm run test:cov

echo ✅ All tests completed!
echo 📁 Coverage report available in: coverage/lcov-report/index.html
pause
