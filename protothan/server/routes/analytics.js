import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { getAnalytics, getRestaurantAnalytics, getNGOAnalytics, getVolunteerAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/', authenticate, getAnalytics);
router.get('/restaurants', authenticate, authorize('admin', 'restaurant'), getRestaurantAnalytics);
router.get('/ngos', authenticate, authorize('admin', 'ngo'), getNGOAnalytics);
router.get('/volunteers', authenticate, authorize('admin', 'volunteer'), getVolunteerAnalytics);

export default router;