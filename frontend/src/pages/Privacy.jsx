import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-navy-900 text-white font-sans p-6 md:p-12">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gold-400 hover:text-white mb-8">
        <ArrowLeft size={20} /> Back to Home
      </button>
      <div className="max-w-3xl mx-auto prose prose-invert">
        <h1 className="font-serif text-4xl text-gold-400 mb-8">Privacy Policy</h1>
        
        <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Data Collection</h3>
        <p className="text-gray-300">We collect your Name, Email, and Phone number solely for account security and verification purposes.</p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Data Security</h3>
        <p className="text-gray-300">Your personal data is encrypted using industry-standard protocols. We do not sell your data to third parties.</p>
      </div>
    </div>
  );
};
export default Privacy;
