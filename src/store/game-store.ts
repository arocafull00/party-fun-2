import { useMemo } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

const getInitialNextPlayerByTeam = (teams: Teams) => ({
  azul: teams.azul.players.length > 1 ? 1 : 0,
  rojo: 0,
});

const areSameCards = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  return a.every((card, index) => card === b[index]);
};

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
  nextPlayerByTeam: {
    azul: number;
    rojo: number;
  };
  teams: Teams;

  // Turn management
  timer: number;
  isTimerRunning: boolean;
  phaseCards: string[];
  allGameCards: string[];

  // Game history
  gameHistory: RoundHistory[];
  currentTurnCards: {
    correct: string[];
    incorrect: string[];
    unplayed: string[];
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
  getCurrentPlayer: () => Player | null;
  getNextPlayer: () => Player | null;
  nextTurn: () => boolean;
  endTurn: () => { phaseComplete: boolean; gameComplete: boolean };
  endGame: () => void;
  resetGame: () => void;
  clearPersistedGame: () => Promise<void>;
}

export const TURN_TIME = 30;
type PersistedGameState = Pick<GameState, "selectedDeck">;

const getPersistedGameState = (state: GameState): Partial<PersistedGameState> => {
  return {
    selectedDeck: state.selectedDeck,
  };
};

export const useTimer = () => useGameStore((s) => s.timer);
export const useIsTimerRunning = () => useGameStore((s) => s.isTimerRunning);
export const useCurrentTurnCards = () => useGameStore((s) => s.currentTurnCards);
export const useCurrentTeam = () => useGameStore((s) => s.currentTeam);
export const useCurrentPlayerIndex = () => useGameStore((s) => s.currentPlayerIndex);
export const useTeams = () => useGameStore((s) => s.teams);
export const useCurrentPhase = () => useGameStore((s) => s.currentPhase);
export const useGameStarted = () => useGameStore((s) => s.gameStarted);
export const usePhaseCards = () => useGameStore((s) => s.phaseCards);
export const useAllGameCards = () => useGameStore((s) => s.allGameCards);
export const useGameHistory = () => useGameStore((s) => s.gameHistory);
export const useSelectedDeck = () => useGameStore((s) => s.selectedDeck);
export const useDecksFromStore = () => useGameStore((s) => s.decks);

