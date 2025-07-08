import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/theme';

const { width, height } = Dimensions.get('window');

export const Background = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

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

    floatingAnimation.start();
    scaleAnimation.start();

    return () => {
      floatingAnimation.stop();
      scaleAnimation.stop();
    };
  }, []);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <View style={styles.container}>
      {/* Base gradient background */}
      <LinearGradient
        colors={colors.gradients.background as [string, string]}
        style={styles.baseGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Animated floating orbs */}
      <Animated.View
        style={[
          styles.orb,
          styles.orb1,
          {
            transform: [
              { translateY },
              { scale: scaleValue },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={colors.gradients.primary as [string, string]}
          style={styles.orbGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.orb,
          styles.orb2,
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
            ],
          },
        ]}
      >
        <LinearGradient
          colors={colors.gradients.secondary as [string, string]}
          style={styles.orbGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.orb,
          styles.orb3,
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
          },
        ]}
      >
        <LinearGradient
          colors={colors.gradients.success as [string, string]}
          style={styles.orbGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Glassmorphism overlay */}
      <View style={styles.glassOverlay} />
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
  baseGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.3,
  },
  orb1: {
    width: 200,
    height: 200,
    top: height * 0.1,
    right: -50,
  },
  orb2: {
    width: 150,
    height: 150,
    top: height * 0.6,
    left: -30,
  },
  orb3: {
    width: 120,
    height: 120,
    top: height * 0.3,
    left: width * 0.7,
  },
  orbGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.glass.backdrop,
  },
});

export default Background;
