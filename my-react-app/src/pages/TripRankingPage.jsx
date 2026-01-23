import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getNextMatch, submitWinner } from "../services/ranking/rankingApi";
import { getImageById } from "../services/ranking/imageApi";

export default function TripRankingPage({ userId }) {
  const navigate = useNavigate();
  const { tripId } = useParams();

  const [leftImage, setLeftImage] = useState(null);
  const [rightImage, setRightImage] = useState(null);
  const [comparisonId, setComparisonId] = useState(null);
  const [finished, setFinished] = useState(false);
  const [currentComparison, setCurrentComparison] = useState(1);
  const [noImgUploaded, setNoImgUploaded] = useState(false);

  useEffect(() => {
    loadNextMatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadNextMatch() {
    try {
      const match = await getNextMatch(tripId, userId);

      if (!match) {
        setNoImgUploaded(currentComparison === 1);
        setFinished(true);
        return;
      }

      setComparisonId(match.id);
      setLeftImage(await getImageById(match.leftImageId));
      setRightImage(await getImageById(match.rightImageId));
    } catch (err) {
      console.error("Error loading next match:", err);
    }
  }

  async function vote(side) {
    if (!comparisonId) return;
    console.log("voted for sides:",side);
    console.log("leftimageId",leftImageId);
    console.log("leftimage",leftImage);
    console.log("rightimageId",rightImageId);
    console.log("rightimage",rightImage);
    try {
      const winnerId =
        side === "left" ? leftImage: rightImage;

      await submitWinner(comparisonId, winnerId, userId);
      console.log("voting for", winnerId);

      setCurrentComparison((prev) => prev + 1);
      await loadNextMatch();
    } catch (err) {
      console.error("Failed to submit winner:", err);
    }
  }

  return (
    <div style={{ textAlign: "center", padding: 20, maxWidth: 600, margin: "0 auto" }}>
      {!finished && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <img
              src={leftImage}
              alt="left"
              onClick={() => vote("left")}
              style={{ cursor: "pointer", maxWidth: 300 }}
            />
            <img
              src={rightImage}
              alt="right"
              onClick={() => vote("right")}
              style={{ cursor: "pointer", maxWidth: 300 }}
            />
          </div>

          <p>Choose the image you prefer</p>
          <p>Comparison {currentComparison}</p>
        </>
      )}

      {finished && (
        <>
          {noImgUploaded ? (
            <h2>No images to compare</h2>
          ) : (
            <h2>Ranking finished 🎉</h2>
          )}

          <button
            onClick={() => navigate(`/trips/${tripId}/result`)}
            style={{ padding: "10px 20px", fontSize: 16 }}
          >
            See Result
          </button>
        </>
      )}
    </div>
  );
}
