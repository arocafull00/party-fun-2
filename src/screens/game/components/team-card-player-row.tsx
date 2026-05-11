import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, IconButton, Icon } from "react-native-paper";

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
      <View style={styles.avatarCircle}>
        <Icon
          source={index % 2 === 0 ? "account" : "account-star"}
          size={24}
          color={teamColor}
        />
      </View>
      <Text style={styles.playerName}>{player.name}</Text>
      <View style={styles.playerActions}>
        <IconButton
          icon="swap-horizontal"
          size={20}
          iconColor={teamColor}
          onPress={onSwap}
          style={styles.actionIcon}
        />
        <IconButton
          icon="trash-can"
          size={20}
          iconColor={colors.error}
          onPress={onRemove}
          style={styles.actionIcon}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  playerRow: {
    minHeight: 72,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  playerName: {
    flex: 1,
    fontFamily: typography.families.bodyBold,
    color: colors.onSurface,
    fontSize: typography.sizes.xl,
  },
  playerActions: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: -10,
  },
  actionIcon: {
    margin: 0,
  },
});

export default TeamCardPlayerRow;
