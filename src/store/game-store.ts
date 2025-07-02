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
  currentRound: number;
  currentTeam: "azul" | "rojo";
  currentPlayerIndex: number;
  teams: Teams;

  // Turn management
  timer: number;
  isTimerRunning: boolean;
  currentCardIndex: number;
  roundCards: string[];

  // Game history
  gameHistory: RoundHistory[];
  currentRoundCards: {
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
  markCardCorrect: (card: string) => void;
  markCardIncorrect: (card: string) => void;
  nextTurn: () => boolean;
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
  currentRound: 1,
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
  roundCards: [],

  // Game history
  gameHistory: [],
  currentRoundCards: {
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
    console.log('Adding player to team:', team, player);
    console.log('New teams state:', newTeams);
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
    console.log('Clearing teams:', newTeams);
    set({ teams: newTeams });
  },

  loadLastGamePlayers: async () => {
    try {
      console.log('Store: Starting to load last game players...');
      const lastGamePlayers = await database.getLastGamePlayers();
      console.log('Store: Last game players received:', lastGamePlayers);
      
      if (lastGamePlayers.length > 0) {
        const azulPlayers: Player[] = [];
        const rojoPlayers: Player[] = [];
        
        lastGamePlayers.forEach((dbPlayer) => {
          console.log('Processing player:', dbPlayer);
          const player: Player = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: dbPlayer.nombre,
          };
          
          if (dbPlayer.equipo === 'azul') {
            azulPlayers.push(player);
            console.log('Added to azul team:', player);
          } else if (dbPlayer.equipo === 'rojo') {
            rojoPlayers.push(player);
            console.log('Added to rojo team:', player);
          }
        });
        
        console.log('Final teams - Azul:', azulPlayers, 'Rojo:', rojoPlayers);
        
        set({
          teams: {
            azul: { players: azulPlayers, score: 0 },
            rojo: { players: rojoPlayers, score: 0 },
          },
        });
        
        console.log('Store: Teams updated successfully');
      } else {
        console.log('Store: No players found in last game');
      }
    } catch (error) {
      console.error('Store: Error loading last game players:', error);
      // Don't throw error, just continue with empty teams
    }
  },

  saveCurrentTeamsToDatabase: async () => {
    try {
      console.log('Store: Starting to save current teams to database...');
      const currentTeams = get().teams;
      await database.saveTeams(currentTeams);
      console.log('Store: Teams saved successfully');
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
      currentRound: 1,
      currentTeam: "azul",
      currentPlayerIndex: 0,
      timer: TURN_TIME,
      isTimerRunning: false,
      currentCardIndex: 0,
      roundCards: shuffledCards,
      gameHistory: [],
      currentRoundCards: { correct: [], incorrect: [] },
      teams: {
        azul: { ...get().teams.azul, score: 0 },
        rojo: { ...get().teams.rojo, score: 0 },
      },
      selectedDeck: null,
      cards: [],
    });
  },

  startTimer: () =>
    set((state) => ({
      isTimerRunning: false,
    })),

  stopTimer: () =>
    set((state) => ({
      isTimerRunning: false,
    })),

  resetTimer: () =>
    set({
      timer: TURN_TIME,
    }),

  markCardCorrect: (card: string) => {
    const state = get();
    const newCorrect = [...state.currentRoundCards.correct, card];
    const newTeamScore = state.teams[state.currentTeam].score + 1;

    set({
      currentRoundCards: {
        ...state.currentRoundCards,
        correct: newCorrect,
      },
      teams: {
        ...state.teams,
        [state.currentTeam]: {
          ...state.teams[state.currentTeam],
          score: newTeamScore,
        },
      },
    });
  },

  markCardIncorrect: (card: string) => {
    const state = get();
    const newIncorrect = [...state.currentRoundCards.incorrect, card];

    set({
      currentRoundCards: {
        ...state.currentRoundCards,
        incorrect: newIncorrect,
      },
    });
  },

  nextTurn: () => {
    const state = get();
    const currentTeamPlayers = state.teams[state.currentTeam].players;
    const nextPlayerIndex = state.currentPlayerIndex + 1;

    if (nextPlayerIndex >= currentTeamPlayers.length) {
      // Switch to other team
      const nextTeam = state.currentTeam === "azul" ? "rojo" : "azul";
      const nextTeamPlayers = state.teams[nextTeam].players;

      if (nextTeamPlayers.length > 0) {
        set({
          currentTeam: nextTeam,
          currentPlayerIndex: 0,
          timer: TURN_TIME,
          isTimerRunning: false,
        });
        return true;
      }
      return false;
    } else {
      set({
        currentPlayerIndex: nextPlayerIndex,
        timer: TURN_TIME,
        isTimerRunning: false,
      });
      return true;
    }
  },

  endRound: () => {
    const state = get();
    const roundHistory: RoundHistory = {
      roundNumber: state.currentRound,
      correctCards: state.currentRoundCards.correct,
      incorrectCards: state.currentRoundCards.incorrect,
      teamScores: {
        azul: state.teams.azul.score,
        rojo: state.teams.rojo.score,
      },
    };

    const newGameHistory = [...state.gameHistory, roundHistory];
    const nextRound = state.currentRound + 1;

    set({
      gameHistory: newGameHistory,
      currentRound: nextRound,
      currentTeam: "azul",
      currentPlayerIndex: 0,
      currentCardIndex: 0,
      timer: TURN_TIME,
      isTimerRunning: false,
      currentRoundCards: { correct: [], incorrect: [] },
      // Reset round cards (same cards, different order)
      roundCards: [...state.roundCards].sort(() => Math.random() - 0.5),
    });
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
      currentRound: 1,
      currentTeam: "azul",
      currentPlayerIndex: 0,
      timer: TURN_TIME,
      isTimerRunning: false,
      currentCardIndex: 0,
      roundCards: [],
      gameHistory: [],
      currentRoundCards: { correct: [], incorrect: [] },
      teams: {
        azul: { players: [], score: 0 },
        rojo: { players: [], score: 0 },
      },
      selectedDeck: null,
      cards: [],
    });
  },
}));
