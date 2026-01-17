import { useState, useEffect } from "react";
import { useTrips } from "../hooks/useTrips";
import { useNavigate } from "react-router-dom";
import "../css/MyTripsPage.css";

function MyTripsPage() {
  const { trips, createTrip, joinTrip,error} = useTrips();
  const [tripName, setTripName] = useState("");
  const [tripId, setTripId] = useState("");
  const [message, setMessage] = useState(""); // <-- shared message for all cases
  const navigate = useNavigate();

  const handleJoinTrip = async () => {
    // 1️⃣ Check if already joined
    if (trips.some((t) => t.id === tripId)) {
      setMessage("Already joined");
      return;
    }

    try {
      await joinTrip(tripId);
      setMessage("Joined successfully"); // 3️⃣ success
      setTripId("");
    } catch (err) {
      setMessage(err); // 2️⃣ trip not found (or any service error)
    }
    
  };
    // Auto-clear message after 3 seconds
  useEffect(() => {
    if (!message) return; // do nothing if no message

    const timer = setTimeout(() => {
      setMessage(""); // clear message
    }, 1000); // 3000ms = 3 seconds

    return () => clearTimeout(timer); // cleanup if message changes
  }, [message]);
  return (
    <div className="page-container">
      {/* My Trips */}
      <div className="trips-section">
        <h2>My Trips</h2>

        <div className="trip-list">
          {trips.length === 0 && <p>No trips yet</p>}

          {trips.map((trip) => (
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
                <button
                onClick={() => navigator.clipboard.writeText(trip.id)}
            >
            Copy ID
            </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="actions-section">
        <div className="action-box">
          <input
            placeholder="Enter Trip Name"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
          />
          <button
            className="primary"
            onClick={() => {
              createTrip(tripName);
              setTripName("");
            }}
          >
            Create Trip
          </button>
        </div>

        <div className="action-box">
          <input
            placeholder="Enter Trip ID"
            value={tripId}
            onChange={(e) => setTripId(e.target.value)}
          />
          <button
            className="primary"
            onClick={() => {
              handleJoinTrip();
              joinTrip(tripId);
              setTripId("");
            }}
          >
            Join Trip
          </button>
        </div>
      </div>
         {/* Message display */}
        {message && (
          <p
            style={{
              color:
                message === "Joined successfully"
                  ? "green"
                  : "red",
              marginTop: "8px",
            }}
          >
            {message}
          </p>
        )}
    </div>
  );
}

export default MyTripsPage;
