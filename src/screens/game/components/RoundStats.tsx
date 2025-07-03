import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
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
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.statItem}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name="checkmark-circle" 
              size={24} 
              color={colors.success} 
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>ACERTADAS</Text>
            <Text style={[styles.count, { color: colors.success }]}>
              {correctCount}
            </Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statItem}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name="close-circle" 
              size={24} 
              color={colors.error} 
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>PASADAS</Text>
            <Text style={[styles.count, { color: colors.error }]}>
              {incorrectCount}
            </Text>
          </View>
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
    paddingVertical: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  count: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: colors.text + '20',
    marginVertical: 8,
  },
}); 