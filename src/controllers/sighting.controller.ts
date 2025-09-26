import { Request, Response } from 'express';
import { supabase } from '../services/supabase.service';
import { compareFacesAI } from '../services/ai.service';

const MATCH_CONFIDENCE_THRESHOLD = 0.8; // Similarity score from Gemini required to be considered a potential match

export const createSighting = async (req: Request, res: Response) => {
  try {
    const { imageData, location, notes } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: 'imageData is required.' });
    }

    // --- 1. Log the Sighting ---
    // In a real app, upload image to storage and get URL
    const imageUrl = 'https://via.placeholder.com/400/sighting'; // Placeholder
    
    const { data: sightingData, error: sightingError } = await supabase
      .from('sightings')
      .insert({ image_url: imageUrl, location, notes } as any)
      .select()
      .single();

    if (sightingError) throw sightingError;
    console.log(`New sighting logged with ID: ${(sightingData as any)?.id}`);

    // --- 2. Find Potential Matches using AI ---
    // Fetch all photos of missing persons associated with an active case.
    const { data: photos, error: photosError } = await supabase
      .from('photos')
      .select(`
        id,
        image_url,
        persons (
          cases (
            status
          )
        )
      `);

    if (photosError) throw photosError;
    
    // Filter for photos where the associated case is currently active.
    const activePhotos = (photos as any[])?.filter((photo: any) => {
      const cases = photo.persons?.cases;
      return cases && cases.some((c: any) => c.status === 'Active Search' || c.status === 'High Priority' || c.status === 'New');
    }) || [];

    console.log(`Found ${activePhotos.length} photos from active cases to compare against.`);

    // Run AI comparisons in parallel for efficiency
    const comparisonPromises = activePhotos.map(async (photo: any) => {
      const { isMatch, confidence } = await compareFacesAI(imageData, photo.image_url);
      
      console.log(`Comparing with photo ID ${photo.id}. AI Result -> Match: ${isMatch}, Confidence: ${confidence.toFixed(4)}`);

      if (isMatch && confidence >= MATCH_CONFIDENCE_THRESHOLD) {
        return {
          sighting_id: (sightingData as any)?.id,
          photo_id: photo.id,
          confidence_score: confidence,
          verification_status: 'pending' as const,
        };
      }
      return null;
    });

    const results = await Promise.all(comparisonPromises);
    const validMatches = results.filter(match => match !== null);

    // --- 3. Log Potential Matches in the database ---
    if (validMatches.length > 0) {
      console.log(`Found ${validMatches.length} potential match(es) above threshold!`);
      const { error: matchError } = await supabase
        .from('potential_matches')
        .insert(validMatches as any);

      if (matchError) throw matchError;
    } else {
      console.log('No strong matches found.');
    }

    res.status(201).json({
      message: 'Sighting reported successfully.',
      sightingId: (sightingData as any)?.id,
      matchesFound: validMatches.length,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};