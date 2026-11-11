import Donation from '../models/Donation.js';
import User from '../models/User.js';
import { analyzeFoodData } from '../services/aiService.js';
import { findBestNGOs, findNearestVolunteers } from '../services/matchingService.js';
import Delivery from '../models/Delivery.js';

export async function createDonation(req, res, next) {
  try {
    const { foodName, category, quantity, storageType, prepTime, expiryTime, location, imageUrl, imageUrls, locationCoords } = req.body;
    const donor = req.user;
    if (!['restaurant', 'household'].includes(donor.role)) {
      return res.status(403).json({ error: 'Only restaurants or household donors can create donations' });
    }

    const analysis = await analyzeFoodData({
      foodName,
      category,
      quantity,
      storageType,
      prepTime,
      imageUrl: imageUrls?.[0] || imageUrl,
    });

    const donation = await Donation.create({
      donor: donor._id,
      donorRole: donor.role,
      foodName,
      category,
      quantity,
      storageType,
      prepTime,
      expiryTime,
      location,
      locationCoords: locationCoords || {
        type: "Point",
        coordinates: [donor.longitude || 80.2707, donor.latitude || 13.0827],
        address: location,
        placeId: "",
      },
      imageUrl: imageUrls?.[0] || imageUrl,
      imageUrls: imageUrls || (imageUrl ? [imageUrl] : []),
      ...analysis,
      status: 'pending',
    });

    donor.donationsCount += 1;
    await donor.save();

    return res.status(201).json(donation);
  } catch (error) {
    next(error);
  }
}

export async function getDonations(req, res, next) {
  try {
    const user = req.user;
    const { role } = user;
    let query = {};

    if (role === 'restaurant' || role === 'household') {
      query = { donor: user._id };
    } else if (role === 'ngo') {
      query = { ngo: user._id };
    } else if (role === 'volunteer') {
      query = { volunteer: user._id };
    }

    const donations = await Donation.find(query).populate('donor ngo volunteer', 'name email role');
    return res.json(donations);
  } catch (error) {
    next(error);
  }
}

export async function getDonationById(req, res, next) {
  try {
    const donation = await Donation.findById(req.params.id).populate('donor ngo volunteer', 'name email role');
    if (!donation) return res.status(404).json({ error: 'Donation not found' });
    return res.json(donation);
  } catch (error) {
    next(error);
  }
}

export async function updateDonation(req, res, next) {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ error: 'Donation not found' });

    // Allow donor, assigned ngo, assigned volunteer, or admin to update
    const isDonor = donation.donor.equals(req.user._id);
    const isNgo = donation.ngo && donation.ngo.equals(req.user._id);
    const isVolunteer = donation.volunteer && donation.volunteer.equals(req.user._id);
    const isAdmin = req.user.role === 'admin';

    if (!isDonor && !isNgo && !isVolunteer && !isAdmin) {
      return res.status(403).json({ error: 'Unauthorized to update this donation' });
    }

    Object.assign(donation, req.body);
    await donation.save();
    return res.json(donation);
  } catch (error) {
    next(error);
  }
}

export async function deleteDonation(req, res, next) {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ error: 'Donation not found' });

    if (!donation.donor.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to delete this donation' });
    }

    await donation.deleteOne();
    return res.json({ message: 'Donation removed' });
  } catch (error) {
    next(error);
  }
}

export async function matchNGOs(req, res, next) {
  try {
    const { category, location, urgency } = req.body;
    const matches = await findBestNGOs({ category, location, urgency });
    return res.json(matches);
  } catch (error) {
    next(error);
  }
}

