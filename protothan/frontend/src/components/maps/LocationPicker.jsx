import React, { useEffect, useRef, useState } from "react";
import { loadGoogleMapsScript } from "../../utils/GoogleMapLoader";
import GoogleMapsSetupWarning from "./GoogleMapsSetupWarning";
import Loader from "../common/Loader";
import Button from "../common/Button";
import { Compass, Search, MapPin } from "lucide-react";

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#020617" }, { weight: 2 }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#082f49" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#38bdf8" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#334155" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#062f22" }] },
];

export default function LocationPicker({
  initialLat = 13.0827,
  initialLng = 80.2707,
  initialAddress = "",
  onChange, // returns { latitude, longitude, address, placeId }
  className = "w-full h-64",
}) {
  const mapContainerRef = useRef(null);
  const inputRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerInstanceRef = useRef(null);
  const autocompleteRef = useRef(null);

  const [mapsApi, setMapsApi] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [geocoding, setGeocoding] = useState(false);

  const [coords, setCoords] = useState({ lat: initialLat, lng: initialLng });
  const [address, setAddress] = useState(initialAddress);

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

  // Initializing Google Map inside picker
  useEffect(() => {
    if (!mapsApi || !mapContainerRef.current) return;

    const defaultCoords = { lat: coords.lat || 13.0827, lng: coords.lng || 80.2707 };

    const map = new mapsApi.Map(mapContainerRef.current, {
      center: defaultCoords,
      zoom: 15,
      styles: DARK_MAP_STYLE,
      disableDefaultUI: true,
      zoomControl: true,
    });
    mapInstanceRef.current = map;

    const pinIcon = {
      path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
      fillColor: "#f97316", // Orange
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWeight: 2,
      scale: 1.6,
      anchor: new mapsApi.Point(12, 22),
    };

    const marker = new mapsApi.Marker({
      position: defaultCoords,
      map: map,
      draggable: true,
      icon: pinIcon,
      animation: mapsApi.Animation.DROP,
    });
    markerInstanceRef.current = marker;

    // Autocomplete Setup
    if (inputRef.current) {
      const autocomplete = new mapsApi.places.Autocomplete(inputRef.current, {
        fields: ["geometry", "formatted_address", "place_id"],
      });
      autocomplete.bindTo("bounds", map);
      autocompleteRef.current = autocomplete;

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
          return;
        }

        const newLat = place.geometry.location.lat();
        const newLng = place.geometry.location.lng();
        const newAddress = place.formatted_address || "";
        const placeId = place.place_id || "";

        map.setCenter({ lat: newLat, lng: newLng });
        map.setZoom(16);
        marker.setPosition({ lat: newLat, lng: newLng });

        setCoords({ lat: newLat, lng: newLng });
        setAddress(newAddress);

        if (onChange) {
          onChange({
            latitude: newLat,
            longitude: newLng,
            address: newAddress,
            placeId,
          });
        }
      });
    }

    // Drag marker event
    marker.addListener("dragend", () => {
      const pos = marker.getPosition();
      const newLat = pos.lat();
      const newLng = pos.lng();
      setCoords({ lat: newLat, lng: newLng });
      reverseGeocode(newLat, newLng);
    });

    // Map click event to drop marker
    map.addListener("click", (e) => {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();
      marker.setPosition({ lat: newLat, lng: newLng });
      setCoords({ lat: newLat, lng: newLng });
      reverseGeocode(newLat, newLng);
    });

    return () => {
      if (mapsApi) {
        if (markerInstanceRef.current) {
          mapsApi.event.clearInstanceListeners(markerInstanceRef.current);
        }
        if (mapInstanceRef.current) {
          mapsApi.event.clearInstanceListeners(mapInstanceRef.current);
        }
      }
    };
  }, [mapsApi]);

  // Reverse Geocoding function
  const reverseGeocode = (lat, lng) => {
    if (!mapsApi) return;
    setGeocoding(true);

    const geocoder = new mapsApi.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      setGeocoding(false);
      if (status === "OK" && results[0]) {
        const matchedAddress = results[0].formatted_address;
        const placeId = results[0].place_id;
        setAddress(matchedAddress);
        if (inputRef.current) {
          inputRef.current.value = matchedAddress;
        }

        if (onChange) {
          onChange({
            latitude: lat,
            longitude: lng,
            address: matchedAddress,
            placeId,
          });
        }
      } else {
        console.error("Geocoder failed due to:", status);
      }
    });
  };

  // Detect GPS geolocation
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setGeocoding(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCoords = { lat: latitude, lng: longitude };
        
        setCoords(newCoords);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter(newCoords);
          mapInstanceRef.current.setZoom(16);
        }
        if (markerInstanceRef.current) {
          markerInstanceRef.current.setPosition(newCoords);
        }
        
        reverseGeocode(latitude, longitude);
      },
      (error) => {
        setGeocoding(false);
        console.error("GPS detection failed:", error);
        alert("Could not retrieve GPS lock. Please type manually or click the map.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  if (loadError) {
    return <GoogleMapsSetupWarning message={loadError} />;
  }

  if (loading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center bg-slate-950/65 rounded-3xl border border-white/5 backdrop-blur-md">
        <Loader />
        <span className="text-xs text-slate-500 font-mono mt-3">LOADING_MAP_PICKER_INTERFACE</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Input and Geolocation Button */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
            <Search size={16} />
          </span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search address or landmark..."
            defaultValue={address}
            className="w-full py-3.5 pl-11 pr-4 text-sm bg-[#0b1329]/55 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/10 transition-all"
          />
        </div>

        <Button
          type="button"
          onClick={detectLocation}
          loading={geocoding}
          variant="secondary"
          className="px-4 shrink-0 flex items-center justify-center gap-2 border-white/10 hover:border-orange-500/20 text-orange-400 bg-white/5 hover:bg-orange-500/5 transition-all"
        >
          <Compass size={16} className={geocoding ? "animate-spin" : ""} />
          <span className="hidden sm:inline">GPS</span>
        </Button>
      </div>

      {/* Visual coordinates metadata */}
      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
        <span>📍 LAT: {coords.lat.toFixed(6)} | LNG: {coords.lng.toFixed(6)}</span>
        {geocoding && <span className="text-orange-400 animate-pulse font-bold">SYNCHRONIZING_COORD...</span>}
      </div>

      {/* Google Map Panel */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
        <div ref={mapContainerRef} className={className} />
        {/* Floating marker drag alert */}
        <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur border border-white/10 py-1.5 px-3 rounded-lg text-[9px] text-slate-400 font-medium select-none pointer-events-none flex items-center gap-1.5 shadow-lg">
          <MapPin size={10} className="text-orange-500 animate-bounce" />
          Drag pin or click anywhere on the map to re-adjust coordinates.
        </div>
      </div>
    </div>
  );
}
