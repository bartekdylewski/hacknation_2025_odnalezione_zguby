#!/bin/bash

# Start backend
echo "🚀 Uruchamianie backendu..."
cd backend
node server.js &
BACKEND_PID=$!
cd ..

echo "✅ Backend działa (PID: $BACKEND_PID)"
echo ""
echo "📝 Aby zatrzymać backend, użyj: kill $BACKEND_PID"
echo "   lub znajdź proces: ps aux | grep node"
