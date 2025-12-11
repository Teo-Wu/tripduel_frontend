import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password) {
      setError("Please fill in both fields");
      setSuccess("");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setError("");
        setSuccess("Registered successfully! You can now log in.");
        // Optionally redirect to login page
        setTimeout(() => navigate("/login"), 1500);
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
      <h1>Register</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <button onClick={handleRegister}>Register</button>
    </div>
    </>
  );
}

export default RegisterPage;
