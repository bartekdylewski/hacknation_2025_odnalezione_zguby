const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'database.db');

// Backup bazy danych
const backupPath = path.join(__dirname, `database.backup.${Date.now()}.db`);
fs.copyFileSync(dbPath, backupPath);
console.log(`✅ Backup utworzony: ${backupPath}`);

// Otwórz bazę i wyczyść dane
const db = new Database(dbPath);

console.log('\n🗑️  Czyszczenie bazy danych...');

// Usuń wszystkie przedmioty
const deletedItems = db.prepare('DELETE FROM found_items').run();
console.log(`   Usunięto przedmiotów: ${deletedItems.changes}`);

// Usuń wszystkich użytkowników
const deletedUsers = db.prepare('DELETE FROM users').run();
console.log(`   Usunięto użytkowników: ${deletedUsers.changes}`);

db.close();

console.log('\n✅ Baza danych wyczyszczona!');
console.log(`📦 Backup: ${backupPath}`);
