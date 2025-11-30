import { Router } from 'express';
import { createCase, getAllCases, notifyNewCase } from '../controllers/case.controller';

const router = Router();

router.get('/', getAllCases);
router.post('/', createCase);
router.post('/notify', notifyNewCase);

export default router;
