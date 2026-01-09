import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-navy-900 text-white font-sans p-6 md:p-12">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gold-400 hover:text-white mb-8">
        <ArrowLeft size={20} /> Back to Home
      </button>
      <div className="max-w-3xl mx-auto prose prose-invert">
        <h1 className="font-serif text-4xl text-gold-400 mb-8">Terms of Service</h1>
        <p className="text-gray-400 mb-4">Last Updated: January 2026</p>
        
        <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h3>
        <p className="text-gray-300">By accessing and using the Gapeva Protocol, you agree to be bound by these terms. Gapeva provides an automated algorithmic trading service.</p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Financial Risks</h3>
        <p className="text-gray-300">Cryptocurrency trading involves significant risk. While our "Panic Switch" protocol is designed to mitigate loss, past performance is not indicative of future results.</p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">3. Fees & Withdrawals</h3>
        <p className="text-gray-300">A 35% performance fee is applied only to profits upon withdrawal. Principal amounts are never taxed by the protocol.</p>
      </div>
    </div>
  );
};
export default Terms;
