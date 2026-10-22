import * as SQLite from 'expo-sqlite';

let dbPromise = null;

// Abre la base una sola vez y crea la tabla si no existe
const getDb = () => {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('flaggame.db')
      .then(async (db) => {
        await db.execAsync(
          `CREATE TABLE IF NOT EXISTS scores_by_mode (
             name TEXT NOT NULL COLLATE NOCASE,
             mode TEXT NOT NULL,
             best_score INTEGER NOT NULL,
             PRIMARY KEY (name, mode)
           );`
        );
        return db;
      })
      .catch((e) => {
        dbPromise = null; // permite reintentar si falló
        throw e;
      });
  }
  return dbPromise;
};

// Top 10 de un modo
export async function loadScores(mode) {
  const db = await getDb();
  return db.getAllAsync(
    `SELECT name, best_score AS bestScore
     FROM scores_by_mode
     WHERE mode = ?
     ORDER BY best_score DESC, name ASC
     LIMIT 10`,
    [mode]
  );
}

// Guarda solo si supera el mejor puntaje previo del jugador en ese modo
export async function saveBestScore(name, mode, score) {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO scores_by_mode (name, mode, best_score) VALUES (?, ?, ?)
     ON CONFLICT(name, mode) DO UPDATE SET best_score = MAX(best_score, excluded.best_score)`,
    [name, mode, score]
  );
}
