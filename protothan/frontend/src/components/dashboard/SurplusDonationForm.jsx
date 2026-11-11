import React, { useState, useRef, useEffect } from "react";
import { Camera, UploadCloud, Trash2, MapPin, Sparkles, AlertCircle, Video } from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";
import Card from "../common/Card";
import LocationPicker from "../maps/LocationPicker";
import { donationService } from "../../services/apiService";
import toast from "react-hot-toast";

export default function SurplusDonationForm({
  initialData = null,
  onSubmit,
  loading = false,
  userAddress = "",
  userCoords = { lat: 13.0827, lng: 80.2707 },
}) {
  const [form, setForm] = useState({
    foodName: initialData?.foodName || "",
    category: initialData?.category || "Cooked Meals",
    quantity: initialData?.quantity || "",
    storageType: initialData?.storageType || "Room Temperature",
    prepTime: initialData?.prepTime || "",
    expiryTime: initialData?.expiryTime || "",
    location: initialData?.location || userAddress,
    locationCoords: initialData?.locationCoords || {
      type: "Point",
      coordinates: [userCoords.lng || 80.2707, userCoords.lat || 13.0827],
      address: userAddress,
      placeId: "",
    },
    imageUrls: initialData?.imageUrls || (initialData?.imageUrl ? [initialData.imageUrl] : []),
    notes: initialData?.notes || "",
  });

  const [uploading, setUploading] = useState(false);

  // Camera states
  const [showCamera, setShowCamera] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Start Camera Stream
  const startCamera = async () => {
    setCameraLoading(true);
    try {
      const constraints = {
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (err) {
      console.error("Camera access failed:", err);
      toast.error("Could not activate camera. Please check permissions or upload files directly.");
    } finally {
      setCameraLoading(false);
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  // Capture Image Frame from Video
  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          toast.error("Failed to capture frame.");
          return;
        }

        const file = new File([blob], `food-rescue-${Date.now()}.jpg`, { type: "image/jpeg" });
        await uploadFile(file);
        stopCamera();
      },
      "image/jpeg",
      0.9
    );
  };

  // Upload File handler
  const uploadFile = async (file) => {
    setUploading(true);
    const toastId = toast.loading(`Uploading photo "${file.name}"...`);
    try {
      const uploadedUrl = await donationService.uploadImage(file);
      setForm((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, uploadedUrl],
      }));
      toast.success("Photo uploaded successfully!", { id: toastId });
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      toast.error("Failed to upload photo to Cloudinary.", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      await uploadFile(file);
    }
  };

  const removeImage = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, idx) => idx !== indexToRemove),
    }));
    toast.success("Photo removed.");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.foodName || !form.quantity || !form.prepTime || !form.expiryTime || !form.location) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (form.imageUrls.length === 0) {
      toast.error("Please provide at least one food photo for AI analysis.");
      return;
    }

    // Submit back
    onSubmit({
      ...form,
      quantity: Number(form.quantity),
      imageUrl: form.imageUrls[0] || "", // backward compatibility
    });
  };

  // Clean camera tracks on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Food Surplus Title"
          placeholder="Fresh Biryani / Sourdough Loaves"
          required
          value={form.foodName}
          onChange={(e) => setForm((prev) => ({ ...prev, foodName: e.target.value }))}
        />
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-400 font-display tracking-wider uppercase">
            Food Category
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
            className="w-full py-3.5 px-4 text-sm bg-[#0b1329]/55 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/40 transition-all"
          >
            <option value="Cooked Meals">Cooked Meals</option>
            <option value="Raw Fruits & Veggies">Raw Fruits & Veggies</option>
            <option value="Dairy Products">Dairy Products</option>
            <option value="Bakery surplus">Bakery surplus</option>
            <option value="Packaged / Canned Items">Packaged / Canned Items</option>
            <option value="Beverages">Beverages</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Quantity (in kg or portions)"
          placeholder="e.g. 15"
          type="number"
          required
          min="1"
          value={form.quantity}
          onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))}
        />
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-400 font-display tracking-wider uppercase">
            Storage Atmosphere
          </label>
          <select
            value={form.storageType}
            onChange={(e) => setForm((prev) => ({ ...prev, storageType: e.target.value }))}
            className="w-full py-3.5 px-4 text-sm bg-[#0b1329]/55 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/40 transition-all"
          >
            <option value="Room Temperature">Room Temperature</option>
            <option value="Refrigerated">Refrigerated</option>
            <option value="Frozen">Frozen</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Preparation / Harvest Time"
          type="datetime-local"
          required
          value={form.prepTime}
          onChange={(e) => setForm((prev) => ({ ...prev, prepTime: e.target.value }))}
        />
        <Input
          label="Estimated Expiration Boundary"
          type="datetime-local"
          required
          value={form.expiryTime}
          onChange={(e) => setForm((prev) => ({ ...prev, expiryTime: e.target.value }))}
        />
      </div>

      {/* Reusable location picker map */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 font-display tracking-wider uppercase">
          Surplus Pickup Address & GPS Coordinates
        </label>
        <LocationPicker
          initialLat={form.locationCoords.coordinates[1]}
          initialLng={form.locationCoords.coordinates[0]}
          initialAddress={form.location}
          onChange={({ latitude, longitude, address, placeId }) => {
            setForm((prev) => ({
              ...prev,
              location: address,
              locationCoords: {
                type: "Point",
                coordinates: [longitude, latitude],
                address,
                placeId,
              },
            }));
          }}
        />
      </div>

      {/* Multiple Image uploads & Camera capture */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-400 font-display tracking-wider uppercase block">
          surplus food gallery (Photos for AI analysis)
        </label>

        {showCamera ? (
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-950 flex flex-col items-center">
            <video ref={videoRef} autoPlay playsInline className="w-full max-h-80 object-cover" />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 px-4 z-20">
              <Button type="button" onClick={capturePhoto} className="bg-orange-500 hover:bg-orange-600 border-none px-6">
                Snap Photo
              </Button>
              <Button type="button" onClick={stopCamera} variant="secondary">
                Cancel
              </Button>
            </div>
            <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur px-2.5 py-1 rounded text-[9px] text-slate-400 font-mono flex items-center gap-1.5 border border-white/5">
              <Video size={10} className="text-orange-500 animate-pulse" />
              CAMERA_STREAM_ACTIVE
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#0a0f1d]/50 border border-white/10 rounded-2xl p-5">
            <div className="flex-1 text-center sm:text-left space-y-1">
              <p className="text-xs text-slate-200 font-bold">Upload Multiple Food Images</p>
              <p className="text-[11px] text-slate-500 leading-normal">
                Select camera capture or files. Images are processed by Gemini to evaluate freshness and risk index.
              </p>
            </div>

            <div className="flex gap-3 shrink-0">
              <Button
                type="button"
                onClick={startCamera}
                loading={cameraLoading}
                variant="secondary"
                className="flex items-center gap-1.5 border-white/10 hover:border-orange-500/20 text-orange-400"
              >
                <Camera size={14} />
                Camera
              </Button>

              <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 rounded-xl text-xs font-bold transition">
                <UploadCloud size={14} />
                Files
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>
        )}

        {/* Uploaded files preview carousel/grid */}
        {form.imageUrls.length > 0 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 pt-2">
            {form.imageUrls.map((url, idx) => (
              <div
                key={idx}
                className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 bg-slate-900 flex items-center justify-center"
              >
                <img src={url} alt={`Surplus ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
                <div className="absolute top-1 left-1 px-1 bg-black/75 rounded text-[8px] text-slate-400 font-mono">
                  #{idx + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-400 font-display tracking-wider uppercase">
          Handling Instructions / Notes
        </label>
        <textarea
          rows={3}
          placeholder="Please handle gently, contains liquids / ready for direct distribution..."
          value={form.notes}
          onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
          className="w-full py-3.5 px-4 text-sm bg-[#0b1329]/55 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/10 transition-all resize-none"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border-none font-bold uppercase tracking-wider text-xs py-4"
      >
        {initialData ? "Apply Telemetry Corrections" : "Submit Surplus Cargo to Admin Registry"}
      </Button>
    </form>
  );
}
