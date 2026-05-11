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

  const teamColor = team === "azul" ? colors.primary : colors.secondary;
  const cardTint = team === "azul" ? colors.secondary : colors.secondary;
  const badgeBg = team === "azul" ? colors.accent : colors.accent;
  const showTeamMenu = onClearTeam != null || onShuffleTeams != null;

  return (
    <View style={[teamCardStyles.teamCardOuter, { backgroundColor: cardTint }]}>
      <View style={[teamCardStyles.leftBar, { backgroundColor: teamColor }]} />
      <View style={teamCardStyles.teamMain}>
        <View style={teamCardStyles.topRow}>
          <View style={teamCardStyles.iconBadgeWrap}>
            <View style={teamCardStyles.teamIconCircle}>
              <Icon source="account-group" size={28} color={teamColor} />
            </View>
          </View>
          <View style={teamCardStyles.titleCol}>
            <Text style={[teamCardStyles.teamTitle, { color: teamColor }]}>{title}</Text>
            <View style={[teamCardStyles.countBadge, { backgroundColor: badgeBg }]}>
              <Text style={[teamCardStyles.countBadgeText, { color: teamColor }]}>
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
                  iconColor={colors.text}
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
            { borderColor: teamColor, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Icon source="plus" size={22} color={teamColor} />
          <Text style={[teamCardStyles.addPlayerText, { color: teamColor }]}>Añadir jugador</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default TeamCard;
