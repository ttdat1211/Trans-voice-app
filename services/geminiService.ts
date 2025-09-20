
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      // remove the "data:mime/type;base64," prefix
      resolve(base64data.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

interface TranslationResult {
  transcript: string;
  translation: string;
}

export const transcribeAndTranslate = async (audioBlob: Blob, mimeType: string, targetLanguage: string): Promise<TranslationResult> => {
  const audioBase64 = await blobToBase64(audioBlob);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: audioBase64,
              },
            },
            {
              text: `You will be given an audio file. Your task is to first transcribe the spoken content of the audio, and then translate the transcription into ${targetLanguage}.`,
            },
          ],
        },
      ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          transcript: {
            type: Type.STRING,
            description: "The verbatim transcription of the audio content in its original language."
          },
          translation: {
            type: Type.STRING,
            description: `The translation of the transcript into ${targetLanguage}.`
          }
        }
      }
    }
  });
  
  const text = response.text.trim();
  try {
    const result = JSON.parse(text);
    if (result.transcript && result.translation) {
      return result as TranslationResult;
    } else {
      throw new Error("Invalid JSON structure in Gemini response.");
    }
  } catch (e) {
    console.error("Failed to parse Gemini JSON response:", text);
    throw new Error("Could not understand the response from the AI. The response was not valid JSON.");
  }
};
