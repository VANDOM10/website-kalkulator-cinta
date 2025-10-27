
import { GoogleGenAI } from "@google/genai";

// Kunci API akan disediakan oleh pengguna melalui UI, karena process.env tidak tersedia di browser.
let ai: GoogleGenAI | null = null;

/**
 * Menginisialisasi instance GoogleGenAI dengan Kunci API yang disediakan pengguna.
 * @param apiKey Kunci API untuk Google Gemini.
 */
export const initializeAi = (apiKey: string) => {
  if (!apiKey) {
    throw new Error("Kunci API tidak boleh kosong.");
  }
  ai = new GoogleGenAI({ apiKey });
};

/**
 * Memeriksa apakah instance AI telah diinisialisasi.
 * @returns boolean
 */
export const isAiInitialized = (): boolean => !!ai;

export const generateLoveMessage = async (name1: string, name2: string, percentage: number): Promise<string> => {
  if (!ai) {
    throw new Error("Layanan AI belum diinisialisasi. Harap berikan Kunci API terlebih dahulu.");
  }

  const prompt = `Kamu adalah seorang ahli ramal cinta yang jenaka dan puitis. Berdasarkan nama '${name1}' dan '${name2}' yang memiliki skor kecocokan ${percentage}%, tuliskan sebuah pesan cinta yang singkat (maksimal 2 kalimat), unik, dan menyenangkan untuk mereka. Gunakan bahasa yang santai dan romantis.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error generating content from Gemini:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
       return "Kunci API Gemini-mu sepertinya tidak valid. Periksa kembali ya!";
    }
    return "Cinta kalian begitu besar, bahkan AI pun tak sanggup menggambarkannya! Coba lagi nanti ya.";
  }
};

export const generateLoveStory = async (name1: string, name2: string): Promise<string> => {
  if (!ai) {
    throw new Error("Layanan AI belum diinisialisasi. Harap berikan Kunci API terlebih dahulu.");
  }
  
  const prompt = `Kamu adalah seorang pencerita yang kreatif dan romantis. Tuliskan sebuah cerita pendek yang imajinatif (sekitar 3-4 paragraf) tentang bagaimana dua orang bernama '${name1}' dan '${name2}' pertama kali bertemu dan akhirnya jatuh cinta. Buatlah cerita yang unik, mengharukan, dan sedikit jenaka.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating love story from Gemini:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
        return "Kisah cinta kalian tak bisa ditulis karena kunci API-nya salah. Yuk, coba perbaiki dulu.";
     }
    return "Sepertinya tinta takdir sedang habis untuk menuliskan kisah cinta kalian. Sungguh sebuah romansa yang luar biasa! Coba lagi sesaat lagi.";
  }
};
