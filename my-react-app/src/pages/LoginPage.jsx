import { useState } from "react"
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]=useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password){
      setError("please fill in both fields");
      setSuccess("");
      return; 
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username,password })
      });
      const data = await response.json();

      if (response.ok) {
        setError("");
        setSuccess("Logged in successfully!");
        // Optionally redirect to another page
        setTimeout(() => navigate("/"), 1000);

      } else {
        setError(data.error || data.msg || "Registration failed");
        setSuccess("");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
      setSuccess("");
    }  
  };

  return (
    <>
      <div> 
        <h1>Login</h1>
        <div>
          <input type = "text" placeholder = "Username" 
          value = {username} onChange = {(e) => setUsername(e.target.value)}>
          </input>
        </div>
        <input type = "password" placeholder = "Password" 
          value = {password} onChange = {(e) => setPassword(e.target.value)}>
          </input>
        {error && <p style={{ color: "red" }}> {error} </p> }
        {success && <p style={{ color: "green" }}> {success} </p> }
        <button onClick = {handleLogin}> Login </button>
      </div>
    </>
  )
}

export default LoginPage
