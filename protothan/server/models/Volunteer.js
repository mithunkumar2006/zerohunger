import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: [true, 'Please provide full name'],
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
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
  phone: {
    type: String,
    required: true
  },
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  vehicleType: {
    type: String,
    enum: ['none', 'bicycle', 'motorcycle', 'car', 'van'],
    default: 'none'
  },
  vehicleNumber: {
    type: String
  },
  licenseNumber: {
    type: String
  },
  availability: {
    days: [String],
    timeSlots: [String]
  },
  preferredAreas: [{
    type: String
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [String],
  backgroundCheck: {
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    completedAt: Date
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  points: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number,
    default: 0
  },
  totalDeliveries: {
    type: Number,
    default: 0
  },
  totalDistance: {
    type: Number,
    default: 0 // in km
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'busy'],
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

volunteerSchema.index({ location: '2dsphere' });

const Volunteer = mongoose.models.Volunteer || mongoose.model('Volunteer', volunteerSchema);

export default Volunteer;