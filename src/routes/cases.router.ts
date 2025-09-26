import { Router } from 'express';
import { createCase, getAllCases } from '../controllers/case.controller';

const router = Router();

router.get('/', getAllCases);
router.post('/', createCase);

export default router;
