import { useState } from 'react'
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import { BrowserRouter, Routes, Route, Link} from "react-router-dom"
import "./App.css"

function App() {
return (
  <BrowserRouter>
    <nav>
    <Link to="/">Home</Link>
    <Link to="/register">Register</Link>
    <Link to="/login">Login</Link>
    </nav>
    <Routes>
      <Route path="/"element= {<HomePage/>} />
      <Route path="/register"element= {<RegisterPage/>} />   
      <Route path="/login"element= {<LoginPage/>} />  
    </Routes>
  </BrowserRouter>
)
}

export default App
