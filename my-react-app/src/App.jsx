import { useState } from 'react'
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyTripsPage from "./pages/MyTripsPage";
import ProfilePage from './pages/ProfilePage';
import TripEditView from "./pages/TripEditView";
import TripRankingPage from "./pages/TripRankingPage";
import TripResultPage from "./pages/TripResultPage";
import Mack from './pages/Mack';
import { HashRouter, Routes, Route, Link } from "react-router-dom"
import "./css/App.css"

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");

  return (
    <HashRouter>
      <nav className="navbar">
        <div className="nav-left">
          { !token && <Link to="/register">Register</Link> }
          { !token && <Link to="/login">Login</Link> }
          { token && <Link to="/profile">Profile</Link> }
          { token && <Link to="/mytrips">MyTrips</Link> } 
          { token && <Link to="/mack">m</Link> } 
        </div>

        { token && 
          <div className="nav-right">
            <span>{username}</span>
            <button className="logout-btn"
              onClick={() => { 
                localStorage.removeItem("token"); 
                localStorage.removeItem("username"); 
                setToken(null); 
                setUsername(""); 
              }}
            >
              Logout
            </button>
          </div>
        }
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            token
              ? <MyTripsPage />
              : <LoginPage setToken={setToken} setUsername={setUsername} username={username} />
          }
        />
        <Route path="/mytrips" element={token ? <MyTripsPage/> : <LoginPage setToken={setToken} setUsername={setUsername} username={username}/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/login" element={<LoginPage setToken={setToken} setUsername={setUsername} username={username}/>} />
        <Route path="/profile" element={ token ? <ProfilePage token={token}/> : <LoginPage setToken={setToken} setUsername={setUsername} username={username}/> } />
        <Route path="/trips/:tripId/edit" element={ token ? <TripEditView /> : <LoginPage setToken={setToken} setUsername={setUsername} username={username}/> } />
        <Route path="/trips/:tripId/rank"element={ token ? <TripRankingPage /> : <LoginPage setToken={setToken} setUsername={setUsername} username={username}/> } />
        <Route path="/trips/:tripId/result"element={ token ? <TripResultPage /> : <LoginPage setToken={setToken} setUsername={setUsername} username={username}/> } />
        <Route path="/mack" element={<Mack/>} />
      </Routes>
    </HashRouter>
  )
}

export default App
