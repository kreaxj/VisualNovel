import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChoiceButton from '../components/ChoiceButton';
import StatsBar from '../components/StatsBar';
import { colors, typography } from '../theme';
import { useGameState } from '../state/useGameState'; 
import { BASE } from '../api/config';

export default function GameScreen({ storyData }) {
  const { gameState, applyEffects, resetState } = useGameState();

  const [currentNodeId, setCurrentNodeId] = useState(storyData.start);
  const [isImageLoading, setIsImageLoading] = useState(true);
  
  const currentNode = storyData.nodes[currentNodeId];

  useEffect(() => {
    if (!currentNode) {
      setCurrentNodeId(storyData.start);
    }
  }, [currentNode, storyData.start]);

  useEffect(() => {
    if (currentNode && currentNode.effects) {
      applyEffects(currentNode.effects);
    }
  }, [currentNodeId]);

  useEffect(() => {
    setIsImageLoading(true);
  }, [currentNodeId]);

  if (!currentNode) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[typography.body, { marginTop: 16 }]}>Загрузка узла...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleChoice = (choice) => {
    if (choice.reset) {
      resetState();
      setCurrentNodeId(storyData.start);
      return;
    }

    if (choice.effects) {
      applyEffects(choice.effects);
    }
    
    setCurrentNodeId(choice.next);
  };

  const availableChoices = currentNode.choices ? currentNode.choices.filter((choice) => {
    if (!choice.conditions) return true;
    return Object.entries(choice.conditions).every(
      ([key, value]) => gameState[key] === value
    );
  }) : [];

  const imageUri = currentNode.image
    ? (currentNode.image.startsWith('http')
        ? currentNode.image
        : `${BASE.replace(/\/?data$/, '')}${currentNode.image}`)
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <StatsBar gameState={gameState} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentWrapper}>
          
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 800,
    flex: 1,
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 24,
    width: '100%',
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
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  choicesContainer: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    marginTop: 10,
    paddingBottom: 20,
  },
});