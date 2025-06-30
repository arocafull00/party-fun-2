import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { database, Bateria } from "../../database/database";
import { useGameStore, Player } from "../../store/game-store";
import { colors } from "../../theme/theme";
import {
  BatterySelectionPhase,
  TeamConfigurationPhase,
  GameSummaryPhase,
  NewGameHeader,
} from "./components";
import { GamePhase, TeamColor } from "./interfaces/types";

type RootStackParamList = {
  Home: undefined;
  NewGame: undefined;
  GameTurn: undefined;
};

type NewGameScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "NewGame"
>;

const NewGameScreen: React.FC = () => {
  const navigation = useNavigation<NewGameScreenNavigationProp>();
  const {
    batteries,
    setBatteries,
    selectedBattery,
    setSelectedBattery,
    setWords,
    teams,
    addPlayerToTeam,
    removePlayerFromTeam,
    movePlayerToTeam,
    clearTeams,
    startGame,
  } = useGameStore();

  const [currentPhase, setCurrentPhase] = useState<GamePhase>("battery");
  const [newPlayerName, setNewPlayerName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBatteries();
    clearTeams(); // Reset teams when entering new game screen
  }, []);

  const loadBatteries = async () => {
    try {
      const batteriesData = await database.getBaterias();
      setBatteries(batteriesData);
    } catch (error) {
      console.error("Error loading batteries:", error);
      Alert.alert("Error", "No se pudieron cargar las baterías");
    }
  };

  const handleSelectBattery = async (battery: Bateria) => {
    setSelectedBattery(battery);

    try {
      const words = await database.getPalabrasByBateria(battery.id);
      setWords(words);
      setCurrentPhase("teams");
    } catch (error) {
      console.error("Error loading words:", error);
      Alert.alert("Error", "No se pudieron cargar las palabras de la batería");
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
    if (!selectedBattery) return;

    try {
      const wordsList = useGameStore.getState().words.map((w) => w.texto);
      startGame(wordsList);
      navigation.navigate("GameTurn");
    } catch (error) {
      console.error("Error starting game:", error);
      Alert.alert("Error", "No se pudo iniciar el juego");
    }
  };

  const handleBackPress = () => {
    if (currentPhase === "battery") {
      navigation.goBack();
    } else if (currentPhase === "teams") {
      setCurrentPhase("battery");
    } else if (currentPhase === "summary") {
      setCurrentPhase("teams");
    }
  };

  const getPhaseTitle = () => {
    switch (currentPhase) {
      case "battery":
        return "Seleccionar Batería";
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
      case "battery":
        return (
          <BatterySelectionPhase
            batteries={batteries}
            onSelectBattery={handleSelectBattery}
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
          />
        );
      case "summary":
        return (
          <GameSummaryPhase
            selectedBattery={selectedBattery}
            teams={teams}
            onStartGame={handleStartGame}
          />
        );
      default:
        return (
          <BatterySelectionPhase
            batteries={batteries}
            onSelectBattery={handleSelectBattery}
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
