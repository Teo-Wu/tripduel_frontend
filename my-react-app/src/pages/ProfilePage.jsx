import { useEffect, useState } from "react";

function ProfilePage({userId}) {
  const [user, setUser] = useState({});

  // 1. This check is outside useEffect: controls rendering
  if (!userId) return <p>Please login to see your profile</p>;

  useEffect(() => {
    // 2. This check is inside useEffect: prevents fetch if id somehow doesn't exist inbetween
    if (!userId) return;

    // 3. Fetch user profile from backend
    fetch(`https://gruppe8.sccprak.netd.cs.tu-dresden.de/users/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then(data => setUser(data))  // set user state
      .catch(err => console.error(err));
  }, [userId]);

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
