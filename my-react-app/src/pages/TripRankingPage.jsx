import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getNextMatch,
  submitWinner,
  resetRanking,
  TOTAL_COMPARISONS,
} from "../services/ranking/rankingApi";
import { getImageById } from "../services/ranking/imageApi";

export default function TripRankingPage(tripId) {
  const navigate = useNavigate();

  const [leftImage, setLeftImage] = useState(null);
  const [rightImage, setRightImage] = useState(null);
  const [finished, setFinished] = useState(false);
  const [currentComparison, setCurrentComparison] = useState(1);

  useEffect(() => {
    resetRanking();
    localStorage.removeItem("winners");
    loadNextMatch();
  }, []);

  function loadNextMatch() {
    getNextMatch().then((match) => {
      if (!match) {
        setFinished(true);
        return;
      }

      getImageById(match.leftImageId).then(setLeftImage);
      getImageById(match.rightImageId).then(setRightImage);
    });
  }

  function vote(winnerId) {
    submitWinner(winnerId).then(() => {
      setCurrentComparison((prev) => prev + 1);
      loadNextMatch();
    });
  }

  return (
    <div style={{ textAlign: "center" }}>
      {/* TITLE */}
      <h1>Trip Ranking</h1>

      {!finished && (
        <>
          {/* IMAGES */}
          <div style={{ display: "flex", gap: 40, justifyContent: "center" }}>
            <img
              src={leftImage}
              alt="left"
              onClick={() => vote("left")}
              style={{ cursor: "pointer", width: 300 }}
            />
            <img
              src={rightImage}
              alt="right"
              onClick={() => vote("right")}
              style={{ cursor: "pointer", width: 300 }}
            />
          </div>

          {/* HELP TEXT */}
          <p style={{ marginTop: 20 }}>
            Choose the image you prefer
          </p>

          {/* PROGRESS */}
          <p>
            Comparison {currentComparison} / {TOTAL_COMPARISONS}
          </p>
        </>
      )}

      {finished && (
        <>
          <h2>Ranking finished 🎉</h2>

          <button onClick={() => navigate(`/trips/${tripId}/result`)}>
            See Result
          </button>
        </>
      )}
    </div>
  );
}
