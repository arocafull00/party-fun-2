import { create } from 'zustand';
import { Bateria, Palabra } from '../database/database';

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
  correctWords: string[];
  incorrectWords: string[];
  teamScores: {
    azul: number;
    rojo: number;
  };
}

export interface GameState {
  // Battery management
  selectedBattery: Bateria | null;
  batteries: Bateria[];
  words: Palabra[];
  
  // Game state
  gameStarted: boolean;
  currentRound: number;
  currentTeam: 'azul' | 'rojo';
  currentPlayerIndex: number;
  teams: Teams;
  
  // Turn management
  timer: number;
  isTimerRunning: boolean;
  currentWordIndex: number;
  roundWords: string[];
  
  // Game history
  gameHistory: RoundHistory[];
  currentRoundWords: {
    correct: string[];
    incorrect: string[];
  };
  
  // Actions
  setBatteries: (batteries: Bateria[]) => void;
  setSelectedBattery: (battery: Bateria | null) => void;
  setWords: (words: Palabra[]) => void;
  
  // Team management
  addPlayerToTeam: (team: 'azul' | 'rojo', player: Player) => void;
  removePlayerFromTeam: (team: 'azul' | 'rojo', playerId: string) => void;
  movePlayerToTeam: (playerId: string, fromTeam: 'azul' | 'rojo', toTeam: 'azul' | 'rojo') => void;
  clearTeams: () => void;
  
  // Game flow
  startGame: (wordsList: string[]) => void;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  markWordCorrect: (word: string) => void;
  markWordIncorrect: (word: string) => void;
  nextTurn: () => boolean;
  endRound: () => void;
  endGame: () => void;
  resetGame: () => void;
}

const ROUNDS = [
  { number: 1, name: 'Ronda 1', description: 'Pista libre (menos sinónimos)' },
  { number: 2, name: 'Ronda 2', description: 'Una sola palabra como pista' },
  { number: 3, name: 'Ronda 3', description: 'Solo mímica' },
];

const TURN_TIME = 30; // 30 seconds per turn

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  selectedBattery: null,
  batteries: [],
  words: [],
  
  // Game state
  gameStarted: false,
  currentRound: 1,
  currentTeam: 'azul',
  currentPlayerIndex: 0,
  teams: {
    azul: { players: [], score: 0 },
    rojo: { players: [], score: 0 },
  },
  
  // Turn management
  timer: TURN_TIME,
  isTimerRunning: false,
  currentWordIndex: 0,
  roundWords: [],
  
  // Game history
  gameHistory: [],
  currentRoundWords: {
    correct: [],
    incorrect: []
  },
  
  // Actions
  setBatteries: (batteries) => set({ batteries }),
  setSelectedBattery: (battery) => set({ selectedBattery: battery }),
  setWords: (words) => set({ words }),
  
  // Team management
  addPlayerToTeam: (team, player) =>
    set((state) => ({
      teams: {
        ...state.teams,
        [team]: {
          ...state.teams[team],
          players: [...state.teams[team].players, player],
        },
      },
    })),
  
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
      const player = state.teams[fromTeam].players.find((p) => p.id === playerId);
      if (!player) return state;
      
      return {
        teams: {
          ...state.teams,
          [fromTeam]: {
            ...state.teams[fromTeam],
            players: state.teams[fromTeam].players.filter((p) => p.id !== playerId),
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
  startGame: (wordsList: string[]) => {
    // Shuffle words for the game
    const shuffledWords = [...wordsList].sort(() => Math.random() - 0.5);
    
    set({
      gameStarted: true,
      currentRound: 1,
      currentTeam: 'azul',
      currentPlayerIndex: 0,
      timer: TURN_TIME,
      isTimerRunning: false,
      currentWordIndex: 0,
      roundWords: shuffledWords,
      gameHistory: [],
      currentRoundWords: { correct: [], incorrect: [] },
      teams: {
        azul: { ...get().teams.azul, score: 0 },
        rojo: { ...get().teams.rojo, score: 0 }
      },
      selectedBattery: null,
      words: []
    });
  },
  
  startTimer: () =>
    set((state) => ({
      isTimerRunning: true,
    })),
  
  stopTimer: () =>
    set((state) => ({
      isTimerRunning: false,
    })),
  
  resetTimer: () =>
    set({
      timer: TURN_TIME,
    }),
  
  markWordCorrect: (word: string) => {
    const state = get();
    const newCorrect = [...state.currentRoundWords.correct, word];
    const newTeamScore = state.teams[state.currentTeam].score + 1;
    
    set({
      currentRoundWords: {
        ...state.currentRoundWords,
        correct: newCorrect
      },
      teams: {
        ...state.teams,
        [state.currentTeam]: {
          ...state.teams[state.currentTeam],
          score: newTeamScore
        }
      }
    });
  },
  
  markWordIncorrect: (word: string) => {
    const state = get();
    const newIncorrect = [...state.currentRoundWords.incorrect, word];
    
    set({
      currentRoundWords: {
        ...state.currentRoundWords,
        incorrect: newIncorrect
      }
    });
  },
  
  nextTurn: () => {
    const state = get();
    const currentTeamPlayers = state.teams[state.currentTeam].players;
    const nextPlayerIndex = state.currentPlayerIndex + 1;
    
    if (nextPlayerIndex >= currentTeamPlayers.length) {
      // Switch to other team
      const nextTeam = state.currentTeam === 'azul' ? 'rojo' : 'azul';
      const nextTeamPlayers = state.teams[nextTeam].players;
      
      if (nextTeamPlayers.length > 0) {
        set({
          currentTeam: nextTeam,
          currentPlayerIndex: 0,
          timer: TURN_TIME,
          isTimerRunning: false
        });
        return true;
      }
      return false;
    } else {
      set({
        currentPlayerIndex: nextPlayerIndex,
        timer: TURN_TIME,
        isTimerRunning: false
      });
      return true;
    }
  },
  
  endRound: () => {
    const state = get();
    const roundHistory: RoundHistory = {
      roundNumber: state.currentRound,
      correctWords: state.currentRoundWords.correct,
      incorrectWords: state.currentRoundWords.incorrect,
      teamScores: {
        azul: state.teams.azul.score,
        rojo: state.teams.rojo.score
      }
    };
    
    const newGameHistory = [...state.gameHistory, roundHistory];
    const nextRound = state.currentRound + 1;
    
         set({
       gameHistory: newGameHistory,
       currentRound: nextRound,
       currentTeam: 'azul',
       currentPlayerIndex: 0,
       currentWordIndex: 0,
       timer: TURN_TIME,
       isTimerRunning: false,
       currentRoundWords: { correct: [], incorrect: [] },
       // Reset round words (same words, different order)
       roundWords: [...state.roundWords].sort(() => Math.random() - 0.5)
     });
  },
  
  endGame: () => {
    const state = get();
    // Final round history is already added in endRound
    set({
      gameStarted: false,
      isTimerRunning: false
    });
  },
  
  resetGame: () => {
    set({
      gameStarted: false,
      currentRound: 1,
      currentTeam: 'azul',
      currentPlayerIndex: 0,
      timer: TURN_TIME,
      isTimerRunning: false,
      currentWordIndex: 0,
      roundWords: [],
      gameHistory: [],
      currentRoundWords: { correct: [], incorrect: [] },
      teams: {
        azul: { players: [], score: 0 },
        rojo: { players: [], score: 0 }
      },
      selectedBattery: null,
      words: []
    });
  },
})); 