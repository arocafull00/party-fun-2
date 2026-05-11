import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Icon, Text } from "react-native-paper";

import { borderRadius, colors, spacing, typography } from "../../theme/theme";


export type CreateDeckWordRowProps = {
  card: string;
  index: number;
  onRemove: () => void;
};

export const CreateDeckWordRow: React.FC<CreateDeckWordRowProps> = ({
  card,
  index,
  onRemove,
}) => {

  return (
    <View style={styles.cardRow}>
      <Text style={styles.cardRowText}>{card}</Text>
      <Pressable onPress={onRemove} style={styles.deleteButton}>
        <Icon source="trash-can" size={26} color={colors.secondary} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  cardRow: {
    minHeight: 84,
    borderRadius: borderRadius.xl,
    backgroundColor: "#fff2df",
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  cardRowIcon: {
    width: 58,
    height: 58,
    borderRadius: borderRadius.md,
    backgroundColor: "#dbe7f8",
    alignItems: "center",
    justifyContent: "center",
  },
  cardRowText: {
    flex: 1,
    fontFamily: typography.families.bodyBold,
    color: "#1d160f",
    fontSize: 44,
    lineHeight: 44,
  },
  deleteButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
});
