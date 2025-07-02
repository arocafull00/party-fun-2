import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { 
  Text, 
  Card, 
  List, 
  Divider,
  Chip,
  Surface,
  Button,
  ActivityIndicator
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { database } from '../database/database';
import { colors } from '../theme/theme';

interface GameStatistics {
  totalGames: number;
  totalCards: number;
  averageAccuracy: number;
  gamesWonByBlue: number;
  gamesWonByRed: number;
  ties: number;
}

interface RecentGame {
  id: number;
  fecha: string;
  mazo_nombre: string;
  equipo_ganador: string | null;
  puntuacion_azul: number;
  puntuacion_rojo: number;
  total_cartas: number;
  cartas_correctas: number;
  precision: number;
}

const StatisticsScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statistics, setStatistics] = useState<GameStatistics>({
    totalGames: 0,
    totalWords: 0,
    averageAccuracy: 0,
    gamesWonByBlue: 0,
    gamesWonByRed: 0,
    ties: 0,
  });
  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const [stats, games] = await Promise.all([
        database.getGameStatistics(),
        database.getRecentGames(20)
      ]);
      
      setStatistics(stats);
      setRecentGames(games);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadStatistics();
    setRefreshing(false);
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getWinnerIcon = (winner: string | null): string => {
    if (winner === 'azul') return '🔵';
    if (winner === 'rojo') return '🔴';
    return '🤝';
  };

  const getWinnerText = (winner: string | null): string => {
    if (winner === 'azul') return 'Azul';
    if (winner === 'rojo') return 'Rojo';
    return 'Empate';
  };

  const getWinnerColor = (winner: string | null): string => {
    if (winner === 'azul') return colors.teamBlue;
    if (winner === 'rojo') return colors.teamRed;
    return colors.text;
  };

  const calculateWinPercentages = () => {
    const total = statistics.totalGames;
    if (total === 0) return { blue: 0, red: 0, tie: 0 };
    
    return {
      blue: Math.round((statistics.gamesWonByBlue / total) * 100),
      red: Math.round((statistics.gamesWonByRed / total) * 100),
      tie: Math.round((statistics.ties / total) * 100),
    };
  };

  const winPercentages = calculateWinPercentages();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando estadísticas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Overall Statistics */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Estadísticas Generales</Text>
            
            <View style={styles.statsGrid}>
              <Surface style={[styles.statItem, { backgroundColor: colors.primary + '20' }]} elevation={2}>
                <Text style={styles.statNumber}>{statistics.totalGames}</Text>
                <Text style={styles.statLabel}>Partidas</Text>
              </Surface>
              
              <Surface style={[styles.statItem, { backgroundColor: colors.success + '20' }]} elevation={2}>
                <Text style={styles.statNumber}>{statistics.totalWords}</Text>
                <Text style={styles.statLabel}>Palabras</Text>
              </Surface>
              
              <Surface style={[styles.statItem, { backgroundColor: colors.warning + '20' }]} elevation={2}>
                <Text style={styles.statNumber}>{statistics.averageAccuracy}%</Text>
                <Text style={styles.statLabel}>Precisión</Text>
              </Surface>
            </View>
          </Card.Content>
        </Card>

        {/* Win Statistics */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Victorias por Equipo</Text>
            
            <View style={styles.winStatsContainer}>
              <View style={[styles.teamWinStat, { backgroundColor: colors.teamBlue + '20' }]}>
                <Text style={[styles.teamWinNumber, { color: colors.teamBlue }]}>
                  {statistics.gamesWonByBlue}
                </Text>
                <Text style={styles.teamWinLabel}>Equipo Azul</Text>
                <Text style={[styles.teamWinPercentage, { color: colors.teamBlue }]}>
                  {winPercentages.blue}%
                </Text>
              </View>
              
              <View style={styles.vsContainer}>
                <Text style={styles.vsText}>VS</Text>
              </View>
              
              <View style={[styles.teamWinStat, { backgroundColor: colors.teamRed + '20' }]}>
                <Text style={[styles.teamWinNumber, { color: colors.teamRed }]}>
                  {statistics.gamesWonByRed}
                </Text>
                <Text style={styles.teamWinLabel}>Equipo Rojo</Text>
                <Text style={[styles.teamWinPercentage, { color: colors.teamRed }]}>
                  {winPercentages.red}%
                </Text>
              </View>
            </View>
            
            {statistics.ties > 0 && (
              <View style={styles.tiesContainer}>
                <Chip 
                  icon="handshake" 
                  style={styles.tiesChip}
                  textStyle={{ color: colors.text }}
                >
                  {statistics.ties} empates ({winPercentages.tie}%)
                </Chip>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Recent Games */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Historial de Partidas</Text>
            
            {recentGames.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No hay partidas registradas</Text>
                <Button
                  mode="contained"
                  onPress={() => router.push('/new-game')}
                  style={styles.playButton}
                  icon="play"
                >
                  Jugar Primera Partida
                </Button>
              </View>
            ) : (
              recentGames.map((game, index) => (
                <View key={game.id}>
                  <List.Item
                    title={
                      <View style={styles.gameHeader}>
                        <Text style={styles.gameTitle}>
                          {getWinnerIcon(game.equipo_ganador)} {getWinnerText(game.equipo_ganador)}
                        </Text>
                        <Text style={styles.gameDate}>{formatDate(game.fecha)}</Text>
                      </View>
                    }
                    description={
                      <View style={styles.gameDetails}>
                        <Text style={styles.gameScore}>
                          {game.puntuacion_azul} - {game.puntuacion_rojo}
                        </Text>
                        <Text style={styles.gameBattery}>
                          📚 {game.bateria_nombre || 'Sin batería'}
                        </Text>
                        <View style={styles.gameStats}>
                          <Chip 
                            style={[styles.gameStatChip, { backgroundColor: colors.success + '20' }]}
                            textStyle={{ color: colors.success, fontSize: 12 }}
                          >
                            {game.palabras_correctas}/{game.total_palabras} palabras
                          </Chip>
                          <Chip 
                            style={[styles.gameStatChip, { backgroundColor: colors.primary + '20' }]}
                            textStyle={{ color: colors.primary, fontSize: 12 }}
                          >
                            {game.precision}% precisión
                          </Chip>
                        </View>
                      </View>
                    }
                    left={props => (
                      <View style={[styles.gameIcon, { backgroundColor: getWinnerColor(game.equipo_ganador) + '20' }]}>
                        <Text style={styles.gameIconText}>#{game.id}</Text>
                      </View>
                    )}
                  />
                  {index < recentGames.length - 1 && <Divider style={styles.gameDivider} />}
                </View>
              ))
            )}
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        {statistics.totalGames > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
              
              <View style={styles.actionsContainer}>
                <Button
                  mode="contained"
                  onPress={() => router.push('/new-game')}
                  style={styles.actionButton}
                  icon="play"
                >
                  Nueva Partida
                </Button>
                
                <Button
                  mode="outlined"
                  onPress={() => router.push('/create-battery')}
                  style={styles.actionButton}
                  icon="plus"
                >
                  Crear Batería
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Fun Facts */}
        {statistics.totalGames > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Datos Curiosos</Text>
              
              <List.Item
                title="Promedio de palabras por partida"
                description={`${Math.round(statistics.totalWords / statistics.totalGames)} palabras`}
                left={props => <List.Icon {...props} icon="calculator" color={colors.primary} />}
              />
              
              <List.Item
                title="Equipo más exitoso"
                description={
                  statistics.gamesWonByBlue > statistics.gamesWonByRed 
                    ? `Equipo Azul (${winPercentages.blue}% victorias)`
                    : statistics.gamesWonByRed > statistics.gamesWonByBlue
                    ? `Equipo Rojo (${winPercentages.red}% victorias)`
                    : 'Empate perfecto'
                }
                left={props => <List.Icon {...props} icon="trophy" color={colors.warning} />}
              />
              
              <List.Item
                title="Nivel de competitividad"
                description={
                  statistics.ties > statistics.totalGames * 0.2
                    ? 'Muy equilibrado (muchos empates)'
                    : statistics.averageAccuracy > 80
                    ? 'Muy competitivo (alta precisión)'
                    : 'Diversión garantizada'
                }
                left={props => <List.Icon {...props} icon="chart-line" color={colors.success} />}
              />
            </Card.Content>
          </Card>
        )}
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
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: colors.text,
    fontSize: 16,
  },
  card: {
    marginBottom: 20,
    backgroundColor: colors.surface,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  statItem: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  winStatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  teamWinStat: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  teamWinNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  teamWinLabel: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 5,
  },
  teamWinPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  vsContainer: {
    paddingHorizontal: 15,
  },
  vsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  tiesContainer: {
    alignItems: 'center',
  },
  tiesChip: {
    backgroundColor: colors.surface,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  playButton: {
    backgroundColor: colors.success,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  gameDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  gameDetails: {
    gap: 5,
  },
  gameScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  gameBattery: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  gameStats: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 5,
  },
  gameStatChip: {
    height: 24,
  },
  gameIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  gameIconText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
  },
  gameDivider: {
    backgroundColor: '#CCCCCC',
    marginVertical: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  actionButton: {
    flex: 1,
  },
});

export default StatisticsScreen; 