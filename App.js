import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Flag from './src/components/Flag';
import GuessForm from './src/components/GuessForm';
import ScoreBoard from './src/components/ScoreBoard';
import { GameProvider, useGame } from './src/context/GameContext';

function Game() {
  const { loading, error } = useGame();

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

  return (
    <View style={styles.center}>
      <Text style={styles.hint}>
        Respondé con el nombre del país en inglés (ej: "Germany", no "Alemania").
      </Text>

      <ScoreBoard />
      <Flag />
      <GuessForm />
    </View>
  );
}

export default function App() {
  return (
    <GameProvider>
      <View style={styles.container}>
        <Game />
      </View>
      <StatusBar style="auto" />
    </GameProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  center: { gap: 12, alignItems: 'center' },
  hint: { fontSize: 14, fontStyle: 'italic', textAlign: 'center' },
});