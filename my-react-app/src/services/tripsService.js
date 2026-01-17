let allTrips = [];
let myTrips = [];

export function createTrip(name) {
  const trip = {
    id: crypto.randomUUID(),
    name,
    status: "CREATED",
  };
  allTrips.push(trip);
  myTrips.push(trip);
  return Promise.resolve(trip);
}

export function joinTrip(tripId) {
  const trip = allTrips.find((t) => t.id === tripId);
  if (!trip) {
    return Promise.reject("Trip not found");
  }
  if (myTrips.some((t) => t.id === tripId)) {
    return Promise.reject("Already joined");
  }
  myTrips.push(trip);
  return Promise.resolve(trip);
}

export function getMyTrips() {
  return Promise.resolve([...myTrips]);
}


export function deleteTrip(tripId) {
  myTrips = myTrips.filter((t) => t.id !== tripId);
  allTrips = allTrips.filter((t) => t.id !== tripId);
  return Promise.resolve();
}
