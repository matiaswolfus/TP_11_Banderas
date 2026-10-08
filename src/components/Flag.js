import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { useGame } from '../context/GameContext';

export default function Flag() {
  const { currentCountry } = useGame();

  if (!currentCountry) return null;

  return (
    <View style={styles.frame}>
      <Image
        style={styles.image}
        source={currentCountry.flag}
        contentFit="contain"
        transition={200}
        accessibilityLabel="Bandera a adivinar"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    aspectRatio: 3 / 2,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f2f2f2',
  },
  image: { flex: 1 },
});
