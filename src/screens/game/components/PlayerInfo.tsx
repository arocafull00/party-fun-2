import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../../theme/theme';

interface PlayerInfoProps {
  currentPlayer: string;
  nextPlayer: string;
}

export const PlayerInfo: React.FC<PlayerInfoProps> = ({ 
  currentPlayer, 
  nextPlayer 
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.currentPlayerText}>{currentPlayer}</Text>
      <Text style={styles.nextPlayerText}>Siguiente: {nextPlayer}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  currentPlayerText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 2,
    opacity: 0.7,
  },
  nextPlayerText: {
    fontSize: 16,
    color: colors.textLight,
    fontWeight: 'bold',
  },
}); 