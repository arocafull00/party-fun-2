import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

import { borderRadius, colors, spacing, typography } from "../../../theme/theme";

interface WordReviewRowProps {
  index: number;
  text: string;
  isCorrect: boolean;
  onToggle: () => void;
}

export const WordReviewRow: React.FC<WordReviewRowProps> = ({
  index,
  text,
  isCorrect,
  onToggle,
}) => {
  return (
    <View style={styles.row}>
      <View style={styles.leftSection}>
        <View style={styles.numberCircle}>
          <Text style={styles.numberText}>{index + 1}</Text>
        </View>
        <Text style={styles.wordText} numberOfLines={1}>
          {text}
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (!isCorrect) onToggle();
          }}
          style={[
            styles.iconButton,
            isCorrect ? styles.buttonCorrectActive : styles.buttonCorrectInactive,
          ]}
        >
          <Ionicons
            name="checkmark"
            size={18}
            color={isCorrect ? "#FFFFFF" : colors.accent}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (isCorrect) onToggle();
          }}
          style={[
            styles.iconButton,
            !isCorrect ? styles.buttonFailActive : styles.buttonFailInactive,
          ]}
        >
          <Ionicons
            name="close"
            size={18}
            color={!isCorrect ? "#FFFFFF" : colors.redTeam}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
    flexShrink: 1,
  },
  numberCircle: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.md,
    color: colors.primary,
  },
  wordText: {
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.md,
    color: colors.text,
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 36,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonCorrectActive: {
    backgroundColor: colors.accent,
  },
  buttonCorrectInactive: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  buttonFailActive: {
    backgroundColor: colors.redTeam,
  },
  buttonFailInactive: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: colors.redTeam,
  },
});
