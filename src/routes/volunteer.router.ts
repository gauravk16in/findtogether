import { Router } from 'express';
import { getNotifications, updateLocation } from '../controllers/volunteer.controller';

const router = Router();

router.get('/notifications', getNotifications);
router.post('/location', updateLocation);

export default router;
