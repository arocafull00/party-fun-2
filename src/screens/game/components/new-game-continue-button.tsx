import React, { useMemo, useRef } from "react";
import { Animated, Pressable, Text } from "react-native";
import { Icon } from "react-native-paper";

import { SparkleBurst } from "../../home/components/SparkleBurst";
import { colors } from "../../../theme/theme";
import { newGameContinueButtonStyles as styles } from "./new-game-continue-button.styles";

interface NewGameContinueButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

const NewGameContinueButton: React.FC<NewGameContinueButtonProps> = ({
  onPress,
  disabled = false,
}) => {
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
    [pressAnim],
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
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.pressable}
    >
      <Animated.View style={[styles.row, animatedStyle, disabled ? { opacity: 0.45 } : null]}>
        <SparkleBurst />
        <Icon source="arrow-right" size={22} color={colors.textLight} />
        <Text style={styles.label}>Continuar</Text>
        <SparkleBurst mirror />
      </Animated.View>
    </Pressable>
  );
};

export default NewGameContinueButton;
