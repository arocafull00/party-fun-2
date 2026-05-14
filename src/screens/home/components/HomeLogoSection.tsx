import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

import { styles } from "../home-screen.styles";

export const HomeLogoSection: React.FC = () => {
  const titleSwing = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const titleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(titleSwing, {
          toValue: -1,
          duration: 1300,
          useNativeDriver: true,
        }),
        Animated.timing(titleSwing, {
          toValue: 1,
          duration: 1300,
          useNativeDriver: true,
        }),
      ]),
      { resetBeforeIteration: false }
    );

    titleAnimation.start();

    return () => {
      titleAnimation.stop();
      titleSwing.setValue(0);
    };
  }, [titleSwing]);

  const titleRotation = titleSwing.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-4deg", "4deg"],
  });

  return (
    <View style={styles.logoSection}>
      <Animated.Image
        accessibilityLabel="Funny Words"
        accessibilityRole="image"
        resizeMode="contain"
        source={require("../../../../assets/title.png")}
        style={[
          styles.titleImage,
          {
            transform: [{ rotate: titleRotation }],
          },
        ]}
      />
    </View>
  );
};
