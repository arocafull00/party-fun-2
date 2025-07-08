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
import { colors } from "../theme/theme";
import { CustomScreen } from "../shared/components/CustomScreen";

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
    const colorOptions = ['#FFD93D', '#4A90E2', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38BA8'];
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
                <Button
                  mode="contained"
                  onPress={handleCreateNewDeck}
                  style={styles.createButton}
                  icon="plus"
                >
                  CREAR MAZO
                </Button>
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
                          iconColor={colors.textLight}
                          onPress={() => handleViewCards(deck)}
                          style={styles.actionButton}
                        />
                        <IconButton
                          icon="pencil"
                          size={20}
                          iconColor={colors.textLight}
                          onPress={() => handleEditDeck(deck)}
                          style={styles.actionButton}
                        />
                        <IconButton
                          icon="delete"
                          size={20}
                          iconColor={colors.textLight}
                          onPress={() => handleDeleteDeck(deck)}
                          style={styles.actionButton}
                        />
                      </View>
                    </Card.Content>
                  </Card>
                ))}
              </View>

              <View style={styles.createNewContainer}>
                <Button
                  mode="contained"
                  onPress={handleCreateNewDeck}
                  style={styles.createNewButton}
                  contentStyle={styles.createNewButtonContent}
                  labelStyle={styles.createNewButtonLabel}
                  icon="plus"
                >
                  CREAR NUEVO MAZO
                </Button>
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
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.textLight,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: "center",
    marginTop: 5,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: colors.textLight,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyCard: {
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textLight,
    marginTop: 15,
    marginBottom: 10,
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.8,
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
  },
  decksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
    marginBottom: 30,
  },
  deckCard: {
    width: "48%",
    borderRadius: 15,
    elevation: 3,
  },
  deckCardContent: {
    padding: 15,
    alignItems: "center",
  },
  deckName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textLight,
    textAlign: "center",
    marginBottom: 10,
  },
  deckActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  actionButton: {
    margin: 0,
  },
  createNewContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  createNewButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    width: "100%",
  },
  createNewButtonContent: {
    height: 55,
  },
  createNewButtonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textLight,
  },
  modalContainer: {
    backgroundColor: colors.surface,
    margin: 20,
    borderRadius: 15,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textLight,
    flex: 1,
  },
  cardsList: {
    padding: 20,
    maxHeight: 400,
  },
  cardItem: {
    marginBottom: 10,
    backgroundColor: colors.surfaceVariant,
  },
  cardText: {
    fontSize: 16,
    color: colors.textLight,
  },
  noCardsText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.7,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.outline,
  },
  cardCount: {
    fontSize: 14,
    color: colors.textLight,
    opacity: 0.7,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  editForm: {
    padding: 20,
  },
  textInput: {
    backgroundColor: colors.surfaceVariant,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 5,
  },
}); 