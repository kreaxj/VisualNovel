import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChoiceButton from '../components/ChoiceButton';
import { colors, typography } from '../theme';
import { useGameState } from '../state/useGameState'; 
import { BASE } from '../api/config';

export default function GameScreen({ storyData }) {
  const { gameState, applyEffects, resetState } = useGameState();

  const [currentNodeId, setCurrentNodeId] = useState(storyData.start);
  const [isImageLoading, setIsImageLoading] = useState(true);
  
  const currentNode = storyData.nodes[currentNodeId];

  useEffect(() => {
    setIsImageLoading(true);
  }, [currentNodeId]);

  const handleChoice = (choice) => {
    if (choice.reset) {
      resetState();
      setCurrentNodeId(storyData.start);
      return;
    }

    applyEffects(choice.effects);
    setCurrentNodeId(choice.next);
  };

  const availableChoices = currentNode.choices.filter((choice) => {
    if (!choice.conditions) return true;
    return Object.entries(choice.conditions).every(
      ([key, value]) => gameState[key] === value
    );
  });

  const imageUri = currentNode.image
    ? (currentNode.image.startsWith('http')
        ? currentNode.image
        : `${BASE.replace(/\/?data$/, '')}${currentNode.image}`)
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.statsBar}>
        <Text style={styles.statsText}>Репутация: {gameState.reputation}</Text>
        <Text style={styles.statsText}>Доверие: {gameState.trustLevel}</Text>
        <Text style={styles.statsText}>Меч: {gameState.hasSilverSword ? 'Да' : 'Нет'}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {imageUri && (
          <View style={styles.imageWrapper}>
            {isImageLoading && (
              <View style={styles.imageLoader}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            )}
            <Image 
              source={{ uri: imageUri }} 
              style={styles.sceneImage} 
              resizeMode="cover"
              onLoadEnd={() => setIsImageLoading(false)}
            />
          </View>
        )}

        <View style={styles.textContainer}>
          {currentNode.endingTitle && (
            <Text style={typography.endingTitle}>
              {currentNode.endingTitle}
            </Text>
          )}

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
    flexGrow: 1,
    padding: 20,
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
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  sceneImage: {
    width: '100%',
    aspectRatio: 16 / 9, 
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#000',
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
  textContainer: {
    minHeight: 150,
    marginBottom: 20,
  },
  choicesContainer: {
    marginTop: 'auto',
    paddingBottom: 20,
  },
});