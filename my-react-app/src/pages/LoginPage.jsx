import { useState } from "react"
import { useNavigate } from "react-router-dom";

function LoginPage({ setuserId, setUsername, username }) {
  const [usernameLocal, setUsernameLocal] = useState(username || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!usernameLocal || !password) {
      setError("Please fill in both fields");
      setSuccess("");
      return;
    }

    try {
      const response = await fetch("https://gruppe8.sccprak.netd.cs.tu-dresden.de/users/sign-in"

, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameLocal, password })
      });

      if (!response.ok) {
        let errMsg = `Login failed with status ${response.status}`;
        if (response.status === 401) {
          errMsg = "Invalid username or password. User may not exist.";
        } else {
          try {
            const data = await response.json();
            errMsg = data.error || data.msg || errMsg;
          } catch(e) {}
        }
        setError(errMsg);
        setSuccess("");
        return;
      }

      const data = await response.json();

      setError("");
      setSuccess("Logged in successfully!");

      localStorage.setItem("userId", data.id);
      localStorage.setItem("username", data.username);
      setuserId(data.id);
      setUsername(data.username); // update parent

      setTimeout(() => navigate("/"), 1500);

    } catch (err) {
      console.error(err);
      setError(err.message || "Server error. Try again later.");
      setSuccess("");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={usernameLocal}
        onChange={(e) => setUsernameLocal(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginPage;
