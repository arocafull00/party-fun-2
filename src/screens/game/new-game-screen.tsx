import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { database, Mazo } from "../../database/database";
import { useGameStore, Player } from "../../store/game-store";
import { colors } from "../../theme/theme";
import {
  DeckSelectionPhase,
  TeamConfigurationPhase,
  GameSummaryPhase,
  NewGameHeader,
} from "./components";
import { GamePhase, TeamColor } from "./interfaces/types";

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

  const [currentPhase, setCurrentPhase] = useState<GamePhase>("deck");
  const [newPlayerName, setNewPlayerName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeScreen = async () => {
      await loadDecks();
      
      // Only clear teams if there are players configured, otherwise try to load last game players
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
      console.log('Attempting to load last game players automatically...');
      await loadLastGamePlayers();
      console.log('Successfully loaded last game players automatically');
    } catch (error) {
      console.error('Error auto-loading last game players:', error);
      // Don't show alert for automatic loading, just log the error
    }
  };

  const handleLoadLastGamePlayers = async () => {
    setLoading(true);
    try {
      await loadLastGamePlayers();
      Alert.alert(
        "Equipos Cargados", 
        "Se han cargado los jugadores de la última partida"
      );
    } catch (error) {
      console.error("Error loading last game players:", error);
      Alert.alert(
        "Error", 
        "No se pudieron cargar los jugadores de la última partida"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearTeams = () => {
    Alert.alert(
      "Limpiar Equipos",
      "¿Estás seguro de que quieres eliminar todos los jugadores de los equipos?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Limpiar", 
          style: "destructive",
          onPress: () => clearTeams()
        },
      ]
    );
  };

  const handleSelectDeck = async (deck: Mazo) => {
    setSelectedDeck(deck);

    try {
      const cards = await database.getCartasByMazo(deck.id);
      setCards(cards);
      setCurrentPhase("teams");
    } catch (error) {
      console.error("Error loading cards:", error);
    }
  };

  const generatePlayerId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const handleAddPlayer = (team: TeamColor) => {
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
      id: generatePlayerId(),
      name: newPlayerName.trim(),
    };

    addPlayerToTeam(team, newPlayer);
    setNewPlayerName("");
  };

  const handleMovePlayer = (playerId: string, fromTeam: TeamColor) => {
    const toTeam: TeamColor = fromTeam === "azul" ? "rojo" : "azul";
    movePlayerToTeam(playerId, fromTeam, toTeam);
  };

  const handleContinueToSummary = () => {
    if (teams.azul.players.length === 0 || teams.rojo.players.length === 0) {
      Alert.alert(
        "Equipos incompletos",
        "Cada equipo debe tener al menos un jugador"
      );
      return;
    }

    const totalPlayers = teams.azul.players.length + teams.rojo.players.length;
    if (totalPlayers < 4) {
      Alert.alert(
        "Pocos jugadores",
        "Se recomienda tener al menos 4 jugadores para una mejor experiencia. ¿Quieres continuar?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Continuar", onPress: () => setCurrentPhase("summary") },
        ]
      );
      return;
    }

    setCurrentPhase("summary");
  };

  const handleStartGame = () => {
    if (!selectedDeck) return;

    try {
      const cardsList = useGameStore.getState().cards.map((c) => c.texto);
      startGame(cardsList);
      router.push("/game-turn");
    } catch (error) {
      console.error("Error starting game:", error);
      Alert.alert("Error", "No se pudo iniciar el juego");
    }
  };

  const handleBackPress = () => {
    if (currentPhase === "deck") {
      router.back();
    } else if (currentPhase === "teams") {
      setCurrentPhase("deck");
    } else if (currentPhase === "summary") {
      setCurrentPhase("teams");
    }
  };

  const getPhaseTitle = () => {
    switch (currentPhase) {
      case "deck":
        return "Seleccionar Mazo";
      case "teams":
        return "Configurar Equipos";
      case "summary":
        return "Resumen del Juego";
      default:
        return "";
    }
  };

  const renderCurrentPhase = () => {
    switch (currentPhase) {
      case "deck":
        return (
          <DeckSelectionPhase
            decks={decks}
            onSelectDeck={handleSelectDeck}
          />
        );
      case "teams":
        return (
          <TeamConfigurationPhase
            teams={teams}
            playerName={newPlayerName}
            onPlayerNameChange={setNewPlayerName}
            onAddPlayer={handleAddPlayer}
            onMovePlayer={handleMovePlayer}
            onRemovePlayer={removePlayerFromTeam}
            onContinue={handleContinueToSummary}
            onLoadLastGamePlayers={handleLoadLastGamePlayers}
            onClearTeams={handleClearTeams}
            loading={loading}
          />
        );
      case "summary":
        return (
          <GameSummaryPhase
            selectedDeck={selectedDeck}
            teams={teams}
            onStartGame={handleStartGame}
          />
        );
      default:
        return (
          <DeckSelectionPhase
            decks={decks}
            onSelectDeck={handleSelectDeck}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <NewGameHeader title={getPhaseTitle()} onBackPress={handleBackPress} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCurrentPhase()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 5,
    paddingTop: 15,
  },
});

export default NewGameScreen;
