import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import ChoiceButton from '../components/ChoiceButton';
import { colors, typography } from '../theme';
import { useGameState } from '../state/useGameState'; 

export default function GameScreen({ storyData }) {
  // 🆕 Достаем состояние и функции из нашего хука
  const { gameState, applyEffects, resetState } = useGameState();

  const [currentNodeId, setCurrentNodeId] = useState(storyData.start);
  const [isImageLoading, setIsImageLoading] = useState(true);
  
  const currentNode = storyData.nodes[currentNodeId];

  // Сбрасываем лоадер картинки при смене узла
  useEffect(() => {
    setIsImageLoading(true);
  }, [currentNodeId]);

  const handleChoice = (choice) => {
    // Если в JSON у выбора есть флаг reset: true
    if (choice.reset) {
      resetState(); // 🆕 Сбрасываем стейт через хук
      setCurrentNodeId(storyData.start);
      return;
    }

    // Применяем эффекты (изменяем переменные)
    applyEffects(choice.effects); // 🆕 Используем функцию из хука

    // Переходим к следующему узлу
    setCurrentNodeId(choice.next);
  };

  // Фильтруем доступные выборы (проверяем conditions)
  const availableChoices = currentNode.choices.filter((choice) => {
    if (!choice.conditions) return true;
    return Object.entries(choice.conditions).every(
      ([key, value]) => gameState[key] === value
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.statsBar}>
        <Text style={styles.statsText}>Репутация: {gameState.reputation}</Text>
        <Text style={styles.statsText}>Доверие: {gameState.trustLevel}</Text>
        {/* Меч и Чародейку можно вывести для теста */}
        <Text style={styles.statsText}>Меч: {gameState.hasSilverSword ? 'Да' : 'Нет'}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {currentNode.image && (
          <View style={styles.imageWrapper}>
            {isImageLoading && (
              <View style={styles.imageLoader}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            )}
            <Image 
              source={{ uri: currentNode.image }} 
              style={styles.sceneImage} 
              resizeMode="cover"
              onLoadEnd={() => setIsImageLoading(false)}
            />
          </View>
        )}

        <View style={styles.textContainer}>
          <Text style={typography.body}>{currentNode.text}</Text>
        </View>

        <View style={styles.choicesContainer}>
          {availableChoices.map((choice, index) => (
            <ChoiceButton
              key={index}
              text={choice.text}
              onPress={() => handleChoice(choice)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  statsText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  imageLoader: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
  },
  sceneImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#000',
  },
  textContainer: {
    minHeight: 150,
    marginBottom: 20,
  },
  choicesContainer: {
    marginTop: 'auto',
  },
});