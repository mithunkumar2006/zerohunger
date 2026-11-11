import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { getUsers, getUserById, updateUser, suspendUser, approveUser, deleteUser } from '../controllers/userController.js';

import User from '../models/User.js';

const router = express.Router();

router.get('/', authenticate, authorize('admin'), getUsers);
router.get('/pending-approvals', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const ngos = await User.countDocuments({ role: 'ngo', approved: false });
    const volunteers = await User.countDocuments({ role: 'volunteer', approved: false });
    res.json({ ngos, volunteers });
  } catch (error) {
    next(error);
  }
});
router.get('/:id', authenticate, getUserById);
router.put('/:id', authenticate, authorize('admin'), updateUser);
router.patch('/:id/suspend', authenticate, authorize('admin'), suspendUser);
router.patch('/:id/approve', authenticate, authorize('admin'), approveUser);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

export default router;