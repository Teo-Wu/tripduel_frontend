import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  createTrip,
  joinTrip,
  getMyTrips,
  deleteTrip,
} from "../services/tripsService"; // adjust path
import "../css/MyTripsPage.css";

function MyTripsPage() {
  const [trips, setTrips] = useState([]);
  const [tripName, setTripName] = useState("");
  const [tripId, setTripId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Load my trips from mock backend
  const loadTrips = async () => {
    const data = await getMyTrips();
    setTrips(data);
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const filteredTrips = useMemo(() => {
    return trips.filter((t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [trips, searchTerm]);

  const handleCreateTrip = async () => {
    if (!tripName) return;
    await createTrip(tripName);
    setTripName("");
    setMessage("Trip created");
    loadTrips();
  };

  const handleJoinTrip = async () => {
    if (!tripId) return;
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
    loadTrips();
  };

  // Auto-clear message
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div className="page-container">
      <h2>My Trips</h2>
      <input
        className="search-input"
        placeholder="Search trips..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="trip-list">
        {filteredTrips.length === 0 && <p>No trips found</p>}
        {filteredTrips.map((trip) => (
          <div key={trip.id} className="trip-card">
            <strong>{trip.name}</strong>
            <div className="trip-actions">
              <button onClick={() => navigate(`/trips/${trip.id}/edit`)}>
                Edit
              </button>
              <button onClick={() => navigate(`/trips/${trip.id}/rank`)}>
                Rank
              </button>
              <button onClick={() => navigate(`/trips/${trip.id}/result`)}>
                Result
              </button>
              <button onClick={() => navigator.clipboard.writeText(trip.id)}>
                Copy ID
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteTrip(trip.id)}
              >
                x
              </button>
            </div>
          </div>
        ))}
      </div>

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

      {message && (
        <p
          className={`message ${
            message.includes("success") || message.includes("created")
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
