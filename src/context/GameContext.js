import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { loadScores, saveBestScore } from '../storage/scoreStorage';

const API_URL = 'https://countriesnow.space/api/v0.1/countries/flag/images';
const TIME_LIMIT = 15;
const HINT_COST = 2; // segundos que descuenta cada pista

// Clave con la que se guarda el ranking en el storage
const SCORES_KEY = 'flags';

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

// Es letra si tiene mayúscula/minúscula distinta (espacios, guiones y apóstrofes no)
const isLetter = (ch) => ch.toLowerCase() !== ch.toUpperCase();

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
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [revealed, setRevealed] = useState([]); // posiciones de letras reveladas
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Multijugador
  const [playing, setPlaying] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [scores, setScores] = useState([]);
  const [storageError, setStorageError] = useState(null);

  // Al montar: traer países
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

  // Al montar: leer el ranking guardado
  useEffect(() => {
    let cancelled = false;

    const loadRanking = async () => {
      try {
        const saved = await loadScores(SCORES_KEY);
        if (!cancelled) setScores(saved);
      } catch {
        if (!cancelled) setStorageError('No se pudo leer el ranking guardado.');
      }
    };

    loadRanking();
    return () => {
      cancelled = true;
    };
  }, []);

  // Pasa a otro país, reinicia el timer y borra las pistas en el mismo render
  const nextCountry = useCallback(() => {
    setCurrentCountry((prev) => pickRandom(countries, prev));
    setTimeLeft(TIME_LIMIT);
    setRevealed([]);
  }, [countries]);

  // Copia de timeLeft para leerla dentro del intervalo sin recrearlo cada segundo
  const timeLeftRef = useRef(TIME_LIMIT);
  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  // Nombre con "_" en las letras que faltan: ['G','_','r','_','a','_','y']
  const hintMask = useMemo(() => {
    if (!currentCountry) return [];
    return Array.from(currentCountry.name).map((ch, i) =>
      isLetter(ch) && !revealed.includes(i) ? '_' : ch
    );
  }, [currentCountry, revealed]);

  // Se puede pedir pista si quedan letras ocultas y el tiempo alcanza para pagarla
  const canHint =
    playing && currentCountry !== null && timeLeft > HINT_COST && hintMask.includes('_');

  // Revela una letra al azar y descuenta HINT_COST segundos
  const requestHint = useCallback(() => {
    if (!canHint) return;

    const hidden = [];
    hintMask.forEach((ch, i) => {
      if (ch === '_') hidden.push(i);
    });
    const pick = hidden[Math.floor(Math.random() * hidden.length)];

    setRevealed((prev) => [...prev, pick]);
    setTimeLeft((t) => Math.max(0, t - HINT_COST));
  }, [canHint, hintMask]);

  // Empieza una partida nueva para el jugador y modo elegidos
  const startGame = useCallback(
    (name) => {
      const cleanName = (name ?? '').trim().replace(/\s+/g, ' ');
      if (!cleanName || countries.length === 0) return false;

      setPlayerName(cleanName);
      setScore(0);
      setTimeLeft(TIME_LIMIT);
      setRevealed([]);
      setCurrentCountry(pickRandom(countries, null));
      setStorageError(null);
      setPlaying(true);
      return true;
    },
    [countries]
  );

  // Termina la partida: vuelve al inicio y guarda el mejor puntaje del jugador en este modo
  const endGame = useCallback(async () => {
    setPlaying(false);
    try {
      await saveBestScore(playerName, SCORES_KEY, score);
      setScores(await loadScores(SCORES_KEY));
    } catch {
      setStorageError('No se pudo guardar el puntaje.');
    }
  }, [playerName, score]);

  // Cuenta regresiva: solo mientras se juega, un intervalo por bandera
  useEffect(() => {
    if (!playing || !currentCountry) return;

    const id = setInterval(() => {
      if (timeLeftRef.current <= 1) {
        // Se acabó el tiempo: termina la partida y se guarda el puntaje
        endGame();
      } else {
        setTimeLeft((t) => t - 1);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [playing, currentCountry, endGame]);

  // Devuelve los puntos de la jugada: +N si acierta, -1 si falla, 0 si no hizo nada
  const guess = useCallback(
    (answer) => {
      if (!currentCountry) return 0;

      const cleaned = normalize(answer ?? '');
      if (!cleaned) return 0; // vacío o solo espacios: no hace nada

      if (cleaned === normalize(currentCountry.name)) {
        const points = 10 + timeLeft;
        setScore((s) => s + points);
        nextCountry();
        return points;
      }

      setScore((s) => s - 1);
      return -1;
    },
    [currentCountry, timeLeft, nextCountry]
  );

  const resetScore = useCallback(() => setScore(0), []);

  const value = useMemo(
    () => ({
      countries,
      currentCountry,
      score,
      timeLeft,
      hintMask,
      canHint,
      hintCost: HINT_COST,
      loading,
      error,
      playing,
      playerName,
      scores,
      storageError,
      guess,
      nextCountry,
      requestHint,
      resetScore,
      startGame,
      endGame,
    }),
    [
      countries,
      currentCountry,
      score,
      timeLeft,
      hintMask,
      canHint,
      loading,
      error,
      playing,
      playerName,
      scores,
      storageError,
      guess,
      nextCountry,
      requestHint,
      resetScore,
      startGame,
      endGame,
    ]
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