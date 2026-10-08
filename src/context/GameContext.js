import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const API_URL = 'https://countriesnow.space/api/v0.1/countries/flag/images';

const GameContext = createContext(null);

// Minúsculas, sin tildes, sin espacios sobrantes y con espacios múltiples colapsados
const normalize = (text) =>
  text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');

// Elige un país al azar, evitando repetir el actual si hay más de uno
const pickRandom = (list, exclude) => {
  if (list.length === 0) return null;
  if (list.length === 1) return list[0];
  let next;
  do {
    next = list[Math.floor(Math.random() * list.length)];
  } while (exclude && next.name === exclude.name);
  return next;
};

export function GameProvider({ children }) {
  const [countries, setCountries] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Al montar: traer países y elegir uno al azar
  useEffect(() => {
    let cancelled = false;

    const loadCountries = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
        const json = await res.json();

        // La API puede traer items incompletos: nos quedamos con los válidos
        const valid = (json.data ?? []).filter((c) => c?.name && c?.flag);

        if (cancelled) return;
        setCountries(valid);
        setCurrentCountry(pickRandom(valid, null));
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadCountries();
    return () => {
      cancelled = true;
    };
  }, []);

  const nextCountry = useCallback(() => {
    setCurrentCountry((prev) => pickRandom(countries, prev));
  }, [countries]);

  // Devuelve true/false para que la UI pueda dar feedback
  const guess = useCallback(
    (answer) => {
      if (!currentCountry) return false;

      const cleaned = normalize(answer ?? '');
      if (!cleaned) return false; // vacío o solo espacios: no hace nada

      const isCorrect = cleaned === normalize(currentCountry.name);

      if (isCorrect) {
        setScore((s) => s + 10);
        nextCountry();
      } else {
        setScore((s) => s - 1);
      }
      return isCorrect;
    },
    [currentCountry, nextCountry]
  );

  const resetScore = useCallback(() => setScore(0), []);

  const value = useMemo(
    () => ({
      countries,
      currentCountry,
      score,
      loading,
      error,
      guess,
      nextCountry,
      resetScore,
    }),
    [countries, currentCountry, score, loading, error, guess, nextCountry, resetScore]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame debe usarse dentro de un <GameProvider>');
  }
  return context;
}