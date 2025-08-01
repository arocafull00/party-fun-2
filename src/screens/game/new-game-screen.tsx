import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  Button,
  IconButton,
  Portal,
  Modal,
  TextInput,
} from "react-native-paper";
import { router } from "expo-router";

import { database, Mazo } from "../../database/database";
import { useGameStore, Player } from "../../store/game-store";
import { colors } from "../../theme/theme";
import { TeamCard } from "./components";
import { TeamColor } from "./interfaces/types";
import { CustomScreen } from "../../shared/components/CustomScreen";

const NewGameScreen: React.FC = () => {
  const {
    decks,
    setDecks,
    selectedDeck,
    setSelectedDeck,
    setCards,
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
  const [selectedTeamForPlayer, setSelectedTeamForPlayer] =
    useState<TeamColor>("azul");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeScreen = async () => {
      await loadDecks();

      // Only clear teams if there are players configured, otherwise try to load last game players
      const hasPlayers =
        teams.azul.players.length > 0 || teams.rojo.players.length > 0;
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
      Alert.alert(
        "Pocos jugadores",
        "Necesitas al menos 2 jugadores para mezclar"
      );
      return;
    }

    // Shuffle array
    const shuffled = [...allPlayers].sort(() => Math.random() - 0.5);

    // Clear teams first
    clearTeams();

    // Distribute players alternately
    shuffled.forEach((player, index) => {
      const team: TeamColor = index % 2 === 0 ? "azul" : "rojo";
      addPlayerToTeam(team, player);
    });

    Alert.alert(
      "¡Jugadores mezclados!",
      "Los equipos han sido reorganizados aleatoriamente"
    );
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

    // Check if player name already exists in either team
    const allPlayers = [...teams.azul.players, ...teams.rojo.players];
    if (
      allPlayers.some(
        (player) =>
          player.name.toLowerCase() === newPlayerName.trim().toLowerCase()
      )
    ) {
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
      Alert.alert(
        "Equipos incompletos",
        "Cada equipo debe tener al menos un jugador"
      );
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
    <CustomScreen contentStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor={colors.text}
          onPress={() => router.push("/")}
        />
        <Text style={styles.headerTitle}>NUEVA PARTIDA</Text>
        <IconButton
          icon="shuffle"
          size={24}
          iconColor={colors.text}
          onPress={handleShufflePlayers}
        />
      </View>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.content}>
          {/* Teams Section */}
          <View style={styles.teamsContainer}>
            <TeamCard
              team="azul"
              title="EQUIPO AZUL"
              backgroundColor={colors.primary}
              players={teams.azul.players}
              onMovePlayer={movePlayerToTeam}
              onRemovePlayer={removePlayerFromTeam}
              onAddPlayer={() => handleAddPlayerPress("azul")}
            />

            <TeamCard
              team="rojo"
              title="EQUIPO ROJO"
              backgroundColor={colors.secondary}
              players={teams.rojo.players}
              onMovePlayer={movePlayerToTeam}
              onRemovePlayer={removePlayerFromTeam}
              onAddPlayer={() => handleAddPlayerPress("rojo")}
            />
          </View>
        </View>
        <View style={styles.bottomActions}>
          <Button
            mode="outlined"
            onPress={handleOpenDeckSelection}
            style={styles.deckButton}
            labelStyle={styles.deckButtonLabel}
            contentStyle={styles.deckButtonContent}
          >
            {selectedDeck ? selectedDeck.nombre : "Seleccionar Mazo"}
          </Button>

          <Button
            mode="contained"
            onPress={handleStartGame}
            style={styles.startButton}
            labelStyle={styles.startButtonLabel}
            contentStyle={styles.startButtonContent}
          >
            ¡EMPEZAR!
          </Button>
        </View>
      {/* Player Modal */}
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

            <TextInput
              label="Nombre del jugador"
              value={newPlayerName}
              onChangeText={setNewPlayerName}
              mode="outlined"
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
      </SafeAreaView>
    </CustomScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    paddingBottom: 5,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  teamsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    height: 230,
    gap: 12,
  },
  deckInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  deckLabel: {
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.text + "20",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  deckButton: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.background,
    borderRadius: 12,
    elevation: 0,
  },
  deckButtonLabel: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "bold",
  },
  deckButtonContent: {
    height: 48,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    elevation: 0,
  },
  startButtonLabel: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "bold",
  },
  startButtonContent: {
    height: 48,
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 20,
    padding: 20,
  },
  modalContent: {
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: colors.text,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: colors.text,
  },
  textInput: {
    width: "100%",
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    minWidth: 100,
  },
});

export default NewGameScreen;