export async function assignVolunteer(req, res, next) {
  try {
    const { volunteerId, ngoId } = req.body;
    const donation = await Donation.findById(req.params.id).populate('donor');
    if (!donation) return res.status(404).json({ error: 'Donation not found' });

    const donor = donation.donor;
    const donorLng = donor.location?.coordinates?.[0] || donor.longitude || 80.2707;
    const donorLat = donor.location?.coordinates?.[1] || donor.latitude || 13.0827;

    let finalVolunteerId = volunteerId;
    let volunteerDetails = null;

    if (!finalVolunteerId) {
      const volunteers = await findNearestVolunteers({ donorLat, donorLng });
      const topVol = volunteers[0];
      if (!topVol) return res.status(404).json({ error: 'No active volunteers available' });
      finalVolunteerId = topVol.volunteerId;
      volunteerDetails = topVol;
    } else {
      const volUser = await User.findById(finalVolunteerId);
      if (!volUser) return res.status(404).json({ error: 'Selected volunteer not found' });
      const volLng = volUser.location?.coordinates?.[0] || volUser.longitude || 80.2620;
      const volLat = volUser.location?.coordinates?.[1] || volUser.latitude || 13.0720;
      
      const distanceKm = Number(getHaversineDistance(donorLat, donorLng, volLat, volLng).toFixed(2));
      volunteerDetails = {
        volunteerId: volUser._id,
        latitude: volLat,
        longitude: volLng,
        distanceKm,
        eta: `${Math.round((distanceKm / 25) * 60 + 8)} mins`
      };
    }

    let finalNgoId = ngoId || donation.ngo;
    if (!finalNgoId) {
      return res.status(400).json({ error: 'An NGO must be selected first before volunteer logistics assignment' });
    }

    donation.ngo = finalNgoId;
    donation.status = 'assigned';
    donation.volunteer = finalVolunteerId;
    await donation.save();

    const ngo = await User.findById(finalNgoId);
    const ngoLng = ngo?.location?.coordinates?.[0] || 80.2500;
    const ngoLat = ngo?.location?.coordinates?.[1] || 13.0650;

    const liveRoute = [
      { lat: volunteerDetails.latitude, lng: volunteerDetails.longitude },
      { lat: donorLat, lng: donorLng },
      { lat: ngoLat, lng: ngoLng }
    ];

    const delivery = await Delivery.create({
      donation: donation._id,
      ngo: finalNgoId,
      volunteer: finalVolunteerId,
      route: `Route from ${donor.name} to ${ngo?.name || 'NGO'}`,
      liveRoute,
      volunteerLocation: { lat: volunteerDetails.latitude, lng: volunteerDetails.longitude },
      distanceKm: volunteerDetails.distanceKm,
      eta: volunteerDetails.eta,
      status: 'Assigned'
    });

    return res.json({ donation, delivery });
  } catch (error) {
    next(error);
  }
}

function getHaversineDistance(lat1, lon1, lat2, lon2) {
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

export async function getNgoSuggestions(req, res, next) {
  try {
    const donation = await Donation.findById(req.params.id).populate('donor');
    if (!donation) return res.status(404).json({ error: 'Donation not found' });

    const donor = donation.donor;
    const donorLng = donor.location?.coordinates?.[0] || donor.longitude || 80.2707;
    const donorLat = donor.location?.coordinates?.[1] || donor.latitude || 13.0827;

    const suggestions = await findBestNGOs({
      donorLat,
      donorLng,
      category: donation.category,
      quantity: donation.quantity
    });

    const volunteers = await findNearestVolunteers({
      donorLat,
      donorLng
    });

    // Save recommendations array to Donation document
    donation.recommendedNGOs = suggestions.map(s => ({
      ngoId: s.ngoId,
      name: s.name,
      confidence: s.confidence,
      distanceKm: s.distanceKm,
      mealsNeeded: s.mealsNeeded,
      recommendationReason: s.recommendationReason
    }));
    await donation.save();

    return res.json({
      donation,
      suggestions,
      volunteers: volunteers.slice(0, 5)
    });
  } catch (error) {
    next(error);
  }
}

export async function triggerAiAnalysis(req, res, next) {
  try {
    const donation = await Donation.findById(req.params.id).populate('donor');
    if (!donation) return res.status(404).json({ error: 'Donation not found' });

    const analysis = await analyzeFoodData({
      foodName: donation.foodName,
      category: donation.category,
      quantity: donation.quantity,
      storageType: donation.storageType,
      prepTime: donation.prepTime,
      imageUrl: donation.imageUrls?.[0] || donation.imageUrl,
    });

    Object.assign(donation, analysis);
    await donation.save();

    return res.json({ success: true, message: "AI evaluation completed successfully", donation });
  } catch (error) {
    next(error);
  }
}
