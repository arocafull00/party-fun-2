import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, typography } from '../../../theme/theme';

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
    fontSize: typography.sizes.sm,
    color: colors.text,
    marginBottom: 2,
  },
  nextPlayerText: {
    fontSize: typography.sizes.md,
    color: colors.text,
    fontWeight: '700',
  },
}); 