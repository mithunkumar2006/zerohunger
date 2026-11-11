import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { getDeliveries, updateDeliveryStatus, assignDelivery, getDeliveryById, updateDeliveryTelemetry } from '../controllers/deliveryController.js';

const router = express.Router();

router.get('/', authenticate, getDeliveries);
router.get('/:id', authenticate, getDeliveryById);
router.post('/:id/assign', authenticate, authorize('admin'), assignDelivery);
router.patch('/:id/status', authenticate, authorize('volunteer', 'admin'), updateDeliveryStatus);
router.patch('/:id/telemetry', authenticate, authorize('volunteer', 'admin'), updateDeliveryTelemetry);

export default router;