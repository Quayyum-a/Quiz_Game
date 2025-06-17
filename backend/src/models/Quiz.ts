import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  timeLimit: { type: Number, default: 20 }, // Time in seconds
  points: { type: Number, default: 1000 },
});

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  questions: [QuestionSchema],
  code: { type: String, unique: true }, // For joining the quiz
  isActive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Generate a random code before saving
QuizSchema.pre("save", function (next) {
  if (!this.code) {
    this.code = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

export const Quiz = mongoose.model("Quiz", QuizSchema);
