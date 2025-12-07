const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3001;

// Helper do formatowania daty
function formatDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Middleware
app.use(cors());
app.use(express.json());

// Inicjalizacja bazy danych (użyj bezwzględnej ścieżki względem pliku)
const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

// Tworzenie tabel
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS found_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    found_at TEXT NOT NULL,
    date_added TEXT NOT NULL,
    date_modified TEXT NOT NULL,
    status TEXT NOT NULL
  );
`);

// ========== USERS API ==========

// Rejestracja użytkownika
app.post('/api/register', async (req, res) => {
  const { username, password, name } = req.body;
  if (!username || !password || !name) {
    return res.status(400).json({ error: 'Wszystkie pola są wymagane' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, password, name) VALUES (?, ?, ?)');
    const info = stmt.run(username, hashedPassword, name);
    res.json({ id: info.lastInsertRowid, username, name });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Użytkownik o takiej nazwie już istnieje' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Logowanie użytkownika
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Wszystkie pola są wymagane' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user) {
      return res.status(400).json({ error: 'Nieprawidłowa nazwa użytkownika lub hasło' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Nieprawidłowa nazwa użytkownika lub hasło' });
    }

    res.json({ id: user.id, username: user.username, name: user.name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pobierz wszystkich użytkowników
app.get('/api/users', (req, res) => {
  try {
    const users = db.prepare('SELECT id, username, name FROM users').all();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== ITEMS API ==========

// Pobierz wszystkie przedmioty
app.get('/api/items', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM found_items ORDER BY date_added DESC').all();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dodaj przedmiot
app.post('/api/items', (req, res) => {
  const { person_id, title, description, found_at, status } = req.body;
  // Walidacja podstawowa
  if (!title || !description || !found_at) {
    return res.status(400).json({ error: 'Brak wymaganych pól (title, description, found_at)' });
  }

  const date_added = formatDate();
  const date_modified = date_added;
  const itemStatus = status || 'znalezione';

  try {
    const stmt = db.prepare(`
      INSERT INTO found_items (person_id, title, description, found_at, date_added, date_modified, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(person_id || null, title, description, found_at, date_added, date_modified, itemStatus);
    res.json({ 
      id: info.lastInsertRowid, 
      person_id, 
      title, 
      description, 
      found_at, 
      date_added, 
      date_modified, 
      status: itemStatus 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Aktualizuj przedmiot
app.put('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const { person_id, title, description, found_at, status } = req.body;
  
  const date_modified = formatDate();

  try {
    // Najpierw pobierz istniejący, żeby nie nadpisać nullami jeśli nie podano
    const existing = db.prepare('SELECT * FROM found_items WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Przedmiot nie istnieje' });
    }

    const stmt = db.prepare(`
      UPDATE found_items 
      SET person_id = ?, title = ?, description = ?, found_at = ?, status = ?, date_modified = ?
      WHERE id = ?
    `);
    
    stmt.run(
      person_id !== undefined ? person_id : existing.person_id,
      title || existing.title,
      description || existing.description,
      found_at || existing.found_at,
      status || existing.status,
      date_modified,
      id
    );

    const updated = db.prepare('SELECT * FROM found_items WHERE id = ?').get(id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset bazy danych (dla celów deweloperskich/demo)
app.post('/api/reset', async (req, res) => {
  try {
    db.exec('DELETE FROM found_items');
    // Opcjonalnie: dodaj przykładowe dane
    const stmt = db.prepare(`
      INSERT INTO found_items (person_id, title, description, found_at, date_added, date_modified, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    // Przykładowy rekord z promptu
    stmt.run(
      "2g4jd92j", 
      "Laptop Dell", 
      "Srebrny laptop dell latitude 5300", 
      "Starostwo Powiatowe w Bydgoszczy, Polska", 
      "2025-12-07 10:23:12", 
      "2025-12-07 12:22:43", 
      "znalezione"
    );

    res.json({ message: 'Baza danych została zresetowana' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Pobierz dane w formacie CSV
app.get('/api/get-csv', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM found_items').all();
    
    // Nagłówki CSV
    const headers = ['id', 'person_id', 'title', 'description', 'found_at', 'date_added', 'date_modified', 'status'];
    
    // Generowanie treści CSV
    const csvRows = [headers.join(',')];
    
    for (const item of items) {
      const row = headers.map(header => {
        const val = item[header] || '';
        // Escaping quotes and wrapping in quotes if necessary
        const stringVal = String(val).replace(/"/g, '""');
        return `"${stringVal}"`;
      });
      csvRows.push(row.join(','));
    }
    
    const csvString = csvRows.join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="items.csv"');
    res.send(csvString);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start serwera
app.listen(PORT, () => {
  console.log(`🚀 Backend działa na http://localhost:${PORT}`);
  console.log(`📊 Baza danych: ${path.resolve('database.db')}`);
});
