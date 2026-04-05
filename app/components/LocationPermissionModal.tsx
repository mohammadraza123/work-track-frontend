"use client";
import { useState } from "react";
import { useLocationPermission } from "../hooks/useLocationPermission";

export function LocationPermissionModal() {
  const { status, requestLocation } = useLocationPermission();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (status === "granted" || status === "checking") return null;

  const handleAllow = async () => {
    setLoading(true);
    setError("");
    try {
      await requestLocation();
    } catch (err: any) {
      if (err?.code === 1) {
        setError("Location blocked. Enable it in your phone settings, then reload.");
      } else {
        setError("Couldn't get location. Check your signal and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      // Respect iOS notch / home bar
      paddingTop: "env(safe-area-inset-top)",
      paddingBottom: "env(safe-area-inset-bottom)",
      paddingLeft: "env(safe-area-inset-left)",
      paddingRight: "env(safe-area-inset-right)",
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      // Prevent background scroll on mobile
      touchAction: "none",
      WebkitOverflowScrolling: "touch",
    }}>
      <div style={{
        background: "white",
        borderRadius: "20px",
        padding: "2rem 1.5rem",
        maxWidth: "340px",
        width: "calc(100% - 2rem)",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "52px", marginBottom: "0.75rem" }}>📍</div>

        <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.2rem", fontWeight: 600, color: "#111" }}>
          Location Required
        </h2>

        <p style={{ color: "#555", fontSize: "0.9rem", lineHeight: 1.6, margin: "0 0 1.25rem" }}>
          This app needs your location to work. You must allow location access before signing in.
        </p>

        {error && (
          <div style={{
            background: "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: "8px",
            padding: "0.75rem",
            marginBottom: "1rem",
            fontSize: "0.85rem",
            color: "#dc2626",
          }}>
            {error}
            {/* Show platform-specific instructions when fully blocked */}
            {status === "denied" && (
              <p style={{ marginTop: "0.5rem", color: "#7f1d1d" }}>
                📱 <strong>iPhone:</strong> Settings → Privacy → Location Services → [Your App] → While Using<br/>
                🤖 <strong>Android:</strong> Settings → Apps → [Your App] → Permissions → Location
              </p>
            )}
          </div>
        )}

        {status === "denied" && !error ? (
          // Already hard-blocked — guide to settings
          <div>
            <p style={{ color: "#dc2626", fontSize: "0.85rem", marginBottom: "1rem" }}>
              Location is blocked. Please enable it in your device settings.
            </p>
            <p style={{ fontSize: "0.8rem", color: "#555", marginBottom: "1rem" }}>
              📱 <strong>iPhone:</strong> Settings → Privacy → Location Services<br/>
              🤖 <strong>Android:</strong> Settings → Apps → Permissions → Location
            </p>
            <button onClick={() => window.location.reload()} style={btnStyle()}>
              I've enabled it — Reload
            </button>
          </div>
        ) : (
          // Prompt state — ask for permission
          <button
            onClick={handleAllow}
            disabled={loading}
            style={btnStyle(loading)}
          >
            {loading ? "Getting location…" : "Allow Location Access"}
          </button>
        )}
      </div>
    </div>
  );
}

function btnStyle(disabled = false) {
  return {
    background: disabled ? "#93c5fd" : "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "0.85rem 1.5rem",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    width: "100%",
    // Larger tap target for mobile (minimum 44px Apple HIG)
    minHeight: "48px",
    WebkitTapHighlightColor: "transparent",
  };
}