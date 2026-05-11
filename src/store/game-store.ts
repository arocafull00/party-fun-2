import { create } from "zustand";
import { Mazo, Carta } from "../database/database";
import {
  shuffleCards,
  calculateNextTurn,
  calculateEndTurn,
} from "../engine/game-engine";

export interface Player {
  id: string;
  name: string;
}

export interface Team {
  players: Player[];
  score: number;
}

export interface Teams {
  azul: Team;
  rojo: Team;
}

export interface RoundHistory {
  roundNumber: number;
  correctCards: string[];
  incorrectCards: string[];
  teamScores: {
    azul: number;
    rojo: number;
  };
}

export interface GameState {
  // Deck management
  selectedDeck: Mazo | null;
  decks: Mazo[];
  cards: Carta[];

  // Game state
  gameStarted: boolean;
  currentPhase: number;
  currentTeam: "azul" | "rojo";
  currentPlayerIndex: number;
  teams: Teams;

  // Turn management
  timer: number;
  isTimerRunning: boolean;
  currentCardIndex: number;
  phaseCards: string[];
  allGameCards: string[];

  // Game history
  gameHistory: RoundHistory[];
  currentTurnCards: {
    correct: string[];
    incorrect: string[];
  };

  // Actions
  setDecks: (decks: Mazo[]) => void;
  setSelectedDeck: (deck: Mazo | null) => void;
  setCards: (cards: Carta[]) => void;

  // Team management
  addPlayerToTeam: (team: "azul" | "rojo", player: Player) => void;
  removePlayerFromTeam: (team: "azul" | "rojo", playerId: string) => void;
  movePlayerToTeam: (
    playerId: string,
    fromTeam: "azul" | "rojo",
    toTeam: "azul" | "rojo"
  ) => void;
  clearTeams: () => void;

  // Game flow
  startGame: (cardsList: string[]) => void;
  setTimer: (timer: number) => void;
  setIsTimerRunning: (running: boolean) => void;
  markCardCorrect: (card: string) => void;
  markCardIncorrect: (card: string) => void;
  updateCurrentRoundCards: (correct: string[], incorrect: string[]) => void;
  nextCard: () => void;
  getCurrentPlayer: () => Player | null;
  getNextPlayer: () => Player | null;
  nextTurn: () => boolean;
  endTurn: () => { phaseComplete: boolean; gameComplete: boolean };
  endGame: () => void;
  resetGame: () => void;
}

