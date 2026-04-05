import { useState, useEffect, useRef, useCallback } from "react";

interface LocationEntry {
  lat: number;
  lng: number;
  timestamp: Date;
}

interface UseLocationTrackingOptions {
  intervalMinutes?: number;
  onLocationUpdate?: (entry: LocationEntry) => void; // send to your API
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
      (pos) => {
        const entry: LocationEntry = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: new Date(),
        };
        setLastLocation(entry);
        setError("");
        onLocationUpdate?.(entry); // 👈 send to your backend here
      },
      (err) => {
        setError("Location unavailable: " + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [onLocationUpdate]);

  const startTracking = useCallback(() => {
    if (isTracking) return;
    setIsTracking(true);

    // Capture immediately on check-in
    captureLocation();

    // Then every 5 minutes
    intervalRef.current = setInterval(() => {
      captureLocation();
    }, intervalMinutes * 60 * 1000);
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