import { useEffect, useState } from "react";
import { getRankingResult } from "../services/ranking/resultApi";
import { getPropertyNameById } from "../services/ranking/propertyApi";

export default function TripResultPage(tripId) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    getRankingResult().then(async (ids) => {
      const names = await Promise.all(
        ids.map((id) => getPropertyNameById(id))
      );

      setResults(names);
    });
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: 300,
          margin: "40px auto",
          border: "1px solid #333",
        }}
      >
        <div
          style={{
            background: "#777",
            color: "white",
            padding: 10,
            fontWeight: "bold",
          }}
        >
          Ski Trip
        </div>

        {results.map((name, index) => (
          <div
            key={name}
            style={{
              padding: 10,
              borderTop: "1px solid #333",
              background: "#eee",
            }}
          >
            {index + 1}. {name}
          </div>
        ))}
      </div>
    </div>
  );
}
