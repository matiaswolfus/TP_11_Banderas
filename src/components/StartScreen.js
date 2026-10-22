import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MODES, useGame } from '../context/GameContext';
import Leaderboard from './Leaderboard';

const OPTIONS = [
  { value: MODES.FLAGS, label: 'Banderas' },
  { value: MODES.CAPITALS, label: 'Capitales' },
];

export default function StartScreen() {
  const { playerName, mode: lastMode, startGame, storageError } = useGame();
  // Estado local del formulario; al apretar "Jugar" se manda al Context
  const [name, setName] = useState(playerName);
  const [mode, setMode] = useState(lastMode);

  const canStart = name.trim().length > 0;

  const handleStart = () => {
    if (canStart) startGame(name, mode);
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

      <View style={styles.modes}>
        {OPTIONS.map((opt) => {
          const selected = mode === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => setMode(opt.value)}
              style={[styles.mode, selected && styles.modeSelected]}
            >
              <Text style={[styles.modeText, selected && styles.modeTextSelected]}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

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
  modes: { flexDirection: 'row', gap: 8 },
  mode: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e3a8a',
  },
  modeSelected: { backgroundColor: '#1e3a8a' },
  modeText: { color: '#1e3a8a', fontWeight: '600' },
  modeTextSelected: { color: '#fff' },
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
