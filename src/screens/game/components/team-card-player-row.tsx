import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, IconButton } from "react-native-paper";

import { Player } from "../../../store/game-store";
import { borderRadius, colors, spacing, typography } from "../../../theme/theme";

interface TeamCardPlayerRowProps {
  player: Player;
  teamColor: string;
  index: number;
  onSwap: () => void;
  onRemove: () => void;
}

const TeamCardPlayerRow: React.FC<TeamCardPlayerRowProps> = ({
  player,
  teamColor,
  index,
  onSwap,
  onRemove,
}) => {
  return (
    <View style={styles.playerRow}>
      <Text style={styles.playerName}>{player.name}</Text>
      <View style={styles.playerActions}>
        <IconButton
          icon="swap-horizontal"
          size={18}
          iconColor={teamColor}
          onPress={onSwap}
          style={styles.actionIcon}
        />
        <IconButton
          icon="trash-can"
          size={18}
          iconColor={colors.accent}
          onPress={onRemove}
          style={styles.actionIcon}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  playerRow: {
    minHeight: 52,
    borderRadius: borderRadius.lg,
    backgroundColor: '#ffffff',
    paddingHorizontal: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  playerName: {
    flex: 1,
    fontFamily: typography.families.bodyBold,
    color: colors.text,
    fontSize: typography.sizes.md,
  },
  playerActions: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: -6,
  },
  actionIcon: {
    margin: 0,
  },
});

export default TeamCardPlayerRow;
