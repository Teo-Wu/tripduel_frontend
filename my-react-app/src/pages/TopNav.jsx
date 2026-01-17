import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/TopNav.css";

function TopNav({ username, onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Map routes to friendly titles
  const getTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/trips/") && path.endsWith("/edit")) return "Trip Edit";
    if (path.startsWith("/trips/") && path.endsWith("/rank")) return "Trip Ranking";
    if (path.startsWith("/trips/") && path.endsWith("/result")) return "Trip Result";
    if (path.startsWith("/profile")) return "Profile";
    if (path.startsWith("/mytrips") || path === "/") return "My Trips";
    return "App";
  };

  // ✅ Nested route safe active check
  const isActive = (path) => {
    if (path === "/mytrips") return location.pathname.startsWith("/mytrips") || location.pathname === "/";
    if (path === "/profile") return location.pathname.startsWith("/profile");
    return false;
  };

  return (
    <header className="top-nav">
      <span className="nav-title">{getTitle()}</span>

      <button className="menu-btn" onClick={() => setOpen(!open)}>
        ☰
      </button>

      {open && (
        <div className="menu" ref={menuRef}>
          <div className="menu-user">{username}</div>

          <button
            className={isActive("/mytrips") ? "active" : ""}
            onClick={() => {
              navigate("/mytrips");
              setOpen(false);
            }}
          >
            My Trips
          </button>

          <button
            className={isActive("/profile") ? "active" : ""}
            onClick={() => {
              navigate("/profile");
              setOpen(false);
            }}
          >
            Profile
          </button>

          <button className="danger" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default TopNav;
