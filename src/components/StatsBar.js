import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function StatsBar({ gameState }) {
  const hasAnyStats = 
    gameState.evidence !== null || 
    gameState.eustachyPunished !== null || 
    gameState.pastodiSpared !== null || 
    gameState.truthKnown;

  return (
    <View style={styles.statsBar}>
      <View style={styles.statsContainer}>
        
        {gameState.evidence !== null && (
          <View style={styles.statItem}>
            <Text style={styles.statsText}>
              Улики: {gameState.evidence ? 'Собраны' : 'Нет'}
            </Text>
          </View>
        )}
        
        {gameState.eustachyPunished !== null && (
          <View style={styles.statItem}>
            <Text style={styles.statsText}>
              Евстахий: {gameState.eustachyPunished ? 'Наказан' : 'Пощажен'}
            </Text>
          </View>
        )}
        
        {gameState.pastodiSpared !== null && (
          <View style={styles.statItem}>
            <Text style={styles.statsText}>
              Пастоди: {gameState.pastodiSpared ? 'Пощажен' : 'Убит'}
            </Text>
          </View>
        )}

        {!hasAnyStats && (
          <View style={styles.statItem}>
            <Text style={styles.statsPlaceholder}>Дневник следствия пуст...</Text>
          </View>
        )}
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsBar: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 50,
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
  },
  statItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  statsText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statsPlaceholder: {
    color: colors.textMuted,
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    width: '100%',
  },
});