export const useGameActions = () => {
  const setTimer = useGameStore((s) => s.setTimer);
  const setIsTimerRunning = useGameStore((s) => s.setIsTimerRunning);
  const markCardCorrect = useGameStore((s) => s.markCardCorrect);
  const markCardIncorrect = useGameStore((s) => s.markCardIncorrect);
  const endGame = useGameStore((s) => s.endGame);
  const nextTurn = useGameStore((s) => s.nextTurn);
  const endTurn = useGameStore((s) => s.endTurn);
  const startGame = useGameStore((s) => s.startGame);
  const resetGame = useGameStore((s) => s.resetGame);
  return useMemo(
    () => ({
      setTimer,
      setIsTimerRunning,
      markCardCorrect,
      markCardIncorrect,
      endGame,
      nextTurn,
      endTurn,
      startGame,
      resetGame,
    }),
    [
      setTimer,
      setIsTimerRunning,
      markCardCorrect,
      markCardIncorrect,
      endGame,
      nextTurn,
      endTurn,
      startGame,
      resetGame,
    ]
  );
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedDeck: null,
      decks: [],
      cards: [],

      // Game state
      gameStarted: false,
      currentPhase: 1,
      currentTeam: "azul",
      currentPlayerIndex: 0,
      nextPlayerByTeam: { azul: 0, rojo: 0 },
      teams: {
        azul: { players: [], score: 0 },
        rojo: { players: [], score: 0 },
      },

      // Turn management
      timer: TURN_TIME,
      isTimerRunning: false,
      phaseCards: [],
      allGameCards: [],

      // Game history
      gameHistory: [],
      currentTurnCards: {
        correct: [],
        incorrect: [],
        unplayed: [],
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
          nextPlayerByTeam: { azul: 0, rojo: 0 },
          teams: {
            azul: { players: [], score: 0 },
            rojo: { players: [], score: 0 },
          },
        }),

      // Game flow
      startGame: (cardsList: string[]) => {
        const shuffledCards = shuffleCards(cardsList);
        const teams = get().teams;

        set({
          gameStarted: true,
          currentPhase: 1,
          currentTeam: "azul",
          currentPlayerIndex: 0,
          nextPlayerByTeam: getInitialNextPlayerByTeam(teams),
          timer: TURN_TIME,
          isTimerRunning: false,
          phaseCards: shuffledCards,
          allGameCards: shuffledCards,
          gameHistory: [],
          currentTurnCards: {
            correct: [],
            incorrect: [],
            unplayed: shuffledCards,
          },
          teams: {
            azul: { ...teams.azul, score: 0 },
            rojo: { ...teams.rojo, score: 0 },
          },
          cards: [],
        });
      },

      setTimer: (timer) => set({ timer }),
      setIsTimerRunning: (isTimerRunning) => set({ isTimerRunning }),

      markCardCorrect: (card: string) => {
        set((state) => {
          const [currentCard, ...remainingUnplayed] = state.currentTurnCards.unplayed;
          if (!currentCard) return state;

          const playedCard = card || currentCard;

          return {
            currentTurnCards: {
              ...state.currentTurnCards,
              correct: [...state.currentTurnCards.correct, playedCard],
              unplayed: remainingUnplayed,
            },
            teams: {
              ...state.teams,
              [state.currentTeam]: {
                ...state.teams[state.currentTeam],
                score: state.teams[state.currentTeam].score + 1,
              },
            },
          };
        });
      },

      markCardIncorrect: (card: string) => {
        set((state) => {
          const [currentCard, ...remainingUnplayed] = state.currentTurnCards.unplayed;
          if (!currentCard) return state;

          const playedCard = card || currentCard;

          return {
            currentTurnCards: {
              ...state.currentTurnCards,
              incorrect: [...state.currentTurnCards.incorrect, playedCard],
              unplayed: remainingUnplayed,
            },
          };
        });
      },

      updateCurrentRoundCards: (correct: string[], incorrect: string[]) => {
        set((state) => {
          const hasSameCorrectCards = areSameCards(
            correct,
            state.currentTurnCards.correct
          );
          const hasSameIncorrectCards = areSameCards(
            incorrect,
            state.currentTurnCards.incorrect
          );
          if (hasSameCorrectCards && hasSameIncorrectCards) return state;

          const scoreDifference =
            correct.length - state.currentTurnCards.correct.length;
          const newTeamScore = Math.max(
            0,
            state.teams[state.currentTeam].score + scoreDifference
          );

          return {
            currentTurnCards: {
              ...state.currentTurnCards,
              correct,
              incorrect,
            },
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

      getCurrentPlayer: () => {
        const state = get();
        return state.teams[state.currentTeam].players[state.currentPlayerIndex] || null;
      },

      getNextPlayer: () => {
        const state = get();
        const result = calculateNextTurn(
          state.currentTeam,
          state.teams,
          state.nextPlayerByTeam
        );
        return (
          state.teams[result.currentTeam].players[result.currentPlayerIndex] || null
        );
      },

      nextTurn: () => {
        const state = get();
        const result = calculateNextTurn(
          state.currentTeam,
          state.teams,
          state.nextPlayerByTeam
        );
        if (!result.hasNextTurn) return false;

        set({
          currentTeam: result.currentTeam,
          currentPlayerIndex: result.currentPlayerIndex,
          nextPlayerByTeam: result.nextPlayerByTeam,
          timer: TURN_TIME,
          isTimerRunning: false,
          currentTurnCards: {
            correct: [],
            incorrect: [],
            unplayed: state.phaseCards,
          },
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
          nextPlayerByTeam: result.phaseComplete
            ? getInitialNextPlayerByTeam(prev.teams)
            : prev.nextPlayerByTeam,
          timer: TURN_TIME,
          isTimerRunning: false,
          phaseCards: result.remainingCards,
          currentTurnCards: {
            correct: [],
            incorrect: [],
            unplayed: result.remainingCards,
          },
          gameStarted: result.gameComplete ? false : prev.gameStarted,
        }));

        if (result.gameComplete) {
          void useGameStore.persist.clearStorage();
        }

        return {
          phaseComplete: result.phaseComplete,
          gameComplete: result.gameComplete,
        };
      },

      endGame: () => {
        set({ gameStarted: false, isTimerRunning: false });
        void useGameStore.persist.clearStorage();
      },

      resetGame: () => {
        set((state) => ({
          gameStarted: false,
          currentPhase: 1,
          currentTeam: "azul",
          currentPlayerIndex: 0,
          nextPlayerByTeam: { azul: 0, rojo: 0 },
          timer: TURN_TIME,
          isTimerRunning: false,
          phaseCards: [],
          allGameCards: [],
          gameHistory: [],
          currentTurnCards: { correct: [], incorrect: [], unplayed: [] },
          teams: {
            azul: { players: state.teams.azul.players, score: 0 },
            rojo: { players: state.teams.rojo.players, score: 0 },
          },
          cards: [],
        }));
        void useGameStore.persist.clearStorage();
      },

      clearPersistedGame: async () => {
        await useGameStore.persist.clearStorage();
      },
    }),
    {
      name: "game-store",
      version: 3,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => getPersistedGameState(state),
    }
  )
);
