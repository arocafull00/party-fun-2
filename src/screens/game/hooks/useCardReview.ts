import { useState, useCallback } from 'react';

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
  // Initialize review cards with their original states
  const [reviewCards, setReviewCards] = useState<ReviewCard[]>(() => {
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
  });

  const toggleCard = useCallback((index: number) => {
    setReviewCards(prev => 
      prev.map((card, i) => 
        i === index 
          ? { ...card, isCorrect: !card.isCorrect }
          : card
      )
    );
  }, []);

  const getCorrectCards = useCallback(() => {
    return reviewCards
      .filter(card => card.isCorrect)
      .map(card => card.text);
  }, [reviewCards]);

  const getIncorrectCards = useCallback(() => {
    return reviewCards
      .filter(card => !card.isCorrect)
      .map(card => card.text);
  }, [reviewCards]);

  const hasChanges = reviewCards.some(card => card.isCorrect !== card.originalState);

  return {
    reviewCards,
    toggleCard,
    getCorrectCards,
    getIncorrectCards,
    hasChanges
  };
}; 