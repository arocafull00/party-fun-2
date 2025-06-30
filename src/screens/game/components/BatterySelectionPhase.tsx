import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Card, Chip } from "react-native-paper";
import { Bateria } from "../../../database/database";
import { colors } from "../../../theme/theme";

interface BatterySelectionPhaseProps {
  batteries: Bateria[];
  onSelectBattery: (battery: Bateria) => void;
}

const BatterySelectionPhase: React.FC<BatterySelectionPhaseProps> = ({
  batteries,
  onSelectBattery,
}) => {
  return (
    <View style={styles.phaseContainer}>
      <Text style={styles.phaseDescription}>
        Selecciona una batería de palabras para el juego
      </Text>

      <View style={styles.batteriesGrid}>
        {batteries.map((battery) => (
          <Card
            key={battery.id}
            style={styles.batteryCard}
            onPress={() => onSelectBattery(battery)}
          >
            <Card.Content style={styles.batteryCardContent}>
              <Text style={styles.batteryName}>{battery.nombre}</Text>
              <Chip
                icon="cards"
                style={styles.batteryChip}
                textStyle={{ color: colors.textLight }}
              >
                {battery.nombre}
              </Chip>
            </Card.Content>
          </Card>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  phaseContainer: {
    flex: 1,
    alignSelf: "center",
    width: "100%",
  },
  phaseDescription: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  batteriesGrid: {
    gap: 15,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  batteryCard: {
    backgroundColor: colors.surface,
    elevation: 4,
    marginBottom: 10,
    width: "48%",
  },
  batteryCardContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  batteryName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 10,
  },
  batteryChip: {
    backgroundColor: colors.primary,
  },
});

export default BatterySelectionPhase; 