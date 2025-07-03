import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Dimensions } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Chip,
  HelperText,
  IconButton,
  Surface,
  Modal,
  Portal,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { database } from "../database/database";
import { useGameStore } from "../store/game-store";
import { colors } from "../theme/theme";
import { CustomScreen } from "../shared/components/CustomScreen";

const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth > 600;

const CreateDeckScreen: React.FC = () => {
  const { setDecks } = useGameStore();
  const [currentCard, setCurrentCard] = useState("");
  const [cards, setCards] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);
  const [deckName, setDeckName] = useState("");
  const [nameError, setNameError] = useState("");

  const validateCard = (card: string): boolean => {
    if (!card.trim()) {
      setCardError("La carta no puede estar vacía");
      return false;
    }
    if (card.trim().length < 2) {
      setCardError("La carta debe tener al menos 2 caracteres");
      return false;
    }
    if (cards.includes(card.trim().toLowerCase())) {
      setCardError("Esta carta ya existe en la lista");
      return false;
    }
    if (cards.length >= 30) {
      setCardError("Has alcanzado el límite máximo de 30 cartas");
      return false;
    }
    setCardError("");
    return true;
  };

  const validateDeckName = (name: string): boolean => {
    if (!name.trim()) {
      setNameError("El nombre del mazo es obligatorio");
      return false;
    }
    if (name.trim().length < 3) {
      setNameError("El nombre debe tener al menos 3 caracteres");
      return false;
    }
    setNameError("");
    return true;
  };

  const handleAddCard = () => {
    const trimmedCard = currentCard.trim();

    if (!validateCard(trimmedCard)) {
      return;
    }

    setCards([...cards, trimmedCard]);
    setCurrentCard("");
    setCardError("");
  };

  const handleRemoveCard = (index: number) => {
    const newCards = cards.filter((_, i) => i !== index);
    setCards(newCards);
  };

  const handleSaveRequest = () => {
    if (cards.length === 0) {
      Alert.alert("Sin cartas", "Debes agregar al menos una carta al mazo");
      return;
    }
    setShowNameModal(true);
  };

  const handleSaveDeck = async () => {
    if (!validateDeckName(deckName)) {
      return;
    }

    setLoading(true);
    try {
      // Ensure database is initialized before use
      await database.init();
      
      const deckId = await database.createMazo(deckName.trim());

      // Add all cards to the deck
      for (const card of cards) {
        await database.addCarta(deckId, card);
      }

      // Update the global state with the new list of decks
      const updatedDecks = await database.getMazos();
      setDecks(updatedDecks);

      setShowNameModal(false);
      Alert.alert(
        "Mazo creado",
        `Se ha creado el mazo "${deckName}" con ${cards.length} cartas`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error("Error saving deck:", error);
      Alert.alert(
        "Error", 
        `No se pudo guardar el mazo: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowNameModal(false);
    setDeckName("");
    setNameError("");
  };

  return (
    <CustomScreen contentStyle={styles.container}>
      <View style={styles.backgroundView}>
        {/* Header Section */}
        <View style={styles.header}>
          <IconButton
            icon="close"
            size={24}
            iconColor={colors.textLight}
            style={styles.closeButton}
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle}>CREACIÓN DE MAZO</Text>
        </View>

        {/* Main Cards Area */}
        <View style={styles.mainArea}>
          <ScrollView
            style={styles.cardsScrollView}
            contentContainerStyle={styles.cardsContainer}
            showsVerticalScrollIndicator={false}
          >
            {cards.length === 0 ? (
              <View style={styles.emptyState}>
                <IconButton
                  icon="cards-outline"
                  size={64}
                  iconColor={colors.textLight}
                  style={styles.emptyIcon}
                />
                <Text style={styles.emptyTitle}>Agrega cartas a tu mazo</Text>
                <Text style={styles.emptySubtitle}>
                  Usa el campo de abajo para añadir palabras
                </Text>
              </View>
            ) : (
              <View style={styles.cardsGrid}>
                {cards.map((card, index) => (
                  <Chip
                    key={index}
                    style={styles.cardChip}
                    textStyle={styles.cardChipText}
                    onClose={() => handleRemoveCard(index)}
                    closeIcon="delete"
                  >
                    {card}
                  </Chip>
                ))}
              </View>
            )}
          </ScrollView>
        </View>

        {/* Bottom Fixed Section */}
        <View style={styles.bottomSection}>
          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <TextInput
                label="Añadir nueva carta"
                value={currentCard}
                onChangeText={(text) => {
                  setCurrentCard(text);
                  if (cardError) setCardError("");
                }}
                mode="outlined"
                style={styles.cardInput}
                error={!!cardError}
                maxLength={30}
                onSubmitEditing={handleAddCard}
                returnKeyType="done"
                theme={{
                  colors: {
                    primary: colors.textLight,
                    onSurface: colors.textLight,
                    outline: colors.textLight,
                    onSurfaceVariant: colors.textLight,
                    surface: "transparent",
                  },
                }}
                textColor={colors.textLight}
                placeholderTextColor={colors.textLight}
              />
              <Button
                mode="contained"
                onPress={handleAddCard}
                style={styles.addButton}
                contentStyle={styles.addButtonContent}
                disabled={cards.length === 0}
                buttonColor="#007AFF"
                labelStyle={styles.acceptButtonLabel}
              >
                AÑADIR
              </Button>
            </View>
            {cardError && (
              <HelperText type="error" style={styles.errorText}>
                {cardError}
              </HelperText>
            )}
          </View>

          <Button
            mode="contained"
            onPress={handleSaveRequest}
            style={styles.acceptButton}
            contentStyle={styles.acceptButtonContent}
            disabled={cards.length === 0}
            buttonColor="#007AFF"
            labelStyle={styles.acceptButtonLabel}
          >
            ACEPTAR
          </Button>
        </View>
      </View>

      {/* Name Modal */}
      <Portal>
        <Modal
          visible={showNameModal}
          onDismiss={handleCloseModal}
          contentContainerStyle={styles.modalContainer}
        >
          <Surface style={styles.modalContent} elevation={5}>
            <Text style={styles.modalTitle}>Nombra tu mazo</Text>
            <Text style={styles.modalSubtitle}>
              Dale un nombre descriptivo a tu mazo de {cards.length} cartas
            </Text>

            <TextInput
              label="Nombre del mazo"
              value={deckName}
              onChangeText={(text) => {
                setDeckName(text);
                if (nameError) setNameError("");
              }}
              mode="outlined"
              style={styles.modalInput}
              error={!!nameError}
              maxLength={50}
              placeholder="Ej: Animales, Deportes, Comida..."
              left={<TextInput.Icon icon="cards" />}
            />
            <HelperText type="error" visible={!!nameError}>
              {nameError}
            </HelperText>

            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={handleCloseModal}
                style={styles.modalButton}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                mode="contained"
                onPress={handleSaveDeck}
                style={[styles.modalButton, styles.modalSaveButton]}
                loading={loading}
                disabled={loading || !deckName.trim()}
              >
                Guardar
              </Button>
            </View>
          </Surface>
        </Modal>
      </Portal>
    </CustomScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    left: 10,
    top: 5,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textLight,
    textAlign: "center",
    flex: 1,
  },
  mainArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardsScrollView: {
    flex: 1,
  },
  cardsContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    margin: 0,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textLight,
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textLight,
    opacity: 0.8,
    textAlign: "center",
    lineHeight: 22,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "flex-start",
  },
  cardChip: {
    backgroundColor: "#E3F2FD",
    marginBottom: 4,
  },
  cardChipText: {
    color: colors.primary,
    fontWeight: "500",
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 16,
  },
  inputSection: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  cardInput: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  addButton: {
    marginTop: 8,
    borderRadius: 20,
  },
  addButtonContent: {
    height: 50,
    paddingHorizontal: 24,
  },
  errorText: {
    color: colors.error,
    marginTop: 4,
  },
  acceptButton: {
    borderRadius: 20,
    minWidth: 120,
  },
  acceptButtonContent: {
    height: 50,
    paddingHorizontal: 24,
  },
  acceptButtonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textLight,
  },
  modalContainer: {
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    opacity: 0.8,
    marginBottom: 24,
  },
  modalInput: {
    backgroundColor: "transparent",
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
  },
  modalSaveButton: {
    backgroundColor: colors.success,
  },
});

export default CreateDeckScreen;
