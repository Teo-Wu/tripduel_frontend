import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  createTrip,
  joinTrip,
  getMyTrips,
  deleteTrip,
} from "../services/tripsService";
import { getRankingResult } from "../services/ranking/rankingApi";
import "../css/MyTripsPage.css";

function MyTripsPage({ userId }) {
  const [trips, setTrips] = useState([]);
  const [tripName, setTripName] = useState("");
  const [tripId, setTripId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const navigate = useNavigate();

  // Load trips and determine status
  const loadTrips = async () => {
    try {
      const data = await getMyTrips(userId);

      const tripsWithStatus = await Promise.all(
       data.map(async (trip) => {
          // Fetch images for this trip
          const imagesRes = await fetch(`/api/images?trip=${trip.id}`);
          const images = await imagesRes.json();
          const imageCount = images.length;

          if (imageCount <= 1) return { ...trip, status: "notReady" };


          // Check if ranking is finished
          try {
            const result = await getRankingResult(trip.id, userId);
            if (result && result.length > 0) {
              return { ...trip, status: "finished" };
            } else {
              return { ...trip, status: "ready" };
            }
          } catch {
            // If backend throws error, assume ranking not yet started
            return { ...trip, status: "ready" };
          }
        })
      );

      setTrips(tripsWithStatus);
    } catch (err) {
      console.error("Failed to load trips:", err);
      setMessage("Failed to load trips");
    }
  };

  useEffect(() => {
    if (userId) loadTrips();
  }, [userId]);

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
    if (
      trips.some(
        (t) => t.name.toLowerCase() === tripName.trim().toLowerCase()
      )
    ) {
      setMessage("Trip name already exists");
      return;
    }
    await createTrip(tripName.trim(), userId);
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
      await joinTrip(tripId.trim(), userId);
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

              {/* Rank button enabled only if ready */}
              <button
                onClick={() => navigate(`/trips/${trip.id}/rank`)}
                disabled={trip.status === "notReady" }
              >
                Rank
              </button>

              {/* Result button enabled only if finished */}
              <button
                onClick={() => navigate(`/trips/${trip.id}/result`)}
                disabled={trip.status !== "finished"}
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
                <button onClick={() => navigator.clipboard.writeText(trip.id)}>
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

            {/* STATUS TEXT */}
            {trip.status === "notReady" && (
              <p className="status-text">Add images to enable ranking</p>
            )}
            {trip.status === "ready" && <p className="status-text">Ready to rank</p>}
            {trip.status === "finished" && <p className="status-text">Ranked</p>}
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
