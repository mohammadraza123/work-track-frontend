import { useState, useEffect, useRef, useCallback } from "react";

interface LocationEntry {
  lat: number;
  lng: number;
  timestamp: Date;
  locationName?: string;
}

interface UseLocationTrackingOptions {
  intervalMinutes?: number;
  onLocationUpdate?: (entry: LocationEntry) => void; // send to your API
}

// Get location name from coordinates using Nominatim
async function getLocationName(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    );
    const data = await response.json();
    console.log("check data>>>", data);
    // Return city/town/village or full address
    return (
      data?.display_name ||
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.county ||
      "Location"
    );
  } catch (error) {
    console.error("Failed to get location name:", error);
    return "Unknown Location";
  }
}

export function useLocationTracking({
  intervalMinutes = 5,
  onLocationUpdate,
}: UseLocationTrackingOptions = {}) {
  const [isTracking, setIsTracking] = useState(false);
  const [lastLocation, setLastLocation] = useState<LocationEntry | null>(null);
  const [error, setError] = useState<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const captureLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const entry: LocationEntry = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: new Date(),
        };

        // Get location name
        const locationName = await getLocationName(entry.lat, entry.lng);
        entry.locationName = locationName;

        console.log("📍 Location Captured (Client):", {
          name: locationName,
          latitude: entry.lat,
          longitude: entry.lng,
          timestamp: entry.timestamp.toLocaleString(),
        });

        setLastLocation(entry);
        setError("");
        onLocationUpdate?.(entry); // 👈 send to your backend here
      },
      (err) => {
        setError("Location unavailable: " + err.message);
        console.error("❌ Location Error:", err.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }, [onLocationUpdate]);

  const startTracking = useCallback(() => {
    if (isTracking) return;
    setIsTracking(true);

    // Capture immediately on check-in
    captureLocation();

    // Then every 5 minutes
    intervalRef.current = setInterval(
      () => {
        captureLocation();
      },
      intervalMinutes * 60 * 1000,
    );
  }, [isTracking, captureLocation, intervalMinutes]);

  const stopTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsTracking(false);
  }, []);

  // Auto-cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { isTracking, lastLocation, error, startTracking, stopTracking };
}
