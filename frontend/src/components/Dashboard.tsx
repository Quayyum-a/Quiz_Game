import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.username}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">My Quizzes</h2>
          <p className="text-gray-600 mb-4">Create and manage your quizzes</p>
          <button
            onClick={() => navigate("/my-quizzes")}
            className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
          >
            View Quizzes
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Join Game</h2>
          <p className="text-gray-600 mb-4">Join an existing game</p>
          <button
            onClick={() => navigate("/join")}
            className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
          >
            Join Game
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Create Quiz</h2>
          <p className="text-gray-600 mb-4">Create a new quiz</p>
          <button
            onClick={() => navigate("/create-quiz")}
            className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
          >
            Create Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
