import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  createTrip,
  joinTrip,
  getMyTrips,
  deleteTrip,
} from "../services/tripsService";
import "../css/MyTripsPage.css";

function MyTripsPage() {
  const [trips, setTrips] = useState([]);
  const [tripName, setTripName] = useState("");
  const [tripId, setTripId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  const navigate = useNavigate();

  /* ---------------- LOAD TRIPS ---------------- */
  const loadTrips = async () => {
    const data = await getMyTrips();
    setTrips(data);
  };

  useEffect(() => {
    loadTrips();
  }, []);

  /* ---------------- SEARCH ---------------- */
  const filteredTrips = useMemo(() => {
    return trips.filter((t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [trips, searchTerm]);

  /* ---------------- ACTIONS ---------------- */
  const handleCreateTrip = async () => {
    if (!tripName.trim()) return;
    await createTrip(tripName);
    setTripName("");
    setMessage("Trip created");
    loadTrips();
  };

  const handleJoinTrip = async () => {
    if (!tripId.trim()) return;
    try {
      await joinTrip(tripId);
      setMessage("Joined successfully");
      setTripId("");
      loadTrips();
    } catch (err) {
      setMessage(err.toString());
    }
  };

  const handleDeleteTrip = async (id) => {
    if (!window.confirm("Delete this trip?")) return;
    await deleteTrip(id);
    setMessage("Trip deleted");
    setOpenMenu(null);
    loadTrips();
  };

  /* ---------------- MESSAGE AUTO CLEAR ---------------- */
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div className="page-container">
      <h2>My Trips</h2>

      {/* SEARCH */}
      <input
        className="search-input"
        placeholder="Search trips..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onBlur={() => setSearchTerm("")}
      />

      {/* TRIP LIST */}
      <div className="trip-list">
        {filteredTrips.length === 0 && <p>No trips found</p>}

        {filteredTrips.map((trip) => (
          <div key={trip.id} className="trip-card">
            <strong>{trip.name}</strong>

            {/* ACTION ROW */}
            <div className="trip-actions-row">
              <button
                className="primary-action"
                onClick={() => navigate(`/trips/${trip.id}/edit`)}
              >
                Edit
              </button>

              <button
                onClick={() => navigate(`/trips/${trip.id}/rank`)}
              >
                Rank
              </button>

              <button
                onClick={() => navigate(`/trips/${trip.id}/result`)}
              >
                Result
              </button>

              <button
                className="more-btn"
                onClick={() =>
                  setOpenMenu(openMenu === trip.id ? null : trip.id)
                }
              >
                ⋮
              </button>
            </div>

            {/* MORE MENU */}
            {openMenu === trip.id && (
              <div className="action-menu">
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(trip.id)
                  }
                >
                  Copy Trip ID
                </button>

                <button
                  className="danger"
                  onClick={() => handleDeleteTrip(trip.id)}
                >
                  Delete Trip
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CREATE / JOIN */}
      <div className="actions-section">
        <div className="action-box">
          <input
            placeholder="Enter Trip Name"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
          />
          <button className="primary" onClick={handleCreateTrip}>
            Create Trip
          </button>
        </div>

        <div className="action-box">
          <input
            placeholder="Enter Trip ID"
            value={tripId}
            onChange={(e) => setTripId(e.target.value)}
          />
          <button className="primary" onClick={handleJoinTrip}>
            Join Trip
          </button>
        </div>
      </div>

      {/* MESSAGE */}
      {message && (
        <p
          className={`message ${
            message.includes("created") ||
            message.includes("success")
              ? "success"
              : "error"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default MyTripsPage;
