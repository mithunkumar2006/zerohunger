import React, { useEffect, useRef, useState } from "react";
import { loadGoogleMapsScript } from "../../utils/GoogleMapLoader";
import GoogleMapsSetupWarning from "./GoogleMapsSetupWarning";
import Loader from "../common/Loader";
import { Car, Compass, Clock, Navigation } from "lucide-react";

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

export default function RouteMap({
  donorCoords, // { lat, lng, name, address }
  ngoCoords,   // { lat, lng, name, address }
  volunteerCoords, // { lat, lng, name, vehicle }
  deliveryStatus = "Assigned", // 'Assigned' | 'Accepted' | 'Picked Up' | 'Delivered'
  className = "w-full h-80",
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  
  const donorMarkerRef = useRef(null);
  const ngoMarkerRef = useRef(null);
  const volunteerMarkerRef = useRef(null);

  const [mapsApi, setMapsApi] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [routeInfo, setRouteInfo] = useState({ distance: "", duration: "" });

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

  // Initializing Map and routing overlays
  useEffect(() => {
    if (!mapsApi || !mapContainerRef.current) return;
    if (!donorCoords || !ngoCoords) return;

    // Center on mid-point
    const midLat = (donorCoords.lat + ngoCoords.lat) / 2;
    const midLng = (donorCoords.lng + ngoCoords.lng) / 2;

    const map = new mapsApi.Map(mapContainerRef.current, {
      center: { lat: midLat, lng: midLng },
      zoom: 12,
      styles: DARK_MAP_STYLE,
      disableDefaultUI: true,
      zoomControl: true,
    });
    mapInstanceRef.current = map;

    // Initialize custom DirectionsRenderer with stylized green path
    const directionsRenderer = new mapsApi.DirectionsRenderer({
      map: map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#10b981", // Emerald Polyline
        strokeOpacity: 0.8,
        strokeWeight: 5,
      },
    });
    directionsRendererRef.current = directionsRenderer;

    // Create Donor Pin (Green)
    donorMarkerRef.current = new mapsApi.Marker({
      position: { lat: donorCoords.lat, lng: donorCoords.lng },
      map,
      title: donorCoords.name || "Donor Location",
      icon: {
        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
        fillColor: "#10b981", // Emerald
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
        scale: 1.5,
        anchor: new mapsApi.Point(12, 22),
      },
    });

    // Create NGO Pin (Orange)
    ngoMarkerRef.current = new mapsApi.Marker({
      position: { lat: ngoCoords.lat, lng: ngoCoords.lng },
      map,
      title: ngoCoords.name || "NGO Location",
      icon: {
        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
        fillColor: "#f97316", // Orange
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
        scale: 1.5,
        anchor: new mapsApi.Point(12, 22),
      },
    });

    // Compute route Donor -> NGO
    const directionsService = new mapsApi.DirectionsService();
    directionsService.route(
      {
        origin: { lat: donorCoords.lat, lng: donorCoords.lng },
        destination: { lat: ngoCoords.lat, lng: ngoCoords.lng },
        travelMode: mapsApi.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === mapsApi.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
          const route = result.routes[0].legs[0];
          setRouteInfo({
            distance: route.distance.text,
            duration: route.duration.text,
          });
        } else {
          console.error("Directions lookup failed:", status);
        }
      }
    );

    // Create Volunteer Pin (Purple)
    if (volunteerCoords && volunteerCoords.lat && volunteerCoords.lng) {
      volunteerMarkerRef.current = new mapsApi.Marker({
        position: { lat: volunteerCoords.lat, lng: volunteerCoords.lng },
        map,
        title: volunteerCoords.name || "Volunteer Carrier",
        icon: {
          path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
          fillColor: "#a855f7", // Purple
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
          scale: 1.6,
          anchor: new mapsApi.Point(12, 22),
        },
      });
    }

    return () => {
      if (donorMarkerRef.current) donorMarkerRef.current.setMap(null);
      if (ngoMarkerRef.current) ngoMarkerRef.current.setMap(null);
      if (volunteerMarkerRef.current) volunteerMarkerRef.current.setMap(null);
      if (directionsRendererRef.current) directionsRendererRef.current.setMap(null);
    };
  }, [mapsApi, donorCoords.lat, donorCoords.lng, ngoCoords.lat, ngoCoords.lng]);

  // Sync Volunteer Marker Coordinate updates dynamically (GPS telemetry)
  useEffect(() => {
    if (!mapsApi || !mapInstanceRef.current) return;
    
    if (volunteerCoords && volunteerCoords.lat && volunteerCoords.lng) {
      if (volunteerMarkerRef.current) {
        volunteerMarkerRef.current.setPosition({
          lat: volunteerCoords.lat,
          lng: volunteerCoords.lng,
        });
      } else {
        volunteerMarkerRef.current = new mapsApi.Marker({
          position: { lat: volunteerCoords.lat, lng: volunteerCoords.lng },
          map: mapInstanceRef.current,
          title: volunteerCoords.name || "Volunteer Carrier",
          icon: {
            path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
            fillColor: "#a855f7", // Purple
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            scale: 1.6,
            anchor: new mapsApi.Point(12, 22),
          },
        });
      }
    }
  }, [mapsApi, volunteerCoords?.lat, volunteerCoords?.lng]);

  if (loadError) {
    return <GoogleMapsSetupWarning message={loadError} />;
  }

  if (loading) {
    return (
      <div className="w-full h-80 flex flex-col items-center justify-center bg-slate-950/65 rounded-3xl border border-white/5 backdrop-blur-md">
        <Loader />
        <span className="text-xs text-slate-500 font-mono mt-3">LOADING_ROUTING_GRID</span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">
      {/* Route Map container */}
      <div ref={mapContainerRef} className={className} />

      {/* Floating directions info panel */}
      <div className="absolute top-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xs bg-slate-950/85 backdrop-blur border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col gap-3.5 z-10 select-none">
        <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
              <Navigation size={12} className="rotate-45" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Logistics Route</h4>
              <p className="text-[9px] text-slate-500 font-mono">STATUS: {deliveryStatus}</p>
            </div>
          </div>
          <span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono">
            LIVE
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-white/5 rounded-xl p-2 border border-white/5">
            <span className="text-[8px] text-slate-500 uppercase font-mono block">Distance</span>
            <span className="text-sm font-black text-white font-display mt-0.5 block">{routeInfo.distance || "Calcul..."}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2 border border-white/5">
            <span className="text-[8px] text-slate-500 uppercase font-mono block">Transit ETA</span>
            <span className="text-sm font-black text-cyan-400 font-display mt-0.5 block">{routeInfo.duration || "Calcul..."}</span>
          </div>
        </div>
        
        {/* Step checklist */}
        <div className="text-[10px] space-y-1.5 text-slate-400 font-mono">
          <div className="flex justify-between">
            <span>Donor Pickup:</span>
            <span className={["Picked Up", "Delivered", "In Transit"].includes(deliveryStatus) ? "text-emerald-400" : "text-amber-400 animate-pulse"}>
              {["Picked Up", "Delivered", "In Transit"].includes(deliveryStatus) ? "✓ COMPLETED" : "⌚ ARRIVING"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>NGO Delivery:</span>
            <span className={deliveryStatus === "Delivered" ? "text-emerald-400" : "text-slate-500"}>
              {deliveryStatus === "Delivered" ? "✓ ARRIVED" : "⌛ EN_ROUTE"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
