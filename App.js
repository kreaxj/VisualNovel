import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import GameScreen from './src/screens/GameScreen';
import { colors, typography } from './src/theme';

// Путь к JSON в папке public. 
// При сборке Expo скопирует его в корень сайта.
const STORY_URL = './data/story.json'; 

export default function App() {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStory() {
      try {
        // Cache-busting: добавляем время, чтобы браузер не кэшировал старый файл
        const url = `${STORY_URL}?v=${Date.now()}`;
        
        const response = await fetch(url, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });

        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        setStory(data);
      } catch (error) {
        console.error('Не удалось загрузить сюжет:', error);
        // Здесь можно оставить локальный фоллбэк (импортируя его как обычный JS объект), 
        // но раз мы используем public, лучше просто показать ошибку.
      } finally {
        setLoading(false);
      }
    }

    loadStory();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[typography.body, { marginTop: 16 }]}>Загрузка сюжета...</Text>
      </View>
    );
  }

  if (!story) {
    return (
      <View style={styles.center}>
        <Text style={typography.body}>Ошибка загрузки данных. Проверьте интернет.</Text>
      </View>
    );
  }

  return <GameScreen storyData={story} />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});