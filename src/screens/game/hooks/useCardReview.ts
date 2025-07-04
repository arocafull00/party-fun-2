import { useState, useCallback, useMemo, useEffect } from 'react';

export interface ReviewCard {
  text: string;
  isCorrect: boolean;
  originalState: boolean;
}

export interface UseCardReviewReturn {
  reviewCards: ReviewCard[];
  toggleCard: (index: number) => void;
  getCorrectCards: () => string[];
  getIncorrectCards: () => string[];
  hasChanges: boolean;
}

export const useCardReview = (
  correctCards: string[],
  incorrectCards: string[]
): UseCardReviewReturn => {
  // Memoize the initial review cards to prevent recreation on every render
  const initialReviewCards = useMemo(() => {
    const correct = correctCards.map(card => ({
      text: card,
      isCorrect: true,
      originalState: true
    }));
    
    const incorrect = incorrectCards.map(card => ({
      text: card,
      isCorrect: false,
      originalState: false
    }));
    
    return [...correct, ...incorrect];
  }, [correctCards, incorrectCards]);

  const [reviewCards, setReviewCards] = useState<ReviewCard[]>(initialReviewCards);

  // Update reviewCards when the initial cards change (new turn)
  useEffect(() => {
    setReviewCards(initialReviewCards);
  }, [initialReviewCards]);

  const toggleCard = useCallback((index: number) => {
    setReviewCards(prev => 
      prev.map((card, i) => 
        i === index 
          ? { ...card, isCorrect: !card.isCorrect }
          : card
      )
    );
  }, []);

  // Memoize the filtered results to prevent recalculation on every render
  const correctCardsResult = useMemo(() => {
    return reviewCards
      .filter(card => card.isCorrect)
      .map(card => card.text);
  }, [reviewCards]);

  const incorrectCardsResult = useMemo(() => {
    return reviewCards
      .filter(card => !card.isCorrect)
      .map(card => card.text);
  }, [reviewCards]);

  // Use useCallback to return stable function references
  const getCorrectCards = useCallback(() => {
    return correctCardsResult;
  }, [correctCardsResult]);

  const getIncorrectCards = useCallback(() => {
    return incorrectCardsResult;
  }, [incorrectCardsResult]);

  // Memoize hasChanges calculation
  const hasChanges = useMemo(() => {
    return reviewCards.some(card => card.isCorrect !== card.originalState);
  }, [reviewCards]);

  return {
    reviewCards,
    toggleCard,
    getCorrectCards,
    getIncorrectCards,
    hasChanges
  };
}; 