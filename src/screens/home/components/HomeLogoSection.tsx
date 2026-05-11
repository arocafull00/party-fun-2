import React from "react";
import { Image, View } from "react-native";

import { styles } from "../home-screen.styles";

export const HomeLogoSection: React.FC = () => {
  return (
    <View style={styles.logoSection}>
      <Image
        accessibilityLabel="Party Fun 2"
        accessibilityRole="image"
        resizeMode="contain"
        source={require("../../../../assets/title.png")}
        style={styles.titleImage}
      />
    </View>
  );
};
