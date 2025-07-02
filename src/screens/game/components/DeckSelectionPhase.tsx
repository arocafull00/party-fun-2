import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Card, Chip } from "react-native-paper";
import { Mazo } from "../../../database/database";
import { colors } from "../../../theme/theme";

interface DeckSelectionPhaseProps {
  decks: Mazo[];
  onSelectDeck: (deck: Mazo) => void;
}

const DeckSelectionPhase: React.FC<DeckSelectionPhaseProps> = ({
  decks,
  onSelectDeck,
}) => {
  return (
    <View style={styles.phaseContainer}>
      <Text style={styles.phaseDescription}>
        Selecciona un mazo de cartas para el juego
      </Text>

      <View style={styles.decksGrid}>
        {decks.map((deck) => (
          <Card
            key={deck.id}
            style={styles.deckCard}
            onPress={() => onSelectDeck(deck)}
          >
            <Card.Content style={styles.deckCardContent}>
              <Text style={styles.deckName}>{deck.nombre}</Text>
              <Chip
                icon="cards"
                style={styles.deckChip}
                textStyle={{ color: colors.textLight }}
              >
                {deck.nombre}
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
  decksGrid: {
    gap: 15,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  deckCard: {
    backgroundColor: colors.surface,
    elevation: 4,
    marginBottom: 10,
    width: "48%",
  },
  deckCardContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  deckName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 10,
  },
  deckChip: {
    backgroundColor: colors.primary,
  },
});

export default DeckSelectionPhase; 