import { useState } from 'react'
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyTripsPage from "./pages/MyTripsPage";
import ProfilePage from './pages/ProfilePage';
import TripEditView from "./pages/TripEditView";

import { BrowserRouter, Routes, Route, Link} from "react-router-dom"
import "./App.css"

function App() {
  // access localstorage, otherwise after reload->all state reset-> token not initialized
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");

return (
  <BrowserRouter basename="/tripduel_frontend">
  <nav className="navbar">
  <div className="nav-left">

    { !token && <Link to="/register">Register</Link> }
    { !token && <Link to="/login">Login</Link> }
    { token && <Link to="/profile">Profile</Link> }
    { token && <Link to="/mytrips">MyTrips</Link> } 
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
      <Route path="/mytrips"element= {token ? <MyTripsPage/> :<LoginPage setToken={setToken} setUsername={setUsername} username={username}/>} />
      <Route path="/register"element= {<RegisterPage/>} />   
      // token/setToken are passed as prop
      // so if App updates token via setToken, ProfilePage immediately receives new token
      <Route path="/login"element= {<LoginPage setToken={setToken} setUsername={setUsername} username={username}/>} />  
      <Route path="/profile"element={ token ? <ProfilePage token={token}/> :<LoginPage setToken={setToken} setUsername={setUsername} username={username}/> } />
      <Route path="/trips/:tripId/edit"  element={
    token ? (
      <TripEditView />
    ) : (
      <LoginPage
        setToken={setToken}
        setUsername={setUsername}
        username={username}
      />
    )
  } />
    </Routes>
  </BrowserRouter>
)
}

export default App
