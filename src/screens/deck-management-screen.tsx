import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import {
  Text,
  Button,
  Card,
  IconButton,
  Portal,
  Modal,
  TextInput,
  Chip,
  Surface,
  Icon,
} from "react-native-paper";
import { router } from "expo-router";

import { database, Mazo, Carta } from "../database/database";
import { useGameStore } from "../store/game-store";
import { borderRadius, colors, spacing, typography } from "../theme/theme";
import { CustomScreen } from "../shared/components/CustomScreen";
import { BouncyButton } from "../shared/components/BouncyButton";

export const DeckManagementScreen: React.FC = () => {
  const { setDecks, decks } = useGameStore();
  const [loading, setLoading] = useState(true);
  const [selectedDeck, setSelectedDeck] = useState<Mazo | null>(null);
  const [deckCards, setDeckCards] = useState<Carta[]>([]);
  const [showCardsModal, setShowCardsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDeckName, setEditingDeckName] = useState("");
  const [deckNameError, setDeckNameError] = useState("");

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    try {
      setLoading(true);
      const decksData = await database.getMazos();
      setDecks(decksData);
    } catch (error) {
      console.error("Error loading decks:", error);
      Alert.alert("Error", "No se pudieron cargar los mazos");
    } finally {
      setLoading(false);
    }
  };

  const handleViewCards = async (deck: Mazo) => {
    try {
      setSelectedDeck(deck);
      const cards = await database.getCartasByMazo(deck.id);
      setDeckCards(cards);
      setShowCardsModal(true);
    } catch (error) {
      console.error("Error loading cards:", error);
      Alert.alert("Error", "No se pudieron cargar las cartas del mazo");
    }
  };

  const handleEditDeck = (deck: Mazo) => {
    setSelectedDeck(deck);
    setEditingDeckName(deck.nombre);
    setDeckNameError("");
    setShowEditModal(true);
  };

  const validateDeckName = (name: string): boolean => {
    if (!name.trim()) {
      setDeckNameError("El nombre del mazo es obligatorio");
      return false;
    }
    if (name.trim().length < 3) {
      setDeckNameError("El nombre debe tener al menos 3 caracteres");
      return false;
    }
    // Check if name already exists (excluding current deck)
    const existingDeck = decks.find(
      (d) => d.nombre.toLowerCase() === name.trim().toLowerCase() && d.id !== selectedDeck?.id
    );
    if (existingDeck) {
      setDeckNameError("Ya existe un mazo con ese nombre");
      return false;
    }
    setDeckNameError("");
    return true;
  };

  const handleSaveDeckName = async () => {
    if (!selectedDeck || !validateDeckName(editingDeckName)) {
      return;
    }

    try {
      // Update deck name in database
      await database.updateMazo(selectedDeck.id, editingDeckName.trim());
      
      // Reload decks to update the list
      await loadDecks();
      
      setShowEditModal(false);
      Alert.alert("Éxito", "Nombre del mazo actualizado correctamente");
    } catch (error) {
      console.error("Error updating deck:", error);
      Alert.alert("Error", "No se pudo actualizar el nombre del mazo");
    }
  };

  const handleDeleteDeck = async (deck: Mazo) => {
    Alert.alert(
      "Eliminar Mazo",
      `¿Estás seguro de que quieres eliminar el mazo "${deck.nombre}"? Esta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await database.deleteMazo(deck.id);
              await loadDecks();
              Alert.alert("Éxito", "Mazo eliminado correctamente");
            } catch (error) {
              console.error("Error deleting deck:", error);
              Alert.alert("Error", "No se pudo eliminar el mazo");
            }
          },
        },
      ]
    );
  };

  const handleCreateNewDeck = () => {
    router.push("/create-deck");
  };

  const getDeckColor = (index: number) => {
    const colorOptions = [
      colors.surfaceContainerLowest,
      colors.surfaceContainerLow,
      colors.surfaceContainer,
      colors.surfaceContainerHigh,
      colors.surfaceContainerLow,
      colors.surfaceContainerHighest,
    ];
    return colorOptions[index % colorOptions.length];
  };

  if (loading) {
    return (
      <CustomScreen>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando mazos...</Text>
        </View>
      </CustomScreen>
    );
  }

  return (
    <CustomScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>MIS MAZOS</Text>
          <Text style={styles.subtitle}>Gestiona tus mazos de cartas</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {decks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Surface style={styles.emptyCard} elevation={2}>
                <Icon source="cards-outline" size={80} />
                <Text style={styles.emptyTitle}>Sin mazos</Text>
                <Text style={styles.emptyDescription}>
                  No tienes ningún mazo creado. Crea tu primer mazo para empezar a jugar.
                </Text>
                <BouncyButton
                  label="Crear mazo"
                  onPress={handleCreateNewDeck}
                  style={styles.createButton}
                  icon="plus"
                />
              </Surface>
            </View>
          ) : (
            <>
              <View style={styles.decksGrid}>
                {decks.map((deck, index) => (
                  <Card key={deck.id} style={[styles.deckCard, { backgroundColor: getDeckColor(index) }]}>
                    <Card.Content style={styles.deckCardContent}>
                      <Text style={styles.deckName}>{deck.nombre}</Text>
                      <View style={styles.deckActions}>
                        <IconButton
                          icon="eye"
                          size={20}
                          iconColor={colors.text}
                          onPress={() => handleViewCards(deck)}
                          style={styles.actionButton}
                        />
                        <IconButton
                          icon="pencil"
                          size={20}
                          iconColor={colors.text}
                          onPress={() => handleEditDeck(deck)}
                          style={styles.actionButton}
                        />
                        <IconButton
                          icon="delete"
                          size={20}
                          iconColor={colors.text}
                          onPress={() => handleDeleteDeck(deck)}
                          style={styles.actionButton}
                        />
                      </View>
                    </Card.Content>
                  </Card>
                ))}
              </View>

              <View style={styles.createNewContainer}>
                <BouncyButton
                  label="Crear nuevo mazo"
                  onPress={handleCreateNewDeck}
                  style={styles.createNewButton}
                  contentStyle={styles.createNewButtonContent}
                  icon="plus"
                />
              </View>
            </>
          )}
        </ScrollView>
      </View>

      {/* Cards Modal */}
      <Portal>
        <Modal
          visible={showCardsModal}
          onDismiss={() => setShowCardsModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Cartas de "{selectedDeck?.nombre}"
            </Text>
            <IconButton
              icon="close"
              size={24}
              onPress={() => setShowCardsModal(false)}
            />
          </View>
          <ScrollView style={styles.cardsList}>
            {deckCards.length === 0 ? (
              <Text style={styles.noCardsText}>Este mazo no tiene cartas</Text>
            ) : (
              deckCards.map((card, index) => (
                <Card key={card.id} style={styles.cardItem}>
                  <Card.Content>
                    <Text style={styles.cardText}>{card.texto}</Text>
                  </Card.Content>
                </Card>
              ))
            )}
          </ScrollView>
          <View style={styles.modalFooter}>
            <Text style={styles.cardCount}>
              {deckCards.length} carta{deckCards.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </Modal>
      </Portal>

      {/* Edit Deck Modal */}
      <Portal>
        <Modal
          visible={showEditModal}
          onDismiss={() => setShowEditModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Mazo</Text>
            <IconButton
              icon="close"
              size={24}
              onPress={() => setShowEditModal(false)}
            />
          </View>
          <View style={styles.editForm}>
            <TextInput
              label="Nombre del mazo"
              value={editingDeckName}
              onChangeText={setEditingDeckName}
              error={!!deckNameError}
              style={styles.textInput}
            />
            {deckNameError ? (
              <Text style={styles.errorText}>{deckNameError}</Text>
            ) : null}
          </View>
          <View style={styles.modalFooter}>
            <Button
              mode="outlined"
              onPress={() => setShowEditModal(false)}
              style={styles.modalButton}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={handleSaveDeckName}
              style={styles.modalButton}
            >
              Guardar
            </Button>
          </View>
        </Modal>
      </Portal>
    </CustomScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "relative",
    backgroundColor: "transparent",
  },
  header: {
    alignItems: "center",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontWeight: "800",
    fontFamily: typography.families.heading,
    color: colors.text,
    textAlign: "center",
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 5,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: typography.sizes.lg,
    color: colors.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xxxl,
  },
  emptyCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLowest,
  },
  emptyTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: "800",
    fontFamily: typography.families.heading,
    color: colors.text,
    marginTop: 15,
    marginBottom: 10,
  },
  emptyDescription: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.8,
  },
  createButton: {
    borderRadius: borderRadius.xl,
  },
  decksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  deckCard: {
    width: "48%",
    borderRadius: borderRadius.xl,
    elevation: 3,
  },
  deckCardContent: {
    padding: spacing.md,
    alignItems: "center",
  },
  deckName: {
    fontSize: typography.sizes.md,
    fontWeight: "700",
    fontFamily: typography.families.bodyBold,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  deckActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
  },
  actionButton: {
    margin: 0,
  },
  createNewContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  createNewButton: {
    borderRadius: borderRadius.xl,
    width: "100%",
  },
  createNewButtonContent: {
    minHeight: 55,
  },
  modalContainer: {
    backgroundColor: colors.surfaceContainerLowest,
    margin: spacing.lg,
    borderRadius: borderRadius.xl,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.surfaceContainerHigh,
  },
  modalTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: "800",
    fontFamily: typography.families.heading,
    color: colors.text,
    flex: 1,
  },
  cardsList: {
    padding: spacing.lg,
    maxHeight: 400,
  },
  cardItem: {
    marginBottom: spacing.sm,
    backgroundColor: colors.surfaceContainerLow,
  },
  cardText: {
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  noCardsText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.7,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: spacing.lg,
    backgroundColor: colors.surfaceContainerLow,
  },
  cardCount: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    opacity: 0.7,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  editForm: {
    padding: spacing.lg,
  },
  textInput: {
    backgroundColor: colors.surfaceContainerLowest,
  },
  errorText: {
    color: colors.accent,
    fontSize: 12,
    marginTop: 5,
  },
}); 