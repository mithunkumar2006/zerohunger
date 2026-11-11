import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      required: true,
    },

    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    volunteerDetails: {
      name: String,
      phone: String,
      vehicleType: String,
    },

    pickupLocation: {
      name: String,
      address: String,
      contactPerson: String,
      contactPhone: String,
    },

    dropoffLocation: {
      name: String,
      address: String,
      contactPerson: String,
      contactPhone: String,
    },

    route: {
      type: String,
    },

    liveRoute: [
      {
        lat: Number,
        lng: Number,
      }
    ],

    volunteerLocation: {
      lat: Number,
      lng: Number,
    },

    distanceKm: {
      type: Number,
      default: 0,
    },

    eta: {
      type: String,
      default: "",
    },

    pickupVerifiedAt: Date,
    dropoffVerifiedAt: Date,

    qrVerificationLogs: [
      {
        action: String,
        timestamp: { type: Date, default: Date.now },
        scannedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      }
    ],

    status: {
      type: String,
      enum: [
        "Assigned",
        "Accepted",
        "Picked Up",
        "In Transit",
        "Delivered",
        "Failed",
        "Cancelled",
      ],
      default: "Assigned",
    },

    assignedAt: {
      type: Date,
      default: Date.now,
    },

    acceptedAt: Date,
    pickupArrivedAt: Date,
    pickedUpAt: Date,
    deliveredAt: Date,
    failedAt: Date,
    failureReason: String,

    proofOfDelivery: {
      photo: String,
      signature: String,
      recipientName: String,
      notes: String,
    },
  },
  {
    timestamps: true,
  }
);

deliverySchema.index({
  volunteer: 1,
  status: 1,
});

deliverySchema.index({
  donation: 1,
});

const Delivery =
  mongoose.models.Delivery ||
  mongoose.model("Delivery", deliverySchema);

export default Delivery;