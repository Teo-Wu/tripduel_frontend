let round = 0;
export const TOTAL_COMPARISONS = 3;

const matches = [
  { leftImageId: "hotel-1", rightImageId: "hotel-2" },
  { leftImageId: "room-1", rightImageId: "room-2" },
  { leftImageId: "swim-1", rightImageId: "swim-2" },
];
export function resetRanking() {
  round = 0;
}
export function getNextMatch() {
  if (round >= matches.length) {
    return Promise.resolve(null);
  }

  const match = matches[round];
  round++;

  return Promise.resolve(match);
}

export function submitWinner(winnerImageId) {
  // pretend backend accepted it
  console.log("Winner:", winnerImageId);
  return Promise.resolve({ success: true });
}
