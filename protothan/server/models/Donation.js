import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    donorRole: { type: String, enum: ['restaurant', 'household'], required: true },
    ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    foodName: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: String, required: true },
    storageType: { type: String, required: true },
    prepTime: { type: String, required: true },
    expiryTime: { type: String, required: true },
    location: { type: String, required: true },
    locationCoords: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0], // [longitude, latitude]
      },
      address: String,
      placeId: String,
    },
    imageUrl: { type: String },
    imageUrls: [{ type: String }],
    status: {
      type: String,
      enum: ['pending', 'matched', 'accepted', 'assigned', 'picked_up', 'delivered', 'rejected'],
      default: 'pending',
    },
    aiStatus: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
    freshnessScore: { type: Number, default: 0 },
    trustScore: { type: Number, default: 0 },
    confidenceScore: { type: Number, default: 0 },
    urgencyScore: { type: Number, default: 0 },
    riskLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    safeUntil: { type: String },
    matchConfidence: { type: Number, default: 0 },
    carbonSaved: { type: Number, default: 0 },
    mealsSaved: { type: Number, default: 0 },
    aiAnalysisRaw: { type: mongoose.Schema.Types.Mixed },
    recommendedNGOs: [
      {
        ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: String,
        confidence: Number,
        distanceKm: Number,
        mealsNeeded: Number,
        recommendationReason: String,
      }
    ],
    pickupQrCode: { type: String },
    dropoffQrCode: { type: String },
    qrHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        scannedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      }
    ],
    notes: { type: String },
  },
  { timestamps: true }
);

donationSchema.index({ locationCoords: '2dsphere' });

export default mongoose.models.Donation || mongoose.model('Donation', donationSchema);
