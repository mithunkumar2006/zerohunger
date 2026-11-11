import mongoose from 'mongoose';
import Delivery from '../models/Delivery.js';

export async function getDeliveries(req, res, next) {
  try {
    const user = req.user;
    let query = {};
    if (user.role === 'volunteer') query = { volunteer: user._id };
    else if (user.role === 'ngo') query = { ngo: user._id };
    const deliveries = await Delivery.find(query)
      .populate('volunteer ngo', 'name email phone address')
      .populate({
        path: 'donation',
        populate: { path: 'donor ngo', select: 'name email phone address' }
      });
    res.json(deliveries);
  } catch (error) {
    next(error);
  }
}

export async function getDeliveryById(req, res, next) {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate('volunteer ngo', 'name email phone address')
      .populate({
        path: 'donation',
        populate: { path: 'donor ngo', select: 'name email phone address' }
      });
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
    res.json(delivery);
  } catch (error) {
    next(error);
  }
}

export async function assignDelivery(req, res, next) {
  try {
    const { volunteerId } = req.body;
    const delivery = await Delivery.findByIdAndUpdate(req.params.id, { volunteer: volunteerId, status: 'Assigned' }, { new: true });
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
    res.json(delivery);
  } catch (error) {
    next(error);
  }
}

export async function updateDeliveryStatus(req, res, next) {
  try {
    const { status } = req.body;
    const delivery = await Delivery.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

    // Sync to Donation status
    let donationStatus = 'assigned';
    if (status === 'Accepted') donationStatus = 'accepted';
    else if (status === 'Picked Up') donationStatus = 'picked_up';
    else if (status === 'Delivered') donationStatus = 'delivered';
    else if (status === 'Cancelled') donationStatus = 'matched';

    if (delivery.donation) {
      const Donation = mongoose.models.Donation || mongoose.model('Donation');
      await Donation.findByIdAndUpdate(delivery.donation, { status: donationStatus });
    }

    res.json(delivery);
  } catch (error) {
    next(error);
  }
}

export async function updateDeliveryTelemetry(req, res, next) {
  try {
    const { lat, lng } = req.body;
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      { volunteerLocation: { lat, lng } },
      { new: true }
    );
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
    res.json(delivery);
  } catch (error) {
    next(error);
  }
}