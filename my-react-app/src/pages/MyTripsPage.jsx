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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const navigate = useNavigate();

  // Load trips
  const loadTrips = async () => {
    const data = await getMyTrips();
    setTrips(data);
  };

  useEffect(() => {
    loadTrips();
  }, []);

  // Filter trips
  const filteredTrips = useMemo(() => {
    return trips.filter((t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [trips, searchTerm]);

  // CREATE TRIP
  const handleCreateTrip = async () => {
    if (!tripName.trim()) {
      setMessage("Trip name cannot be empty");
      return;
    }
    if (trips.some((t) => t.name.toLowerCase() === tripName.trim().toLowerCase())) {
      setMessage("Trip name already exists");
      return;
    }
    await createTrip(tripName.trim());
    setTripName("");
    setShowCreateModal(false);
    setMessage("Trip created");
    loadTrips();
  };

  // JOIN TRIP
  const handleJoinTrip = async () => {
    if (!tripId.trim()) {
      setMessage("Trip ID cannot be empty");
      return;
    }
    if (trips.some((t) => t.id === tripId.trim())) {
      setMessage("You have already joined this trip");
      return;
    }
    try {
      await joinTrip(tripId.trim());
      setTripId("");
      setShowJoinModal(false);
      setMessage("Joined successfully");
      loadTrips();
    } catch (err) {
      setMessage(err.toString());
    }
  };

  // DELETE TRIP
  const handleDeleteTrip = async (id) => {
    if (!window.confirm("Delete this trip?")) return;
    await deleteTrip(id);
    setMessage("Trip deleted");
    setOpenMenu(null);
    loadTrips();
  };

  // Auto-hide message
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div className="page-container">
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
              <button onClick={() => navigate(`/trips/${trip.id}/rank`)}>
                Rank
              </button>
              <button onClick={() => navigate(`/trips/${trip.id}/result`)}>
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
                <button onClick={() => navigator.clipboard.writeText(trip.id)}>
                  Copy Trip ID
                </button>
                <button className="danger" onClick={() => handleDeleteTrip(trip.id)}>
                  Delete Trip
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CREATE / JOIN BUTTONS */}
      <div className="actions-section">
        <div className="action-box">
          <button className="primary" onClick={() => setShowCreateModal(true)}>
            + Add New Trip
          </button>
        </div>

        <div className="action-box">
          <button className="primary" onClick={() => setShowJoinModal(true)}>
            Join Trip
          </button>
        </div>
      </div>

      {/* MESSAGE */}
      {message && (
        <p
          className={`message ${
            message.includes("created") || message.includes("success")
              ? "success"
              : "error"
          }`}
        >
          {message}
        </p>
      )}

      {/* CREATE TRIP MODAL */}
      {showCreateModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h4>New Trip</h4>
            <input
              autoFocus
              placeholder="Enter trip name"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
            />
            <button onClick={handleCreateTrip}>Add Trip</button>
            <button className="cancel" onClick={() => setShowCreateModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* JOIN TRIP MODAL */}
      {showJoinModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h4>Join Trip</h4>
            <input
              autoFocus
              placeholder="Enter trip ID"
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
            />
            <button onClick={handleJoinTrip}>Join</button>
            <button className="cancel" onClick={() => setShowJoinModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyTripsPage;
