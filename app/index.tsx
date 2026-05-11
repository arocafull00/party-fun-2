import { ImageBackground, StyleSheet } from "react-native";

import { HomeScreen } from "../src/screens/home-screen";

export default function App() {
  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.root}
      resizeMode="cover"
    >
      <HomeScreen />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
