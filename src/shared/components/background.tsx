import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/theme';

const circlePositions = [4, 16, 28, 40, 52, 64, 76, 88];
const columns = [6, 24, 42, 60, 78, 96];

export const Background = () => {
  return (
    <View style={styles.container}>
      <View style={styles.baseBackground} />
      {circlePositions.map((top) =>
        columns.map((left) => (
          <View key={`dot-${top}-${left}`} style={[styles.dot, { top: `${top}%`, left: `${left}%` }]} />
        ))
      )}
      <View style={[styles.shape, styles.triangle]} />
      <View style={[styles.shape, styles.circle]} />
      <View style={[styles.shape, styles.squiggle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  baseBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.surfaceVariant,
    opacity: 0.45,
  },
  shape: {
    position: 'absolute',
    opacity: 0.2,
    backgroundColor: colors.surfaceVariant,
  },
  triangle: {
    width: 180,
    height: 180,
    borderRadius: 24,
    transform: [{ rotate: '18deg' }],
    top: '22%',
    right: -80,
  },
  circle: {
    width: 220,
    height: 220,
    borderRadius: 220,
    bottom: -110,
    left: -40,
  },
  squiggle: {
    width: 150,
    height: 40,
    borderRadius: 20,
    top: '58%',
    left: '8%',
    transform: [{ rotate: '-22deg' }],
  },
});

export default Background;
