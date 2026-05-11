import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Card, Button, IconButton } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { Mazo } from "../../../database/database";
import { colors, spacing, borderRadius, typography } from "../../../theme/theme";

interface DeckSelectionPhaseProps {
  decks: Mazo[];
  onSelectDeck: (deck: Mazo) => void;
  onCreateDeck: () => void;
  cardCounts?: Record<number, number>;
}

type TabType = "mis-mazos" | "explorar";

const DeckSelectionPhase: React.FC<DeckSelectionPhaseProps> = ({
  decks,
  onSelectDeck,
  onCreateDeck,
  cardCounts = {},
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("mis-mazos");

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Fecha desconocida";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Creado hoy";
    if (diffDays === 1) return "Creado ayer";
    if (diffDays < 7) return `Creado hace ${diffDays} días`;
    return `Creado el ${date.toLocaleDateString("es-ES")}`;
  };

  return (
    <View style={styles.container}>
      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setActiveTab("mis-mazos")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "mis-mazos" && styles.tabTextActive,
            ]}
          >
            Mis mazos
          </Text>
          {activeTab === "mis-mazos" && (
            <View style={styles.tabIndicator} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setActiveTab("explorar")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "explorar" && styles.tabTextActive,
            ]}
          >
            Explorar
          </Text>
          {activeTab === "explorar" && (
            <View style={styles.tabIndicator} />
          )}
        </TouchableOpacity>
      </View>

      {/* Create New Deck Card */}
      <View style={styles.createCardWrapper}>
        <View style={styles.createCard}>
          <View style={styles.createCardIconContainer}>
            <View style={styles.cardStackIcon}>
              <View style={styles.cardStackBack1} />
              <View style={styles.cardStackBack2} />
              <View style={styles.cardStackFront}>
                <Ionicons name="add" size={20} color={'#ffffff'} />
              </View>
            </View>
            <View style={styles.sparkleTopRight}>
              <Ionicons name="sparkles" size={14} color={colors.primary} />
            </View>
          </View>
          <Text style={styles.createCardTitle}>Crear nuevo mazo</Text>
          <Text style={styles.createCardDescription}>
            Añade tus propias palabras{"\n"}y crea un mazo personalizado.
          </Text>
          <Button
            mode="contained"
            icon="plus"
            onPress={onCreateDeck}
            style={styles.createButton}
            labelStyle={styles.createButtonLabel}
            buttonColor={colors.primary}
            textColor={'#ffffff'}
          >
            NUEVO MAZO
          </Button>
        </View>
      </View>

      {/* Decks Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Tus mazos ({decks.length})</Text>
        <TouchableOpacity style={styles.sortButton} activeOpacity={0.7}>
          <Text style={styles.sortText}>Ordenar</Text>
          <Ionicons name="chevron-down" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Decks List */}
      <View style={styles.decksList}>
        {decks.map((deck) => (
          <Card key={deck.id} style={styles.deckCard}>
            <Card.Content style={styles.deckCardContent}>
              {/* Left Image Area */}
              <View style={styles.deckImageContainer}>
                <View style={styles.deckImageBg}>
                  <View style={styles.deckCardStack}>
                    <View style={styles.deckCardBack} />
                    <View style={styles.deckCardFront}>
                      <Text style={styles.deckCardLetter}>A</Text>
                    </View>
                  </View>
                  <View style={styles.sparkleIcon}>
                    <Ionicons
                      name="sparkles"
                      size={14}
                      color={colors.primary}
                    />
                  </View>
                </View>
              </View>

              {/* Right Content Area */}
              <View style={styles.deckInfoContainer}>
                <View style={styles.deckHeaderRow}>
                  <Text style={styles.deckName} numberOfLines={1}>
                    {deck.nombre}
                  </Text>
                  <IconButton
                    icon="dots-vertical"
                    size={20}
                    iconColor={colors.text}
                    onPress={() => {}}
                    style={styles.menuButton}
                  />
                </View>

                <View style={styles.deckTags}>
                  <View style={styles.deckTagWords}>
                    <Ionicons
                      name="text"
                      size={14}
                      color={colors.primary}
                      style={styles.tagIcon}
                    />
                    <Text style={styles.deckTagText}>
                      {cardCounts[deck.id] ?? 0} palabras
                    </Text>
                  </View>
                  <View style={styles.deckTagDate}>
                    <Ionicons
                      name="time-outline"
                      size={14}
                      color={colors.text}
                      style={styles.tagIcon}
                    />
                    <Text style={styles.deckTagTextSecondary}>
                      {formatDate(deck.createdAt)}
                    </Text>
                  </View>
                </View>

                <Button
                  mode="outlined"
                  icon="play"
                  onPress={() => onSelectDeck(deck)}
                  style={styles.useDeckButton}
                  labelStyle={styles.useDeckButtonLabel}
                  textColor={colors.primary}
                >
                  USAR MAZO
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  tabContainer: {
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: colors.background,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    marginBottom: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignItems: "center",
    position: "relative",
  },
  tabText: {
    fontFamily: typography.families.body,
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  tabTextActive: {
    fontFamily: typography.families.bodyBold,
    color: colors.primary,
  },
  tabIndicator: {
    position: "absolute",
    bottom: 2,
    width: "60%",
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  createCardWrapper: {
    width: "100%",
    marginBottom: spacing.lg,
  },
  createCard: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.primary,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.secondary,
    padding: spacing.lg,
    alignItems: "center",
  },
  createCardIconContainer: {
    marginBottom: spacing.md,
    position: "relative",
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  cardStackIcon: {
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  cardStackBack1: {
    position: "absolute",
    width: 36,
    height: 44,
    borderRadius: 6,
    backgroundColor: colors.primary,
    opacity: 0.3,
    transform: [{ rotate: "-12deg" }, { translateX: -4 }],
  },
  cardStackBack2: {
    position: "absolute",
    width: 36,
    height: 44,
    borderRadius: 6,
    backgroundColor: colors.primary,
    opacity: 0.5,
    transform: [{ rotate: "-6deg" }, { translateX: -2 }],
  },
  cardStackFront: {
    width: 36,
    height: 44,
    borderRadius: 6,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  sparkleTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  createCardTitle: {
    fontFamily: typography.families.heading,
    fontSize: typography.sizes.lg,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  createCardDescription: {
    fontFamily: typography.families.body,
    fontSize: typography.sizes.sm,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  createButton: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
  },
  createButtonLabel: {
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.sm,
    letterSpacing: 0.5,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortText: {
    fontFamily: typography.families.body,
    fontSize: typography.sizes.md,
    color: colors.primary,
    marginRight: spacing.xs,
  },
  decksList: {
    width: "100%",
  },
  deckCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  deckCardContent: {
    flexDirection: "row",
    padding: spacing.sm,
    paddingVertical: spacing.md,
  },
  deckImageContainer: {
    width: "32%",
    aspectRatio: 0.85,
    marginRight: spacing.md,
  },
  deckImageBg: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  deckCardStack: {
    width: 44,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  deckCardBack: {
    position: "absolute",
    width: 32,
    height: 42,
    borderRadius: 6,
    backgroundColor: colors.primary,
    opacity: 0.15,
    transform: [{ rotate: "-8deg" }, { translateX: -3 }],
  },
  deckCardFront: {
    width: 32,
    height: 42,
    borderRadius: 6,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  deckCardLetter: {
    fontFamily: typography.families.heading,
    fontSize: typography.sizes.lg,
    color: colors.primary,
  },
  sparkleIcon: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  deckInfoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  deckHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.xs,
  },
  deckName: {
    fontFamily: typography.families.heading,
    fontSize: typography.sizes.lg,
    color: colors.text,
    flex: 1,
    marginTop: 2,
  },
  menuButton: {
    margin: 0,
    marginTop: -8,
    marginRight: -8,
  },
  deckTags: {
    marginBottom: spacing.sm,
  },
  deckTagWords: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    marginBottom: spacing.xs,
  },
  deckTagDate: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  tagIcon: {
    marginRight: 4,
  },
  deckTagText: {
    fontFamily: typography.families.body,
    fontSize: typography.sizes.sm,
    color: colors.primary,
  },
  deckTagTextSecondary: {
    fontFamily: typography.families.body,
    fontSize: typography.sizes.sm,
    color: colors.text,
  },
  useDeckButton: {
    borderRadius: borderRadius.full,
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  useDeckButtonLabel: {
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.sm,
    letterSpacing: 0.5,
  },
});

export default DeckSelectionPhase;
