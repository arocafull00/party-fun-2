import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Pressable,
  TextInput as RNTextInput,
} from "react-native";
import {
  Text,
  Button,
  Icon,
  Modal,
  Portal,
  HelperText,
} from "react-native-paper";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppHeader } from "../shared/components/app-header";
import { AppHeaderIconButton } from "../shared/components/app-header-icon-button";
import { useCreateDeck } from "../hooks/useCreateDeck";
import { borderRadius, colors, spacing, typography } from "../theme/theme";
import { DotsBackground } from "../shared/components/DotsBackground";
import { CreateDeckWordRow } from "./create-deck/CreateDeckWordRow";

const NAVY = "#0F2847";
const GREY_MUTED = "#5C6570";
const ACTIVE_BADGE_BG = "#D4F4DD";
const ACTIVE_BADGE_FG = "#1B5E20";
const LIGHT_INPUT_BORDER = "#D1D5DB";
const EMPTY_CARD_BG = "#E3F0FF";

const CreateDeckScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { createDeck, loading: saving } = useCreateDeck();
  const [currentCard, setCurrentCard] = useState("");
  const [cards, setCards] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);
  const [deckName, setDeckName] = useState("");
  const [nameError, setNameError] = useState("");

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
      await createDeck(deckName.trim(), cards);

      setShowNameModal(false);
      Alert.alert(
        "Mazo creado",
        `Se ha creado el mazo "${deckName.trim()}" con ${cards.length} cartas`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error("Error saving deck:", error);
      Alert.alert(
        "Error",
        `No se pudo guardar el mazo: ${error instanceof Error ? error.message : "Error desconocido"}`
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

  const addDisabled = !currentCard.trim() || cards.length >= 30;

  return (
    <View style={styles.root}>
      <DotsBackground />
      <View style={styles.shell}>
        <View
          style={{
            paddingLeft: insets.left,
            paddingRight: insets.right,
          }}
        >
          <AppHeader
            left={
              <AppHeaderIconButton
                icon="chevron-left"
                onPress={() => router.back()}
              />
            }
          />
        </View>

        <View
          style={[
            styles.body,
            {
              paddingLeft: spacing.lg + insets.left,
              paddingRight: spacing.lg + insets.right,
            },
          ]}
        >
          <View style={styles.editorCard}>
            <View style={styles.headerBadgeRow}>
              <View style={styles.badgeWords}>
                <Icon source="file-document-outline" size={18} color={colors.primary} />
                <Text style={styles.badgeWordsLabel}>{cards.length} Palabras</Text>
              </View>
            </View>

            <View style={styles.titleRow}>
              <View style={styles.titleTexts}>
                <Text style={styles.editorTitle}>Editor de Baraja</Text>
                <Text style={styles.editorSubtitle}>Añade todas las palabras que quieras!</Text>
              </View>
              <View style={styles.illustration}>
                <Icon source="cards-playing-outline" size={42} color={colors.primary} />
              </View>
            </View>


            <View style={styles.inputShell}>
              <View style={styles.inputGlyph}>
                <Text style={styles.inputGlyphText}>T</Text>
              </View>
              <RNTextInput
                value={currentCard}
                onChangeText={(text) => {
                  setCurrentCard(text);
                  if (cardError) {
                    setCardError("");
                  }
                }}
                placeholder="Añadir palabra"
                placeholderTextColor="#9CA3AF"
                style={styles.nativeInput}
                maxLength={30}
                onSubmitEditing={handleAddCard}
                returnKeyType="done"
              />
            </View>

            {cardError ? (
              <HelperText type="error" style={styles.errorText} visible={!!cardError}>
                {cardError}
              </HelperText>
            ) : null}

            <Pressable
              disabled={addDisabled}
              onPress={handleAddCard}
              style={({ pressed }) => [
                styles.addOutlineBtn,
                addDisabled && styles.addOutlineBtnDisabled,
                pressed && !addDisabled && styles.addOutlineBtnPressed,
              ]}
            >
              <View style={styles.addIconCircle}>
                <Icon source="plus" size={20} color="#fff" />
              </View>
              <Text style={styles.addOutlineLabel}>AÑADIR PALABRA</Text>
            </Pressable>
          </View>

          <View style={styles.listSection}>
            {cards.length === 0 ? (
              <View style={styles.emptyCardWrap}>
                <View style={styles.emptyCard}>
                  <View style={styles.emptyIconCluster}>
                    <View style={styles.raysRow}>
                      <View style={[styles.ray, { transform: [{ rotate: "-28deg" }] }]} />
                      <View style={[styles.ray, styles.rayTall]} />
                      <View style={[styles.ray, { transform: [{ rotate: "28deg" }] }]} />
                    </View>
                    <Icon source="package-variant" size={40} color={colors.primary} />
                  </View>
                  <Text style={styles.emptyTitle}>Tu baraja está vacía</Text>
                  <Text style={styles.emptySubtitle}>Añade palabras para empezar a jugar.</Text>
                </View>
              </View>
            ) : (
              <ScrollView
                style={styles.listScroll}
                contentContainerStyle={styles.listScrollContent}
                contentInsetAdjustmentBehavior="automatic"
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.cardRows}>
                  {cards
                    .map((card, index) => ({ card, index }))
                    .reverse()
                    .map(({ card, index }) => (
                      <CreateDeckWordRow
                        key={`${card}-${index}`}
                        card={card}
                        index={index}
                        onRemove={() => handleRemoveCard(index)}
                      />
                    ))}
                </View>
              </ScrollView>
            )}
          </View>

        <View style={[styles.footerWrap, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
          <View style={styles.footerCard}>
            <Button
              mode="contained"
              onPress={handleSaveRequest}
              style={styles.saveButton}
              contentStyle={styles.footerBtnContent}
              labelStyle={styles.saveButtonLabel}
              disabled={cards.length === 0}
              icon="content-save"
              loading={loading || saving}
              buttonColor={colors.primary}
            >
              Guardar Baraja
            </Button>
          </View>
        </View>
      </View>
      </View>

      <Portal>
        <Modal
          visible={showNameModal}
          onDismiss={handleCloseModal}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nombra tu mazo</Text>
            <Text style={styles.modalSubtitle}>
              Dale un nombre descriptivo a tu mazo de {cards.length} cartas
            </Text>
            <RNTextInput
              value={deckName}
              onChangeText={(text) => {
                setDeckName(text);
                if (nameError) {
                  setNameError("");
                }
              }}
              placeholder="Ej: Animales, Deportes, Comida..."
              placeholderTextColor="#9CA3AF"
              style={styles.modalInputNative}
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
                disabled={loading || !deckName.trim()}
              >
                Guardar
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFBF5",
  },
  shell: {
    flex: 1,
  },
  body: {
    flex: 1,
    gap: spacing.md,
  },
  listSection: {
    flex: 1,
    minHeight: 0,
  },
  listScroll: {
    flex: 1,
  },
  listScrollContent: {
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  emptyCardWrap: {
    flex: 1,
    minHeight: 0,
    justifyContent: "center",
  },
  editorCard: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  headerBadgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
  },
  badgeActive: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: ACTIVE_BADGE_BG,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.full,
  },
  badgeActiveLabel: {
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.xs,
    color: ACTIVE_BADGE_FG,
    letterSpacing: 0.6,
  },
  badgeWords: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#C5CAD3",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.full,
  },
  badgeWordsLabel: {
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.sm,
    color: colors.primary,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  titleTexts: {
    flex: 1,
    gap: 4,
  },
  editorTitle: {
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.xxl,
    color: NAVY,
  },
  editorSubtitle: {
    fontFamily: typography.families.body,
    fontSize: typography.sizes.md,
    color: GREY_MUTED,
    lineHeight: 22,
  },
  illustration: {
    width: 72,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  pencilFloat: {
    position: "absolute",
    right: -4,
    bottom: 4,
    backgroundColor: "#FFF9E6",
    borderRadius: 8,
    padding: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.primary,
    opacity: 0.35,
    marginTop: spacing.xs,
  },
  inputShell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: LIGHT_INPUT_BORDER,
    borderRadius: 14,
    backgroundColor: "#fff",
    paddingLeft: 10,
    paddingRight: 12,
    minHeight: 52,
  },
  inputGlyph: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  inputGlyphText: {
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.lg,
    color: colors.primary,
  },
  nativeInput: {
    flex: 1,
    fontFamily: typography.families.body,
    fontSize: typography.sizes.md,
    color: NAVY,
    paddingVertical: 10,
  },
  errorText: {
    marginTop: -4,
  },
  addOutlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    minHeight: 54,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: "#fff",
  },
  addOutlineBtnDisabled: {
    opacity: 0.45,
  },
  addOutlineBtnPressed: {
    opacity: 0.85,
  },
  addIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  addOutlineLabel: {
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.md,
    color: colors.primary,
    letterSpacing: 0.8,
  },
  emptyCard: {
    borderRadius: 18,
    backgroundColor: EMPTY_CARD_BG,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: "dashed",
    alignItems: "center",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  emptyIconCluster: {
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  raysRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 5,
    marginBottom: 4,
  },
  ray: {
    width: 3,
    height: 10,
    borderRadius: 2,
    backgroundColor: colors.primary,
    opacity: 0.85,
  },
  rayTall: {
    height: 14,
  },
  emptyTitle: {
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.xl,
    color: NAVY,
    textAlign: "center",
  },
  emptySubtitle: {
    fontFamily: typography.families.body,
    fontSize: typography.sizes.md,
    color: GREY_MUTED,
    textAlign: "center",
  },
  cardRows: {
    gap: spacing.md,
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
  footerWrap: {
    paddingTop: spacing.sm,
  },
  footerCard: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "stretch",
    padding: spacing.md,
  },
  footerBtnContent: {
    minHeight: 48,
  },
  nameButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
    borderColor: colors.primary,
  },
  nameButtonLabel: {
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.sm,
  },
  saveButton: {
    flex: 1.15,
    borderRadius: borderRadius.lg,
  },
  saveButtonLabel: {
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.sm,
    color: "#fff",
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
  modalInputNative: {
    borderWidth: 1,
    borderColor: LIGHT_INPUT_BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: typography.families.body,
    fontSize: typography.sizes.md,
    backgroundColor: "#fff",
    color: NAVY,
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
    color: colors.text,
  },
});

export default CreateDeckScreen;
