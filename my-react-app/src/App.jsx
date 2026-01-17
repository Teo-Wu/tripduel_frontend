import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyTripsPage from "./pages/MyTripsPage";
import ProfilePage from "./pages/ProfilePage";
import TripEditView from "./pages/TripEditView";
import TripRankingPage from "./pages/TripRankingPage";
import TripResultPage from "./pages/TripResultPage";

import { HashRouter, Routes, Route } from "react-router-dom";
import TopNav from "./pages/TopNav";
import "./css/App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken("");
    setUsername("");
  };

  return (
    <HashRouter>
      {/* 🔹 REPLACED NAVBAR */}
      {!token && (
  <nav className="navbar">
    <div className="nav-left">
      <a href="#/register">Register</a>
      <a href="#/login">Login</a>
    </div>
  </nav>
)}
      {token && (
        <TopNav
          username={username}
          onLogout={handleLogout}
          title="My Trips"
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <MyTripsPage />
            ) : (
              <LoginPage
                setToken={setToken}
                setUsername={setUsername}
                username={username}
              />
            )
          }
        />

        <Route
          path="/mytrips"
          element={
            token ? (
              <MyTripsPage />
            ) : (
              <LoginPage
                setToken={setToken}
                setUsername={setUsername}
                username={username}
              />
            )
          }
        />

        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/login"
          element={
            <LoginPage
              setToken={setToken}
              setUsername={setUsername}
              username={username}
            />
          }
        />

        <Route
          path="/profile"
          element={
            token ? (
              <ProfilePage token={token} />
            ) : (
              <LoginPage
                setToken={setToken}
                setUsername={setUsername}
                username={username}
              />
            )
          }
        />

        <Route
          path="/trips/:tripId/edit"
          element={
            token ? (
              <TripEditView />
            ) : (
              <LoginPage
                setToken={setToken}
                setUsername={setUsername}
                username={username}
              />
            )
          }
        />

        <Route
          path="/trips/:tripId/rank"
          element={
            token ? (
              <TripRankingPage />
            ) : (
              <LoginPage
                setToken={setToken}
                setUsername={setUsername}
                username={username}
              />
            )
          }
        />

        <Route
          path="/trips/:tripId/result"
          element={
            token ? (
              <TripResultPage />
            ) : (
              <LoginPage
                setToken={setToken}
                setUsername={setUsername}
                username={username}
              />
            )
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;

