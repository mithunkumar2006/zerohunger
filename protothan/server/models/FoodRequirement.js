import mongoose from 'mongoose';

const foodRequirementSchema = new mongoose.Schema(
  {
    ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    mealsNeeded: { type: Number, required: true },
    category: { type: String, required: true },
    urgency: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    fulfilled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.FoodRequirement || mongoose.model('FoodRequirement', foodRequirementSchema);
