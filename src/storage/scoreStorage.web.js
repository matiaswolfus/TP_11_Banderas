const KEY = 'flag-game:best-scores:v2';

const read = () => {
  try {
    const raw = globalThis.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

// Top 10 de un modo
export async function loadScores(mode) {
  return Object.values(read())
    .filter((entry) => entry.mode === mode)
    .sort((a, b) => b.bestScore - a.bestScore || a.name.localeCompare(b.name))
    .slice(0, 10)
    .map(({ name, bestScore }) => ({ name, bestScore }));
}

// Guarda solo si supera el mejor puntaje previo del jugador en ese modo
export async function saveBestScore(name, mode, score) {
  const data = read();
  const key = `${mode}:${name.toLowerCase()}`;
  const prev = data[key];

  if (!prev || score > prev.bestScore) {
    data[key] = { name: prev?.name ?? name, mode, bestScore: score };
    globalThis.localStorage.setItem(KEY, JSON.stringify(data));
  }
}
