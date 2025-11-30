import { Router } from 'express';
import { runMCPWorkflow } from '../controllers/mcp.controller';

const router = Router();

router.post('/', runMCPWorkflow);

export default router;
