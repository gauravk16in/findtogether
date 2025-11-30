import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import fetch from 'node-fetch';

// Initialize the Google Gemini AI client
// Ensure API_KEY is set in your environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Fetches an image from a URL and converts it to a base64 encoded string.
 * @param url The URL of the image to fetch.
 * @returns A promise that resolves to the base64 string.
 */
async function urlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from ${url}: ${response.statusText}`);
  }
  const buffer = await response.buffer();
  return buffer.toString('base64');
}

/**
 * Compares two images using the Gemini model to determine if they are of the same person.
 * @param base64Image1 - Base64 encoded string of the first image (e.g., from a sighting).
 * @param imageUrl2 - URL of the second image (e.g., from the database).
 * @returns A promise that resolves to an object with match status and confidence score.
 */
export const compareFacesAI = async (
  base64Image1: string,
  imageUrl2: string
): Promise<{ isMatch: boolean; confidence: number }> => {
  try {
    console.log(`AI Service: Comparing faces. Sighting image vs. DB image URL: ${imageUrl2}`);
    
    // Fetch the second image from its URL and convert it to base64
    const base64Image2 = await urlToBase64(imageUrl2);

    const imagePart1 = {
      inlineData: { mimeType: 'image/jpeg', data: base64Image1 },
    };
    const imagePart2 = {
      inlineData: { mimeType: 'image/jpeg', data: base64Image2 },
    };

    const textPart = {
      text: `Carefully compare the person in these two images. Are they the same individual? 
      Provide your response in a raw JSON format, without any markdown formatting. The JSON must have two fields: 
      1. "isMatch": a boolean (true if it's the same person, false otherwise).
      2. "confidence": a number between 0.0 and 1.0 representing your confidence in the match decision.`,
    };

    // Call the Gemini API with the two images and the text prompt
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: { parts: [imagePart1, imagePart2, textPart] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isMatch: { type: Type.BOOLEAN },
              confidence: { type: Type.NUMBER },
            },
            required: ['isMatch', 'confidence'],
          },
        }
    });

    const jsonString = response.text?.trim() || '{}';
    const result = JSON.parse(jsonString);

    console.log('AI Service: Comparison result:', result);
    return {
      isMatch: result.isMatch,
      confidence: result.confidence,
    };
  } catch (error) {
    console.error('Error in Gemini API call:', error);
    // Return a default non-match response in case of an API or parsing error
    return { isMatch: false, confidence: 0 };
  }
};