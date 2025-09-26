import { Router } from 'express';
import { supabase } from '../services/supabase.service';

const router = Router();

// Get all reports
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        cases:case_id (
          *,
          persons:person_id (
            *,
            photos (*)
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reports:', error);
      return res.status(500).json({ error: 'Failed to fetch reports' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific report by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        cases:case_id (
          *,
          persons:person_id (
            *,
            photos (*)
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching report:', error);
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get reports by case ID
router.get('/case/:caseId', async (req, res) => {
  try {
    const { caseId } = req.params;

    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        cases:case_id (
          *,
          persons:person_id (
            *,
            photos (*)
          )
        )
      `)
      .eq('case_id', caseId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reports for case:', error);
      return res.status(500).json({ error: 'Failed to fetch reports for case' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching reports for case:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
