import { StyleSheet, Text, View } from 'react-native';
import { useGame } from '../context/GameContext';

export default function Timer() {
  const { timeLeft } = useGame();
  const urgent = timeLeft <= 5;

  return (
    <View style={[styles.card, urgent && styles.cardUrgent]}>
      <Text style={[styles.label, urgent && styles.labelUrgent]}>TIEMPO</Text>
      <Text style={styles.time}>{timeLeft}s</Text>
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
  cardUrgent: { backgroundColor: '#b91c1c' },
  label: { color: '#bfdbfe', fontSize: 13, fontWeight: '600', letterSpacing: 2 },
  labelUrgent: { color: '#fecaca' },
  time: { color: '#ffffff', fontSize: 40, fontWeight: '800' },
});