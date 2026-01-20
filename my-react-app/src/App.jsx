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
  const [userId, setuserId] = useState(localStorage.getItem("userId") || "");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setuserId("");
    setUsername("");
  };

  return (
    <HashRouter>
      {/* 🔹 REPLACED NAVBAR */}
      {!userId && (
  <nav className="navbar">
    <div className="nav-left">
      <a href="#/register">Register</a>
      <a href="#/login">Login</a>
    </div>
  </nav>
)}
      {userId && (
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
            userId ? (
              <MyTripsPage />
            ) : (
              <LoginPage
                setuserId={setuserId}
                setUsername={setUsername}
                username={username}
              />
            )
          }
        />

        <Route
          path="/mytrips"
          element={
            userId ? (
              <MyTripsPage userId={userId}/>
            ) : (
              <LoginPage
                setuserId={setuserId}
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
              setuserId={setuserId}
              setUsername={setUsername}
              username={username}
            />
          }
        />

        <Route
          path="/profile"
          element={
            userId ? (
              <ProfilePage userId={userId} />
            ) : (
              <LoginPage
                setuserId={setuserId}
                setUsername={setUsername}
                username={username}
              />
            )
          }
        />

        <Route
          path="/trips/:tripId/edit"
          element={
            userId ? (
              <TripEditView />
            ) : (
              <LoginPage
                setuserId={setuserId}
                setUsername={setUsername}
                username={username}
              />
            )
          }
        />

        <Route
          path="/trips/:tripId/rank"
          element={
            userId ? (
              <TripRankingPage userId={userId} />
            ) : (
              <LoginPage
                setuserId={setuserId}
                setUsername={setUsername}
                username={username}
              />
            )
          }
        />

        <Route
          path="/trips/:tripId/result"
          element={
            userId ? (
              <TripResultPage userId={userId} username={username}/>
            ) : (
              <LoginPage
                setuserId={setuserId}
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

