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
            styles.button,
            isCorrect ? styles.buttonCorrectActive : styles.buttonCorrectInactive,
          ]}
        >
          <Ionicons
            name="checkmark"
            size={14}
            color={isCorrect ? "#FFFFFF" : colors.accent}
            style={styles.buttonIcon}
          />
          <Text
            style={[
              styles.buttonLabel,
              isCorrect ? styles.buttonLabelActive : styles.buttonLabelCorrectInactive,
            ]}
          >
            Acierto
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (isCorrect) onToggle();
          }}
          style={[
            styles.button,
            !isCorrect ? styles.buttonFailActive : styles.buttonFailInactive,
          ]}
        >
          <Ionicons
            name="close"
            size={14}
            color={!isCorrect ? "#FFFFFF" : colors.redTeam}
            style={styles.buttonIcon}
          />
          <Text
            style={[
              styles.buttonLabel,
              !isCorrect ? styles.buttonLabelActive : styles.buttonLabelFailInactive,
            ]}
          >
            Fallo
          </Text>
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
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
    flexShrink: 1,
  },
  numberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E8E0F7",
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
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    minWidth: 80,
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
  buttonIcon: {
    marginRight: 4,
  },
  buttonLabel: {
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.sm,
  },
  buttonLabelActive: {
    color: "#FFFFFF",
  },
  buttonLabelCorrectInactive: {
    color: colors.accent,
  },
  buttonLabelFailInactive: {
    color: colors.redTeam,
  },
});
