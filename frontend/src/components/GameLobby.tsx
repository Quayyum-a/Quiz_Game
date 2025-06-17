import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../store";
import socketService from "../services/socketService";

interface Player {
  id: string;
  name: string;
  isReady: boolean;
}

export default function GameLobby() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<
    "waiting" | "starting" | "started"
  >("waiting");
  const [countdown, setCountdown] = useState(5);

  // Get the current user from the auth state
  const currentUser = useAppSelector((state) => state.auth.user);
  const isHost = currentUser?.isAdmin || false;

  useEffect(() => {
    socketService.on("playerJoined", (player: Player) => {
      setPlayers((prev) => [...prev, player]);
    });

    socketService.on("playerLeft", (playerId: string) => {
      setPlayers((prev) => prev.filter((p) => p.id !== playerId));
    });

    socketService.on("gameStarting", () => {
      setGameState("starting");
      let count = 5;
      setCountdown(count);
      const timer = setInterval(() => {
        count--;
        setCountdown(count);
        if (count === 0) {
          clearInterval(timer);
          navigate(`/game/${code}/play`);
        }
      }, 1000);
    });

    return () => {
      socketService.off("playerJoined");
      socketService.off("playerLeft");
      socketService.off("gameStarting");
    };
  }, [code, navigate]);

  const startGame = () => {
    socketService.startGame(code!);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
              Game PIN: {code}
            </h1>
            <p className="text-gray-600 mt-2">
              Share this PIN with your players
            </p>
          </div>

          {gameState === "starting" && (
            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-purple-600 animate-bounce">
                {countdown}
              </div>
              <p className="text-xl text-gray-700 mt-4">Game starting...</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Players ({players.length})
              </h2>
              <div className="space-y-3">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
                  >
                    <span className="font-medium text-gray-700">
                      {player.name}
                    </span>
                    {player.isReady && (
                      <span className="text-green-500">Ready</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Game Controls
              </h2>
              {isHost ? (
                <div className="space-y-4">
                  <button
                    onClick={startGame}
                    disabled={players.length < 2 || gameState === "starting"}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-xl hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Game
                  </button>
                  <p className="text-sm text-gray-500 text-center">
                    {players.length < 2
                      ? "Need at least 2 players to start"
                      : "Ready to start!"}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600">
                    Waiting for host to start the game...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
