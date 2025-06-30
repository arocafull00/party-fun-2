import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Card, Chip, List } from "react-native-paper";
import { Bateria } from "../../../database/database";
import { colors } from "../../../theme/theme";
import { Teams } from "../interfaces/types";
import ButtonPrimaryAction from "./ButtonPrimaryAction";

interface GameSummaryPhaseProps {
  selectedBattery: Bateria | null;
  teams: Teams;
  onStartGame: () => void;
}

const GameSummaryPhase: React.FC<GameSummaryPhaseProps> = ({
  selectedBattery,
  teams,
  onStartGame,
}) => {
  return (
    <View style={styles.phaseContainer}>
      <ButtonPrimaryAction
        title="¡EMPEZAR PARTIDA!"
        onPress={onStartGame}
        variant="success"
        size="large"
        icon="play"
      />

      {/* Selected Battery */}
      <Card style={styles.summaryCard}>
        <Card.Content style={{ width: "100%" }}>
          <Text style={styles.summaryTitle}>Batería Seleccionada</Text>
          <Chip
            icon="cards"
            style={styles.selectedBatteryChip}
            textStyle={{ color: colors.textLight }}
          >
            {selectedBattery?.nombre}
          </Chip>
        </Card.Content>
      </Card>

      {/* Teams Summary */}
      <View style={{ width: "100%", gap: 10, justifyContent: "center", flexDirection: "row" }}>
        <Card style={styles.summaryCard}>
          <Card.Content style={{ width: "100%" }}>
            <Text style={styles.summaryTitle}>Equipos</Text>
            <View style={styles.teamsSummaryRow}>
              <View style={styles.teamSummary}>
                <Text
                  style={[styles.teamSummaryTitle, { color: colors.teamBlue }]}
                >
                  EQUIPO AZUL ({teams.azul.players.length})
                </Text>
                {teams.azul.players.map((player) => (
                  <Text key={player.id} style={styles.playerSummaryName}>
                    • {player.name}
                  </Text>
                ))}
              </View>
              <View style={styles.teamSummary}>
                <Text
                  style={[styles.teamSummaryTitle, { color: colors.teamRed }]}
                >
                  EQUIPO ROJO ({teams.rojo.players.length})
                </Text>
                {teams.rojo.players.map((player) => (
                  <Text key={player.id} style={styles.playerSummaryName}>
                    • {player.name}
                  </Text>
                ))}
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Game Info */}
        <Card style={styles.summaryCard}>
          <Card.Content style={{ width: "100%" }}>
            <Text style={styles.summaryTitle}>Información del Juego</Text>
            <List.Item
              title="Jugadores totales"
              description={`${
                teams.azul.players.length + teams.rojo.players.length
              } jugadores`}
              left={(props) => <List.Icon {...props} icon="account-group" />}
            />
            <List.Item
              title="Rondas"
              description="3 rondas (Libre, Una palabra, Mímica)"
              left={(props) => <List.Icon {...props} icon="numeric-3-circle" />}
            />
            <List.Item
              title="Tiempo por turno"
              description="30 segundos"
              left={(props) => <List.Icon {...props} icon="timer" />}
            />
          </Card.Content>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  phaseContainer: {
    flex: 1,
    alignSelf: "center",
    width: "100%",
    paddingBottom: 20,
  },
  phaseDescription: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  summaryCard: {
    marginBottom: 15,
    backgroundColor: colors.surface,
    elevation: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 10,
  },
  selectedBatteryChip: {
    backgroundColor: colors.success,
    alignSelf: "flex-start",
  },
  teamsSummaryRow: {
    flexDirection: "row",
    gap: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  teamSummary: {
    flex: 1,
  },
  teamSummaryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  playerSummaryName: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
});

export default GameSummaryPhase;
