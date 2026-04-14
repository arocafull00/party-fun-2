import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { 
  Text, 
  Card, 
  List, 
  Chip,
  Surface,
  Button,
  ActivityIndicator
} from 'react-native-paper';
import { router } from 'expo-router';

import { database } from '../database/database';
import { borderRadius, colors, spacing, typography } from '../theme/theme';
import { CustomScreen } from '../shared/components/CustomScreen';
import { BouncyButton } from '../shared/components/BouncyButton';

interface GameStatistics {
  totalGames: number;
  totalWords: number;
  averageAccuracy: number;
  gamesWonByBlue: number;
  gamesWonByRed: number;
  ties: number;
}

interface RecentGame {
  id: number;
  fecha: string;
  bateria_nombre: string | null;
  equipo_ganador: string | null;
  puntuacion_azul: number;
  puntuacion_rojo: number;
  total_palabras: number;
  palabras_correctas: number;
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
    if (winner === 'azul') return colors.primary;
    if (winner === 'rojo') return colors.accent;
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
      <CustomScreen contentStyle={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando estadísticas...</Text>
        </View>
      </CustomScreen>
    );
  }

  return (
    <CustomScreen contentStyle={styles.container}>
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
              
              <Surface style={[styles.statItem, { backgroundColor: colors.secondary + '20' }]} elevation={2}>
                <Text style={styles.statNumber}>{statistics.totalWords}</Text>
                <Text style={styles.statLabel}>Palabras</Text>
              </Surface>
              
              <Surface style={[styles.statItem, { backgroundColor: colors.accent + '20' }]} elevation={2}>
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
              <View style={[styles.teamWinStat, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.teamWinNumber, { color: colors.primary }]}>
                  {statistics.gamesWonByBlue}
                </Text>
                <Text style={styles.teamWinLabel}>Equipo Azul</Text>
                <Text style={[styles.teamWinPercentage, { color: colors.primary }]}>
                  {winPercentages.blue}%
                </Text>
              </View>
              
              <View style={styles.vsContainer}>
                <Text style={styles.vsText}>VS</Text>
              </View>
              
              <View style={[styles.teamWinStat, { backgroundColor: colors.accent + '20' }]}>
                <Text style={[styles.teamWinNumber, { color: colors.accent }]}>
                  {statistics.gamesWonByRed}
                </Text>
                <Text style={styles.teamWinLabel}>Equipo Rojo</Text>
                <Text style={[styles.teamWinPercentage, { color: colors.accent }]}>
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
                <BouncyButton
                  label="Jugar primera partida"
                  onPress={() => router.push('/new-game')}
                  style={styles.playButton}
                  icon="play"
                />
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
                            style={[styles.gameStatChip, { backgroundColor: colors.secondary + '20' }]}
                            textStyle={{ color: colors.secondary, fontSize: 12 }}
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
                  {index < recentGames.length - 1 && <View style={styles.gameDivider} />}
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
                left={props => <List.Icon {...props} icon="trophy" color={colors.accent} />}
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
                left={props => <List.Icon {...props} icon="chart-line" color={colors.secondary} />}
              />
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </CustomScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.sm,
    color: colors.text,
    fontSize: typography.sizes.md,
  },
  card: {
    marginBottom: spacing.lg,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.xl,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '800',
    fontFamily: typography.families.heading,
    color: colors.text,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  statItem: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: typography.sizes.xxl,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  winStatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  teamWinStat: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  teamWinNumber: {
    fontSize: typography.sizes.xxxl,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  teamWinLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  teamWinPercentage: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
  },
  vsContainer: {
    paddingHorizontal: 15,
  },
  vsText: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
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
    paddingVertical: spacing.lg,
  },
  emptyText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  playButton: {
    backgroundColor: colors.secondary,
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
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  gameDetails: {
    gap: spacing.xs,
  },
  gameScore: {
    fontSize: typography.sizes.sm,
    fontWeight: '700',
    color: colors.text,
  },
  gameBattery: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  gameStats: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
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
    height: spacing.sm,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});

export default StatisticsScreen; 