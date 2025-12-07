const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

console.log('📊 Database location:', dbPath);
console.log('\n=== USERS ===');
const users = db.prepare('SELECT * FROM users').all();
console.log('Total users:', users.length);
users.forEach(user => {
  console.log(`- ${user.username} (${user.name})`);
});

console.log('\n=== FOUND ITEMS ===');
const items = db.prepare('SELECT * FROM found_items').all();
console.log('Total items:', items.length);
items.forEach(item => {
  console.log(`- [${item.status}] ${item.title}: ${item.description.substring(0, 50)}...`);
});

db.close();
