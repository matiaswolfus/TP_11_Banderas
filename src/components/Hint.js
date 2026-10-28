import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useGame } from '../context/GameContext';

export default function Hint() {
  const { hintMask, requestHint, canHint, hintCost } = useGame();

  if (hintMask.length === 0) return null;

  // Los espacios del nombre se ven como una separación más ancha entre palabras
  const display = hintMask.map((ch) => (ch === ' ' ? '\u00A0\u00A0' : ch)).join(' ');

  return (
    <View style={styles.card}>
      <Text style={styles.label}>PISTA</Text>
      <Text style={styles.mask}>{display}</Text>
      <Pressable
        onPress={requestHint}
        disabled={!canHint}
        style={({ pressed }) => [
          styles.button,
          !canHint && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonText}>Revelar letra (-{hintCost}s)</Text>
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
  mask: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
  },
  button: {
    marginTop: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: '#3b82f6',
  },
  buttonDisabled: { opacity: 0.4 },
  buttonPressed: { opacity: 0.7 },
  buttonText: { color: '#ffffff', fontWeight: '600' },
});