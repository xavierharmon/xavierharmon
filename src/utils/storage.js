import { STORAGE_KEY } from "@/constants";

export function loadTrips() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("[storage] Failed to load trips:", err);
    return [];
  }
}

export function saveTrips(trips) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  } catch (err) {
    console.error("[storage] Failed to save trips:", err);
    throw new Error("Storage is full. Try removing some photos to free up space.");
  }
}

export function clearTrips() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("[storage] Failed to clear trips:", err);
  }
}