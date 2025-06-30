import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, IconButton } from "react-native-paper";
import { colors } from "../../../theme/theme";

interface NewGameHeaderProps {
  title: string;
  onBackPress: () => void;
}

const NewGameHeader: React.FC<NewGameHeaderProps> = ({
  title,
  onBackPress,
}) => {
  return (
    <View style={styles.header}>
      <IconButton
        icon="arrow-left"
        size={24}
        iconColor={colors.textLight}
        onPress={onBackPress}
      />
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: 48 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: 5,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textLight,
  },
});

export default NewGameHeader;
