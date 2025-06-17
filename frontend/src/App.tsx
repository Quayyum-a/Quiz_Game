import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Layout from "./components/Layout";
import JoinGame from "./components/JoinGame";
import GameLobby from "./components/GameLobby";
import GamePlay from "./components/GamePlay";
import GameResults from "./components/GameResults";
import QuizEditor from "./components/QuizEditor";
import Login from "./components/Login";
import Register from "./components/Register";
import MyQuizzes from "./components/MyQuizzes";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/join" replace />} />
            <Route path="/join" element={<JoinGame />} />
            <Route path="/game/:code" element={<GameLobby />} />
            <Route path="/game/:code/play" element={<GamePlay />} />
            <Route path="/game/:code/results" element={<GameResults />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-quizzes" element={<MyQuizzes />} />
            <Route path="/create-quiz" element={<QuizEditor />} />
            <Route path="/edit-quiz/:id" element={<QuizEditor />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
