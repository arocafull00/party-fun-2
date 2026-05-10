import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Pressable } from "react-native";
import {
  Text,
  Button,
  Card,
  IconButton,
  Portal,
  Modal,
  TextInput,
  Icon,
  ActivityIndicator,
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
  const [wordCounts, setWordCounts] = useState<Record<number, number>>({});
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
      const deckCounts = await Promise.all(
        decksData.map(async (deck) => {
          const cards = await database.getCartasByMazo(deck.id);
          return [deck.id, cards.length] as const;
        })
      );
      const counts = deckCounts.reduce<Record<number, number>>((acc, [id, count]) => {
        acc[id] = count;
        return acc;
      }, {});
      setWordCounts(counts);
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
      await database.updateMazo(selectedDeck.id, editingDeckName.trim());
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

  const handleDeckOptions = (deck: Mazo) => {
    Alert.alert(deck.nombre, "Elige una acción", [
      {
        text: "Ver cartas",
        onPress: () => handleViewCards(deck),
      },
      {
        text: "Renombrar",
        onPress: () => handleEditDeck(deck),
      },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => handleDeleteDeck(deck),
      },
      {
        text: "Cancelar",
        style: "cancel",
      },
    ]);
  };

  const getDeckIcon = (index: number) => {
    const icons = ["silverware-fork-knife", "compass-outline", "leaf", "castle"];
    return icons[index % icons.length];
  };

  if (loading) {
    return (
      <CustomScreen contentStyle={styles.screenContent}>
        <View style={styles.screen}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Cargando mazos...</Text>
          </View>
        </View>
      </CustomScreen>
    );
  }

  return (
    <CustomScreen contentStyle={styles.screenContent}>
      <View style={styles.screen}>
        <View style={styles.brandRow}>
          <Text style={styles.brandTitle}>PARTY FUN 2</Text>
        </View>
        <View style={styles.header}>
          <Text style={styles.title}>Mis Barajas</Text>
          <Text style={styles.subtitle}>Elige una baraja para empezar a jugar o crea una nueva.</Text>
        </View>
        <View style={styles.primaryAction}>
          <BouncyButton
            label="Crear Nueva Baraja"
            onPress={handleCreateNewDeck}
            icon="plus-circle"
            variant="tertiary"
          />
        </View>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {decks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>Todavía no tienes barajas.</Text>
              <Text style={styles.emptyDescription}>Pulsa crear nueva baraja para comenzar.</Text>
            </View>
          ) : null}

          {decks.map((deck, index) => (
            <Pressable
              key={deck.id}
              style={styles.deckCard}
              onPress={() => handleViewCards(deck)}
              onLongPress={() => handleDeckOptions(deck)}
            >
              <View style={styles.deckIconContainer}>
                <Icon source={getDeckIcon(index)} size={18} color={colors.textLight} />
              </View>
              <View style={styles.deckTextArea}>
                <Text style={styles.deckName}>{deck.nombre}</Text>
                <Text style={styles.deckDescription}>Vocabulario experto sobre este mundo culinario.</Text>
                <View style={styles.deckMeta}>
                  <Icon source="book-open-page-variant-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.deckMetaText}>{wordCounts[deck.id] ?? 0} PALABRAS</Text>
                </View>
              </View>
            </Pressable>
          ))}

          <Pressable style={styles.customDeckCard} onPress={handleCreateNewDeck}>
            <View style={styles.customDeckPlus}>
              <Icon source="plus" size={26} color={colors.accent} />
            </View>
            <Text style={styles.customDeckText}>Nueva Baraja Personalizada</Text>
          </Pressable>
        </ScrollView>
        <View style={styles.bottomTabs}>
          <Pressable style={styles.tabItem} onPress={() => router.push("/new-game")}>
            <Icon source="play-circle" size={18} color={"#69a4d8"} />
            <Text style={styles.tabLabel}>JUGAR</Text>
          </Pressable>
          <Pressable style={styles.tabItem} onPress={() => router.push("/statistics")}>
            <Icon source="chart-bar" size={18} color={"#69a4d8"} />
            <Text style={styles.tabLabel}>ESTADÍSTICAS</Text>
          </Pressable>
          <View style={styles.tabItemActive}>
            <Icon source="cards" size={18} color={colors.textLight} />
            <Text style={styles.tabLabelActive}>BARAJAS</Text>
          </View>
        </View>
      </View>

      <Portal>
        <Modal
          visible={showCardsModal}
          onDismiss={() => setShowCardsModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Cartas de "{selectedDeck?.nombre}"</Text>
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
              deckCards.map((card) => (
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
              {deckCards.length} carta{deckCards.length !== 1 ? "s" : ""}
            </Text>
          </View>
        </Modal>
      </Portal>

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
  screenContent: {
    paddingHorizontal: 0,
  },
  screen: {
    flex: 1,
    paddingTop: spacing.md,
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
  header: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  title: {
    fontSize: 52,
    lineHeight: 52,
    fontFamily: typography.families.heading,
    color: "#2a1e12",
  },
  subtitle: {
    fontFamily: typography.families.body,
    color: "#5a4a3a",
    fontSize: typography.sizes.lg,
  },
  primaryAction: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  createDeckButton: {
    borderRadius: borderRadius.xl,
  },
  createDeckButtonContent: {
    minHeight: 62,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  contentContainer: {
    gap: spacing.md,
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
  },
  loadingText: {
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  },
  emptyContainer: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: "#e9d5b5",
    borderStyle: "dashed",
    paddingVertical: spacing.xl,
    alignItems: "center",
    gap: spacing.xs,
  },
  emptyTitle: {
    fontFamily: typography.families.heading,
    color: "#2a1e12",
    fontSize: typography.sizes.xl,
  },
  emptyDescription: {
    color: "#6f5f50",
    textAlign: "center",
    fontFamily: typography.families.body,
  },
  deckCard: {
    backgroundColor: "#ffe8c6",
    borderRadius: borderRadius.xl,
    minHeight: 176,
    padding: spacing.md,
    borderBottomWidth: 4,
    borderBottomColor: "#f2c89b",
    flexDirection: "row",
    gap: spacing.md,
  },
  deckIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.sm,
    backgroundColor: "#2d1c16",
    alignItems: "center",
    justifyContent: "center",
  },
  deckTextArea: {
    flex: 1,
    gap: spacing.sm,
  },
  deckName: {
    fontFamily: typography.families.heading,
    color: "#2a1e12",
    fontSize: typography.sizes.xxxl,
    lineHeight: typography.sizes.xxxl + 2,
  },
  deckDescription: {
    fontFamily: typography.families.body,
    color: "#665648",
    fontSize: typography.sizes.md,
    lineHeight: 22,
  },
  deckMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  deckMetaText: {
    fontFamily: typography.families.bodyBold,
    color: "#5e4e40",
    fontSize: typography.sizes.sm,
    letterSpacing: 0.5,
  },
  customDeckCard: {
    marginTop: spacing.sm,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#e9d5b5",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  customDeckPlus: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.full,
    backgroundColor: "#ffe8b8",
    alignItems: "center",
    justifyContent: "center",
  },
  customDeckText: {
    fontFamily: typography.families.bodyBold,
    color: "#684d2f",
    fontSize: typography.sizes.lg,
  },
  bottomTabs: {
    position: "absolute",
    bottom: 14,
    left: 16,
    right: 16,
    borderRadius: borderRadius.xl,
    backgroundColor: "#fff6ea",
    borderWidth: 1,
    borderColor: "#f2e0c9",
    flexDirection: "row",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  tabLabel: {
    color: "#69a4d8",
    fontFamily: typography.families.bodyBold,
    fontSize: 12,
  },
  tabItemActive: {
    flex: 1,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 6,
  },
  tabLabelActive: {
    color: colors.textLight,
    fontFamily: typography.families.bodyBold,
    fontSize: 12,
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
export default DeckManagementScreen;