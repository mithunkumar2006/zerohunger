import User from "../models/User.js";
import { signToken } from "../services/jwtService.js";

// ================= REGISTER =================
export async function register(req, res, next) {
  try {
    const roleParam = req.params.role;
    const validRoles = ["restaurant", "household", "ngo", "volunteer", "admin"];
    
    if (!validRoles.includes(roleParam)) {
      return res.status(400).json({
        error: `Invalid registration role: ${roleParam}`,
      });
    }

    const {
      name,
      email,
      password,
      role,
      phone,
      address,
      licenseNumber,
      ngoRegistration,
      vehicle,
      availability,
      houseName,
      restaurantName,
      secretKey,
      latitude,
      longitude,
      placeId,
      capacity,
      availableStorage,
      mealsNeeded,
      preferredWorkingArea,
    } = req.body;

    const activeRole = role || roleParam;
    if (activeRole !== roleParam) {
      return res.status(400).json({
        error: `Role mismatch. Endpoint is for ${roleParam}, but request specifies ${activeRole}.`,
      });
    }

    if (!email || !password || !phone || !address) {
      return res.status(400).json({
        error: "Email, password, phone, and physical address are required",
      });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Please enter a valid email address",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    if (phone.length < 9) {
      return res.status(400).json({
        error: "Please enter a valid phone number (at least 9 digits)",
      });
    }

    let displayName = name;
    if (activeRole === "restaurant") {
      if (!restaurantName || !restaurantName.trim()) {
        return res.status(400).json({
          error: "Restaurant Name is required for restaurant registration",
        });
      }
      displayName = restaurantName.trim();
      if (!licenseNumber || !licenseNumber.trim()) {
        return res.status(400).json({
          error: "Food Safety / Trade License Number is required",
        });
      }
    } else {
      if (!name || !name.trim()) {
        return res.status(400).json({
          error: "Display Name is required",
        });
      }
      displayName = name.trim();
    }

    if (activeRole === "ngo") {
      if (!ngoRegistration || !ngoRegistration.trim()) {
        return res.status(400).json({
          error: "NGO Registration ID / Charity License is required",
        });
      }
    }

    if (activeRole === "volunteer") {
      if (!vehicle || !vehicle.trim()) {
        return res.status(400).json({
          error: "Carrier Vehicle Type is required for volunteers",
        });
      }
      if (!availability) {
        return res.status(400).json({
          error: "Availability selection is required for volunteers",
        });
      }
    }

    if (activeRole === "household") {
      if (!houseName || !houseName.trim()) {
        return res.status(400).json({
          error: "Household/House Name is required for household registration",
        });
      }
    }

    if (activeRole === "admin") {
      if (secretKey !== "SUPER_SECRET_RESCUE_KEY") {
        return res.status(403).json({
          error: "Invalid Admin Access Secret Key. Access restricted.",
        });
      }
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({
        error: "An account with this email address already exists",
      });
    }

    const user = await User.create({
      name: displayName,
      email: email.toLowerCase(),
      password,
      role: activeRole,
      phone,
      address,
      latitude: Number(latitude) || 0,
      longitude: Number(longitude) || 0,
      placeId: placeId || "",
      licenseNumber: activeRole === "restaurant" ? licenseNumber : "",
      ngoRegistration: activeRole === "ngo" ? ngoRegistration : "",
      vehicle: activeRole === "volunteer" ? vehicle : "",
      availability: activeRole === "volunteer" ? availability : "",
      houseName: activeRole === "household" ? houseName : "",
      capacity: activeRole === "ngo" ? (Number(capacity) || 0) : 0,
      availableStorage: activeRole === "ngo" ? (Number(availableStorage) || 0) : 0,
      mealsNeeded: activeRole === "ngo" ? (Number(mealsNeeded) || 0) : 0,
      preferredWorkingArea: activeRole === "volunteer" ? preferredWorkingArea : "",
      approved: activeRole === "admin",
    });

    const token = signToken(user);

    return res.status(201).json({
      message: "Registration Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ================= LOGIN =================
export async function login(req, res, next) {
  try {
    const roleParam = req.params.role;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and Password are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    if (user.role !== roleParam) {
      return res.status(401).json({
        error: `Account role mismatch. This user is registered as a ${user.role.toUpperCase()}, but you requested ${roleParam.toUpperCase()}.`,
      });
    }

    const validPassword = await user.comparePassword(password);

    if (!validPassword) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    if (user.isSuspended) {
      return res.status(403).json({
        error: "Your account is suspended. Please contact administration.",
      });
    }

    user.lastLogin = new Date();

    await user.save({
      validateBeforeSave: false,
    });

    const token = signToken(user);

    return res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ================= LOGOUT =================
export function logout(req, res) {
  res.json({
    message: "Logged Out Successfully",
  });
}

// ================= PROFILE =================
export async function getProfile(req, res) {
  res.json(req.user);
}

// ================= UPDATE PROFILE =================
export async function updateProfile(req, res, next) {
  try {
    const allowedFields = [
      "name",
      "phone",
      "address",
      "avatar",
      "latitude",
      "longitude",
      "mealsNeeded",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.user[field] = req.body[field];
      }
    });

    await req.user.save();

    res.json(req.user);
  } catch (error) {
    next(error);
  }
}

// ================= FORGOT PASSWORD =================
export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json({
      message: "Password reset feature will be implemented soon.",
    });
  } catch (error) {
    next(error);
  }
}