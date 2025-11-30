import { Request, Response } from 'express';
import { supabase } from '../services/supabase.service';

export const getNotifications = async (req: Request, res: Response) => {
  const userId = req.query.userId as string;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*, cases(id, status, persons(name))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateLocation = async (req: Request, res: Response) => {
  const { userId, lat, lng, address } = req.body;

  if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Check if volunteer profile exists
    const { data: existing } = await supabase
      .from('volunteers')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existing) {
      const { error } = await (supabase
        .from('volunteers') as any)
        .update({ 
            location_lat: lat, 
            location_lng: lng, 
            location_address: address 
        })
        .eq('user_id', userId);
      if (error) throw error;
    } else {
      // Create new volunteer profile
      // Need name from users table or request. For now, fetch user email.
      const { data: userData } = await supabase.from('users').select('email').eq('id', userId).single();
      
      const { error } = await (supabase
        .from('volunteers') as any)
        .insert({
            user_id: userId,
            name: (userData as any)?.email?.split('@')[0] || 'Volunteer',
            location_lat: lat,
            location_lng: lng,
            location_address: address
        });
      if (error) throw error;
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
