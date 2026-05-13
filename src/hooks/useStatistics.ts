import { useState, useEffect, useCallback } from 'react';
import { database } from '../database/database';

export interface GameStatistics {
  gamesWonByBlue: number;
  gamesWonByRed: number;
}

export interface PlayerWins {
  nombre: string;
  wins: number;
}

export const useStatistics = () => {
  const [stats, setStats] = useState<GameStatistics>({
    gamesWonByBlue: 0,
    gamesWonByRed: 0,
  });
  const [playerWins, setPlayerWins] = useState<PlayerWins[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, p] = await Promise.all([
        database.getGameStatistics(),
        database.getPlayerWins(),
      ]);
      setStats(s);
      setPlayerWins(p);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { stats, playerWins, loading, refetch: load };
};
