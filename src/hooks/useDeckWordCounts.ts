import { useEffect, useState } from 'react';
import { database } from '../database/database';
import type { Mazo } from '../database/database';

export const useDeckWordCounts = (decks: Mazo[]) => {
  const [wordCounts, setWordCounts] = useState<Record<number, number>>({});

  useEffect(() => {
    const loadCounts = async () => {
      const counts: Record<number, number> = {};
      await Promise.all(
        decks.map(async (deck) => {
          try {
            const count = await database.countCartasByMazo(deck.id);
            counts[deck.id] = count;
          } catch (error) {
            console.error(`Error counting cards for deck ${deck.id}:`, error);
            counts[deck.id] = 0;
          }
        })
      );
      setWordCounts(counts);
    };

    if (decks.length > 0) {
      loadCounts();
    } else {
      setWordCounts({});
    }
  }, [decks]);

  return wordCounts;
};
