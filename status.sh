#!/bin/bash

echo "🔍 Sprawdzanie stanu systemu Odnalezionych Zgub"
echo "================================================"
echo ""

# Sprawdź backend
echo "📡 Backend (port 3001):"
if curl -s --max-time 2 http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Backend działa"
    ITEMS=$(curl -s --max-time 2 http://localhost:3001/api/items | grep -o "\"id\":" | wc -l)
    echo "   📦 Liczba przedmiotów w bazie: $ITEMS"
else
    echo "❌ Backend nie działa"
    echo "   💡 Uruchom: ./start-backend.sh"
fi

echo ""

# Sprawdź frontend
echo "🌐 Frontend (port 3000):"
if curl -s --max-time 2 http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend działa"
else
    echo "❌ Frontend nie działa"
    echo "   💡 Uruchom: cd frontend && npm run dev"
fi

echo ""
echo "================================================"
