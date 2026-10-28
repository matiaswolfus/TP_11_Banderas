import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useGame } from '../context/GameContext';
import Leaderboard from './Leaderboard';

export default function StartScreen() {
  const { playerName, startGame, storageError } = useGame();
  // Estado local del formulario; al apretar "Jugar" se manda al Context
  const [name, setName] = useState(playerName);

  const canStart = name.trim().length > 0;

  const handleStart = () => {
    if (canStart) startGame(name);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adiviná la bandera</Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        onSubmitEditing={handleStart}
        placeholder="Tu nombre"
        maxLength={20}
        autoCorrect={false}
        returnKeyType="go"
      />

      <Pressable
        onPress={handleStart}
        disabled={!canStart}
        style={({ pressed }) => [
          styles.button,
          !canStart && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonText}>Jugar</Text>
      </Pressable>

      {storageError && <Text style={styles.error}>{storageError}</Text>}

      <Leaderboard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignSelf: 'stretch', gap: 12 },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center' },
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
  buttonDisabled: { opacity: 0.4 },
  buttonPressed: { opacity: 0.8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  error: { color: '#dc2626', textAlign: 'center' },
});
