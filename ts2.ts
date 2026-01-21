
import { GoogleGenAI, Type } from "@google/genai";
import { NailAnalysisResponse } from "../types";

export const analyzeNails = async (base64Image: string): Promise<NailAnalysisResponse> => {
  // Inicializamos dentro de la función para asegurar que tome la API_KEY de Vercel
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const textModel = "gemini-3-flash-preview";
  const imageModel = "gemini-2.5-flash-image";
  
  const systemInstruction = `
    Eres un experto mundial en manicura de lujo. Analiza la foto de la mano y devuelve JSON:
    1. 'colores': 5 códigos HEX elegantes.
    2. 'diseños': 3 nombres de diseños tendencia 2026.
    3. 'explicacion': Breve razón estética (en español).
    RESPONDE SOLO JSON.
  `;

  const textResponse = await ai.models.generateContent({
    model: textModel,
    contents: [
      {
        parts: [
          { text: "Analiza esta mano." },
          { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] } },
        ],
      },
    ],
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          colores: { type: Type.ARRAY, items: { type: Type.STRING } },
          diseños: { type: Type.ARRAY, items: { type: Type.STRING } },
          explicacion: { type: Type.STRING }
        },
        required: ["colores", "diseños", "explicacion"]
      }
    }
  });

  const analysis = JSON.parse(textResponse.text || "{}") as NailAnalysisResponse;

  // Generar las vistas previas
  const imagePromises = analysis.diseños.map(async (diseño) => {
    try {
      const editResponse = await ai.models.generateContent({
        model: imageModel,
        contents: {
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] } },
            { text: `Realistic virtual try-on: Apply professional nail art "${diseño}" to the fingernails. Realistic lighting, perfect fit.` }
          ]
        }
      });
      for (const part of editResponse.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    } catch (e) { return null; }
    return null;
  });

  analysis.imagenesDiseños = (await Promise.all(imagePromises)).filter(img => img !== null) as string[];
  return analysis;
};
