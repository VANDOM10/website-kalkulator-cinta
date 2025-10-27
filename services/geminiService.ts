
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY is not defined in environment variables");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLoveMessage = async (name1: string, name2: string, percentage: number): Promise<string> => {
  const prompt = `Kamu adalah seorang ahli ramal cinta yang jenaka dan puitis. Berdasarkan nama '${name1}' dan '${name2}' yang memiliki skor kecocokan ${percentage}%, tuliskan sebuah pesan cinta yang singkat (maksimal 2 kalimat), unik, dan menyenangkan untuk mereka. Gunakan bahasa yang santai dan romantis.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error generating content from Gemini:", error);
    return "Cinta kalian begitu besar, bahkan AI pun tak sanggup menggambarkannya! Coba lagi nanti ya.";
  }
};

export const generateLoveStory = async (name1: string, name2: string): Promise<string> => {
  const prompt = `Kamu adalah seorang pencerita yang kreatif dan romantis. Tuliskan sebuah cerita pendek yang imajinatif (sekitar 3-4 paragraf) tentang bagaimana dua orang bernama '${name1}' dan '${name2}' pertama kali bertemu dan akhirnya jatuh cinta. Buatlah cerita yang unik, mengharukan, dan sedikit jenaka.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating love story from Gemini:", error);
    return "Sepertinya tinta takdir sedang habis untuk menuliskan kisah cinta kalian. Sungguh sebuah romansa yang luar biasa! Coba lagi sesaat lagi.";
  }
};
