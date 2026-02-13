#!/bin/bash

echo "🧪 Starting Bookstore API Test Suite..."
echo "========================================"
echo ""

# Check if server is running
echo "📡 Checking if server is running on port 5000..."
if ! lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Server is not running on port 5000"
    echo "Please start the server with: npm run dev"
    exit 1
fi

echo "✅ Server is running"
echo ""

# Navigate to tests directory
cd "$(dirname "$0")"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing test dependencies..."
    npm install
    echo ""
fi

# Run tests
echo "🧪 Running API Tests..."
echo "========================================"
npm test

# Check exit code
if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "✅ All tests passed!"
    echo "========================================"
else
    echo ""
    echo "========================================"
    echo "❌ Some tests failed. Please check the output above."
    echo "========================================"
    exit 1
fi
