import { useEffect, useState } from "react";
import { getRankingResult } from "../services/ranking/rankingApi";
import { listProperties } from "../services/property/propertyService";
import { getTripById } from "../services/tripsService";
import { useParams } from "react-router-dom";

export default function TripResultPage({ userId, username }) {
  const [results, setResults] = useState([]);
  const [tripName, setTripName] = useState("");
  const [loading, setLoading] = useState(true);
  const { tripId } = useParams();

  useEffect(() => {
    async function fetchRankingData() {
      if (!tripId) return;

      try {
        // Get trip name
        const trip = await getTripById(tripId);
        setTripName(trip.name);

        // Get ranked property IDs
        const propertyIds = await getRankingResult(tripId, userId);
        console.log("Ranking IDs:", propertyIds);

        // Get all properties for this trip
        const allProps = await listProperties(tripId);
        console.log("All properties:", allProps);

        // Map IDs to names
        const rankedProperties = propertyIds
          .map(id => allProps.find(p => p.id === id))
          .filter(Boolean)
          .map(p => p.name);

        console.log("Ranked property names:", rankedProperties);
        setResults(rankedProperties);
      } catch (err) {
        console.error("Failed to load ranking data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRankingData();
  }, [tripId, userId]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div style={{ textAlign: "center" }}>
      <h2>{tripName} ranked by user {username}</h2>
      <div style={{ width: 300, margin: "40px auto", border: "1px solid #333" }}>
        {results.map((name, index) => (
          <div key={index} style={{ padding: 10, borderTop: "1px solid #333", background: "#eee" }}>
            {index + 1}. {name}
          </div>
        ))}
      </div>
    </div>
  );
}
