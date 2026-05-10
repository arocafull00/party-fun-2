import React, { useMemo, useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Pressable } from "react-native";
import {
  Text,
  Button,
  TextInput,
  Icon,
  IconButton,
  Modal,
  Portal,
  HelperText,
} from "react-native-paper";
import { router } from "expo-router";

import { database } from "../database/database";
import { useGameStore } from "../store/game-store";
import { borderRadius, colors, spacing, typography } from "../theme/theme";
import { CustomScreen } from "../shared/components/CustomScreen";
import { BouncyButton } from "../shared/components/BouncyButton";

const CreateDeckScreen: React.FC = () => {
  const { setDecks } = useGameStore();
  const [currentCard, setCurrentCard] = useState("");
  const [cards, setCards] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);
  const [deckName, setDeckName] = useState("");
  const [nameError, setNameError] = useState("");

  const cardIcons = useMemo(
    () => ["paw", "water", "leaf", "weather-windy", "triangle", "castle"],
    []
  );

  const validateCard = (card: string): boolean => {
    const cardTrimmed = card.trim();    
    if (!cardTrimmed) {
      setCardError("La carta no puede estar vacía");
      return false;
    }
    if (cardTrimmed.length < 2) {
      setCardError("La carta debe tener al menos 2 caracteres");
      return false;
    }
    if (cards.some((item) => item.toLowerCase() === card.trim().toLowerCase())) {
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
    const nameTrimmed = name.trim();    
    if (!nameTrimmed) {
      setNameError("El nombre del mazo es obligatorio");
      return false;
    }
    if (nameTrimmed.length < 3) {
      setNameError("El nombre debe tener al menos 3 caracteres");
      return false;
    }
    setNameError("");
    return true;
  };

  const handleAddCard = () => {
    if (!validateCard(currentCard)) {
      return;
    }

    setCards([...cards, currentCard]);
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
      await database.init();
      const deckId = await database.createMazo(deckName);
      for (const card of cards) {
        await database.addCarta(deckId, card);
      }
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
      <View style={styles.screen}>
        <View style={styles.brandRow}>
          <Text style={styles.brandTitle}>PARTY FUN 2</Text>
        </View>
        <View style={styles.headerCard}>
          <View style={styles.headerBadgeRow}>
            <Text style={styles.headerBadge}>BARAJA ACTIVA</Text>
            <Text style={styles.headerCount}>{cards.length} Palabras</Text>
          </View>
          <Pressable onPress={() => setShowNameModal(true)}>
            <Text style={styles.headerTitle}>
              {deckName || "Editor de Baraja"}
            </Text>
          </Pressable>
          <Text style={styles.headerSubtitle}>
            Añade todas las palabras que quieras!
          </Text>
        </View>

        <View style={styles.addWordSection}>
          <View style={styles.addInputWrapper}>
            <TextInput
              mode="outlined"
              value={currentCard}
              onChangeText={(text) => {
                setCurrentCard(text);
                if (cardError) {
                  setCardError("");
                }
              }}
              placeholder="Añadir palabra"
              style={styles.addWordInput}
              maxLength={30}
              onSubmitEditing={handleAddCard}
              returnKeyType="done"
              error={!!cardError}
            />
          </View>
          {cardError ? (
            <HelperText type="error" style={styles.errorText}>
              {cardError}
            </HelperText>
          ) : null}
          <BouncyButton
            label="Añadir Palabra"
            onPress={handleAddCard}
            variant="primary"
            icon="plus-circle"
            disabled={!currentCard.trim() || cards.length >= 30}
          />
        </View>

        <ScrollView
          style={styles.cardsScrollView}
          contentContainerStyle={styles.cardsContainer}
          showsVerticalScrollIndicator={false}
        >
          {cards.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Tu baraja está vacía</Text>
              <Text style={styles.emptySubtitle}>Añade palabras para empezar a jugar.</Text>
            </View>
          ) : (
            <View style={styles.cardRows}>
              {cards.map((card, index) => (
                <View key={`${card}-${index}`} style={styles.cardRow}>
                  <View style={styles.cardRowIcon}>
                    <Icon source={cardIcons[index % cardIcons.length]} size={26} color={colors.primary} />
                  </View>
                  <Text style={styles.cardRowText}>{card}</Text>
                  <Pressable onPress={() => handleRemoveCard(index)} style={styles.deleteButton}>
                    <Icon source="trash-can" size={26} color={colors.secondary} />
                  </Pressable>
                </View>
              ))}
              <View style={styles.listEnd}>
                <View style={styles.listEndDot} />
                <View style={styles.listEndDot} />
                <View style={styles.listEndDot} />
                <Text style={styles.listEndText}>FIN DE LA LISTA</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.bottomActions}>
          <Button
            mode="outlined"
            onPress={() => setShowNameModal(true)}
            style={styles.nameButton}
            icon="pencil"
          >
            Nombrar
          </Button>
          <Button
            mode="contained"
            onPress={handleSaveRequest}
            style={styles.saveButton}
            disabled={cards.length === 0}
            icon="content-save"
            loading={loading}
          >
            Guardar Baraja
          </Button>
        </View>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor={colors.primary}
          style={styles.backButton}
          onPress={() => router.back()}
        />
      </View>

      <Portal>
        <Modal
          visible={showNameModal}
          onDismiss={handleCloseModal}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nombra tu mazo</Text>
            <Text style={styles.modalSubtitle}>Dale un nombre descriptivo a tu mazo de {cards.length} cartas</Text>
            <TextInput
              mode="outlined"
              label="Nombre del mazo"
              value={deckName}
              onChangeText={(text) => {
                setDeckName(text.trim());
                if (nameError) {
                  setNameError("");
                }
              }}
              style={styles.modalInput}
              error={!!nameError}
              maxLength={50}
              placeholder="Ej: Animales, Deportes, Comida..."
            />
            {nameError ? <HelperText type="error">{nameError}</HelperText> : null}
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
                disabled={loading || !deckName}
              >
                Guardar
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </CustomScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  screen: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  brandRow: {
    alignItems: "center",
    marginBottom: spacing.md,
  },
  brandTitle: {
    fontFamily: typography.families.heading,
    color: colors.primary,
    fontSize: typography.sizes.xl,
    letterSpacing: 0.8,
  },
  headerCard: {
    borderRadius: borderRadius.xl,
    backgroundColor: colors.background,
    borderBottomWidth: 4,
    borderBottomColor: colors.primary,
    padding: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  headerBadgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerBadge: {
    backgroundColor: "#c8ff7f",
    color: "#2a2a2a",
    alignSelf: "flex-start",
    borderRadius: borderRadius.full,
    paddingVertical: 4,
    paddingHorizontal: 12,
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.sm,
    letterSpacing: 1.2,
  },
  headerCount: {
    fontFamily: typography.families.bodyBold,
    color: "#5a4328",
    fontSize: typography.sizes.xxl,
  },
  headerTitle: {
    fontFamily: typography.families.heading,
    color: "#2a1e12",
    fontSize: 58,
    lineHeight: 58,
  },
  headerSubtitle: {
    fontFamily: typography.families.body,
    color: "#544435",
    fontSize: typography.sizes.xl,
    lineHeight: 30,
  },
  addWordSection: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  addInputWrapper: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "flex-start",
  },
  addWordInput: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorText: {
    marginTop: -6,
  },
  addWordButton: {
    borderRadius: borderRadius.xl,
  },
  addWordButtonContent: {
    minHeight: 58,
  },
  cardsScrollView: {
    flex: 1,
  },
  cardsContainer: {
    gap: spacing.md,
    paddingBottom: 120,
  },
  emptyState: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: "#e8d9c3",
    borderStyle: "dashed",
    alignItems: "center",
    paddingVertical: spacing.xl,
    gap: spacing.xs,
  },
  emptyTitle: {
    fontFamily: typography.families.heading,
    color: "#2a1e12",
    fontSize: typography.sizes.xl,
  },
  emptySubtitle: {
    fontFamily: typography.families.body,
    color: "#6f5f50",
    fontSize: typography.sizes.md,
  },
  cardRows: {
    gap: spacing.md,
  },
  cardRow: {
    minHeight: 84,
    borderRadius: borderRadius.xl,
    backgroundColor: "#fff2df",
    borderBottomWidth: 3,
    borderBottomColor: "#f0d7b7",
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  cardRowIcon: {
    width: 58,
    height: 58,
    borderRadius: borderRadius.md,
    backgroundColor: "#dbe7f8",
    alignItems: "center",
    justifyContent: "center",
  },
  cardRowText: {
    flex: 1,
    fontFamily: typography.families.bodyBold,
    color: "#1d160f",
    fontSize: 44,
    lineHeight: 44,
  },
  deleteButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  listEnd: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.xl,
  },
  listEndDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: "#f0d8b0",
  },
  listEndText: {
    marginTop: spacing.sm,
    fontFamily: typography.families.bodyBold,
    color: "#5a4328",
    letterSpacing: 1,
    fontSize: typography.sizes.md,
  },
  bottomActions: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.md,
    flexDirection: "row",
    gap: spacing.sm,
  },
  nameButton: {
    flex: 1,
    borderRadius: borderRadius.xl,
    borderColor: colors.primary,
  },
  saveButton: {
    flex: 1.4,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary,
  },
  backButton: {
    position: "absolute",
    top: 2,
    left: 2,
    margin: 0,
  },
  modalContainer: {
    paddingHorizontal: spacing.lg,
  },
  modalContent: { 
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  modalTitle: {
    fontSize: typography.sizes.xxl,
    fontFamily: typography.families.heading,
    color: colors.text,
  },
  modalSubtitle: {
    fontSize: typography.sizes.md,
    color: colors.text,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  modalInput: {
    backgroundColor: colors.background,
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
    backgroundColor: colors.primary,
  },
});

export default CreateDeckScreen;
