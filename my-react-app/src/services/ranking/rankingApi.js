
export async function getNextMatch(tripId, userId) {
  const res = await fetch(`http://gruppe8.sccprak.netd.cs.tu-dresden.de/matches/next?trip=${tripId}`, {
    headers: {
      "UserID": userId
    }
  });

  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.id) return null;

  return {
    id: data.id,
    leftImageId: data.image1,
    rightImageId: data.image2
  };
}

export async function submitWinner(comparisonId, winnerId, userId) {
  const res = await fetch(`http://gruppe8.sccprak.netd.cs.tu-dresden.de/matches/next/${comparisonId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "UserID": userId
    },
    body: JSON.stringify({ winner: winnerId })
  });

  if (!res.ok) throw new Error("Failed to submit winner");
  return true;
}

export async function getRankingResult(tripId, userId) {
  const res = await fetch(`http://gruppe8.sccprak.netd.cs.tu-dresden.de/matches/result?trip=${tripId}`, {
    headers: { "UserID": userId }
  });
  if (!res.ok) throw new Error("Failed to fetch ranking");
  const data = await res.json();
  return data.propertyIds; // array of ranked property UUIDs
}
