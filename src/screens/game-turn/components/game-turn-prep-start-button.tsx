import React, { useMemo, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { Icon } from "react-native-paper";

import { colors } from "../../../theme/theme";
import { SparkleBurst } from "../../home/components/SparkleBurst";
import { styles } from "../../game-turn-screen.styles";

type GameTurnPrepStartButtonProps = {
  onPress: () => void;
};

export function GameTurnPrepStartButton({ onPress }: GameTurnPrepStartButtonProps) {
  const pressAnim = useRef(new Animated.Value(0)).current;

  const animatedStyle = useMemo(
    () => ({
      transform: [
        {
          translateY: pressAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 2],
          }),
        },
      ],
    }),
    [pressAnim]
  );

  const handlePressIn = () => {
    Animated.timing(pressAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(pressAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.prepStartShell}>
      <View style={styles.prepStartRow}>
        <View style={styles.prepStartSparkleSide}>
          <SparkleBurst />
        </View>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.prepStartPressable}
        >
          <Animated.View style={[styles.prepStartAnimated, animatedStyle]}>
            <Icon source="play" size={28} color={'#ffffff'} />
            <Text style={styles.prepStartLabel}>¡Empezar!</Text>
          </Animated.View>
        </Pressable>
        <View style={styles.prepStartSparkleSide}>
          <SparkleBurst mirror />
        </View>
      </View>
    </View>
  );
}
