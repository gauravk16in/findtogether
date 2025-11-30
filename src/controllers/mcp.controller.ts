import { Request, Response } from 'express';
import { MCPService } from '../services/mcp.service';

export const runMCPWorkflow = async (req: Request, res: Response) => {
  const { action, payload } = req.body;

  try {
    let result;
    switch (action) {
      case 'report_missing_person':
        result = await MCPService.reportMissingPerson(payload);
        break;
      case 'post_alerts':
        result = await MCPService.postAlerts(payload.caseId);
        break;
      case 'create_search_map':
        result = await MCPService.createSearchMap(payload.location);
        break;
      case 'coordinate_volunteers':
        result = await MCPService.coordinateVolunteers(payload.caseId, payload.location);
        break;
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
    res.json(result);
  } catch (error: any) {
    console.error(`MCP Error [${action}]:`, error);
    res.status(500).json({ error: error.message });
  }
};
