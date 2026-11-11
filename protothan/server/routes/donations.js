import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { createDonation, getDonations, getDonationById, updateDonation, deleteDonation, matchNGOs, assignVolunteer, getNgoSuggestions, triggerAiAnalysis } from '../controllers/donationController.js';

const router = express.Router();

router.post('/', authenticate, authorize('restaurant', 'household'), createDonation);
router.get('/', authenticate, getDonations);
router.get('/:id', authenticate, getDonationById);
router.get('/:id/suggestions', authenticate, authorize('admin'), getNgoSuggestions);
router.put('/:id', authenticate, authorize('restaurant', 'household', 'ngo', 'volunteer', 'admin'), updateDonation);
router.delete('/:id', authenticate, authorize('restaurant', 'household', 'admin'), deleteDonation);
router.post('/match', authenticate, authorize('restaurant', 'household', 'admin'), matchNGOs);
router.post('/:id/assign-volunteer', authenticate, authorize('restaurant', 'household', 'ngo', 'admin'), assignVolunteer);
router.post('/:id/trigger-ai', authenticate, authorize('admin'), triggerAiAnalysis);

export default router;