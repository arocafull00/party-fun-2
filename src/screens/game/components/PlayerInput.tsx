import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Card, TextInput, Button } from "react-native-paper";
import { colors } from "../../../theme/theme";
import { TeamColor } from "../interfaces/types";

interface PlayerInputProps {
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  onAddPlayer: (team: TeamColor) => void;
}

const PlayerInput: React.FC<PlayerInputProps> = ({
  playerName,
  onPlayerNameChange,
  onAddPlayer,
}) => {
  return (
    <Card style={styles.addPlayerCard}>
      <Card.Content>
        <Text style={styles.addPlayerTitle}>Añadir Jugador</Text>
        <View style={styles.addPlayerRow}>
          <TextInput
            style={styles.playerNameInput}
            value={playerName}
            onChangeText={onPlayerNameChange}
            placeholder="Nombre del jugador"
            mode="outlined"
          />
          <Button
            mode="contained"
            onPress={() => onAddPlayer("azul")}
            style={[styles.teamAddButton, { backgroundColor: colors.teamBlue }]}
            contentStyle={styles.teamAddButtonContent}
            compact
          >
            Azul
          </Button>
          <Button
            mode="contained"
            onPress={() => onAddPlayer("rojo")}
            style={[styles.teamAddButton, { backgroundColor: colors.teamRed }]}
            contentStyle={styles.teamAddButtonContent}
            compact
          >
            Rojo
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  addPlayerCard: {
    backgroundColor: colors.surface,
    elevation: 4,
    width: "100%",
  },
  addPlayerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 10,
  },
  addPlayerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  playerNameInput: {
    flex: 1,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  teamAddButton: {
    paddingHorizontal: 30,
  },
  teamAddButtonContent: {
    height: 56,
    justifyContent: "center",
  },
});

export default PlayerInput; 