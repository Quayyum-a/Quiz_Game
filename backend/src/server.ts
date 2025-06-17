import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Quiz } from "./models/Quiz";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/kahoot-clone")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Socket.IO connection handling
interface Player {
  id: string;
  name: string;
  score: number;
  isReady: boolean;
  lastAnswer?: {
    answerId: string;
    timeLeft: number;
  };
}

interface GameState {
  quizId: string;
  currentQuestion: number;
  players: { [socketId: string]: Player };
  isStarted: boolean;
  isFinished: boolean;
  questionTimer?: NodeJS.Timeout;
  questionTimeLeft: number;
}

const games: { [code: string]: GameState } = {};
const QUESTION_TIME = 20; // seconds per question

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Host creates a game
  socket.on("host-game", async ({ quizId }) => {
    try {
      const quiz = await Quiz.findById(quizId);
      if (quiz && typeof quiz.code === "string" && quiz.code) {
        games[quiz.code] = {
          quizId,
          currentQuestion: -1,
          players: {},
          isStarted: false,
          isFinished: false,
          questionTimeLeft: QUESTION_TIME,
        };
        socket.join(quiz.code);
        socket.emit("game-created", { code: quiz.code });
      }
    } catch (error) {
      console.error("Error creating game:", error);
    }
  });

  // Player joins a game
  socket.on("join-game", ({ code, playerName }) => {
    const game = games[code];
    if (game && !game.isStarted) {
      game.players[socket.id] = {
        id: socket.id,
        name: playerName,
        score: 0,
        isReady: false,
      };
      socket.join(code);
      io.to(code).emit("player-joined", {
        players: Object.values(game.players),
      });
    }
  });

  // Player ready status
  socket.on("player-ready", ({ code }) => {
    const game = games[code];
    if (game && game.players[socket.id]) {
      game.players[socket.id].isReady = true;
      io.to(code).emit("player-ready", {
        players: Object.values(game.players),
      });
    }
  });

  // Host starts the game
  socket.on("start-game", async ({ code }) => {
    const game = games[code];
    if (game && !game.isStarted) {
      game.isStarted = true;
      game.currentQuestion = 0;
      const quiz = await Quiz.findById(game.quizId);

      if (quiz) {
        // Start countdown
        io.to(code).emit("game-starting");

        // After 5 seconds, start the first question
        setTimeout(() => {
          startQuestion(code, quiz);
        }, 5000);
      }
    }
  });

  // Player submits answer
  socket.on("submit-answer", ({ code, answerId }) => {
    const game = games[code];
    if (game && game.isStarted && !game.isFinished) {
      const player = game.players[socket.id];
      if (player) {
        player.lastAnswer = {
          answerId,
          timeLeft: game.questionTimeLeft,
        };
      }
    }
  });

  // Disconnect handling
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Remove player from any game they were in
    Object.keys(games).forEach((code) => {
      if (games[code].players[socket.id]) {
        delete games[code].players[socket.id];
        io.to(code).emit("player-left", {
          players: Object.values(games[code].players),
        });
      }
    });
  });
});

// Helper function to start a question
async function startQuestion(code: string, quiz: any) {
  const game = games[code];
  if (!game) return;

  game.questionTimeLeft = QUESTION_TIME;

  // Send question to all players
  io.to(code).emit("question", {
    id: quiz.questions[game.currentQuestion]._id,
    text: quiz.questions[game.currentQuestion].text,
    options: quiz.questions[game.currentQuestion].options,
    timeLimit: QUESTION_TIME,
  });

  // Start timer
  game.questionTimer = setInterval(() => {
    game.questionTimeLeft--;
    io.to(code).emit("time-update", game.questionTimeLeft);

    if (game.questionTimeLeft <= 0) {
      clearInterval(game.questionTimer);
      showResults(code, quiz);
    }
  }, 1000);
}

// Helper function to show results
async function showResults(code: string, quiz: any) {
  const game = games[code];
  if (!game) return;

  // Calculate scores
  const currentQuestion = quiz.questions[game.currentQuestion];
  Object.values(game.players).forEach((player) => {
    if (player.lastAnswer) {
      const isCorrect =
        player.lastAnswer.answerId === currentQuestion.correctAnswer;
      if (isCorrect) {
        // Score based on time left (max 1000 points)
        const timeBonus = Math.floor(
          (player.lastAnswer.timeLeft / QUESTION_TIME) * 1000
        );
        player.score += timeBonus;
      }
    }
  });

  // Show results
  io.to(code).emit("show-results", {
    question: currentQuestion,
    players: Object.values(game.players),
  });

  // Move to next question after 5 seconds
  setTimeout(() => {
    game.currentQuestion++;
    if (game.currentQuestion < quiz.questions.length) {
      startQuestion(code, quiz);
    } else {
      // Game over
      game.isFinished = true;
      io.to(code).emit("game-over", {
        players: Object.values(game.players),
      });
    }
  }, 5000);
}

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
