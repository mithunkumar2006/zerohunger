import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  businessName: {
    type: String,
    required: [true, 'Please provide business name'],
    trim: true
  },
  businessType: {
    type: String,
    enum: ['restaurant', 'cafe', 'hotel', 'catering', 'bakery', 'supermarket', 'other'],
    required: true
  },
  licenseNumber: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  contactPerson: {
    name: String,
    phone: String,
    email: String
  },
  operatingHours: {
    opening: String,
    closing: String,
    days: [String]
  },
  averageDailySurplus: {
    type: Number,
    default: 0 // in portions
  },
  typicalFoodTypes: [{
    type: String
  }],
  storageCapacity: {
    type: Number,
    default: 0 // in kg
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [String],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalDonations: {
    type: Number,
    default: 0
  },
  totalMealsDonated: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Create 2dsphere index for geospatial queries
restaurantSchema.index({ location: '2dsphere' });

const Restaurant = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;