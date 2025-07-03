import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/theme';

interface ReviewCardProps {
  text: string;
  isCorrect: boolean;
  onToggle: () => void;
  horizontal?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

export const ReviewCard: React.FC<ReviewCardProps> = ({ 
  text, 
  isCorrect, 
  onToggle,
  horizontal = false
}) => {
  const cardStyle = horizontal ? styles.horizontalCard : styles.card;
  const contentStyle = horizontal ? styles.horizontalCardContent : styles.cardContent;
  const textContainerStyle = horizontal ? styles.horizontalTextContainer : styles.textContainer;
  const textStyle = horizontal ? styles.horizontalCardText : styles.cardText;

  return (
    <Card style={cardStyle}>
      <TouchableOpacity onPress={onToggle} style={contentStyle}>
        <View style={textContainerStyle}>
          <Text style={textStyle}>{text}</Text>
        </View>
        <View style={[
          styles.iconContainer,
          { backgroundColor: isCorrect ? colors.success : colors.error }
        ]}>
          <Ionicons
            name={isCorrect ? "checkmark" : "close"}
            size={horizontal ? 32 : 24}
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
  horizontalCard: {
    backgroundColor: colors.surface,
    elevation: 6,
    borderRadius: 16,
    width: screenWidth * 0.7,
    minHeight: 200,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  horizontalCardContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    minHeight: 200,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  horizontalTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  horizontalCardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
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