const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, './db/voters.db');
const db = new Database(dbPath);

// Optional: Initialize table
db.exec(`
  CREATE TABLE IF NOT EXISTS voters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    voter TEXT
  )
`);

function insertVoter(data) {
  const dataStr = JSON.stringify(data);
  if (dataStr && dataStr.trim() !== '') {
    return db.prepare('INSERT INTO voters (voter) VALUES (?)').run(dataStr);
  }
}

function getVoters() {
  return db.prepare(`SELECT * FROM voters`).all();
}

async function getVoterById(id) {
  return db.prepare(`SELECT * FROM voters WHERE id = ?`).get(id);
}

async function updateVoter(id, voterData) {
  const voterJson = JSON.stringify(voterData);
  const stmt = db.prepare('UPDATE voters SET voter = ? WHERE id = ?');
  const result = stmt.run(voterJson, id);
  return result.changes > 0; // true if row was updated
}

module.exports = {
  insertVoter,
  getVoters,
  getVoterById,
  updateVoter
};
