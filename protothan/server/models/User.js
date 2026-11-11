import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: [
        "restaurant",
        "household",
        "ngo",
        "volunteer",
        "admin",
      ],
      default: "household",
    },

    avatar: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    licenseNumber: {
      type: String,
      default: "",
    },

    ngoRegistration: {
      type: String,
      default: "",
    },

    vehicle: {
      type: String,
      default: "",
    },

    availability: {
      type: String,
      default: "",
    },

    houseName: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isSuspended: {
      type: Boolean,
      default: false,
    },

    approved: {
      type: Boolean,
      default: false,
    },

    points: {
      type: Number,
      default: 0,
    },

    donationsCount: {
      type: Number,
      default: 0,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    location: {
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

    capacity: {
      type: Number,
      default: 0,
    },

    availableStorage: {
      type: Number,
      default: 0,
    },

    preferredWorkingArea: {
      type: String,
      default: "",
    },

    mealsNeeded: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Geospatial index for proximity searches
userSchema.index({ location: "2dsphere" });

// Virtual getters/setters to map latitude/longitude to the Point coordinates
userSchema.virtual("latitude")
  .get(function () {
    return this.location && this.location.coordinates
      ? this.location.coordinates[1]
      : 0;
  })
  .set(function (val) {
    if (!this.location) {
      this.location = { type: "Point", coordinates: [0, val] };
    } else {
      if (!this.location.coordinates) this.location.coordinates = [0, 0];
      this.location.coordinates[1] = val;
    }
  });

userSchema.virtual("longitude")
  .get(function () {
    return this.location && this.location.coordinates
      ? this.location.coordinates[0]
      : 0;
  })
  .set(function (val) {
    if (!this.location) {
      this.location = { type: "Point", coordinates: [val, 0] };
    } else {
      if (!this.location.coordinates) this.location.coordinates = [0, 0];
      this.location.coordinates[0] = val;
    }
  });

// Ensure virtuals are serialized
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);

export default User;