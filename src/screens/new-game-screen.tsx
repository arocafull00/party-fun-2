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
  List
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

  const [batteryMenuVisible, setBatteryMenuVisible] = useState(false);
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
    setBatteryMenuVisible(false);
    
    try {
      const words = await database.getPalabrasByBateria(battery.id);
      setWords(words);
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

  const handleStartGame = () => {
    if (!selectedBattery) {
      Alert.alert('Batería requerida', 'Selecciona una batería de palabras');
      return;
    }

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
          { text: 'Continuar', onPress: startGameConfirmed },
        ]
      );
      return;
    }

    startGameConfirmed();
  };

  const startGameConfirmed = () => {
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

  const TeamCard: React.FC<{ 
    team: 'azul' | 'rojo', 
    title: string, 
    backgroundColor: string 
  }> = ({ team, title, backgroundColor }) => (
    <Card style={[styles.teamCard, { borderLeftColor: backgroundColor, borderLeftWidth: 6 }]}>
      <Card.Content>
        <Text style={[styles.teamTitle, { color: backgroundColor }]}>{title}</Text>
        <Divider style={styles.divider} />
        
        {teams[team].players.length === 0 ? (
          <Text style={styles.emptyTeamText}>Sin jugadores</Text>
        ) : (
          teams[team].players.map((player) => (
            <View key={player.id} style={styles.playerItem}>
              <Chip 
                style={[styles.playerChip, { backgroundColor: backgroundColor + '20' }]}
                textStyle={{ color: backgroundColor }}
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Battery Selection */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Seleccionar Batería</Text>
            <Menu
              visible={batteryMenuVisible}
              onDismiss={() => setBatteryMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setBatteryMenuVisible(true)}
                  style={styles.batteryButton}
                  contentStyle={styles.batteryButtonContent}
                  icon="chevron-down"
                >
                  {selectedBattery ? selectedBattery.nombre : 'Seleccionar batería'}
                </Button>
              }
            >
              {batteries.map((battery) => (
                <Menu.Item
                  key={battery.id}
                  onPress={() => handleSelectBattery(battery)}
                  title={battery.nombre}
                />
              ))}
            </Menu>
            
            {selectedBattery && (
              <Chip 
                icon="cards" 
                style={styles.selectedBatteryChip}
                textStyle={{ color: colors.textLight }}
              >
                {selectedBattery.nombre}
              </Chip>
            )}
          </Card.Content>
        </Card>

        {/* Teams Setup */}
        <View style={styles.teamsContainer}>
          <Text style={styles.sectionTitle}>Configurar Equipos</Text>
          
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
        </View>

        {/* Game Info */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Información del Juego</Text>
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

        {/* Start Game Button */}
        <Button
          mode="contained"
          onPress={handleStartGame}
          style={styles.startButton}
          contentStyle={styles.startButtonContent}
          labelStyle={styles.startButtonLabel}
          icon="play"
          disabled={!selectedBattery || teams.azul.players.length === 0 || teams.rojo.players.length === 0}
        >
          ¡EMPEZAR PARTIDA!
        </Button>
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
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  card: {
    marginBottom: 15,
    backgroundColor: colors.surface,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  batteryButton: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  batteryButtonContent: {
    height: 50,
  },
  selectedBatteryChip: {
    backgroundColor: colors.success,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  teamsContainer: {
    marginBottom: 15,
  },
  teamsRow: {
    flexDirection: 'row',
    gap: 15,
  },
  teamCard: {
    flex: 1,
    backgroundColor: colors.surface,
    elevation: 4,
    marginBottom: 8,
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
  emptyTeamText: {
    textAlign: 'center',
    color: colors.text,
    fontStyle: 'italic',
    marginBottom: 15,
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
    marginBottom: 15,
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