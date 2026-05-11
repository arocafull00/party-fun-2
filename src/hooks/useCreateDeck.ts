import { useState, useCallback } from 'react';
import { database } from '../database/database';
import { useGameStore } from '../store/game-store';

export const useCreateDeck = () => {
  const { setDecks } = useGameStore();
  const [loading, setLoading] = useState(false);

  const createDeck = useCallback(async (name: string, cards: string[]) => {
    setLoading(true);
    try {
      const deckId = await database.createMazo(name);
      for (const card of cards) {
        await database.addCarta(deckId, card);
      }
      const updated = await database.getMazos();
      setDecks(updated);
      return deckId;
    } finally {
      setLoading(false);
    }
  }, [setDecks]);

  return { createDeck, loading };
};
