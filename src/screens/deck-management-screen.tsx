import React, { useState } from "react";
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
import { router, useLocalSearchParams } from "expo-router";

import { database, Mazo, Carta } from "../database/database";
import { useDecks } from "../hooks/useDecks";
import { useDeckWordCounts } from "../hooks/useDeckWordCounts";
import { useGameStore } from "../store/game-store";
import { borderRadius, colors, spacing, typography } from "../theme/theme";
import { CustomScreen } from "../shared/components/CustomScreen";

import { AppHeader } from "../shared/components/app-header";
import { AppHeaderIconButton } from "../shared/components/app-header-icon-button";
import { DotsBackground } from "../shared/components/DotsBackground";
import { DeckListCard } from "./deck-list-card";

export const DeckManagementScreen: React.FC = () => {
  const { selectMode } = useLocalSearchParams<{ selectMode?: string }>();
  const isSelectMode = selectMode === "true";

  const { decks, loading, refetch } = useDecks();
  const wordCounts = useDeckWordCounts(decks);
  const storeSetSelectedDeck = useGameStore((s) => s.setSelectedDeck);
  const storeSetCards = useGameStore((s) => s.setCards);

  const [selectedDeck, setSelectedDeck] = useState<Mazo | null>(null);
  const [deckCards, setDeckCards] = useState<Carta[]>([]);
  const [showCardsModal, setShowCardsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDeckName, setEditingDeckName] = useState("");
  const [deckNameError, setDeckNameError] = useState("");

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
      await refetch();
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
              await refetch();
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

  const handleDeckBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/");
  };

  const deckManagementHeader = (
    <AppHeader
      left={
        <AppHeaderIconButton
          icon="chevron-left"
          onPress={handleDeckBack}
        />
      }
    />
  );

  if (loading) {
    return (
      <CustomScreen contentStyle={styles.screenContent} header={deckManagementHeader}>
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
    <CustomScreen contentStyle={styles.screenContent} header={deckManagementHeader}>
      <DotsBackground />
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.title}>{isSelectMode ? "Selecciona un Mazo" : "Mis Mazos"}</Text>
          <Text style={styles.subtitle}>
            {isSelectMode
              ? "Elige un mazo para usar en la partida."
              : "Elige un mazo para empezar a jugar o crea uno nuevo."}
          </Text>
        </View>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {decks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>Todavía no tienes mazos.</Text>
              <Text style={styles.emptyDescription}>Pulsa crear nuevo mazo para comenzar.</Text>
            </View>
          ) : null}

          {decks.map((deck, index) => (
            <DeckListCard
              key={deck.id}
              name={deck.nombre}
              wordCount={wordCounts[deck.id] ?? 0}
              deckIndex={index}
              onPress={async () => {
                if (isSelectMode) {
                  try {
                    storeSetSelectedDeck(deck);
                    const cards = await database.getCartasByMazo(deck.id);
                    storeSetCards(cards);
                    router.back();
                  } catch (error) {
                    console.error("Error loading cards:", error);
                    Alert.alert("Error", "No se pudieron cargar las cartas del mazo");
                  }
                } else {
                  router.push(`/edit/${deck.id}`);
                }
              }}
              onLongPress={() => handleDeckOptions(deck)}
            />
          ))}

          <Pressable style={styles.customDeckCard} onPress={handleCreateNewDeck}>
            <View style={styles.customDeckPlus}>
              <Icon source="plus" size={26} color={colors.primary} />
            </View>
            <Text style={styles.customDeckText}>Nuevo Mazo Personalizado</Text>
          </Pressable>
        </ScrollView>
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
  header: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  title: {
    fontSize: 30,
    lineHeight: 40,
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
    width: "100%",
    borderRadius: borderRadius.full,
  },
  createDeckButtonContent: {
    minHeight: 52,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  createDeckButtonLabel: {
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.lg,
    letterSpacing: 0.15,
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
    color: colors.text,
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
  deckDescription: {
    fontFamily: typography.families.body,
    color: "#665648",
    fontSize: typography.sizes.md,
    lineHeight: 22,
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
    color: colors.text,
    fontSize: typography.sizes.lg,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    margin: spacing.lg,
    borderRadius: borderRadius.xl,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.secondary,
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
    backgroundColor: colors.background,
  },
  cardText: {
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  noCardsText: {
    fontSize: typography.sizes.md,
    color: colors.text,
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.7,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  cardCount: {
    fontSize: typography.sizes.sm,
    color: colors.text,
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
    backgroundColor: '#ffffff',
  },
  errorText: {
    color: colors.accent,
    fontSize: 12,
    marginTop: 5,
  },
});
export default DeckManagementScreen;
