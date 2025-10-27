
import React, { useState, useCallback } from 'react';
import { generateLoveMessage, generateLoveStory } from './services/geminiService';
import ResultCard from './components/ResultCard';
import Loader from './components/Loader';
import HeartIcon from './components/HeartIcon';

const App: React.FC = () => {
  const [name1, setName1] = useState<string>('');
  const [name2, setName2] = useState<string>('');
  const [result, setResult] = useState<{ percentage: number; message: string } | null>(null);
  const [story, setStory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingStory, setIsGeneratingStory] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = useCallback(async () => {
    if (!name1 || !name2) {
      setError('Mohon masukkan kedua nama.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setStory(null); // Reset story on new calculation

    try {
      // Simple deterministic "love score" calculation
      const combinedNames = (name1 + name2).toLowerCase().replace(/\s/g, '');
      let sum = 0;
      for (let i = 0; i < combinedNames.length; i++) {
        sum += combinedNames.charCodeAt(i);
      }
      const percentage = (sum % 61) + 40; // Generates a score between 40 and 100

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
      <footer className="text-center mt-8 text-gray-500">
        <p>Dibuat dengan <HeartIcon className="w-4 h-4 inline-block text-rose-500" /> oleh VANDOM</p>
      </footer>
    </div>
  );
};

export default App;