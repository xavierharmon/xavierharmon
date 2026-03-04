// src/hooks/useRouteDrawer.js
import { useCallback } from "react";
import { getStoredRoute, storeRoute } from "@/utils/routeStorage";
import { STOP_COLORS } from "@/constants";

export function useRouteDrawer() {

  const drawStoredRoute = useCallback((map, encodedPolyline, color = STOP_COLORS.STOP) => {
    if (!window.google?.maps?.geometry || !encodedPolyline) return null;

    const path = window.google.maps.geometry.encoding.decodePath(encodedPolyline);

    const polyline = new window.google.maps.Polyline({
      path,
      geodesic:      true,
      strokeColor:   color,
      strokeOpacity: 0.85,
      strokeWeight:  4,
      map,
    });

    return polyline;
  }, []);

  const fetchAndDrawRoute = useCallback((map, stops, color = STOP_COLORS.STOP) => {
    return new Promise((resolve, reject) => {
      if (!window.google) return reject(new Error("Google Maps not loaded"));

      const validStops = stops.filter(s => s?.lat && s?.lng);
      if (validStops.length < 2) return resolve(null);

      // Check localStorage cache first
      const stored = getStoredRoute(validStops);
      if (stored) {
        console.log("[useRouteDrawer] Drawing from cache");
        const polyline = drawStoredRoute(map, stored, color);
        return resolve({ polyline, fromCache: true });
      }

      // Not cached — call Directions API once and store the result
      console.log("[useRouteDrawer] Fetching from Directions API");

      new window.google.maps.DirectionsService().route({
        origin: {
          lat: validStops[0].lat,
          lng: validStops[0].lng,
        },
        destination: {
          lat: validStops[validStops.length - 1].lat,
          lng: validStops[validStops.length - 1].lng,
        },
        waypoints: validStops.slice(1, -1).map(s => ({
          location: { lat: s.lat, lng: s.lng },
          stopover: true,
        })),
        travelMode: window.google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status !== "OK") {
          return reject(new Error(`Directions API returned: ${status}`));
        }

        // Extract and store the encoded polyline
        const encodedPolyline = result.routes[0].overview_polyline.points;
        storeRoute(validStops, encodedPolyline);

        const polyline = drawStoredRoute(map, encodedPolyline, color);
        resolve({ polyline, fromCache: false });
      });
    });
  }, [drawStoredRoute]);

  return { fetchAndDrawRoute, drawStoredRoute };
}