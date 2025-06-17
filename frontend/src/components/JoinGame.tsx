import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setGameCode, setIsHost } from "../store/slices/gameSlice";
import socketService from "../services/socketService";

export default function JoinGame() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) {
      setError("Please fill in all fields");
      return;
    }

    try {
      socketService.connect();
      socketService.joinGame(code.toUpperCase(), name);
      dispatch(setGameCode(code.toUpperCase()));
      dispatch(setIsHost(false));
      navigate(`/game/${code}`);
    } catch (error) {
      setError("Failed to join game");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 mb-2">
            Kahoot!
          </h1>
          <h2 className="text-2xl font-bold text-gray-800">
            Enter Game PIN
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                id="game-code"
                name="code"
                type="text"
                required
                className="appearance-none block w-full px-4 py-3 border-2 border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 text-center text-2xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Game PIN"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={6}
              />
            </div>
            <div>
              <input
                id="player-name"
                name="name"
                type="text"
                required
                className="appearance-none block w-full px-4 py-3 border-2 border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 text-center text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Nickname"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-105 transition-all duration-200"
            >
              Enter
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have a game PIN?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              Sign in to create your own quiz
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
