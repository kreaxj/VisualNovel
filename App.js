import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import GameScreen from './src/screens/GameScreen';
import { colors, typography } from './src/theme';
import { loadStory } from './src/api/dataLoader';

export default function App() {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const result = await loadStory();
        setStory(result.story);
        console.log(`Загружено. Версия: ${result.version}. Из кэша: ${result.fromCache}`);
      } catch (e) {
        console.error(e);
        setError('Не удалось загрузить сюжет. Проверьте интернет.');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[typography.body, { marginTop: 16 }]}>Загрузка сюжета...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.center}>
          <Text style={typography.body}>{error}</Text>
        </View>
      );
    }

    return <GameScreen storyData={story} />;
  };

  return (
    <SafeAreaProvider>
      {renderContent()}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
});