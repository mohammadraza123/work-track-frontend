import { useState, useEffect } from "react";

export type LocationStatus = "idle" | "granted" | "denied" | "prompt" | "checking";

export function useLocationPermission() {
  const [status, setStatus] = useState<LocationStatus>("checking");

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }

    // Safari iOS doesn't support permissions.query — fallback to "prompt"
    if (!navigator.permissions) {
      setStatus("prompt");
      return;
    }

    navigator.permissions
      .query({ name: "geolocation" })
      .then((result) => {
        setStatus(result.state as LocationStatus);
        result.onchange = () => setStatus(result.state as LocationStatus);
      })
      .catch(() => {
        // Safari throws on unsupported permission names
        setStatus("prompt");
      });
  }, []);

  const requestLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setStatus("granted");
          resolve(pos);
        },
        (err) => {
          // err.code 1 = permission denied, 2 = unavailable, 3 = timeout
          if (err.code === 1) setStatus("denied");
          reject(err);
        },
        {
          enableHighAccuracy: true,   // important for mobile GPS
          timeout: 10000,
          maximumAge: 300000,         // cache for 5 mins — saves battery
        }
      );
    });
  };

  return { status, requestLocation };
}