import { useState } from 'react'
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ProfilePage from './pages/ProfilePage';
import { BrowserRouter, Routes, Route, Link} from "react-router-dom"
import "./App.css"

function App() {
  // access localstorage, otherwise after reload->all state reset-> token not initialized
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");

return (
  <BrowserRouter>
  <nav className="navbar">
  <div className="nav-left">
    <Link to="/">Home</Link>
    { !token && <Link to="/register">Register</Link> }
    { !token && <Link to="/login">Login</Link> }
    { token && <Link to="/profile">Profile</Link> }
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
      <Route path="/"element= {<HomePage/>} />
      <Route path="/register"element= {<RegisterPage/>} />   
      // token/setToken are passed as prop
      // so if App updates token via setToken, ProfilePage immediately receives new token
      <Route path="/login"element= {<LoginPage setToken={setToken} setUsername={setUsername} username={username}/>} />  
      <Route path="/profile"element={ token ? <ProfilePage token={token}/> : <LoginPage setToken={setToken}/> } />

    </Routes>
  </BrowserRouter>
)
}

export default App
