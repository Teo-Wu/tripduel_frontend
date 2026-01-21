import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getNextMatch,
  submitWinner,
} from "../services/ranking/rankingApi";
import { getImageById } from "../services/ranking/imageApi";

export default function TripRankingPage({ userId }) {
  const navigate = useNavigate();
  const { tripId } = useParams();

  const [leftImage, setLeftImage] = useState(null);
  const [rightImage, setRightImage] = useState(null);
  const [comparisonId, setComparisonId] = useState(null);
  const [finished, setFinished] = useState(false);
  const [currentComparison, setCurrentComparison] = useState(1);
  const [totalComparisons, setTotalComparisons] = useState(0);
  const [leftImageId, setLeftImageId] = useState(null);
  const [rightImageId, setRightImageId] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        await loadNextMatch();
      } catch (err) {
        console.error("Failed to initialize ranking:", err);
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadNextMatch() {
  const match = await getNextMatch(tripId, userId);
  if (!match) {
    setFinished(true);
    return;
  }

  setComparisonId(match.id);
  setLeftImageId(match.leftImageId);
  setRightImageId(match.rightImageId);

  setLeftImage(await getImageById(match.leftImageId));
  setRightImage(await getImageById(match.rightImageId));
}


  async function vote(side) {
  if (!comparisonId) return;

  try {
    const winnerId = side === "left" ? leftImageId : rightImageId;
    console.log("winner ",{winnerId })
    await submitWinner(comparisonId, winnerId, userId);
    setCurrentComparison((prev) => prev + 1);
    await loadNextMatch();
  } catch (err) {
    console.error("Failed to submit winner:", err);
  }
}

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      {!finished && (
        <>
          {/* IMAGES */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              alignItems: "center",
            }}
          >
            <img
              src={leftImage}
              alt="left"
              onClick={() => vote("left")}
              style={{ cursor: "pointer", width: "100%", maxWidth: 300 }}
            />
            <img
              src={rightImage}
              alt="right"
              onClick={() => vote("right")}
              style={{ cursor: "pointer", width: "100%", maxWidth: 300 }}
            />
          </div>

          {/* HELP TEXT */}
          <p style={{ marginTop: 20 }}>Choose the image you prefer</p>

          {/* PROGRESS */}
          <p>
            Comparison {currentComparison} 
          </p>
        </>
      )}

      {finished && (
        <>
          <h2>Ranking finished</h2>
          <button
            onClick={() => navigate(`/trips/${tripId}/result`)}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            See Result
          </button>
        </>
      )}
    </div>
  );
}
