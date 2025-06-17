import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Player {
  id: string;
  name: string;
  score: number;
  isReady: boolean;
}

interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    color: string;
  }[];
  timeLimit: number;
}

interface GameState {
  code: string | null;
  isHost: boolean;
  players: Player[];
  currentQuestion: Question | null;
  timeLeft: number;
  showResults: boolean;
  isGameOver: boolean;
  finalScores: Player[];
}

const initialState: GameState = {
  code: null,
  isHost: false,
  players: [],
  currentQuestion: null,
  timeLeft: 0,
  showResults: false,
  isGameOver: false,
  finalScores: [],
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    setIsHost: (state, action: PayloadAction<boolean>) => {
      state.isHost = action.payload;
    },
    setPlayers: (state, action: PayloadAction<Player[]>) => {
      state.players = action.payload;
    },
    setCurrentQuestion: (state, action: PayloadAction<Question>) => {
      state.currentQuestion = action.payload;
      state.timeLeft = action.payload.timeLimit;
      state.showResults = false;
    },
    updateTimeLeft: (state, action: PayloadAction<number>) => {
      state.timeLeft = action.payload;
    },
    showResults: (state) => {
      state.showResults = true;
    },
    updatePlayerScore: (
      state,
      action: PayloadAction<{ id: string; score: number }>
    ) => {
      const player = state.players.find((p) => p.id === action.payload.id);
      if (player) {
        player.score = action.payload.score;
      }
    },
    setGameOver: (state, action: PayloadAction<Player[]>) => {
      state.isGameOver = true;
      state.finalScores = action.payload;
    },
    resetGame: () => {
      return initialState;
    },
  },
});

export const {
  setGameCode,
  setIsHost,
  setPlayers,
  setCurrentQuestion,
  updateTimeLeft,
  showResults,
  updatePlayerScore,
  setGameOver,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;
