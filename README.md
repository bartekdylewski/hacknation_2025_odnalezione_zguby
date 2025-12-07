# Odnalezione zguby - znalezione.gov.pl

System do zarządzania znalezionymi rzeczami z backendem (Node.js + Express + SQLite) i frontendem (React + Vite).

## Struktura projektu

```
.
├── backend/          # Backend API (Node.js + Express + SQLite)
└── frontend/         # Frontend aplikacja (React + Vite)
```

## Instalacja i uruchomienie

### Szybki start (oba serwery)

#### Backend
```bash
./start-backend.sh
# lub manualnie:
cd backend
npm install
node server.js
```

Backend będzie dostępny na: `http://localhost:3001`

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend będzie dostępny na: `http://localhost:3000`

#### Zatrzymanie backendu
```bash
# Znajdź PID procesu
ps aux | grep "node server.js"

# Zatrzymaj proces
kill [PID]
```

## Funkcje

- 📝 **Zgłaszanie znalezionych rzeczy** - formularz do dodawania przedmiotów
- 🔍 **Weryfikacja PESEL** - system wydawania rzeczy z weryfikacją
- 📊 **Dane.gov.pl export** - eksport danych do CSV zgodny ze standardem
- 👥 **System użytkowników** - rejestracja i logowanie
- 💾 **Trwałe przechowywanie** - baza SQLite zamiast localStorage

## API Endpoints

### Users
- `POST /api/users/register` - Rejestracja
- `POST /api/users/login` - Logowanie
- `GET /api/users` - Lista użytkowników

### Items
- `GET /api/items` - Wszystkie przedmioty
- `GET /api/items/active` - Aktywne przedmioty
- `GET /api/items/issued` - Wydane przedmioty
- `POST /api/items` - Dodaj przedmiot
- `PATCH /api/items/:id/issue` - Wydaj przedmiot

## Technologie

**Backend:**
- Node.js
- Express.js
- better-sqlite3
- CORS

**Frontend:**
- React 18
- Vite
- React Router
- Radix UI
- Tailwind CSS (w Vite)
