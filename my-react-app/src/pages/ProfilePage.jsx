import { useEffect, useState } from "react";

function ProfilePage({ token }) {
  const [user, setUser] = useState({});
  const storedToken = token;

  // 1. This check is outside useEffect: controls rendering
  if (!storedToken) return <p>Please login to see your profile</p>;

  useEffect(() => {
    // 2. This check is inside useEffect: prevents fetch if token somehow doesn't exist inbetween
    if (!storedToken) return;

    // 3. Fetch user profile from backend
    fetch("https://backend-user-tripduel.onrender.com/api/users/profile", {
      headers: { Authorization: `Bearer ${storedToken}` }
    })
      .then(res => res.json())
      .then(data => setUser(data))  // set user state
      .catch(err => console.error(err));
  }, [storedToken]);

  // 4. This check is outside useEffect: show loading state while data hasn't arrived
  if (!user.username) return <p>Loading profile...</p>;

  // 5. Render profile once user data is available
  return (
    <div>
      <h2>Profile</h2>
      <p>User ID: {user.id}</p>
      <p>Username: {user.username}</p>

    </div>
  );
}

export default ProfilePage;
