const BASE_URL = '/api/trips'; // proxy to real backend

export async function getTripById(tripId) {
  const res = await fetch(`/api/trips/${tripId}`);
  if (!res.ok) throw new Error("Failed to fetch trip");
  return res.json(); // returns { id, name }
}

export async function createTrip(name, userId) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-ID': userId,
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    throw new Error(`Failed to create trip: ${res.statusText}`);
  }

  const trip = await res.json();
  return trip;
}

export async function joinTrip(tripId, userId) {
  const res = await fetch(`${BASE_URL}/${tripId}/join`, {
    method: 'POST',
    headers: {
      'X-User-ID': userId,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to join trip: ${res.statusText}`);
  }

  const trip = await res.json();
  return trip;
}

export async function leaveTrip(tripId, userId) {
  const res = await fetch(`${BASE_URL}/${tripId}/join`, {
    method: 'DELETE',
    headers: {
      'X-User-ID': userId,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to leave trip: ${res.statusText}`);
  }

  const trip = await res.json();
  return trip;
}

export async function getMyTrips(userId) {
  const res = await fetch(BASE_URL, {
    method: 'GET',
    headers: {
      'X-User-ID': userId,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch trips: ${res.statusText}`);
  }

  const trips = await res.json();
  return trips;
}

export async function deleteTrip(tripId) {
  const res = await fetch(`${BASE_URL}/${tripId}`, {
    method: 'DELETE',
  });

  if (!res.ok && res.status !== 204) {
    throw new Error(`Failed to delete trip: ${res.statusText}`);
  }
}
