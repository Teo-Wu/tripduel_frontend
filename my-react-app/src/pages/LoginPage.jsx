import { useState } from 'react'

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [error, setError]=useState("");
  
  const handleLogin = () => {
    if (!username || !password){
      setError("please fill in both fields");
    }
    if (username === "dm1" && password === "pwd1") {
      setError("");
      alert("login Successful!");
    }
    else {
      setError("Invalid username or password.")
    }
  }
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
        { error && <p> {error} </p> }
        <button onClick = {handleLogin}> Login </button>
      </div>
    </>
  )
}

export default LoginPage
