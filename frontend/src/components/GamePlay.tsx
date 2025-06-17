import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socketService from "../services/socketService";
import { Timer } from "./ui/Timer";
import { AnswerOption } from "./ui/AnswerOption";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    color: "red" | "blue" | "yellow" | "green";
  }[];
  timeLimit: number;
}

export default function GamePlay() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);

  useEffect(() => {
    socketService.on("question", (question: Question) => {
      setCurrentQuestion(question);
      setSelectedAnswer(null);
      setShowResults(false);
      setCorrectAnswer(null);
    });

    socketService.on("show-results", ({ question }) => {
      setShowResults(true);
      setCorrectAnswer(question.correctAnswer);
    });

    socketService.on("game-over", () => {
      navigate(`/game/${code}/results`);
    });

    return () => {
      socketService.off("question");
      socketService.off("show-results");
      socketService.off("game-over");
    };
  }, [code, navigate]);

  const handleAnswerSelect = (answerId: string) => {
    if (selectedAnswer || showResults) return;
    setSelectedAnswer(answerId);
    socketService.submitAnswer(code!, answerId);
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Loading question...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Timer */}
          <div className="flex justify-center mb-8">
            <Timer
              duration={currentQuestion.timeLimit}
              onComplete={() => setShowResults(true)}
              size="lg"
            />
          </div>

          {/* Question */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-800">
              {currentQuestion.text}
            </h2>
          </motion.div>

          {/* Answer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {currentQuestion.options.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <AnswerOption
                    text={option.text}
                    color={option.color}
                    isSelected={selectedAnswer === option.id}
                    isCorrect={showResults && option.id === correctAnswer}
                    isWrong={
                      showResults &&
                      selectedAnswer === option.id &&
                      option.id !== correctAnswer
                    }
                    onClick={() => handleAnswerSelect(option.id)}
                    disabled={selectedAnswer !== null || showResults}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Results */}
          {showResults && (
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-2xl font-bold text-gray-800">
                {selectedAnswer === correctAnswer
                  ? "Correct! 🎉"
                  : "Time's up! ⏰"}
              </div>
              <div className="text-gray-600 mt-2">
                Waiting for next question...
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
