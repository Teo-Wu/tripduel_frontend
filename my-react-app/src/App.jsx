import { useState } from 'react'
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import { BrowserRouter, Routes, Route, Link} from "react-router-dom"
import "./App.css"

function App() {
return (
  <BrowserRouter>
    <nav>
    <Link to="/">Home</Link>
    <Link to="/login">Login</Link>
    </nav>
    <Routes>
      <Route path="/"element= {<HomePage/>} />
      <Route path="/login"element= {<LoginPage/>} />    
    </Routes>
  </BrowserRouter>
)
}

export default App
