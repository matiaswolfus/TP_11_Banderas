import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GameProvider, useGame } from './src/context/GameContext';
import ScoreBoard from './src/components/ScoreBoard';
import Timer from './src/components/Timer';
import Flag from './src/components/Flag';
import GuessForm from './src/components/GuessForm';
import StartScreen from './src/components/StartScreen';
import Hint from './src/components/Hint';

function Game() {
  const { loading, error, playing, playerName, endGame } = useGame();

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (!playing) {
    return (
      <View style={styles.center}>
        <StartScreen />
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <Text style={styles.player}>Jugador: {playerName}</Text>
      <Text style={styles.hint}>
        {'Respondé con el nombre del país en inglés (ej: "Germany", no "Alemania").'}
      </Text>
      <ScoreBoard />
      <Timer />
      <Flag />
      <Hint />
      <GuessForm />

      <Pressable
        onPress={endGame}
        style={({ pressed }) => [styles.endButton, pressed && styles.endButtonPressed]}
      >
        <Text style={styles.endButtonText}>Terminar partida</Text>
      </Pressable>
    </View>
  );
}

export default function App() {
  return (
    <GameProvider>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Game />
        </ScrollView>
        <StatusBar style="auto" />
      </View>
    </GameProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  center: {
    gap: 12,
    alignItems: 'center',
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  player: { fontSize: 16, fontWeight: '700' },
  hint: { fontSize: 14, fontStyle: 'italic', textAlign: 'center' },
  endButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#b91c1c',
  },
  endButtonPressed: { opacity: 0.8 },
  endButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
