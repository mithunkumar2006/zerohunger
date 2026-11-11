import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    mealsSaved: { type: Number, default: 0 },
    foodSavedKg: { type: Number, default: 0 },
    wastePrevented: { type: Number, default: 0 },
    peopleFed: { type: Number, default: 0 },
    donations: { type: Number, default: 0 },
    monthlyDonations: [Number],
    monthlyMeals: [Number],
    topNGOs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    topVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.models.Analytics || mongoose.model('Analytics', analyticsSchema);
