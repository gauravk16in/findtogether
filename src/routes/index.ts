import { Router } from 'express';
import casesRouter from './cases.router';
import sightingsRouter from './sightings.router';
import authRouter from './auth.router';
import volunteerRouter from './volunteer.router';
import mcpRouter from './mcp.router';

const router = Router();

router.use('/cases', casesRouter);
router.use('/sightings', sightingsRouter);
router.use('/auth', authRouter);
router.use('/volunteer', volunteerRouter);
router.use('/mcp', mcpRouter);

export default router;
