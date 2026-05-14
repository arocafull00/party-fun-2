import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Pressable,
  BackHandler,
} from "react-native";
import { Text, Button, Portal } from "react-native-paper";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useDecks } from "../../hooks/useDecks";
import { useGameStore, useGameStarted, Player } from "../../store/game-store";
import { database } from "../../database/database";
import { CustomScreen } from "../../shared/components/CustomScreen";
import { FocusTextInput } from "../../shared/components/FocusTextInput";
import { AppHeader } from "../../shared/components/app-header";
import { AppHeaderIconButton } from "../../shared/components/app-header-icon-button";
import NewGameDeckCard from "./components/new-game-deck-card";
import NewGameContinueButton from "./components/new-game-continue-button";
import TeamCard from "./components/TeamCard";
import { TeamColor } from "./interfaces/types";
import { newGameScreenStyles as styles } from "./new-game-screen.styles";

const NewGameScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    selectedDeck,
    teams,
    addPlayerToTeam,
    removePlayerFromTeam,
    movePlayerToTeam,
    clearTeams,
    startGame,
  } = useGameStore();
  const gameStarted = useGameStarted();

  useDecks();
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [selectedTeamForPlayer, setSelectedTeamForPlayer] = useState<TeamColor>("azul");

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

  const handleClearTeam = (team: TeamColor) => {
    const list = team === "azul" ? teams.azul.players : teams.rojo.players;
    [...list].forEach((p) => removePlayerFromTeam(team, p.id));
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
  };

  const handleOpenDeckSelection = () => {
    router.push("/deck-management?selectMode=true");
  };

  useEffect(() => {
    if (!showPlayerModal) {
      return;
    }
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      Keyboard.dismiss();
      setShowPlayerModal(false);
      setNewPlayerName("");
      return true;
    });
    return () => sub.remove();
  }, [showPlayerModal]);

  const dismissPlayerOverlay = () => {
    Keyboard.dismiss();
    setShowPlayerModal(false);
    setNewPlayerName("");
  };

  const handleStartGame = async () => {
    if (gameStarted) {
      router.push("/game-turn");
      return;
    }
    if (!selectedDeck) {
      router.push("/deck-management?selectMode=true");
      return;
    }
    if (teams.azul.players.length === 0 || teams.rojo.players.length === 0) {
      Alert.alert("Equipos incompletos", "Cada equipo debe tener al menos un jugador");
      return;
    }
    await startGameConfirmed();
  };

  const startGameConfirmed = async () => {
    try {
      if (!selectedDeck) {
        Alert.alert("Error", "No hay un mazo seleccionado");
        return;
      }
      const cartas = await database.getCartasByMazo(selectedDeck.id);
      const cardsList = cartas.map((c) => c.texto);
      if (cardsList.length === 0) {
        Alert.alert("Mazo vacío", "El mazo seleccionado no tiene cartas");
        return;
      }
      startGame(cardsList);
      router.push("/game-turn");
    } catch (error) {
      console.error("Error starting game:", error);
      Alert.alert("Error", "No se pudo iniciar el juego");
    }
  };

  return (
    <CustomScreen
      contentStyle={styles.screenContent}
      header={
        <AppHeader
          left={
            <AppHeaderIconButton
              icon="chevron-left"
              onPress={() => router.push("/")}
            />
          }
        />
      }
    >
      <View style={styles.screenBody}>
        <View style={styles.headerTitleBlock}>
          <View style={styles.titleRow}>
            <Text style={styles.mainTitle}>Configura tu Partida</Text>
          </View>
        </View>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TeamCard
            team="azul"
            title="Equipo Azul"
            players={teams.azul.players}
            onMovePlayer={movePlayerToTeam}
            onRemovePlayer={removePlayerFromTeam}
            onAddPlayer={() => handleAddPlayerPress("azul")}
            onClearTeam={() => handleClearTeam("azul")}
            onShuffleTeams={handleShufflePlayers}
          />
          <TeamCard
            team="rojo"
            title="Equipo Rojo"
            players={teams.rojo.players}
            onMovePlayer={movePlayerToTeam}
            onRemovePlayer={removePlayerFromTeam}
            onAddPlayer={() => handleAddPlayerPress("rojo")}
            onClearTeam={() => handleClearTeam("rojo")}
            onShuffleTeams={handleShufflePlayers}
          />
          <NewGameDeckCard
            deckName={selectedDeck?.nombre ?? null}
            onPress={handleOpenDeckSelection}
          />
          <View style={styles.startButton}>
            <NewGameContinueButton onPress={handleStartGame} />
          </View>
        </ScrollView>
      </View>
      <Portal>
        {showPlayerModal ? (
          <View style={styles.modalOverlayRoot} pointerEvents="box-none">
            <Pressable style={styles.modalBackdrop} onPress={dismissPlayerOverlay} />
            <KeyboardAvoidingView
              behavior="padding"
              keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 24 : 0}
              style={styles.modalKeyboardAvoid}
            >
              <ScrollView
                keyboardShouldPersistTaps="handled"
                bounces={false}
                showsVerticalScrollIndicator={false}
                style={styles.modalPlayerScroll}
                contentContainerStyle={styles.modalScrollInner}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Añadir Jugador</Text>
                    <Text style={styles.modalSubtitle}>
                      Equipo {selectedTeamForPlayer === "azul" ? "Azul" : "Rojo"}
                    </Text>
                    <FocusTextInput
                      label="Nombre del jugador"
                      value={newPlayerName}
                      onChangeText={setNewPlayerName}
                      onSubmitEditing={handleAddPlayer}
                      blurOnSubmit={false}
                      style={styles.textInput}
                      autoFocus
                    />
                    <View style={styles.modalActions}>
                      <Button
                        mode="outlined"
                        onPress={dismissPlayerOverlay}
                        style={styles.modalButton}
                      >
                        Cerrar
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
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        ) : null}
      </Portal>
    </CustomScreen>
  );
};

export default NewGameScreen;
