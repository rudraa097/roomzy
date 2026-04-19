import { GoogleGenAI, Type } from "@google/genai";

// Use VITE_GEMINI_API_KEY — exposed safely via Vite's import.meta.env
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });

export const optimizeListing = async (details: {
  title: string;
  address: string;
  rent: number;
  amenities: string[];
  type: string;
}) => {
  try {
    const prompt = `Optimize this rental listing for a mobile app called Roomzy (India market). 
    Make it catchy, professional, and optimized for search ranking.
    
    Current Details:
    Title: ${details.title}
    Address: ${details.address}
    Rent: ₹${details.rent}
    Amenities: ${details.amenities.join(", ")}
    Type: ${details.type}
    
    Provide a new catchy title and a detailed description that highlights the benefits.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimizedTitle: { type: Type.STRING },
            optimizedDescription: { type: Type.STRING },
            suggestedRent: {
              type: Type.NUMBER,
              description: "Suggested fair market rent based on details",
            },
          },
          required: ["optimizedTitle", "optimizedDescription", "suggestedRent"],
        },
      },
    });

    if (!response.text) {
      throw new Error("Empty response from Gemini API");
    }

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Optimization failed:", error);
    throw error;
  }
};
