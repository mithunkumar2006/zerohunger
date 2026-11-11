import React, { useEffect, useRef, useState } from "react";
import { loadGoogleMapsScript } from "../../utils/GoogleMapLoader";
import GoogleMapsSetupWarning from "./GoogleMapsSetupWarning";
import Loader from "../common/Loader";

// Sleek Slate-Dark theme styling for Google Maps (Stripe/Linear-like aesthetic)
const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#020617" }, { weight: 2 }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#94a3b8" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#475569" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#062f22" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#10b981" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#0f172a" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#475569" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#334155" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#020617" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#94a3b8" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#475569" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#082f49" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#38bdf8" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#082f49" }],
  },
];

export default function GoogleMap({
  center = { lat: 13.0827, lng: 80.2707 }, // default Chennai
  zoom = 13,
  markers = [], // array of { lat, lng, title, role, onClick, description }
  onMapClick,
  className = "w-full h-full",
  options = {},
}) {
  const mapRef = useRef(null);
  const googleMapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [mapsApi, setMapsApi] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

  useEffect(() => {
    if (!apiKey || apiKey.trim() === "") {
      setLoadError("Google Maps API key is not configured.");
      setLoading(false);
      return;
    }

    loadGoogleMapsScript(apiKey)
      .then((maps) => {
        setMapsApi(maps);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Maps loader failed:", err);
        setLoadError(err.message || "Failed to load Google Maps script.");
        setLoading(false);
      });
  }, [apiKey]);

  // Initialize Map Instance
  useEffect(() => {
    if (!mapsApi || !mapRef.current) return;

    const mapOptions = {
      center,
      zoom,
      styles: DARK_MAP_STYLE,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true,
      ...options,
    };

    const map = new mapsApi.Map(mapRef.current, mapOptions);
    googleMapInstanceRef.current = map;

    if (onMapClick) {
      map.addListener("click", (e) => {
        onMapClick({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        });
      });
    }

    return () => {
      if (mapsApi && googleMapInstanceRef.current) {
        mapsApi.event.clearInstanceListeners(googleMapInstanceRef.current);
      }
    };
  }, [mapsApi, onMapClick]);

  // Sync Zoom and Center
  useEffect(() => {
    if (googleMapInstanceRef.current) {
      googleMapInstanceRef.current.setZoom(zoom);
      googleMapInstanceRef.current.panTo(center);
    }
  }, [center.lat, center.lng, zoom]);

  // Synchronize Markers
  useEffect(() => {
    if (!mapsApi || !googleMapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // Role-based custom marker colors (SVG pins)
    const getMarkerColor = (role) => {
      switch (role?.toLowerCase()) {
        case "restaurant":
          return "#10b981"; // Green
        case "household":
          return "#3b82f6"; // Blue
        case "ngo":
          return "#f97316"; // Orange
        case "volunteer":
          return "#a855f7"; // Purple
        default:
          return "#ef4444"; // Red
      }
    };

    // Add new markers
    markers.forEach((markerData) => {
      if (!markerData.lat || !markerData.lng) return;

      const markerColor = getMarkerColor(markerData.role);
      
      const pinSvg = {
        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
        fillColor: markerColor,
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 1.5,
        scale: 1.5,
        anchor: new mapsApi.Point(12, 22),
      };

      const marker = new mapsApi.Marker({
        position: { lat: markerData.lat, lng: markerData.lng },
        map: googleMapInstanceRef.current,
        title: markerData.title || "",
        icon: pinSvg,
      });

      if (markerData.description || markerData.title) {
        const infowindow = new mapsApi.InfoWindow({
          content: `
            <div style="color: #0f172a; padding: 6px; font-family: sans-serif; max-width: 200px;">
              <h4 style="margin: 0 0 4px 0; font-weight: bold; font-size: 13px; text-transform: uppercase;">${markerData.title}</h4>
              <p style="margin: 0; font-size: 11px; color: #475569;">${markerData.description || ""}</p>
            </div>
          `,
        });

        marker.addListener("click", () => {
          if (markerData.onClick) {
            markerData.onClick(markerData);
          }
          infowindow.open(googleMapInstanceRef.current, marker);
        });
      } else if (markerData.onClick) {
        marker.addListener("click", () => {
          markerData.onClick(markerData);
        });
      }

      markersRef.current.push(marker);
    });
  }, [mapsApi, markers]);

  if (loadError) {
    return <GoogleMapsSetupWarning message={loadError} />;
  }

  if (loading) {
    return (
      <div className="w-full min-h-[350px] flex flex-col items-center justify-center bg-slate-950/65 rounded-3xl border border-white/5 backdrop-blur-md">
        <Loader />
        <span className="text-xs text-slate-500 font-mono mt-3">INITIALIZING_GOOGLE_MAPS_ENGINE</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden rounded-3xl border border-white/10 shadow-xl bg-slate-950">
      <div ref={mapRef} className={className} />
    </div>
  );
}
