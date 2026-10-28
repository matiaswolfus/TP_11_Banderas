import { StyleSheet, Text, View } from 'react-native';
import { useGame } from '../context/GameContext';

export default function Leaderboard() {
  const { scores, playerName } = useGame();

  // Top 10 ordenado por puntaje (desempata por nombre)
  const top = [...scores]
    .sort((a, b) => b.bestScore - a.bestScore || a.name.localeCompare(b.name))
    .slice(0, 10);

  const isCurrent = (name) =>
    playerName !== '' && name.toLowerCase() === playerName.toLowerCase();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>TOP 10</Text>

      {top.length === 0 ? (
        <Text style={styles.empty}>Todavía no hay puntajes.</Text>
      ) : (
        top.map((s, i) => (
          <View key={s.name} style={[styles.row, isCurrent(s.name) && styles.rowCurrent]}>
            <Text style={styles.position}>{i + 1}</Text>
            <Text style={styles.name} numberOfLines={1}>
              {s.name}
            </Text>
            <Text style={styles.points}>{s.bestScore}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    gap: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#1e3a8a',
  },
  title: { color: '#bfdbfe', fontSize: 13, fontWeight: '600', letterSpacing: 2 },
  empty: { color: '#ffffff' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  rowCurrent: { backgroundColor: 'rgba(255,255,255,0.15)' },
  position: { color: '#93c5fd', fontSize: 16, fontWeight: '700', width: 24 },
  name: { color: '#ffffff', fontSize: 16, flex: 1 },
  points: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
});
