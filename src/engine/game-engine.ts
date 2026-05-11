export const shuffleCards = (cards: string[]): string[] => {
  return [...cards].sort(() => Math.random() - 0.5);
};

export const getPhaseDescription = (phase: number): string => {
  switch (phase) {
    case 1:
      return 'COGE EL MÓVIL';
    case 2:
      return 'UNA PALABRA';
    case 3:
      return 'MÍMICA';
    default:
      return `FASE ${phase}`;
  }
};

export const getPhaseTitle = (phase: number): string => {
  switch (phase) {
    case 1:
      return 'FASE 1 - PISTA LIBRE';
    case 2:
      return 'FASE 2 - UNA PALABRA';
    case 3:
      return 'FASE 3 - MÍMICA';
    default:
      return `FASE ${phase}`;
  }
};

export interface TurnResult {
  currentTeam: 'azul' | 'rojo';
  currentPlayerIndex: number;
  hasNextTurn: boolean;
}

export const calculateNextTurn = (
  currentTeam: 'azul' | 'rojo',
  currentPlayerIndex: number,
  teams: { azul: { players: unknown[] }; rojo: { players: unknown[] } }
): TurnResult => {
  const currentTeamPlayers = teams[currentTeam].players;
  const nextPlayerIndex = currentPlayerIndex + 1;

  if (nextPlayerIndex >= currentTeamPlayers.length) {
    const nextTeam = currentTeam === 'azul' ? 'rojo' : 'azul';
    if (teams[nextTeam].players.length === 0) {
      return { currentTeam, currentPlayerIndex, hasNextTurn: false };
    }
    return { currentTeam: nextTeam, currentPlayerIndex: 0, hasNextTurn: true };
  }

  return { currentTeam, currentPlayerIndex: nextPlayerIndex, hasNextTurn: true };
};

export interface EndTurnResult {
  phaseComplete: boolean;
  gameComplete: boolean;
  nextPhase: number;
  nextTeam: 'azul' | 'rojo';
  nextPlayerIndex: number;
  remainingCards: string[];
  gameHistoryEntry: {
    roundNumber: number;
    correctCards: string[];
    incorrectCards: string[];
    teamScores: { azul: number; rojo: number };
  };
}

export const calculateEndTurn = (
  state: {
    currentPhase: number;
    currentTeam: 'azul' | 'rojo';
    currentPlayerIndex: number;
    teams: { azul: { score: number }; rojo: { score: number } };
    phaseCards: string[];
    currentTurnCards: { correct: string[]; incorrect: string[] };
    allGameCards: string[];
  }
): EndTurnResult => {
  const remainingCards = state.phaseCards.filter(
    (card) => !state.currentTurnCards.correct.includes(card)
  );

  const roundHistory = {
    roundNumber: state.currentPhase,
    correctCards: state.currentTurnCards.correct,
    incorrectCards: state.currentTurnCards.incorrect,
    teamScores: {
      azul: state.teams.azul.score,
      rojo: state.teams.rojo.score,
    },
  };

  if (remainingCards.length === 0) {
    const nextPhase = state.currentPhase + 1;
    if (nextPhase > 3) {
      return {
        phaseComplete: true,
        gameComplete: true,
        nextPhase: state.currentPhase,
        nextTeam: 'azul',
        nextPlayerIndex: 0,
        remainingCards: [],
        gameHistoryEntry: roundHistory,
      };
    }
    return {
      phaseComplete: true,
      gameComplete: false,
      nextPhase,
      nextTeam: 'azul',
      nextPlayerIndex: 0,
      remainingCards: shuffleCards([...state.allGameCards]),
      gameHistoryEntry: roundHistory,
    };
  }

  return {
    phaseComplete: false,
    gameComplete: false,
    nextPhase: state.currentPhase,
    nextTeam: state.currentTeam,
    nextPlayerIndex: state.currentPlayerIndex,
    remainingCards: shuffleCards(remainingCards),
    gameHistoryEntry: roundHistory,
  };
};
