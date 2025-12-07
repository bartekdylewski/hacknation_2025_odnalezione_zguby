const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Inicjalizacja bazy danych
const db = new Database('database.db');

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
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    date TEXT NOT NULL,
    personal_code TEXT NOT NULL,
    submitted_by TEXT NOT NULL,
    submitted_at TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    issued_at TEXT
  );
`);

// ========== USERS API ==========

// Pobierz wszystkich użytkowników
app.get('/api/users', (req, res) => {
  try {
    const users = db.prepare('SELECT id, username, name FROM users').all();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Zarejestruj użytkownika
app.post('/api/users/register', (req, res) => {
  try {
    const { username, password, name } = req.body;
    const stmt = db.prepare('INSERT INTO users (username, password, name) VALUES (?, ?, ?)');
    const result = stmt.run(username, password, name);
    res.json({ id: result.lastInsertRowid, username, name });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Logowanie użytkownika
app.post('/api/users/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const user = db.prepare('SELECT id, username, name FROM users WHERE username = ? AND password = ?')
      .get(username, password);
    
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: 'Nieprawidłowe dane logowania' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== FOUND ITEMS API ==========

// Pobierz wszystkie znalezione rzeczy
app.get('/api/items', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM found_items ORDER BY submitted_at DESC').all();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pobierz aktywne rzeczy
app.get('/api/items/active', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM found_items WHERE status = ? ORDER BY submitted_at DESC')
      .all('active');
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pobierz wydane rzeczy
app.get('/api/items/issued', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM found_items WHERE status = ? ORDER BY issued_at DESC')
      .all('issued');
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dodaj nową znalezioną rzecz
app.post('/api/items', (req, res) => {
  try {
    const { id, category, description, location, date, personal_code, submitted_by, submitted_at } = req.body;
    const stmt = db.prepare(`
      INSERT INTO found_items (id, category, description, location, date, personal_code, submitted_by, submitted_at, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `);
    stmt.run(id, category, description, location, date, personal_code, submitted_by, submitted_at);
    res.json({ success: true, id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Wydaj rzecz
app.patch('/api/items/:id/issue', (req, res) => {
  try {
    const { id } = req.params;
    const { issued_at } = req.body;
    const stmt = db.prepare('UPDATE found_items SET status = ?, issued_at = ? WHERE id = ?');
    stmt.run('issued', issued_at, id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Usuń rzecz
app.delete('/api/items/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM found_items WHERE id = ?');
    stmt.run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
