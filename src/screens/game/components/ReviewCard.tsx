import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/theme';

interface ReviewCardProps {
  text: string;
  isCorrect: boolean;
  onToggle: () => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ 
  text, 
  isCorrect, 
  onToggle 
}) => {
  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={onToggle} style={styles.cardContent}>
        <View style={styles.textContainer}>
          <Text style={styles.cardText}>{text}</Text>
        </View>
        <View style={[
          styles.iconContainer,
          { backgroundColor: isCorrect ? colors.success : colors.error }
        ]}>
          <Ionicons
            name={isCorrect ? "checkmark" : "close"}
            size={24}
            color={colors.textLight}
          />
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    marginBottom: 8,
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
}); 