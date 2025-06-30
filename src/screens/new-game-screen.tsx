import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Text, 
  Button, 
  Card, 
  TextInput,
  Divider,
  Chip,
  IconButton,
  Menu,
  List,
  ProgressBar
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { database, Bateria, Palabra } from '../database/database';
import { useGameStore, Player } from '../store/game-store';
import { colors } from '../theme/theme';

type RootStackParamList = {
  Home: undefined;
  NewGame: undefined;
  GameTurn: undefined;
};

type NewGameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NewGame'>;

type GamePhase = 'battery' | 'teams' | 'summary';

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
    startGame
  } = useGameStore();

  const [currentPhase, setCurrentPhase] = useState<GamePhase>('battery');
  const [newPlayerName, setNewPlayerName] = useState('');
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
      console.error('Error loading batteries:', error);
      Alert.alert('Error', 'No se pudieron cargar las baterías');
    }
  };

  const handleSelectBattery = async (battery: Bateria) => {
    setSelectedBattery(battery);
    
    try {
      const words = await database.getPalabrasByBateria(battery.id);
      setWords(words);
      setCurrentPhase('teams');
    } catch (error) {
      console.error('Error loading words:', error);
      Alert.alert('Error', 'No se pudieron cargar las palabras de la batería');
    }
  };

  const generatePlayerId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const handleAddPlayer = (team: 'azul' | 'rojo') => {
    if (!newPlayerName.trim()) {
      Alert.alert('Nombre requerido', 'Ingresa el nombre del jugador');
      return;
    }

    // Check if player name already exists in either team
    const allPlayers = [...teams.azul.players, ...teams.rojo.players];
    if (allPlayers.some(player => player.name.toLowerCase() === newPlayerName.trim().toLowerCase())) {
      Alert.alert('Nombre duplicado', 'Ya existe un jugador con ese nombre');
      return;
    }

    const newPlayer: Player = {
      id: generatePlayerId(),
      name: newPlayerName.trim(),
    };

    addPlayerToTeam(team, newPlayer);
    setNewPlayerName('');
  };

  const handleMovePlayer = (playerId: string, fromTeam: 'azul' | 'rojo') => {
    const toTeam = fromTeam === 'azul' ? 'rojo' : 'azul';
    movePlayerToTeam(playerId, fromTeam, toTeam);
  };

  const handleContinueToSummary = () => {
    if (teams.azul.players.length === 0 || teams.rojo.players.length === 0) {
      Alert.alert('Equipos incompletos', 'Cada equipo debe tener al menos un jugador');
      return;
    }

    const totalPlayers = teams.azul.players.length + teams.rojo.players.length;
    if (totalPlayers < 4) {
      Alert.alert(
        'Pocos jugadores',
        'Se recomienda tener al menos 4 jugadores para una mejor experiencia. ¿Quieres continuar?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Continuar', onPress: () => setCurrentPhase('summary') },
        ]
      );
      return;
    }

    setCurrentPhase('summary');
  };

  const handleStartGame = () => {
    if (!selectedBattery) return;

    try {
      const wordsList = useGameStore.getState().words.map(w => w.texto);
      startGame(wordsList);
      navigation.navigate('GameTurn');
    } catch (error) {
      console.error('Error starting game:', error);
      Alert.alert('Error', 'No se pudo iniciar el juego');
    }
  };

  const handleBackPress = () => {
    if (currentPhase === 'battery') {
      navigation.goBack();
    } else if (currentPhase === 'teams') {
      setCurrentPhase('battery');
    } else if (currentPhase === 'summary') {
      setCurrentPhase('teams');
    }
  };

  const getPhaseProgress = () => {
    switch (currentPhase) {
      case 'battery': return 0.33;
      case 'teams': return 0.67;
      case 'summary': return 1;
      default: return 0;
    }
  };

  const getPhaseTitle = () => {
    switch (currentPhase) {
      case 'battery': return 'Seleccionar Batería';
      case 'teams': return 'Configurar Equipos';
      case 'summary': return 'Resumen del Juego';
      default: return '';
    }
  };

  // Battery Selection Phase Component
  const BatterySelectionPhase: React.FC = () => (
    <View style={styles.phaseContainer}>
      <Text style={styles.phaseDescription}>
        Selecciona una batería de palabras para el juego
      </Text>
      
      <View style={styles.batteriesGrid}>
        {batteries.map((battery) => (
          <Card 
            key={battery.id} 
            style={styles.batteryCard}
            onPress={() => handleSelectBattery(battery)}
          >
            <Card.Content style={styles.batteryCardContent}>
              <Text style={styles.batteryName}>{battery.nombre}</Text>
              <Chip 
                icon="cards" 
                style={styles.batteryChip}
                textStyle={{ color: colors.textLight }}
              >
                {battery.nombre}
              </Chip>
            </Card.Content>
          </Card>
        ))}
      </View>
    </View>
  );

  // Team Configuration Phase Component  
  const TeamConfigurationPhase: React.FC = () => {
    const TeamCard: React.FC<{ 
      team: 'azul' | 'rojo', 
      title: string, 
      backgroundColor: string 
    }> = ({ team, title, backgroundColor }) => (
      <Card style={[styles.teamCard, { borderColor: backgroundColor, borderWidth: 3 }]}>
        <Card.Content>
          <Text style={[styles.teamTitle, { color: backgroundColor }]}>{title}</Text>
          <Divider style={styles.divider} />
          
          {teams[team].players.length === 0 ? (
            <View style={styles.emptyTeamContainer}>
              <IconButton
                icon="account-plus"
                size={48}
                iconColor={backgroundColor}
                style={[styles.addPlayerIcon, { backgroundColor: backgroundColor + '20' }]}
              />
              <Text style={styles.emptyTeamText}>AÑADIR JUGADOR</Text>
            </View>
          ) : (
            teams[team].players.map((player) => (
              <View key={player.id} style={styles.playerItem}>
                <Chip 
                  style={[styles.playerChip, { backgroundColor: backgroundColor + '20' }]}
                  textStyle={{ color: backgroundColor, fontWeight: 'bold' }}
                >
                  {player.name}
                </Chip>
                <View style={styles.playerActions}>
                  <IconButton
                    icon="swap-horizontal"
                    size={20}
                    iconColor={colors.primary}
                    onPress={() => handleMovePlayer(player.id, team)}
                  />
                  <IconButton
                    icon="close"
                    size={20}
                    iconColor={colors.error}
                    onPress={() => removePlayerFromTeam(team, player.id)}
                  />
                </View>
              </View>
            ))
          )}
        </Card.Content>
      </Card>
    );

    return (
      <View style={styles.phaseContainer}>
        <Text style={styles.phaseDescription}>
          Organiza los jugadores en dos equipos
        </Text>
        
        <View style={styles.teamsRow}>
          <TeamCard 
            team="azul" 
            title="EQUIPO AZUL" 
            backgroundColor={colors.teamBlue} 
          />
          <TeamCard 
            team="rojo" 
            title="EQUIPO ROJO" 
            backgroundColor={colors.teamRed} 
          />
        </View>

        {/* Add Player Section */}
        <Card style={styles.addPlayerCard}>
          <Card.Content>
            <Text style={styles.addPlayerTitle}>Agregar Jugador</Text>
            <View style={styles.addPlayerRow}>
              <TextInput
                label="Nombre del jugador"
                value={newPlayerName}
                onChangeText={setNewPlayerName}
                mode="outlined"
                style={styles.playerNameInput}
                maxLength={20}
                onSubmitEditing={() => {}}
                returnKeyType="done"
              />
              <Button
                mode="contained"
                onPress={() => handleAddPlayer('azul')}
                style={[styles.teamAddButton, { backgroundColor: colors.teamBlue }]}
                contentStyle={styles.teamAddButtonContent}
                disabled={!newPlayerName.trim()}
              >
                + AZUL
              </Button>
              <Button
                mode="contained"
                onPress={() => handleAddPlayer('rojo')}
                style={[styles.teamAddButton, { backgroundColor: colors.teamRed }]}
                contentStyle={styles.teamAddButtonContent}
                disabled={!newPlayerName.trim()}
              >
                + ROJO
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Text style={styles.selectedBatteryText}>
          Batería seleccionada: {selectedBattery?.nombre}
        </Text>

        <Button
          mode="contained"
          onPress={handleContinueToSummary}
          style={styles.continueButton}
          contentStyle={styles.continueButtonContent}
          disabled={teams.azul.players.length === 0 || teams.rojo.players.length === 0}
        >
          Continuar
        </Button>
      </View>
    );
  };

  // Game Summary Phase Component
  const GameSummaryPhase: React.FC = () => (
    <View style={styles.phaseContainer}>
      <Text style={styles.phaseDescription}>
        Revisa la configuración antes de empezar
      </Text>

      {/* Selected Battery */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text style={styles.summaryTitle}>Batería Seleccionada</Text>
          <Chip 
            icon="cards" 
            style={styles.selectedBatteryChip}
            textStyle={{ color: colors.textLight }}
          >
            {selectedBattery?.nombre}
          </Chip>
        </Card.Content>
      </Card>

      {/* Teams Summary */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text style={styles.summaryTitle}>Equipos</Text>
          <View style={styles.teamsSummaryRow}>
            <View style={styles.teamSummary}>
              <Text style={[styles.teamSummaryTitle, { color: colors.teamBlue }]}>
                EQUIPO AZUL ({teams.azul.players.length})
              </Text>
              {teams.azul.players.map((player) => (
                <Text key={player.id} style={styles.playerSummaryName}>
                  • {player.name}
                </Text>
              ))}
            </View>
            <View style={styles.teamSummary}>
              <Text style={[styles.teamSummaryTitle, { color: colors.teamRed }]}>
                EQUIPO ROJO ({teams.rojo.players.length})
              </Text>
              {teams.rojo.players.map((player) => (
                <Text key={player.id} style={styles.playerSummaryName}>
                  • {player.name}
                </Text>
              ))}
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Game Info */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text style={styles.summaryTitle}>Información del Juego</Text>
          <List.Item
            title="Jugadores totales"
            description={`${teams.azul.players.length + teams.rojo.players.length} jugadores`}
            left={props => <List.Icon {...props} icon="account-group" />}
          />
          <List.Item
            title="Rondas"
            description="3 rondas (Libre, Una palabra, Mímica)"
            left={props => <List.Icon {...props} icon="numeric-3-circle" />}
          />
          <List.Item
            title="Tiempo por turno"
            description="30 segundos"
            left={props => <List.Icon {...props} icon="timer" />}
          />
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleStartGame}
        style={styles.startButton}
        contentStyle={styles.startButtonContent}
        labelStyle={styles.startButtonLabel}
        icon="play"
      >
        ¡EMPEZAR PARTIDA!
      </Button>
    </View>
  );

  const renderCurrentPhase = () => {
    switch (currentPhase) {
      case 'battery':
        return <BatterySelectionPhase />;
      case 'teams':
        return <TeamConfigurationPhase />;
      case 'summary':
        return <GameSummaryPhase />;
      default:
        return <BatterySelectionPhase />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with progress */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <IconButton
            icon="arrow-left"
            size={24}
            iconColor={colors.text}
            onPress={handleBackPress}
          />
          <Text style={styles.headerTitle}>{getPhaseTitle()}</Text>
          <View style={{ width: 48 }} />
        </View>
        <ProgressBar 
          progress={getPhaseProgress()} 
          color={colors.tertiary}
          style={styles.progressBar}
        />
      </View>

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
  header: {
    backgroundColor: colors.background,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textLight,
  },
  progressBar: {
    marginHorizontal: 20,
    marginTop: 10,
    height: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  phaseContainer: {
    flex: 1,
  },
  phaseDescription: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  
  // Battery Selection Styles
  batteriesGrid: {
    gap: 15,
  },
  batteryCard: {
    backgroundColor: colors.surface,
    elevation: 4,
    marginBottom: 10,
  },
  batteryCardContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  batteryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  batteryChip: {
    backgroundColor: colors.primary,
  },
  
  // Team Configuration Styles
  teamsRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  teamCard: {
    flex: 1,
    backgroundColor: colors.surface,
    elevation: 4,
    minHeight: 200,
  },
  teamTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  divider: {
    backgroundColor: '#CCCCCC',
    marginBottom: 15,
  },
  emptyTeamContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  addPlayerIcon: {
    marginBottom: 10,
  },
  emptyTeamText: {
    textAlign: 'center',
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 12,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  playerChip: {
    flex: 1,
    marginRight: 8,
  },
  playerActions: {
    flexDirection: 'row',
  },
  addPlayerCard: {
    marginBottom: 20,
    backgroundColor: colors.surface,
    elevation: 4,
  },
  addPlayerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  addPlayerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playerNameInput: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  teamAddButton: {
    minWidth: 50,
  },
  teamAddButtonContent: {
    height: 56,
    justifyContent: 'center',
  },
  selectedBatteryText: {
    textAlign: 'center',
    color: colors.text,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  continueButton: {
    backgroundColor: colors.primary,
    marginBottom: 15,
  },
  continueButtonContent: {
    height: 50,
  },
  
  // Summary Styles
  summaryCard: {
    marginBottom: 15,
    backgroundColor: colors.surface,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  selectedBatteryChip: {
    backgroundColor: colors.success,
    alignSelf: 'flex-start',
  },
  teamsSummaryRow: {
    flexDirection: 'row',
    gap: 20,
  },
  teamSummary: {
    flex: 1,
  },
  teamSummaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  playerSummaryName: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  startButton: {
    backgroundColor: colors.success,
    marginBottom: 15,
  },
  startButtonContent: {
    height: 60,
  },
  startButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textLight,
  },
});

export default NewGameScreen; 