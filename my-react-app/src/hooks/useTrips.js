import { useEffect, useState } from "react";
import * as tripsApi from "../services/tripsService";

export function useTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  

  const loadTrips = async () => {
    setLoading(true);
    const data = await tripsApi.getMyTrips();
    setTrips(data);
    setLoading(false);
  };

  const createTrip = async (name) => {
    await tripsApi.createTrip(name);
    loadTrips();
  };

  const joinTrip = async (tripId) => {
    await tripsApi.joinTrip(tripId);
    loadTrips();
  };

  useEffect(() => {
    loadTrips();
  }, []);

  return {
    trips,
    loading,
    createTrip,
    joinTrip,
  };
}
