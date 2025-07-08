import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/theme';

const { width, height } = Dimensions.get('window');

export const Background = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const rotationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create floating animation
    const floatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: true,
        }),
      ])
    );

    // Create subtle scale animation
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.05,
          duration: 12000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 12000,
          useNativeDriver: true,
        }),
      ])
    );

    // Create rotation animation
    const rotationAnimation = Animated.loop(
      Animated.timing(rotationValue, {
        toValue: 1,
        duration: 15000,
        useNativeDriver: true,
      })
    );

    floatingAnimation.start();
    scaleAnimation.start();
    rotationAnimation.start();

    return () => {
      floatingAnimation.stop();
      scaleAnimation.stop();
      rotationAnimation.stop();
    };
  }, []);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const rotation = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Base background color */}
      <View style={[styles.baseBackground, { backgroundColor: colors.background }]} />

      {/* Animated floating cards */}
      <Animated.View
        style={[
          styles.card,
          styles.card1,
          {
            transform: [
              { translateY },
              { scale: scaleValue },
            ],
            backgroundColor: colors.primary,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.card,
          styles.card2,
          {
            transform: [
              { translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 15],
              }) },
              { scale: scaleValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.95],
              }) },
              { rotate: '15deg' },
            ],
            backgroundColor: colors.secondary,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.card,
          styles.card3,
          {
            transform: [
              { translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -25],
              }) },
              { scale: scaleValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.1],
              }) },
            ],
            backgroundColor: colors.accent,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.card,
          styles.card4,
          {
            transform: [
              { translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 10],
              }) },
              { scale: scaleValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.05],
              }) },
              { rotate: '-25deg' },
            ],
            backgroundColor: colors.primary,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.card,
          styles.card5,
          {
            transform: [
              { translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -15],
              }) },
              { scale: scaleValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.9],
              }) },
              { rotate: rotation },
            ],
            backgroundColor: colors.secondary,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.card,
          styles.card6,
          {
            transform: [
              { translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 20],
              }) },
              { scale: scaleValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.15],
              }) },
              { rotate: '45deg' },
            ],
            backgroundColor: colors.accent,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: -1,
  },
  baseBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    position: 'absolute',
    borderRadius: 12,
    opacity: 0.15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  card1: {
    width: 120,
    height: 180,
    top: height * 0.1,
    right: -30,
  },
  card2: {
    width: 100,
    height: 150,
    top: height * 0.6,
    left: -20,
  },
  card3: {
    width: 80,
    height: 120,
    top: height * 0.3,
    left: width * 0.7,
  },
  card4: {
    width: 90,
    height: 135,
    top: height * 0.8,
    right: width * 0.2,
  },
  card5: {
    width: 70,
    height: 105,
    top: height * 0.15,
    left: width * 0.3,
  },
  card6: {
    width: 110,
    height: 165,
    top: height * 0.45,
    right: width * 0.1,
  },
});

export default Background;
