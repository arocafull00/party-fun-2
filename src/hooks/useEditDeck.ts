import { useState, useCallback } from 'react';
import { database } from '../database/database';
import { useGameStore } from '../store/game-store';

export const useEditDeck = () => {
  const { setDecks } = useGameStore();
  const [loading, setLoading] = useState(false);

  const editDeck = useCallback(async (id: number, name: string, cards: string[]) => {
    setLoading(true);
    try {
      await database.updateMazoWithCards(id, name, cards);
      const updated = await database.getMazos();
      setDecks(updated);
    } finally {
      setLoading(false);
    }
  }, [setDecks]);

  return { editDeck, loading };
};
