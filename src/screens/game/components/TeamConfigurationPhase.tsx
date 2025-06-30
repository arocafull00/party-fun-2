import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../../../theme/theme";
import { Teams, TeamColor } from "../interfaces/types";
import TeamCard from "./TeamCard";
import PlayerInput from "./PlayerInput";
import ButtonPrimaryAction from "./ButtonPrimaryAction";

interface TeamConfigurationPhaseProps {
  teams: Teams;
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  onAddPlayer: (team: TeamColor) => void;
  onMovePlayer: (playerId: string, fromTeam: TeamColor) => void;
  onRemovePlayer: (team: TeamColor, playerId: string) => void;
  onContinue: () => void;
}

const TeamConfigurationPhase: React.FC<TeamConfigurationPhaseProps> = ({
  teams,
  playerName,
  onPlayerNameChange,
  onAddPlayer,
  onMovePlayer,
  onRemovePlayer,
  onContinue,
}) => {
  return (
    <View style={styles.phaseContainer}>
      <PlayerInput
        playerName={playerName}
        onPlayerNameChange={onPlayerNameChange}
        onAddPlayer={onAddPlayer}
      />
      
      <View style={styles.teamsRow}>
        <TeamCard
          team="azul"
          title="EQUIPO AZUL"
          backgroundColor={colors.teamBlue}
          players={teams.azul.players}
          onMovePlayer={onMovePlayer}
          onRemovePlayer={onRemovePlayer}
        />
        <TeamCard
          team="rojo"
          title="EQUIPO ROJO"
          backgroundColor={colors.teamRed}
          players={teams.rojo.players}
          onMovePlayer={onMovePlayer}
          onRemovePlayer={onRemovePlayer}
        />
      </View>

      <ButtonPrimaryAction
        title="Continuar"
        onPress={onContinue}
        variant="success"
        size="medium"
        disabled={
          teams.azul.players.length === 0 || teams.rojo.players.length === 0
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  phaseContainer: {
    flex: 1,
    alignSelf: "center",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingBottom: 20,
  },
  teamsRow: {
    flexDirection: "row",
    flexGrow: 1,
    gap: 8,
    height: 250,
  },
});

export default TeamConfigurationPhase; 