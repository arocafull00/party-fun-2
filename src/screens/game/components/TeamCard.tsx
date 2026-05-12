import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { Text, IconButton, Icon, Menu } from "react-native-paper";

import { Player } from "../../../store/game-store";
import { colors } from "../../../theme/theme";
import { TeamColor } from "../interfaces/types";
import TeamCardPlayerRow from "./team-card-player-row";
import { teamCardStyles } from "./team-card.styles";

interface TeamCardProps {
  team: TeamColor;
  title: string;
  players: Player[];
  onMovePlayer: (playerId: string, fromTeam: TeamColor, toTeam: TeamColor) => void;
  onRemovePlayer: (team: TeamColor, playerId: string) => void;
  onAddPlayer: () => void;
  onClearTeam?: () => void;
  onShuffleTeams?: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({
  team,
  title,
  players,
  onMovePlayer,
  onRemovePlayer,
  onAddPlayer,
  onClearTeam,
  onShuffleTeams,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMovePlayer = (playerId: string) => {
    const toTeam: TeamColor = team === "azul" ? "rojo" : "azul";
    onMovePlayer(playerId, team, toTeam);
  };

  const isBlue = team === "azul";
  const palette = isBlue
    ? {
        cardBg: "#c5dff2",
        bar: colors.primary,
        accent: "#003566",
        badgeBg: "#005ab2",
        badgeFg: "#ffffff",
        cardBorder: "#6ba8d4",
        menuIcon: "#003566",
      }
    : {
        cardBg: "#f9d6da",
        bar: colors.redTeam,
        accent: "#6b1218",
        badgeBg: "#a82d35",
        badgeFg: "#ffffff",
        cardBorder: "#d8606a",
        menuIcon: "#4a0e12",
      };
  const teamColor = palette.bar;
  const showTeamMenu = onClearTeam != null || onShuffleTeams != null;

  return (
    <View
      style={[
        teamCardStyles.teamCardOuter,
        { backgroundColor: palette.cardBg, borderColor: palette.cardBorder },
      ]}
    >
      <View style={[teamCardStyles.leftBar, { backgroundColor: palette.bar }]} />
      <View style={teamCardStyles.teamMain}>
        <View style={teamCardStyles.topRow}>
          <View style={teamCardStyles.titleCol}>
            <Text style={[teamCardStyles.teamTitle, { color: palette.accent }]}>{title}</Text>
            <View style={[teamCardStyles.countBadge, { backgroundColor: palette.badgeBg }]}>
              <Text style={[teamCardStyles.countBadgeText, { color: palette.badgeFg }]}>
                {players.length} jugador{players.length === 1 ? "" : "es"}
              </Text>
            </View>
          </View>
          {showTeamMenu ? (
            <Menu
              visible={menuOpen}
              onDismiss={() => setMenuOpen(false)}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  size={22}
                  iconColor={palette.menuIcon}
                  onPress={() => setMenuOpen(true)}
                  style={teamCardStyles.menuAnchor}
                />
              }
            >
              {onClearTeam ? (
                <Menu.Item
                  onPress={() => {
                    setMenuOpen(false);
                    onClearTeam();
                  }}
                  title="Vaciar equipo"
                />
              ) : null}
              {onShuffleTeams ? (
                <Menu.Item
                  onPress={() => {
                    setMenuOpen(false);
                    onShuffleTeams();
                  }}
                  title="Mezclar jugadores"
                />
              ) : null}
            </Menu>
          ) : (
            <View style={teamCardStyles.menuSpacer} />
          )}
        </View>
        {players.length > 0 ? (
          <View style={teamCardStyles.playersList}>
            {players.map((player, index) => (
              <TeamCardPlayerRow
                key={player.id}
                player={player}
                teamColor={teamColor}
                index={index}
                onSwap={() => handleMovePlayer(player.id)}
                onRemove={() => onRemovePlayer(team, player.id)}
              />
            ))}
          </View>
        ) : null}
        <Pressable
          onPress={onAddPlayer}
          style={({ pressed }) => [
            teamCardStyles.addPlayerPressable,
            { borderColor: palette.accent, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Icon source="plus" size={22} color={palette.accent} />
          <Text style={[teamCardStyles.addPlayerText, { color: palette.accent }]}>Añadir jugador</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default TeamCard;
