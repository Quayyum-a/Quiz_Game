export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdBy: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
  isReady: boolean;
}

export interface GameState {
  status: "waiting" | "starting" | "playing" | "finished";
  currentQuestion: number;
  timeRemaining: number;
  players: Player[];
  scores: Record<string, number>;
}
