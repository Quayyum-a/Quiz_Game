import axios from "axios";
import { store } from "../store";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api",
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },
  register: async (username: string, email: string, password: string) => {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    return response.data;
  },
};

export const quizAPI = {
  createQuiz: async (quizData: any) => {
    const response = await api.post("/quiz", quizData);
    return response.data;
  },
  getQuizzes: async () => {
    const response = await api.get("/quiz");
    return response.data;
  },
  getQuizById: async (id: string) => {
    const response = await api.get(`/quiz/${id}`);
    return response.data;
  },
  updateQuiz: async (id: string, quizData: any) => {
    const response = await api.put(`/quiz/${id}`, quizData);
    return response.data;
  },
  deleteQuiz: async (id: string) => {
    const response = await api.delete(`/quiz/${id}`);
    return response.data;
  },
};

export const gameAPI = {
  getGameResults: async (gameId: string) => {
    const response = await api.get(`/game/${gameId}/results`);
    return response.data;
  },
  saveGameResults: async (gameId: string, results: any) => {
    const response = await api.post(`/game/${gameId}/results`, results);
    return response.data;
  },
};
