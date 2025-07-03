import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
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
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.playerRow}>
          <Text style={styles.currentPlayerText}>{currentPlayer}</Text>
          <View style={styles.crownContainer}>
            <Ionicons 
              name="trophy" 
              size={24} 
              color={colors.primary} 
            />
          </View>
        </View>
        
        <View style={styles.nextPlayerContainer}>
          <Text style={styles.nextLabel}>SIGUIENTE:</Text>
          <Text style={styles.nextPlayerText}>{nextPlayer}</Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    elevation: 4,
  },
  content: {
    paddingVertical: 12,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  currentPlayerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  crownContainer: {
    marginLeft: 8,
  },
  nextPlayerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 8,
  },
  nextPlayerText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
}); 