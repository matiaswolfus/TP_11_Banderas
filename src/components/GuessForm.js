import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useGame } from '../context/GameContext';

export default function GuessForm() {
  const { guess } = useGame();
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null

  const handleSubmit = () => {
    if (!answer.trim()) return;

    const isCorrect = guess(answer);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setAnswer('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={answer}
        onChangeText={(text) => {
          setAnswer(text);
          setFeedback(null);
        }}
        onSubmitEditing={handleSubmit}
        placeholder="¿De qué país es?"
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="send"
        submitBehavior="submit"
      />

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Adivinar</Text>
      </Pressable>

      {feedback && (
        <Text style={[styles.feedback, feedback === 'correct' ? styles.correct : styles.wrong]}>
          {feedback === 'correct' ? '¡Correcto! +10' : 'Incorrecto, -1'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', gap: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonPressed: { opacity: 0.8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  feedback: { textAlign: 'center', fontSize: 16, fontWeight: '600' },
  correct: { color: '#16a34a' },
  wrong: { color: '#dc2626' },
});
