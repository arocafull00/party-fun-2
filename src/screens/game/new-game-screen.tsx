import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Pressable } from "react-native";
import { Text, Button, IconButton, Portal, Modal, Icon } from "react-native-paper";
import { router } from "expo-router";

import { database } from "../../database/database";
import { useGameStore, Player } from "../../store/game-store";
import { borderRadius, colors, spacing, typography } from "../../theme/theme";
import { TeamCard } from "./components";
import { TeamColor } from "./interfaces/types";
import { CustomScreen } from "../../shared/components/CustomScreen";
import { BouncyButton } from "../../shared/components/BouncyButton";
import { FocusTextInput } from "../../shared/components/FocusTextInput";

const NewGameScreen: React.FC = () => {
  const {
    setDecks,
    selectedDeck,
    teams,
    addPlayerToTeam,
    removePlayerFromTeam,
    movePlayerToTeam,
    clearTeams,
    loadLastGamePlayers,
    startGame,
  } = useGameStore();

  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [selectedTeamForPlayer, setSelectedTeamForPlayer] = useState<TeamColor>("azul");

  useEffect(() => {
    const initializeScreen = async () => {
      await loadDecks();
      const hasPlayers = teams.azul.players.length > 0 || teams.rojo.players.length > 0;
      if (!hasPlayers) {
        await loadLastGamePlayersAutomatically();
      }
    };

    initializeScreen();
  }, []);

  const loadDecks = async () => {
    try {
      const decksData = await database.getMazos();
      setDecks(decksData);
    } catch (error) {
      console.error("Error loading decks:", error);
    }
  };

  const loadLastGamePlayersAutomatically = async () => {
    try {
      await loadLastGamePlayers();
    } catch (error) {
      console.error("Error auto-loading last game players:", error);
    }
  };

  const handleShufflePlayers = () => {
    const allPlayers = [...teams.azul.players, ...teams.rojo.players];
    if (allPlayers.length < 2) {
      Alert.alert("Pocos jugadores", "Necesitas al menos 2 jugadores para mezclar");
      return;
    }
    const shuffled = [...allPlayers].sort(() => Math.random() - 0.5);
    clearTeams();
    shuffled.forEach((player, index) => {
      const team: TeamColor = index % 2 === 0 ? "azul" : "rojo";
      addPlayerToTeam(team, player);
    });
    Alert.alert("¡Jugadores mezclados!", "Los equipos han sido reorganizados aleatoriamente");
  };

  const handleAddPlayerPress = (team: TeamColor) => {
    setSelectedTeamForPlayer(team);
    setShowPlayerModal(true);
  };

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) {
      Alert.alert("Nombre requerido", "Ingresa el nombre del jugador");
      return;
    }
    const allPlayers = [...teams.azul.players, ...teams.rojo.players];
    if (allPlayers.some((player) => player.name.toLowerCase() === newPlayerName.trim().toLowerCase())) {
      Alert.alert("Nombre duplicado", "Ya existe un jugador con ese nombre");
      return;
    }
    const newPlayer: Player = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: newPlayerName.trim(),
    };
    addPlayerToTeam(selectedTeamForPlayer, newPlayer);
    setNewPlayerName("");
    setShowPlayerModal(false);
  };

  const handleOpenDeckSelection = () => {
    router.push("/deck-selection");
  };

  const handleStartGame = () => {
    if (!selectedDeck) {
      router.push("/deck-selection");
      return;
    }
    if (teams.azul.players.length === 0 || teams.rojo.players.length === 0) {
      Alert.alert("Equipos incompletos", "Cada equipo debe tener al menos un jugador");
      return;
    }
    startGameConfirmed();
  };

  const startGameConfirmed = () => {
    try {
      const cardsList = useGameStore.getState().cards.map((c) => c.texto);
      startGame(cardsList);
      router.push("/game-turn");
    } catch (error) {
      console.error("Error starting game:", error);
      Alert.alert("Error", "No se pudo iniciar el juego");
    }
  };

  return (
    <CustomScreen contentStyle={styles.screenContent}>
      <View style={styles.screen}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor={colors.primary}
          style={styles.backButton}
          onPress={() => router.push("/")}
        />
        <View style={styles.brandRow}>
          <Text style={styles.brandTitle}>Party Fun 2</Text>
        </View>
        <View style={styles.headerBlock}>
          <Text style={styles.mainTitle}>Configura tu Partida</Text>
          <Text style={styles.mainSubtitle}>Añade a los jugadores y elige su bando.</Text>
        </View>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <TeamCard
            team="azul"
            title="Equipo Azul"
            players={teams.azul.players}
            onMovePlayer={movePlayerToTeam}
            onRemovePlayer={removePlayerFromTeam}
            onAddPlayer={() => handleAddPlayerPress("azul")}
          />
          <TeamCard
            team="rojo"
            title="Equipo Rojo"
            players={teams.rojo.players}
            onMovePlayer={movePlayerToTeam}
            onRemovePlayer={removePlayerFromTeam}
            onAddPlayer={() => handleAddPlayerPress("rojo")}
          />
          <View style={styles.deckRow}>
            <Pressable style={styles.deckButton} onPress={handleOpenDeckSelection}>
              <Text style={styles.deckButtonLabel}>
                {selectedDeck ? selectedDeck.nombre : "Seleccionar mazo"}
              </Text>
            </Pressable>
            <IconButton
              icon="shuffle-variant"
              size={20}
              iconColor={colors.primary}
              style={styles.shuffleButton}
              onPress={handleShufflePlayers}
            />
          </View>
          <View style={styles.startButton}>
            <BouncyButton
              label="Continuar"
              onPress={handleStartGame}
              icon="arrow-right"
            />
          </View>
        </ScrollView>
        <View style={styles.bottomTabs}>
          <View style={styles.tabItemActive}>
            <Icon source="gamepad-variant" size={18} color={colors.textLight} />
            <Text style={styles.tabLabelActive}>Jugar</Text>
          </View>
          <Pressable style={styles.tabItem} onPress={() => router.push("/statistics")}>
            <Icon source="chart-bar" size={18} color={"#6b819e"} />
            <Text style={styles.tabLabel}>Estadísticas</Text>
          </Pressable>
          <Pressable style={styles.tabItem} onPress={() => router.push("/deck-management")}>
            <Icon source="cards" size={18} color={"#6b819e"} />
            <Text style={styles.tabLabel}>Barajas</Text>
          </Pressable>
        </View>
      </View>
      <Portal>
        <Modal
          visible={showPlayerModal}
          onDismiss={() => {
            setShowPlayerModal(false);
            setNewPlayerName("");
          }}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Añadir Jugador</Text>
            <Text style={styles.modalSubtitle}>
              Equipo {selectedTeamForPlayer === "azul" ? "Azul" : "Rojo"}
            </Text>
            <FocusTextInput
              label="Nombre del jugador"
              value={newPlayerName}
              onChangeText={setNewPlayerName}
              style={styles.textInput}
              autoFocus
            />
            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => {
                  setShowPlayerModal(false);
                  setNewPlayerName("");
                }}
                style={styles.modalButton}
              >
                Cancelar
              </Button>
              <Button
                mode="contained"
                onPress={handleAddPlayer}
                style={styles.modalButton}
                disabled={!newPlayerName.trim()}
              >
                Añadir
              </Button>
            </View>
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
    paddingTop: spacing.sm,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: spacing.xs,
    left: spacing.sm,
    margin: 0,
    zIndex: 2,
  },
  brandRow: {
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  brandTitle: {
    fontFamily: typography.families.heading,
    color: colors.primary,
    fontSize: typography.sizes.xxl,
    letterSpacing: 0.6,
  },
  headerBlock: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  mainTitle: {
    fontFamily: typography.families.heading,
    color: "#2a1e12",
    fontSize: 56,
    lineHeight: 56,
  },
  mainSubtitle: {
    fontFamily: typography.families.body,
    color: "#5f503f",
    fontSize: typography.sizes.xl,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  contentContainer: {
    gap: spacing.lg,
    paddingBottom: 140,
  },
  deckRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  deckButton: {
    flex: 1,
    minHeight: 56,
    borderRadius: borderRadius.xl,
    backgroundColor: "#fff4e6",
    borderWidth: 1,
    borderColor: "#e6d4be",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  deckButtonLabel: {
    color: colors.primary,
    fontSize: typography.sizes.md,
    fontFamily: typography.families.bodyBold,
  },
  shuffleButton: {
    backgroundColor: "#e7f1ff",
    margin: 0,
  },
  startButton: {
    borderRadius: borderRadius.xl,
    marginTop: spacing.xs,
  },
  startButtonContent: {
    minHeight: 72,
    paddingHorizontal: spacing.md,
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
    color: "#6b819e",
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
    padding: spacing.lg,
  },
  modalContent: {
    alignItems: "center",
  },
  modalTitle: {
    fontSize: typography.sizes.xxl,
    fontFamily: typography.families.heading,
    marginBottom: 8,
    color: colors.text,
  },
  modalSubtitle: {
    fontSize: typography.sizes.md,
    marginBottom: spacing.lg,
    color: colors.textSecondary,
  },
  textInput: {
    width: "100%",
    marginBottom: spacing.lg,
  },
  modalActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  modalButton: {
    minWidth: 100,
  },
});

export default NewGameScreen;
