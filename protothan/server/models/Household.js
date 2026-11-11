import mongoose from 'mongoose';

const householdSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  familyName: {
    type: String,
    required: true,
    trim: true
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
  familySize: {
    type: Number,
    default: 1
  },
  averageMonthlyWaste: {
    type: Number,
    default: 0 // in kg
  },
  typicalFoodTypes: [{
    type: String
  }],
  isVerified: {
    type: Boolean,
    default: false
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
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

householdSchema.index({ location: '2dsphere' });

const Household = mongoose.models.Household || mongoose.model('Household', householdSchema);

export default Household;