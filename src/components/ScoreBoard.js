import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useGame } from '../context/GameContext';

export default function ScoreBoard() {
  const { score, resetScore } = useGame();

  return (
    <View style={styles.card}>
      <Text style={styles.label}>PUNTAJE</Text>
      <Text style={styles.score}>{score}</Text>
      <Pressable
        onPress={resetScore}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>Reiniciar puntaje</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#1e3a8a',
  },
  label: { color: '#bfdbfe', fontSize: 13, fontWeight: '600', letterSpacing: 2 },
  score: { color: '#ffffff', fontSize: 56, fontWeight: '800' },
  button: {
    marginTop: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: '#3b82f6',
  },
  buttonPressed: { opacity: 0.7 },
  buttonText: { color: '#ffffff', fontWeight: '600' },
}); 