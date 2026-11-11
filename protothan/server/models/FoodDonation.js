import mongoose from 'mongoose';

const foodDonationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'donorType',
    required: true
  },
  donorType: {
    type: String,
    enum: ['Restaurant', 'Household'],
    required: true
  },
  donorDetails: {
    name: String,
    email: String,
    phone: String,
    address: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    }
  },
  foodDetails: {
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['Cooked Food', 'Raw Vegetables', 'Fruits', 'Baked Goods', 'Dairy', 'Packaged Food', 'Other'],
      required: true
    },
    quantity: {
      type: Number,
      required: true // in portions or kg
    },
    quantityUnit: {
      type: String,
      enum: ['portions', 'kg', 'boxes', 'packets'],
      default: 'portions'
    },
    description: String,
    ingredients: [String],
    allergens: [String]
  },
  prepTime: {
    type: Date,
    required: true
  },
  expiryTime: {
    type: Date,
    required: true
  },
  storageType: {
    type: String,
    enum: ['Room Temperature', 'Refrigerated', 'Frozen'],
    required: true
  },
  images: [String],
  aiAnalysis: {
    freshnessScore: {
      type: Number,
      min: 0,
      max: 100
    },
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High']
    },
    safeUntil: String,
    trustScore: {
      type: Number,
      min: 0,
      max: 100
    },
    recommendation: String,
    analyzedAt: Date
  },
  matchedNGO: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO'
  },
  ngoDetails: {
    name: String,
    email: String,
    phone: String,
    address: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    }
  },
  assignedVolunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer'
  },
  volunteerDetails: {
    name: String,
    phone: String,
    vehicleType: String
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Volunteer Assigned', 'In Transit', 'Delivered', 'Cancelled', 'Expired'],
    default: 'Pending'
  },
  deliveryDetails: {
    pickupTime: Date,
    deliveryTime: Date,
    estimatedPickup: Date,
    estimatedDelivery: Date,
    actualPickup: Date,
    actualDelivery: Date,
    distance: Number, // in km
    route: {
      type: Object // Google Maps route data
    }
  },
  notifications: [{
    type: {
      type: String,
      enum: ['donor', 'ngo', 'volunteer']
    },
    message: String,
    sentAt: Date,
    readAt: Date
  }],
  feedback: {
    donorRating: Number,
    ngoRating: Number,
    volunteerRating: Number,
    donorComment: String,
    ngoComment: String,
    volunteerComment: String
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'cancelledByType'
  },
  cancelledByType: {
    type: String,
    enum: ['Restaurant', 'Household', 'NGO', 'Volunteer', 'Admin']
  },
  cancellationReason: String,
  cancelledAt: Date
}, {
  timestamps: true
});

// Indexes for efficient queries
foodDonationSchema.index({ status: 1, createdAt: -1 });
foodDonationSchema.index({ donor: 1, status: 1 });
foodDonationSchema.index({ matchedNGO: 1, status: 1 });
foodDonationSchema.index({ assignedVolunteer: 1, status: 1 });
foodDonationSchema.index({ 'donorDetails.location': '2dsphere' });
foodDonationSchema.index({ 'ngoDetails.location': '2dsphere' });

const FoodDonation = mongoose.models.FoodDonation || mongoose.model('FoodDonation', foodDonationSchema);

export default FoodDonation;