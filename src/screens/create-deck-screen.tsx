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
import { borderRadius, colors, spacing, typography } from "../theme/theme";
import { CustomScreen } from "../shared/components/CustomScreen";
import { FocusTextInput } from "../shared/components/FocusTextInput";

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
              <FocusTextInput
                label="Añadir nueva carta"
                value={currentCard}
                onChangeText={(text) => {
                  setCurrentCard(text);
                  if (cardError) setCardError("");
                }}
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

            <FocusTextInput
              label="Nombre del mazo"
              value={deckName}
              onChangeText={(text) => {
                setDeckName(text);
                if (nameError) setNameError("");
              }}
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    left: 10,
    top: 5,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: "800",
    fontFamily: typography.families.heading,
    color: colors.text,
    textAlign: "center",
    flex: 1,
  },
  mainArea: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  cardsScrollView: {
    flex: 1,
  },
  cardsContainer: {
    flexGrow: 1,
    paddingBottom: spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xxxl,
  },
  emptyIcon: {
    margin: 0,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: "800",
    fontFamily: typography.families.heading,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    opacity: 0.8,
    textAlign: "center",
    lineHeight: 22,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "flex-start",
  },
  cardChip: {
    backgroundColor: colors.surfaceContainerHigh,
    marginBottom: spacing.xs,
  },
  cardChipText: {
    color: colors.primary,
    fontWeight: "500",
  },
  bottomSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.md,
  },
  inputSection: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  cardInput: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
  },
  addButton: {
    marginTop: 8,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary,
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
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary,
    minWidth: 120,
  },
  acceptButtonContent: {
    height: 50,
    paddingHorizontal: 24,
  },
  acceptButtonLabel: {
    fontSize: typography.sizes.md,
    fontWeight: "700",
    fontFamily: typography.families.bodyBold,
    color: colors.textLight,
  },
  modalContainer: {
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },
  modalTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: "800",
    fontFamily: typography.families.heading,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: "center",
    opacity: 0.8,
    marginBottom: spacing.xl,
  },
  modalInput: {
    backgroundColor: "transparent",
    marginBottom: spacing.sm,
  },
  modalButtons: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  modalButton: {
    flex: 1,
  },
  modalSaveButton: {
    backgroundColor: colors.success,
  },
});

export default CreateDeckScreen;
