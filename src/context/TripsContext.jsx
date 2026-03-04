import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loadTrips, saveTrips } from "@/utils/storage";
import { generateId } from "@/utils/imageHelpers";

const TripsContext = createContext(null);

export function TripsProvider({ children }) {
  const [trips, setTrips]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    try {
      setTrips(loadTrips());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = useCallback((updated) => {
    try {
      saveTrips(updated);
      setTrips(updated);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const addTrip = useCallback((tripData) => {
    const trip = { ...tripData, id: generateId() };
    persist([...trips, trip]);
    return trip;
  }, [trips, persist]);

  const updateTrip = useCallback((updatedTrip) => {
    persist(trips.map(t => t.id === updatedTrip.id ? updatedTrip : t));
  }, [trips, persist]);

  const deleteTrip = useCallback((id) => {
    persist(trips.filter(t => t.id !== id));
  }, [trips, persist]);

  const createBlankTrip = useCallback(() => ({
    id:          null,
    name:        "",
    date:        new Date().toISOString().slice(0, 10),
    description: "",
    photos:      [],
    origin:      null,
    destination: null,
    stops:       [],
  }), []);

  return (
    <TripsContext.Provider value={{
      trips,
      loading,
      error,
      addTrip,
      updateTrip,
      deleteTrip,
      createBlankTrip,
    }}>
      {children}
    </TripsContext.Provider>
  );
}

export function useTrips() {
  const ctx = useContext(TripsContext);
  if (!ctx) throw new Error("useTrips must be used inside <TripsProvider>");
  return ctx;
}