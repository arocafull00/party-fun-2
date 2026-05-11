import { useCallback, useEffect, useState } from 'react';
import { database } from '../database/database';
import { useGameStore } from '../store/game-store';

export const useDecks = () => {
  const { decks, setDecks } = useGameStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDecks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await database.getMazos();
      setDecks(data);
      setError(null);
    } catch (err) {
      setError('No se pudieron cargar los mazos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [setDecks]);

  useEffect(() => {
    loadDecks();
  }, [loadDecks]);

  return { decks, loading, error, refetch: loadDecks };
};
