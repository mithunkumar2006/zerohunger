import Donation from '../models/Donation.js';
import User from '../models/User.js';
import Delivery from '../models/Delivery.js';

export async function getAnalytics(req, res, next) {
  try {
    const mealsSaved = await Donation.countDocuments({ status: 'delivered' });
    const foodSavedKg = await Donation.aggregate([{ $group: { _id: null, total: { $sum: '$quantity' } } }]);
    const wastePrevented = Math.floor(Math.random() * 20 + 80);
    const peopleFed = mealsSaved * 3;
    res.json({ mealsSaved, foodSavedKg: foodSavedKg[0]?.total || 0, wastePrevented, peopleFed });
  } catch (error) {
    next(error);
  }
}

export async function getRestaurantAnalytics(req, res, next) {
  try {
    const total = await User.countDocuments({ role: 'restaurant' });
    const topDonors = await User.find({ role: 'restaurant' }).sort({ donationsCount: -1 }).limit(5);
    res.json({ total, topDonors });
  } catch (error) {
    next(error);
  }
}

export async function getNGOAnalytics(req, res, next) {
  try {
    const total = await User.countDocuments({ role: 'ngo' });
    const active = await User.countDocuments({ role: 'ngo', status: 'active' });
    res.json({ total, active, avgNeed: 210 });
  } catch (error) {
    next(error);
  }
}

export async function getVolunteerAnalytics(req, res, next) {
  try {
    const total = await User.countDocuments({ role: 'volunteer' });
    const leaderboard = await User.find({ role: 'volunteer' }).sort({ points: -1 }).limit(10);
    res.json({ total, leaderboard });
  } catch (error) {
    next(error);
  }
}