const path = require('path');
const Database = require('better-sqlite3');
const { log } = require('console');

const dbPath = path.join(__dirname, './db/voters.db');
const db = new Database(dbPath);

// Optional: Initialize table
 db.exec(`
  CREATE TABLE IF NOT EXISTS voters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_by TEXT,
    created_at TEXT,
    updated_at TEXT,
    is_synced INTEGER DEFAULT 0,
    voter TEXT
  )
`);

 db.exec(`
  CREATE TABLE IF NOT EXISTS districts (
    id TEXT PRIMARY KEY,
    name_en TEXT,
    name_hi TEXT
  )
`);

 db.exec(`
  CREATE TABLE IF NOT EXISTS vidhan_sabhas (
    id TEXT PRIMARY KEY,
    district_id TEXT,
    name_en TEXT,
    name_hi TEXT,
    FOREIGN KEY(district_id) REFERENCES districts(id)
  )
`);

 db.exec(`
  CREATE TABLE IF NOT EXISTS wards (
    id TEXT PRIMARY KEY,
    vidhan_sabha_id TEXT,
    name_en TEXT,
    name_hi TEXT,
    FOREIGN KEY(vidhan_sabha_id) REFERENCES vidhan_sabhas(id)
  )`
);

 db.exec(`
  CREATE TABLE IF NOT EXISTS mohallas (
    id TEXT PRIMARY KEY,
    ward_id TEXT,
    vidhan_sabha_id TEXT,
    name_en TEXT,
    name_hi TEXT,
    area TEXT,
    FOREIGN KEY(ward_id) REFERENCES wards(id)
  )`
);

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

function insertMasterData(masterData) {
  const insertDistrict = db.prepare(
    `INSERT OR REPLACE INTO districts (id, name_en, name_hi) VALUES (?, ?, ?)`
  );
  const insertVS = db.prepare(
    `INSERT OR REPLACE INTO vidhan_sabhas (id, district_id, name_en, name_hi) VALUES (?, ?, ?, ?)`
  );
  const insertWard = db.prepare(
    `INSERT OR REPLACE INTO wards (id, vidhan_sabha_id, name_en, name_hi) VALUES (?, ?, ?, ?)`
  );
  const insertMohalla = db.prepare(
    `INSERT OR REPLACE INTO mohallas (id, ward_id, vidhan_sabha_id, name_en, name_hi, area) VALUES (?, ?, ?, ?, ?, ?)`
  );

  const transaction = db.transaction(() => {
    for (const district of masterData) {
      insertDistrict.run(district.district_id, district.district_name_en, district.district_name_hi);

      for (const vs of district.vidhan_sabhas || []) {
        insertVS.run(vs.vidhan_sabha_id, district.district_id, vs.vidhan_sabha_name_en, vs.vidhan_sabha_name_hi);

        for (const ward of vs.wards || []) {
          insertWard.run(ward.ward_id, vs.vidhan_sabha_id, ward.ward_name_en, ward.ward_name_hi);

          for (const mohalla of ward.mohallas || []) {
            insertMohalla.run(mohalla.mohalla_id, ward.ward_id, vs.vidhan_sabha_id, mohalla.mohalla_name_en, mohalla.mohalla_name_hi, mohalla.mohalla_area);
          }
        }
      }
    }
  });

  transaction();
}

// 1. Get all districts
function getDistricts() {
  const stmt = db.prepare('SELECT * FROM districts ORDER BY name_en');
  return stmt.all();
}

// 2. Get Vidhan Sabhas by district_id
function getVidhanSabhasByDistrict(district_id) {
  const stmt = db.prepare('SELECT * FROM vidhan_sabhas WHERE district_id = ? ORDER BY name_en');
  return stmt.all(district_id);
}

// 3. Get Wards by vidhan_sabha_id
function getWardsByVidhanSabha(vidhan_sabha_id) {
  const stmt = db.prepare('SELECT * FROM wards WHERE vidhan_sabha_id = ? ORDER BY name_en');
  return stmt.all(vidhan_sabha_id);
}

// 4. Get Mohallas by ward_id
function getMohallasByWard(ward_id) {
  const stmt = db.prepare('SELECT * FROM mohallas WHERE ward_id = ? ORDER BY name_en');
  return stmt.all(ward_id);
}

async function getNameById(table,id) {
  return db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
}

module.exports = {
  insertVoter,
  getVoters,
  getVoterById,
  updateVoter,
  insertMasterData,
  getDistricts,
  getVidhanSabhasByDistrict,
  getWardsByVidhanSabha,
  getMohallasByWard,
  getNameById
};
