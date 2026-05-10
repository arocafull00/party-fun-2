import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Card, IconButton, Icon } from "react-native-paper";
import { Player } from "../../../store/game-store";
import { borderRadius, colors, spacing, typography } from "../../../theme/theme";
import { TeamColor } from "../interfaces/types";

interface TeamCardProps {
  team: TeamColor;
  title: string;
  players: Player[];
  onMovePlayer: (playerId: string, fromTeam: TeamColor, toTeam: TeamColor) => void;
  onRemovePlayer: (team: TeamColor, playerId: string) => void;
  onAddPlayer: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({
  team,
  title,
  players,
  onMovePlayer,
  onRemovePlayer,
  onAddPlayer,
}) => {
  const handleMovePlayer = (playerId: string) => {
    const toTeam: TeamColor = team === "azul" ? "rojo" : "azul";
    onMovePlayer(playerId, team, toTeam);
  };

  const teamColor = team === "azul" ? colors.primary : colors.secondary;

  return (
    <Card style={styles.teamCard}>
      <Card.Content style={styles.teamContent}>
        <View style={styles.teamHeader}>
          <View style={[styles.teamAccent, { backgroundColor: teamColor }]} />
          <Text style={[styles.teamTitle, { color: teamColor }]}>{title}</Text>
        </View>
        {players.length > 0 ? (
          <View style={styles.playersList}>
            {players.map((player, index) => (
              <View key={player.id} style={styles.playerRow}>
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
                    onPress={() => handleMovePlayer(player.id)}
                    style={styles.actionIcon}
                  />
                  <IconButton
                    icon="trash-can"
                    size={20}
                    iconColor={colors.error}
                    onPress={() => onRemovePlayer(team, player.id)}
                    style={styles.actionIcon}
                  />
                </View>
              </View>
            ))}
          </View>
        ) : null}
        <View style={[styles.addPlayerContainer, { borderColor: `${teamColor}66` }]}>
          <IconButton
            icon="account-plus"
            size={22}
            iconColor={teamColor}
            onPress={onAddPlayer}
            style={styles.addPlayerIcon}
          />
          <Text style={[styles.addPlayerText, { color: teamColor }]}>Añadir Jugador</Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  teamCard: {
    width: "100%",
    backgroundColor: "#ffeedb",
    borderRadius: borderRadius.xl,
    borderBottomWidth: 5,
    borderBottomColor: "#e8d8c1",
  },
  teamContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  teamHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  teamAccent: {
    width: 14,
    height: 58,
    borderRadius: borderRadius.md,
  },
  teamTitle: {
    fontSize: 46,
    lineHeight: 46,
    fontFamily: typography.families.heading,
    letterSpacing: 0.3,
  },
  playersList: {
    gap: spacing.sm,
  },
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
    backgroundColor: "#f2f5fb",
    alignItems: "center",
    justifyContent: "center",
  },
  playerName: {
    flex: 1,
    fontFamily: typography.families.bodyBold,
    color: "#251c14",
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
  addPlayerContainer: {
    minHeight: 76,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    borderStyle: "dashed",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  addPlayerIcon: {
    margin: 0,
  },
  addPlayerText: {
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.xl,
  },
});

export default TeamCard; 