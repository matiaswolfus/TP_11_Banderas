import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useGame } from '../context/GameContext';

export default function GuessForm() {
  const { guess, currentCountry } = useGame();
  const inputRef = useRef(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null); // puntos de la última jugada (+N o -1) | null

  // Con cada bandera nueva el campo vuelve a quedar listo para escribir
  useEffect(() => {
    inputRef.current?.focus();
  }, [currentCountry]);

  const handleSubmit = () => {
    const points = guess(answer);
    if (points === 0) return; // vacío: no hace nada

    setFeedback(points);
    if (points > 0) setAnswer('');
    // Acierte o falle, el campo queda listo para seguir escribiendo
    inputRef.current?.focus();
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        autoFocus
        selectTextOnFocus
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

      {feedback !== null && (
        <Text style={[styles.feedback, feedback > 0 ? styles.correct : styles.wrong]}>
          {feedback > 0 ? `¡Correcto! +${feedback}` : `Incorrecto, ${feedback}`}
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
