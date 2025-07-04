import { create } from "zustand";
import { Mazo, Carta, database } from "../database/database";

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
  currentPhase: number; // 1, 2, or 3
  currentTeam: "azul" | "rojo";
  currentPlayerIndex: number;
  teams: Teams;

  // Turn management
  timer: number;
  isTimerRunning: boolean;
  currentCardIndex: number;
  phaseCards: string[]; // Cards available for current phase
  allGameCards: string[]; // All original cards from the game

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
  loadLastGamePlayers: () => Promise<void>;
  saveCurrentTeamsToDatabase: () => Promise<void>;

  // Game flow
  startGame: (cardsList: string[]) => void;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  decrementTimer: () => boolean;
  reduceTimerForSkip: () => void;
  markCardCorrect: (card: string) => void;
  markCardIncorrect: (card: string) => void;
  updateCurrentRoundCards: (correct: string[], incorrect: string[]) => void;
  getCurrentPlayer: () => Player | null;
  getNextPlayer: () => Player | null;
  nextTurn: () => boolean;
  endTurn: () => { phaseComplete: boolean; gameComplete: boolean };
  endRound: () => void;
  endGame: () => void;
  resetGame: () => void;
}

const TURN_TIME = 30; // 30 seconds per turn

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
    const newTeams = {
      ...get().teams,
      [team]: {
        ...get().teams[team],
        players: [...get().teams[team].players, player],
      },
    };
    set({ teams: newTeams });
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

  clearTeams: () => {
    const newTeams = {
      azul: { players: [], score: 0 },
      rojo: { players: [], score: 0 },
    };
    set({ teams: newTeams });
  },

  loadLastGamePlayers: async () => {
    try {
      const lastGamePlayers = await database.getLastGamePlayers();
      
      if (lastGamePlayers.length > 0) {
        const azulPlayers: Player[] = [];
        const rojoPlayers: Player[] = [];
        
        lastGamePlayers.forEach((dbPlayer) => {
          const player: Player = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: dbPlayer.nombre,
          };
          
          if (dbPlayer.equipo === 'azul') {
            azulPlayers.push(player);
          } else if (dbPlayer.equipo === 'rojo') {
            rojoPlayers.push(player);
          }
        });
        
        set({
          teams: {
            azul: { players: azulPlayers, score: 0 },
            rojo: { players: rojoPlayers, score: 0 },
          },
        });
        
      }
    } catch (error) {
      // Don't throw error, just continue with empty teams
    }
  },

  saveCurrentTeamsToDatabase: async () => {
    try {
      const currentTeams = get().teams;
      await database.saveTeams(currentTeams);
    } catch (error) {
      console.error('Store: Error saving current teams to database:', error);
    }
  },

  // Game flow
  startGame: (cardsList: string[]) => {
    // Save current teams to database before starting the game
    const currentState = get();
    if (currentState.teams.azul.players.length > 0 || currentState.teams.rojo.players.length > 0) {
      currentState.saveCurrentTeamsToDatabase().catch((error) => {
        console.error('Error saving teams before game start:', error);
      });
    }

    // Shuffle cards for the game
    const shuffledCards = [...cardsList].sort(() => Math.random() - 0.5);

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

  startTimer: () =>
    set({
      isTimerRunning: true,
    }),

  stopTimer: () =>
    set({
      isTimerRunning: false,
    }),

  resetTimer: () =>
    set({
      timer: TURN_TIME,
    }),

  // Function to decrement timer by 1 second
  decrementTimer: () => {
    const state = get();
    const newTime = state.timer - 1;
    
    if (newTime <= 0) {
      set({ timer: 0, isTimerRunning: false });
      return false; // Timer reached zero
    } else {
      set({ timer: newTime });
      return true; // Timer still running
    }
  },

  // New function to reduce timer by 5 seconds in phase 1
  reduceTimerForSkip: () => {
    const state = get();
    if (state.currentPhase === 1) {
      const newTime = Math.max(0, state.timer - 5);
      set({ timer: newTime });
    }
  },

  markCardCorrect: (card: string) => {
    const state = get();
    set({
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
    });
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
      const scoreDifference = correct.length - state.currentTurnCards.correct.length;
      const newTeamScore = Math.max(0, state.teams[state.currentTeam].score + scoreDifference);

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

  getCurrentPlayer: () => {
    const state = get();
    const currentTeamPlayers = state.teams[state.currentTeam].players;
    return currentTeamPlayers[state.currentPlayerIndex] || null;
  },

  getNextPlayer: () => {
    const state = get();
    const currentTeamPlayers = state.teams[state.currentTeam].players;
    const nextPlayerIndex = state.currentPlayerIndex + 1;

    if (nextPlayerIndex >= currentTeamPlayers.length) {
      // Next player is from the other team
      const nextTeam = state.currentTeam === "azul" ? "rojo" : "azul";
      const nextTeamPlayers = state.teams[nextTeam].players;
      return nextTeamPlayers[0] || null;
    } else {
      return currentTeamPlayers[nextPlayerIndex] || null;
    }
  },

  nextTurn: () => {
    const state = get();
    const currentTeamPlayers = state.teams[state.currentTeam].players;
    const nextPlayerIndex = state.currentPlayerIndex + 1;

    if (nextPlayerIndex >= currentTeamPlayers.length) {
      // Switch to other team
      const nextTeam = state.currentTeam === "azul" ? "rojo" : "azul";
      if (state.teams[nextTeam].players.length === 0) return false;

      set({
        currentTeam: nextTeam,
        currentPlayerIndex: 0,
        timer: TURN_TIME,
        isTimerRunning: false,
        currentCardIndex: 0,
        currentTurnCards: { correct: [], incorrect: [] },
      });
      return true;
    }

    set({
      currentPlayerIndex: nextPlayerIndex,
      timer: TURN_TIME,
      isTimerRunning: false,
      currentCardIndex: 0,
      currentTurnCards: { correct: [], incorrect: [] },
    });
    return true;
  },

  endTurn: () => {
    const state = get();
    
    // Remove correct cards from phase pool and shuffle
    const remainingCards = state.phaseCards.filter(card => 
      !state.currentTurnCards.correct.includes(card)
    );
    
    const roundHistory: RoundHistory = {
      roundNumber: state.currentPhase,
      correctCards: state.currentTurnCards.correct,
      incorrectCards: state.currentTurnCards.incorrect,
      teamScores: {
        azul: state.teams.azul.score,
        rojo: state.teams.rojo.score,
      },
    };

    // Phase complete?
    if (remainingCards.length === 0) {
      const nextPhase = state.currentPhase + 1;
      
      if (nextPhase > 3) {
        // Game complete
        set({
          gameHistory: [...state.gameHistory, roundHistory],
          gameStarted: false,
          isTimerRunning: false,
        });
        return { phaseComplete: true, gameComplete: true };
      }
      
      // Next phase
      set({
        gameHistory: [...state.gameHistory, roundHistory],
        currentPhase: nextPhase,
        currentTeam: "azul",
        currentPlayerIndex: 0,
        currentCardIndex: 0,
        timer: TURN_TIME,
        isTimerRunning: false,
        currentTurnCards: { correct: [], incorrect: [] },
        phaseCards: [...state.allGameCards].sort(() => Math.random() - 0.5),
      });
      return { phaseComplete: true, gameComplete: false };
    }
    
    // Continue phase
    set({
      gameHistory: [...state.gameHistory, roundHistory],
      phaseCards: remainingCards.sort(() => Math.random() - 0.5),
      currentCardIndex: 0,
      currentTurnCards: { correct: [], incorrect: [] },
    });
    return { phaseComplete: false, gameComplete: false };
  },

  endRound: () => {
    // This function is now deprecated - use endTurn instead
    // Keeping for backward compatibility
    const result = get().endTurn();
    return result;
  },

  endGame: () => {
    const state = get();
    // Final round history is already added in endRound
    set({
      gameStarted: false,
      isTimerRunning: false,
    });
  },

  resetGame: () => {
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
    });
  },
}));
