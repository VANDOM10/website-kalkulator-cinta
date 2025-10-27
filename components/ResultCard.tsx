import React from 'react';

interface ResultCardProps {
  percentage: number;
  message: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ percentage, message }) => {
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
      {/* FIX: Removed unsupported `jsx` prop from `<style>` tag to resolve TypeScript error. */}
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

export default ResultCard;
