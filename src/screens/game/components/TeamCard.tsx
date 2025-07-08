import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Card, Divider, Chip, IconButton } from "react-native-paper";
import { Player } from "../../../store/game-store";
import { colors } from "../../../theme/theme";
import { TeamColor } from "../interfaces/types";

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
    <Card style={[styles.teamCard, { borderColor: backgroundColor }]}>
      <Card.Content style={{ height: "100%" }}>
        <Text style={[styles.teamTitle, { color: backgroundColor }]}>
          {title}
        </Text>
        <Divider style={styles.divider} />

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
                <Chip
                  style={[
                    styles.playerChip,
                    { backgroundColor: backgroundColor + "20" },
                  ]}
                  textStyle={{ color: backgroundColor, fontWeight: "bold" }}
                >
                  {player.name}
                </Chip>
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
    backgroundColor: colors.background,
    borderRadius: 20,
    width: "48%",
    borderWidth: 2,
  },
  teamTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    letterSpacing: 1,
    color: colors.text,
  },
  divider: {
    backgroundColor: colors.secondary,
    marginBottom: 20,
    height: 2,
  },
  emptyTeamContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 20,
    height: "100%",
  },
  addPlayerIcon: {
    marginBottom: 15,
    backgroundColor: colors.secondary + "20",
  },
  emptyTeamText: {
    textAlign: "center",
    color: colors.text,
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  playerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  playerChip: {
    flex: 1,
    marginRight: 8,
    backgroundColor: colors.secondary + "20",
  },
  playerActions: {
    flexDirection: "row",
  },
  addMoreContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  addMoreIcon: {
    alignSelf: "center",
    backgroundColor: colors.secondary + "20",
  },
});

export default TeamCard; 