const TURN_TIME = 30;

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  selectedDeck: null,
  decks: [],
  cards: [],

  // Game state
  gameStarted: false,
  currentPhase: 1,
  currentTeam: "azul",
  currentPlayerIndex: 0,
  teams: {
    azul: { players: [], score: 0 },
    rojo: { players: [], score: 0 },
  },

  // Turn management
  timer: TURN_TIME,
  isTimerRunning: false,
  currentCardIndex: 0,
  phaseCards: [],
  allGameCards: [],

  // Game history
  gameHistory: [],
  currentTurnCards: {
    correct: [],
    incorrect: [],
  },

  // Actions
  setDecks: (decks) => set({ decks }),
  setSelectedDeck: (deck) => set({ selectedDeck: deck }),
  setCards: (cards) => set({ cards }),

  // Team management
  addPlayerToTeam: (team, player) => {
    set((state) => ({
      teams: {
        ...state.teams,
        [team]: {
          ...state.teams[team],
          players: [...state.teams[team].players, player],
        },
      },
    }));
  },

  removePlayerFromTeam: (team, playerId) =>
    set((state) => ({
      teams: {
        ...state.teams,
        [team]: {
          ...state.teams[team],
          players: state.teams[team].players.filter((p) => p.id !== playerId),
        },
      },
    })),

  movePlayerToTeam: (playerId, fromTeam, toTeam) =>
    set((state) => {
      const player = state.teams[fromTeam].players.find(
        (p) => p.id === playerId
      );
      if (!player) return state;

      return {
        teams: {
          ...state.teams,
          [fromTeam]: {
            ...state.teams[fromTeam],
            players: state.teams[fromTeam].players.filter(
              (p) => p.id !== playerId
            ),
          },
          [toTeam]: {
            ...state.teams[toTeam],
            players: [...state.teams[toTeam].players, player],
          },
        },
      };
    }),

  clearTeams: () =>
    set({
      teams: {
        azul: { players: [], score: 0 },
        rojo: { players: [], score: 0 },
      },
    }),

  // Game flow
  startGame: (cardsList: string[]) => {
    const shuffledCards = shuffleCards(cardsList);

    set({
      gameStarted: true,
      currentPhase: 1,
      currentTeam: "azul",
      currentPlayerIndex: 0,
      timer: TURN_TIME,
      isTimerRunning: false,
      currentCardIndex: 0,
      phaseCards: shuffledCards,
      allGameCards: shuffledCards,
      gameHistory: [],
      currentTurnCards: { correct: [], incorrect: [] },
      teams: {
        azul: { ...get().teams.azul, score: 0 },
        rojo: { ...get().teams.rojo, score: 0 },
      },
      selectedDeck: null,
      cards: [],
    });
  },

  setTimer: (timer) => set({ timer }),
  setIsTimerRunning: (isTimerRunning) => set({ isTimerRunning }),

  markCardCorrect: (card: string) => {
    set((state) => ({
      currentTurnCards: {
        ...state.currentTurnCards,
        correct: [...state.currentTurnCards.correct, card],
      },
      teams: {
        ...state.teams,
        [state.currentTeam]: {
          ...state.teams[state.currentTeam],
          score: state.teams[state.currentTeam].score + 1,
        },
      },
    }));
  },

  markCardIncorrect: (card: string) => {
    set((state) => ({
      currentTurnCards: {
        ...state.currentTurnCards,
        incorrect: [...state.currentTurnCards.incorrect, card],
      },
    }));
  },

  updateCurrentRoundCards: (correct: string[], incorrect: string[]) => {
    set((state) => {
      const scoreDifference =
        correct.length - state.currentTurnCards.correct.length;
      const newTeamScore = Math.max(
        0,
        state.teams[state.currentTeam].score + scoreDifference
      );

      return {
        currentTurnCards: { correct, incorrect },
        teams: {
          ...state.teams,
          [state.currentTeam]: {
            ...state.teams[state.currentTeam],
            score: newTeamScore,
          },
        },
      };
    });
  },

  nextCard: () =>
    set((state) => ({ currentCardIndex: state.currentCardIndex + 1 })),

  getCurrentPlayer: () => {
    const state = get();
    return state.teams[state.currentTeam].players[state.currentPlayerIndex] || null;
  },

  getNextPlayer: () => {
    const state = get();
    const result = calculateNextTurn(
      state.currentTeam,
      state.currentPlayerIndex,
      state.teams
    );
    return (
      state.teams[result.currentTeam].players[result.currentPlayerIndex] || null
    );
  },

  nextTurn: () => {
    const state = get();
    const result = calculateNextTurn(
      state.currentTeam,
      state.currentPlayerIndex,
      state.teams
    );
    if (!result.hasNextTurn) return false;

    set({
      currentTeam: result.currentTeam,
      currentPlayerIndex: result.currentPlayerIndex,
      timer: TURN_TIME,
      isTimerRunning: false,
      currentCardIndex: 0,
      currentTurnCards: { correct: [], incorrect: [] },
    });
    return true;
  },

  endTurn: () => {
    const state = get();
    const result = calculateEndTurn(state);

    set((prev) => ({
      gameHistory: [...prev.gameHistory, result.gameHistoryEntry],
      currentPhase: result.nextPhase,
      currentTeam: result.nextTeam,
      currentPlayerIndex: result.nextPlayerIndex,
      currentCardIndex: 0,
      timer: TURN_TIME,
      isTimerRunning: false,
      currentTurnCards: { correct: [], incorrect: [] },
      phaseCards: result.remainingCards,
      gameStarted: result.gameComplete ? false : prev.gameStarted,
    }));

    return {
      phaseComplete: result.phaseComplete,
      gameComplete: result.gameComplete,
    };
  },

  endGame: () => set({ gameStarted: false, isTimerRunning: false }),

  resetGame: () =>
    set({
      gameStarted: false,
      currentPhase: 1,
      currentTeam: "azul",
      currentPlayerIndex: 0,
      timer: TURN_TIME,
      isTimerRunning: false,
      currentCardIndex: 0,
      phaseCards: [],
      allGameCards: [],
      gameHistory: [],
      currentTurnCards: { correct: [], incorrect: [] },
      teams: {
        azul: { players: [], score: 0 },
        rojo: { players: [], score: 0 },
      },
      selectedDeck: null,
      cards: [],
    }),
}));
