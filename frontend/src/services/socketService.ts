import { io, Socket } from "socket.io-client";
import { store } from "../store";
import {
  setPlayers,
  setCurrentQuestion,
  setGameOver,
  updatePlayerScore,
} from "../store/slices/gameSlice";

// Define socket event types
type SocketEvent =
  | "player-joined"
  | "player-left"
  | "game-started"
  | "question"
  | "show-results"
  | "game-over"
  | "time-update"
  | "player-ready";

type SocketCallback = (...args: unknown[]) => void;

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  private constructor() {
    this.setupSocketListeners();
  }

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  private setupSocketListeners() {
    if (this.socket) {
      this.socket.on("player-joined", (players) => {
        store.dispatch(setPlayers(players));
      });

      this.socket.on("player-left", (players) => {
        store.dispatch(setPlayers(players));
      });

      this.socket.on("question", (question) => {
        store.dispatch(setCurrentQuestion(question));
      });

      this.socket.on("show-results", ({ players }) => {
        players.forEach((player: { id: string; score: number }) => {
          store.dispatch(updatePlayerScore(player));
        });
      });

      this.socket.on("game-over", (finalScores) => {
        store.dispatch(setGameOver(finalScores));
      });
    }
  }

  connect() {
    if (!this.socket) {
      this.socket = io(
        import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"
      );
      this.setupSocketListeners();
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Host actions
  hostGame(quizId: string) {
    if (this.socket) {
      this.socket.emit("host-game", { quizId });
    }
  }

  startGame(code: string) {
    if (this.socket) {
      this.socket.emit("start-game", { code });
    }
  }

  // Player actions
  joinGame(code: string, playerName: string) {
    if (this.socket) {
      this.socket.emit("join-game", { code, playerName });
    }
  }

  setReady(code: string) {
    if (this.socket) {
      this.socket.emit("player-ready", { code });
    }
  }

  submitAnswer(code: string, answerId: string) {
    if (this.socket) {
      this.socket.emit("submit-answer", { code, answerId });
    }
  }

  // Event listeners
  on(event: SocketEvent, callback: SocketCallback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: SocketEvent) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export default SocketService.getInstance();
