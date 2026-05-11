import React, { useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import { Text, Button, Portal, Modal } from "react-native-paper";
import { router } from "expo-router";

import { useDecks } from "../../hooks/useDecks";
import { useGameStore, Player } from "../../store/game-store";
import { CustomScreen } from "../../shared/components/CustomScreen";
import { FocusTextInput } from "../../shared/components/FocusTextInput";
import { AppHeader } from "../../shared/components/app-header";
import { AppHeaderIconButton } from "../../shared/components/app-header-icon-button";
import { SparkleBurst } from "../home/components/SparkleBurst";
import NewGameDeckCard from "./components/new-game-deck-card";
import NewGameContinueButton from "./components/new-game-continue-button";
import TeamCard from "./components/TeamCard";
import { TeamColor } from "./interfaces/types";
import { newGameScreenStyles as styles } from "./new-game-screen.styles";

const NewGameScreen: React.FC = () => {
  const {
    selectedDeck,
    teams,
    addPlayerToTeam,
    removePlayerFromTeam,
    movePlayerToTeam,
    clearTeams,
    startGame,
  } = useGameStore();

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
            <SparkleBurst />
          </View>
          <Text style={styles.mainSubtitle}>
            Añade a los jugadores y elige su bando para comenzar.
          </Text>
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

export default NewGameScreen;
