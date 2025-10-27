
import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- KONTEN DARI services/geminiService.ts ---
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


// --- KONTEN DARI components/HeartIcon.tsx ---
const HeartIcon: React.FC<{className?: string}> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
};

// --- KONTEN DARI components/Loader.tsx ---
const Loader: React.FC = () => {
  return (
    <svg 
      className="animate-spin h-5 w-5 text-white" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      ></circle>
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};


// --- KONTEN DARI components/ResultCard.tsx ---
const ResultCard: React.FC<{percentage: number; message: string;}> = ({ percentage, message }) => {
  const getProgressColor = () => {
    if (percentage < 60) return 'bg-yellow-400';
    if (percentage < 85) return 'bg-orange-400';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md text-center animate-fade-in">
      <p className="text-gray-600 font-semibold">Tingkat Kecocokan Kalian</p>
      <div className="relative my-4 w-32 h-32 mx-auto flex items-center justify-center">
         <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-rose-100"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className={`${getProgressColor().replace('bg-', 'text-')}`}
            strokeDasharray={`${percentage}, 100`}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-3xl font-bold text-rose-600">{percentage}%</span>
      </div>
      <p className="text-gray-700 italic">"{message}"</p>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// --- KONTEN DARI App.tsx ---
const App: React.FC = () => {
  const [name1, setName1] = useState<string>('');
  const [name2, setName2] = useState<string>('');
  const [result, setResult] = useState<{ percentage: number; message: string } | null>(null);
  const [story, setStory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingStory, setIsGeneratingStory] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [isKeyNeeded, setIsKeyNeeded] = useState<boolean>(true);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini-api-key');
    if (savedKey) {
      try {
        initializeAi(savedKey);
        setIsKeyNeeded(!isAiInitialized());
      } catch (err) {
        console.error("Failed to initialize AI with saved key:", err);
        localStorage.removeItem('gemini-api-key');
        setIsKeyNeeded(true);
      }
    } else {
      setIsKeyNeeded(true);
    }
  }, []);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey) {
      initializeAi(apiKey);
      localStorage.setItem('gemini-api-key', apiKey);
      setIsKeyNeeded(false);
      setApiKey(''); // Clear input after submission
    }
  };

  const ApiKeyModal = () => (
    <div className="w-full max-w-md mx-auto bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8">
        <div className="text-center">
            <h2 className="font-pacifico text-3xl text-rose-500 mb-4">Kunci API Gemini</h2>
            <p className="text-gray-600 mb-6">Untuk menggunakan kalkulator cinta ini, kamu perlu memasukkan Kunci API Google AI Studio.</p>
            <form onSubmit={handleApiKeySubmit}>
            <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Masukkan Kunci API di sini"
                className="w-full px-4 py-3 bg-white border-2 border-rose-200 rounded-full focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition-all duration-300"
            />
            <button
                type="submit"
                disabled={!apiKey}
                className="w-full mt-4 bg-rose-500 text-white font-bold py-3 rounded-full shadow-lg hover:bg-rose-600 active:scale-95 transform transition-all duration-300 disabled:bg-rose-300"
            >
                Simpan & Mulai
            </button>
            </form>
            <p className="text-xs text-gray-500 mt-4">
            Kunci API-mu disimpan di browser saja.
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline ml-1">
                Dapatkan Kunci API gratis.
            </a>
            </p>
        </div>
    </div>
  );

  const handleCalculate = useCallback(async () => {
    if (!name1 || !name2) {
      setError('Mohon masukkan kedua nama.');
      return;
    }
    if (!isAiInitialized()) {
      setError('Kunci API belum diatur. Mohon segarkan halaman dan masukkan kunci.');
      setIsKeyNeeded(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setStory(null);

    try {
      const combinedNames = (name1 + name2).toLowerCase().replace(/\s/g, '');
      let sum = 0;
      for (let i = 0; i < combinedNames.length; i++) {
        sum += combinedNames.charCodeAt(i);
      }
      const percentage = (sum % 61) + 40;

      const message = await generateLoveMessage(name1, name2, percentage);
      setResult({ percentage, message });

    } catch (err) {
      console.error(err);
      setError('Oops! Ada sedikit masalah dengan ramalan cinta. Coba lagi nanti ya.');
    } finally {
      setIsLoading(false);
    }
  }, [name1, name2]);

  const handleGenerateStory = useCallback(async () => {
    setIsGeneratingStory(true);
    try {
      const generatedStory = await generateLoveStory(name1, name2);
      setStory(generatedStory);
    } catch (err) {
      console.error(err);
      setError('Maaf, kisah cinta kalian terlalu epic untuk ditulis saat ini. Coba sesaat lagi.');
    } finally {
      setIsGeneratingStory(false);
    }
  }, [name1, name2]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 to-teal-100 flex flex-col items-center justify-center p-4">
        {isKeyNeeded ? <ApiKeyModal /> : (
            <main className="w-full max-w-md mx-auto bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 transform transition-all duration-500">
                <div className="text-center mb-8">
                <h1 className="font-pacifico text-4xl md:text-5xl text-rose-500">Kalkulator Cinta</h1>
                <p className="text-gray-600 mt-2">Cari tahu seberapa cocok kamu dan dia!</p>
                </div>
                
                <div className="space-y-6">
                <div className="relative">
                    <input
                    type="text"
                    value={name1}
                    onChange={(e) => setName1(e.target.value)}
                    placeholder="Nama Kamu"
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-rose-200 rounded-full focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition-all duration-300"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400">
                        <HeartIcon className="w-6 h-6"/>
                    </div>
                </div>
                <div className="relative">
                    <input
                    type="text"
                    value={name2}
                    onChange={(e) => setName2(e.target.value)}
                    placeholder="Nama Pasangan"
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-rose-200 rounded-full focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition-all duration-300"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400">
                        <HeartIcon className="w-6 h-6"/>
                    </div>
                </div>
                
                <button
                    onClick={handleCalculate}
                    disabled={isLoading || isGeneratingStory}
                    className="w-full bg-rose-500 text-white font-bold py-4 rounded-full flex items-center justify-center space-x-2 shadow-lg hover:bg-rose-600 active:scale-95 transform transition-all duration-300 disabled:bg-rose-300 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                    <>
                        <Loader />
                        <span>Meramal...</span>
                    </>
                    ) : (
                        <>
                        <HeartIcon className="w-6 h-6"/>
                        <span>Hitung Cinta</span>
                        </>
                    )}
                </button>
                </div>

                {error && <p className="text-red-500 text-center mt-4 animate-pulse">{error}</p>}
                
                <div className="mt-8 min-h-[150px]">
                {result && !isLoading && <ResultCard percentage={result.percentage} message={result.message} />}
                </div>
                
                {result && !isLoading && !story && !isGeneratingStory && (
                <div className="mt-6 text-center">
                    <button
                    onClick={handleGenerateStory}
                    className="bg-transparent border-2 border-rose-400 text-rose-500 font-semibold py-2 px-6 rounded-full hover:bg-rose-100 active:scale-95 transform transition-all duration-300"
                    >
                    Buatkan Cerita Cinta Kami
                    </button>
                </div>
                )}

                {isGeneratingStory && (
                <div className="flex justify-center items-center mt-6 space-x-2 text-gray-600">
                    <Loader />
                    <span>Menulis kisah cinta...</span>
                </div>
                )}

                {story && (
                <div className="mt-6 bg-rose-50/50 p-4 rounded-xl shadow-inner animate-fade-in">
                    <h3 className="font-pacifico text-2xl text-rose-500 text-center mb-2">Kisah Cinta Kalian</h3>
                    <p className="text-gray-700 whitespace-pre-wrap text-sm">{story}</p>
                </div>
                )}

            </main>
        )}
      <footer className="text-center mt-8 text-gray-500">
        <p>Dibuat dengan <HeartIcon className="w-4 h-4 inline-block text-rose-500" /> oleh VANDOM</p>
      </footer>
    </div>
  );
};

// --- LOGIKA RENDER ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
