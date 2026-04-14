import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Card, IconButton } from "react-native-paper";
import { Player } from "../../../store/game-store";
import { borderRadius, colors, spacing, typography } from "../../../theme/theme";
import { TeamColor } from "../interfaces/types";
import { SelectionChip } from "../../../shared/components/SelectionChip";

interface TeamCardProps {
  team: TeamColor;
  title: string;
  backgroundColor: string;
  players: Player[];
  onMovePlayer: (playerId: string, fromTeam: TeamColor, toTeam: TeamColor) => void;
  onRemovePlayer: (team: TeamColor, playerId: string) => void;
  onAddPlayer: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({
  team,
  title,
  backgroundColor,
  players,
  onMovePlayer,
  onRemovePlayer,
  onAddPlayer,
}) => {
  const handleMovePlayer = (playerId: string) => {
    const toTeam: TeamColor = team === "azul" ? "rojo" : "azul";
    onMovePlayer(playerId, team, toTeam);
  };

  return (
    <Card style={styles.teamCard}>
      <Card.Content style={{ height: "100%" }}>
        <Text style={[styles.teamTitle, { color: backgroundColor }]}>
          {title}
        </Text>

        {players.length === 0 ? (
          <View style={styles.emptyTeamContainer}>
            <IconButton
              icon="account-plus"
              size={48}
              iconColor={backgroundColor}
              style={[
                styles.addPlayerIcon,
                { backgroundColor: backgroundColor + "20" },
              ]}
              onPress={onAddPlayer}
            />
            <Text style={styles.emptyTeamText}>AÑADIR JUGADOR</Text>
          </View>
        ) : (
          <>
            {players.map((player) => (
              <View key={player.id} style={styles.playerItem}>
                <SelectionChip
                  selected={true}
                  label={player.name}
                  icon="account"
                />
                <View style={styles.playerActions}>
                  <IconButton
                    icon="swap-horizontal"
                    size={20}
                    iconColor={colors.primary}
                    onPress={() => handleMovePlayer(player.id)}
                  />
                  <IconButton
                    icon="close"
                    size={20}
                    iconColor={colors.accent}
                    onPress={() => onRemovePlayer(team, player.id)}
                  />
                </View>
              </View>
            ))}
            
            {/* Add player button when there are existing players */}
            <View style={styles.addMoreContainer}>
              <IconButton
                icon="plus"
                size={24}
                iconColor={backgroundColor}
                style={[
                  styles.addMoreIcon,
                  { backgroundColor: backgroundColor + "20" },
                ]}
                onPress={onAddPlayer}
              />
            </View>
          </>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  teamCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.xl,
    width: "48%",
  },
  teamTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: "800",
    fontFamily: typography.families.heading,
    textAlign: "center",
    marginBottom: spacing.md,
    letterSpacing: 1,
    color: colors.text,
  },
  emptyTeamContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: spacing.md,
    height: "100%",
  },
  addPlayerIcon: {
    marginBottom: spacing.md,
    backgroundColor: colors.surfaceContainerHigh,
  },
  emptyTeamText: {
    textAlign: "center",
    color: colors.textSecondary,
    fontWeight: "700",
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.md,
    letterSpacing: 1,
  },
  playerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  playerActions: {
    flexDirection: "row",
  },
  addMoreContainer: {
    alignItems: "center",
    marginTop: spacing.sm,
  },
  addMoreIcon: {
    alignSelf: "center",
    backgroundColor: colors.surfaceContainerHigh,
  },
});

export default TeamCard; 