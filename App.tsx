
import React, { useState, useCallback, useEffect } from 'react';
import { generateLoveMessage, generateLoveStory, initializeAi, isAiInitialized } from './services/geminiService.ts';
import ResultCard from './components/ResultCard.tsx';
import Loader from './components/Loader.tsx';
import HeartIcon from './components/HeartIcon.tsx';

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

export default App;
