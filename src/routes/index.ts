import { Router } from 'express';
import casesRouter from './cases.router';
import sightingsRouter from './sightings.router';
import authRouter from './auth.router';
import reportsRouter from './reports.router';

const router = Router();

router.use('/cases', casesRouter);
router.use('/sightings', sightingsRouter);
router.use('/auth', authRouter);
router.use('/reports', reportsRouter);

export default router;
