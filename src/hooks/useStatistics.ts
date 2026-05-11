import { useState, useEffect, useCallback } from 'react';
import { database } from '../database/database';

export interface GameStatistics {
  totalGames: number;
  totalCards: number;
  averageAccuracy: number;
  gamesWonByBlue: number;
  gamesWonByRed: number;
  ties: number;
}

export interface RecentGame {
  id: number;
  fecha: string;
  mazo_nombre: string | null;
  equipo_ganador: string | null;
  puntuacion_azul: number;
  puntuacion_rojo: number;
  total_cartas: number;
  cartas_correctas: number;
  precision: number;
}

export const useStatistics = () => {
  const [stats, setStats] = useState<GameStatistics>({
    totalGames: 0,
    totalCards: 0,
    averageAccuracy: 0,
    gamesWonByBlue: 0,
    gamesWonByRed: 0,
    ties: 0,
  });
  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, g] = await Promise.all([
        database.getGameStatistics(),
        database.getRecentGames(20),
      ]);
      setStats(s);
      setRecentGames(g);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { stats, recentGames, loading, refetch: load };
};
