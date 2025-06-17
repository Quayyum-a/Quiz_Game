import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { setQuizzes, deleteQuiz } from "../store/slices/quizSlice";
import { quizAPI } from "../services/apiService";
import socketService from "../services/socketService";

export default function MyQuizzes() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { quizzes } = useSelector((state: RootState) => state.quiz);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const data = await quizAPI.getQuizzes();
      dispatch(setQuizzes(data));
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async (quizId: string) => {
    try {
      socketService.connect();
      socketService.hostGame(quizId);
    } catch (error: any) {
      setError("Failed to start quiz");
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await quizAPI.deleteQuiz(quizId);
        dispatch(deleteQuiz(quizId));
      } catch (error: any) {
        setError(error.response?.data?.message || "Failed to delete quiz");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Quizzes</h1>
          <Link
            to="/create-quiz"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Create New Quiz
          </Link>
        </div>

        {error && (
          <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
        )}

        {quizzes.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No quizzes yet
            </h3>
            <p className="text-gray-500">
              Create your first quiz to get started!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {quiz.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{quiz.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="mr-4">
                      {quiz.questions.length} Questions
                    </span>
                    <span>
                      Created {new Date(quiz.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleStartQuiz(quiz.id)}
                      className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                    >
                      Start Quiz
                    </button>
                    <Link
                      to={`/edit-quiz/${quiz.id}`}
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 text-center"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="flex-1 bg-red-100 text-red-600 px-4 py-2 rounded-md hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
