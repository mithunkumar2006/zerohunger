import mongoose from 'mongoose';

const ngoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organizationName: {
    type: String,
    required: [true, 'Please provide organization name'],
    trim: true
  },
  registrationNumber: {
    type: String,
    required: true
  },
  ngoType: {
    type: String,
    enum: ['shelter', 'orphanage', 'oldagehome', 'foodbank', 'community', 'religious', 'other'],
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
      type: [Number],
      default: [0, 0]
    }
  },
  contactPerson: {
    name: String,
    phone: String,
    email: String
  },
  capacity: {
    type: Number,
    default: 0 // number of people served
  },
  dailyRequirement: {
    type: Number,
    default: 0 // meals needed per day
  },
  foodPreferences: [{
    type: String
  }],
  operatingHours: {
    opening: String,
    closing: String,
    days: [String]
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
  totalReceived: {
    type: Number,
    default: 0
  },
  totalMealsReceived: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

ngoSchema.index({ location: '2dsphere' });

const NGO = mongoose.models.NGO || mongoose.model('NGO', ngoSchema);

export default NGO;