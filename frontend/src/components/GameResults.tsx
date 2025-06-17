import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import confetti from "canvas-confetti";

export default function GameResults() {
  const { players } = useSelector((state: RootState) => state.game);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger confetti animation for winner
    if (players.length > 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, []);

  // Sort players by score in descending order
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winners = sortedPlayers.filter(
    (p, i) => i === 0 || p.score === sortedPlayers[0].score
  );

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Game Over!</h1>
          {winners.length === 1 ? (
            <p className="text-xl text-gray-600">
              Congratulations to {winners[0].name} for winning!
            </p>
          ) : (
            <p className="text-xl text-gray-600">
              It's a tie between {winners.map((w) => w.name).join(" and ")}!
            </p>
          )}
        </div>

        {/* Podium for top 3 */}
        <div className="flex justify-center items-end space-x-4 mb-16 h-64">
          {/* Second Place */}
          {sortedPlayers[1] && (
            <div className="w-32 flex flex-col items-center">
              <div className="bg-white rounded-lg shadow-lg p-4 text-center mb-2">
                <div className="h-12 w-12 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl mb-2">
                  2
                </div>
                <p className="font-semibold text-gray-900">
                  {sortedPlayers[1].name}
                </p>
                <p className="text-gray-600">{sortedPlayers[1].score} pts</p>
              </div>
              <div className="w-full bg-gray-300 h-32"></div>
            </div>
          )}

          {/* First Place */}
          {sortedPlayers[0] && (
            <div className="w-32 flex flex-col items-center">
              <div className="bg-white rounded-lg shadow-lg p-4 text-center mb-2 border-2 border-yellow-400">
                <div className="h-12 w-12 mx-auto rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-xl mb-2">
                  1
                </div>
                <p className="font-semibold text-gray-900">
                  {sortedPlayers[0].name}
                </p>
                <p className="text-gray-600">{sortedPlayers[0].score} pts</p>
              </div>
              <div className="w-full bg-yellow-400 h-40"></div>
            </div>
          )}

          {/* Third Place */}
          {sortedPlayers[2] && (
            <div className="w-32 flex flex-col items-center">
              <div className="bg-white rounded-lg shadow-lg p-4 text-center mb-2">
                <div className="h-12 w-12 mx-auto rounded-full bg-orange-400 flex items-center justify-center text-white font-bold text-xl mb-2">
                  3
                </div>
                <p className="font-semibold text-gray-900">
                  {sortedPlayers[2].name}
                </p>
                <p className="text-gray-600">{sortedPlayers[2].score} pts</p>
              </div>
              <div className="w-full bg-orange-400 h-24"></div>
            </div>
          )}
        </div>

        {/* Full Scoreboard */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Final Scoreboard
          </h2>
          <div className="space-y-4">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-gray-500">
                    #{index + 1}
                  </span>
                  <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-900">
                    {player.name}
                  </span>
                </div>
                <span className="text-xl font-semibold text-primary-600">
                  {player.score} pts
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate("/join")}
            className="px-6 py-3 bg-white text-primary-600 rounded-md hover:bg-gray-50 font-medium border border-primary-600"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
