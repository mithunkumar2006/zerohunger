import User from '../models/User.js';
import Delivery from '../models/Delivery.js';

/**
 * Calculates distance in kilometers between two sets of GPS coordinates using the Haversine formula.
 */
export function getHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

/**
 * Ranks NGOs based on proximity, storage capacity, and meals needed.
 */
export async function findBestNGOs({ donorLat, donorLng, category, quantity }) {
  // Fetch active approved NGOs
  const ngos = await User.find({ role: 'ngo', approved: true, isSuspended: false }).lean();
  
  const matches = ngos.map((ngo) => {
    const ngoLng = ngo.location?.coordinates?.[0] || 0;
    const ngoLat = ngo.location?.coordinates?.[1] || 0;

    // 1. Calculate distance
    const distanceKm = Number(getHaversineDistance(donorLat, donorLng, ngoLat, ngoLng).toFixed(2));

    // 2. Proximity Score (40% weight) - max points for <2km, decrease as distance grows
    const distanceScore = Math.max(0, 100 - (distanceKm * 5));

    // 3. Storage Capacity Score (30% weight)
    const qty = Number(quantity) || 10;
    const storageAvail = ngo.availableStorage || 0;
    let storageScore = 50; // default
    if (storageAvail >= qty) {
      storageScore = 100;
    } else if (storageAvail > 0) {
      storageScore = Math.round((storageAvail / qty) * 100);
    } else {
      storageScore = 15; // zero storage capacity indicator
    }

    // 4. Need Score (30% weight)
    const mealsNeeded = ngo.mealsNeeded || 0;
    const mealsProvided = qty * 2; // Approx 2 meals per kg
    let needScore = 50;
    if (mealsNeeded > 0) {
      if (mealsProvided >= mealsNeeded) {
        needScore = 100;
      } else {
        needScore = Math.round((mealsProvided / mealsNeeded) * 100);
      }
    }

    // Weighted match confidence index
    const confidence = Math.round((distanceScore * 0.4) + (storageScore * 0.3) + (needScore * 0.3));

    // Recommendation Text
    let recommendationReason = "";
    if (distanceKm < 3) {
      recommendationReason += `Close proximity (${distanceKm} km away). `;
    } else {
      recommendationReason += `Located ${distanceKm} km away. `;
    }

    if (storageAvail >= qty) {
      recommendationReason += `Sufficient storage capacity (${storageAvail} kg available). `;
    } else {
      recommendationReason += `Storage capacity is limited (${storageAvail} kg available). `;
    }

    if (mealsNeeded > 0) {
      recommendationReason += `Rescues will satisfy ${Math.min(100, Math.round((mealsProvided/mealsNeeded)*100))}% of their daily requirement (${mealsNeeded} meals).`;
    }

    return {
      ngoId: ngo._id,
      name: ngo.name,
      email: ngo.email,
      phone: ngo.phone,
      address: ngo.address,
      latitude: ngoLat,
      longitude: ngoLng,
      distanceKm,
      capacity: ngo.capacity || 0,
      availableStorage: storageAvail,
      mealsNeeded,
      confidence: Math.min(100, Math.max(10, confidence)),
      recommendationReason,
    };
  });

  // Sort descending by confidence score
  return matches.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
}

/**
 * Ranks Volunteers based on distance, availability, vehicle, and active delivery runs.
 */
export async function findNearestVolunteers({ donorLat, donorLng }) {
  // Fetch active volunteers
  const volunteers = await User.find({ role: 'volunteer', approved: true, isSuspended: false }).lean();

  const rankedVolunteers = await Promise.all(
    volunteers.map(async (volunteer) => {
      const volLng = volunteer.location?.coordinates?.[0] || 0;
      const volLat = volunteer.location?.coordinates?.[1] || 0;

      // 1. Calculate distance to pickup point
      const distanceKm = Number(getHaversineDistance(donorLat, donorLng, volLat, volLng).toFixed(2));

      // 2. Count active delivery runs to prevent overloading
      const activeRuns = await Delivery.countDocuments({
        volunteer: volunteer._id,
        status: { $in: ["Assigned", "Accepted", "Picked Up", "In Transit"] }
      });

      // Proximity Score (Base)
      const proximityScore = Math.max(0, 100 - (distanceKm * 8));

      // Load Penalty (Deduct points if busy)
      const loadPenalty = activeRuns * 25;
      const score = Math.max(10, Math.round(proximityScore - loadPenalty));

      // Calculate travel ETA based on vehicle speed
      // Walk: 5 km/h, Bicycle: 15 km/h, Motorbike/Car: 40 km/h
      const vehicle = (volunteer.vehicle || "").toLowerCase();
      let speedKmh = 25; // default
      if (vehicle.includes("walk")) speedKmh = 5;
      else if (vehicle.includes("bicycle") || vehicle.includes("bike")) speedKmh = 15;
      else if (vehicle.includes("car") || vehicle.includes("van") || vehicle.includes("motorbike")) speedKmh = 40;

      // Time (minutes) = (distance / speed) * 60 + buffer
      const travelTimeMinutes = Math.round((distanceKm / speedKmh) * 60 + 8);

      return {
        volunteerId: volunteer._id,
        name: volunteer.name,
        email: volunteer.email,
        phone: volunteer.phone,
        vehicle: volunteer.vehicle || "Bicycle",
        availability: volunteer.availability || "flexible",
        distanceKm,
        activeRuns,
        score,
        eta: `${travelTimeMinutes} mins`,
        latitude: volLat,
        longitude: volLng,
      };
    })
  );

  // Sort descending by suitability score
  return rankedVolunteers.sort((a, b) => b.score - a.score);
}
