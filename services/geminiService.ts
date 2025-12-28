
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { ChatMode, AspectRatio, ImageSize } from '../types';
import { MODELS } from '../constants';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const generateChatStream = async ({
    prompt,
    image,
    mode
}: {
    prompt: string;
    image?: File;
    mode: ChatMode;
}) => {
    const modelName = MODELS.chat[mode];
    const modelConfig = mode === 'thinking' ? { thinkingConfig: { thinkingBudget: 32768 } } : {};
    
    let contents: any = [{ text: prompt }];
    if (image) {
        const imagePart = await fileToGenerativePart(image);
        contents = [imagePart, { text: prompt }];
    }

    const stream = await ai.models.generateContentStream({
        model: image ? MODELS.imageAnalysis : modelName,
        contents: { parts: contents },
        config: modelConfig,
    });
    
    return stream;
};

export const generateImage = async ({
    prompt,
    aspectRatio,
    size
}: {
    prompt: string;
    aspectRatio: AspectRatio;
    size: ImageSize;
}) => {
    const response = await ai.models.generateContent({
        model: MODELS.imageGen,
        contents: { parts: [{ text: prompt }] },
        config: {
            imageConfig: {
                aspectRatio: aspectRatio,
                imageSize: size,
            },
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    throw new Error("No image generated");
};

export const editImage = async ({
    prompt,
    image
}: {
    prompt: string;
    image: File;
}) => {
    const imagePart = await fileToGenerativePart(image);
    const response = await ai.models.generateContent({
        model: MODELS.imageEdit,
        contents: {
            parts: [imagePart, { text: prompt }],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    throw new Error("No image generated from edit");
};


export const generateWithSearchGrounding = async (prompt: string): Promise<GenerateContentResponse> => {
    const response = await ai.models.generateContent({
        model: MODELS.search,
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });
    return response;
};

export const generateWithMapsGrounding = async (prompt: string, location: { latitude: number; longitude: number }): Promise<GenerateContentResponse> => {
    const response = await ai.models.generateContent({
        model: MODELS.maps,
        contents: prompt,
        config: {
            tools: [{ googleMaps: {} }],
            toolConfig: {
                retrievalConfig: {
                    latLng: location,
                },
            },
        },
    });
    return response;
};
