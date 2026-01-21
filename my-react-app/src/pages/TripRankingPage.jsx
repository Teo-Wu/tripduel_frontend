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
  const no_img_uploaded=true;

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
    try {
      const match = await getNextMatch(tripId, userId);
      if (!match) {
        setFinished(true);
        return;
      }
      no_img_uploaded=false;
      setComparisonId(match.id);
      setLeftImage(await getImageById(match.leftImageId));
      setRightImage(await getImageById(match.rightImageId));
    } catch (err) {
      console.error("Error loading next match:", err);
    }
  }

  async function vote(side) {
    if (!comparisonId) return;

    try {
      const winnerId =
        side === "left"
          ? leftImage.split("/").pop() // assumes backend uses UUID in URL
          : rightImage.split("/").pop();

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
        {no_img_uploaded ? (<h2>No images to compare</h2>):(<h2>Ranking successfully 🎉</h2>)}
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
