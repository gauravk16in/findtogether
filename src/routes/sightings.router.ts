import { Router } from 'express';
import { createSighting } from '../controllers/sighting.controller';

const router = Router();

router.post('/', createSighting);

export default router;
