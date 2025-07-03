import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/theme';

interface RoundStatsProps {
  correctCount: number;
  incorrectCount: number;
}

export const RoundStats: React.FC<RoundStatsProps> = ({ 
  correctCount, 
  incorrectCount 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Ionicons 
          name="checkmark-circle" 
          size={20} 
          color={colors.success} 
        />
        <Text style={styles.count}>
          {correctCount}
        </Text>
      </View>
      
      <View style={styles.statItem}>
        <Ionicons 
          name="close-circle" 
          size={20} 
          color={colors.error} 
        />
        <Text style={styles.count}>
          {incorrectCount}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  count: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textLight,
  },
}); 