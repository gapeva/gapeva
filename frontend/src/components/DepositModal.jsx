import React, { useState } from 'react';
import { PaystackButton } from 'react-paystack';
import api from '../services/api'; // Your axios instance
import { X, CreditCard, ShieldCheck } from 'lucide-react';

const DepositModal = ({ isOpen, onClose, userEmail, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  // Configuration
  const publicKey = "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // REPLACE WITH YOUR PUBLIC KEY
  const amountInCents = amount * 100; // Paystack works in cents/kobo

  const handlePaystackSuccess = async (reference) => {
    setProcessing(true);
    try {
      // Call backend to verify and credit wallet
      await api.post('/wallet/verify-deposit', { reference: reference.reference });
      alert("Deposit Verified! Funds added to wallet.");
      onSuccess(); // Refresh dashboard data
      onClose();
    } catch (error) {
      alert("Verification failed. Please contact support.");
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const componentProps = {
    email: userEmail,
    amount: amountInCents,
    publicKey,
    text: "Confirm Deposit",
    onSuccess: handlePaystackSuccess,
    onClose: () => alert("Transaction cancelled"),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-navy-800 w-full max-w-md rounded-2xl border border-gold-400/20 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-navy-900 p-6 flex justify-between items-center border-b border-white/5">
            <h3 className="font-serif text-xl text-gold-400">Add Capital</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X size={24} />
            </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
            <div className="bg-blue-900/20 p-4 rounded-lg flex items-start gap-3 border border-blue-500/20">
                <ShieldCheck className="text-blue-400 shrink-0" size={24} />
                <p className="text-sm text-blue-200">
                    Funds are held in your secure Wallet Balance until you allocate them to the Trading Bot.
                </p>
            </div>

            <div>
                <label className="block text-gray-400 text-sm mb-2">Amount (USD)</label>
                <div className="relative">
                    <span className="absolute left-4 top-3.5 text-gray-500">$</span>
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-navy-900 border border-gray-700 rounded-lg py-3 pl-8 pr-4 text-white focus:border-gold-400 focus:outline-none"
                        placeholder="100.00"
                    />
                </div>
                <p className="text-xs text-gray-500 mt-2">Minimum deposit: $3.00</p>
            </div>

            {/* Paystack Button Wrapper */}
            <div className="pt-2">
                {amount >= 3 ? (
                    <div className="w-full bg-gold-400 hover:bg-gold-500 text-navy-900 font-bold py-4 rounded-lg transition-colors flex justify-center cursor-pointer">
                         <PaystackButton {...componentProps} className="w-full h-full" />
                    </div>
                ) : (
                    <button disabled className="w-full bg-gray-700 text-gray-500 font-bold py-4 rounded-lg cursor-not-allowed">
                        Enter Amount ($3.00+)
                    </button>
                )}
            </div>
            
            <div className="flex justify-center items-center gap-2 text-gray-500 text-xs">
                <CreditCard size={14} />
                <span>Secured by Paystack</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
