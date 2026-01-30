import React, { useState, useEffect } from 'react';
import { PaystackButton } from 'react-paystack';
import api from '../services/api';
import { X, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';

const DepositModal = ({ isOpen, onClose, userEmail, userPhone, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAmount('');
      setProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Paystack configuration
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  const amountInCents = amount * 100;

  const handlePaystackSuccess = async (reference) => {
    setProcessing(true);
    try {
      const { walletService } = await import('../services/api');
      await walletService.verifyDeposit({ reference: reference.reference });
      alert("Deposit Verified! Funds added to wallet.");
      onSuccess();
      onClose();
    } catch (error) {
      alert("Verification failed. Please contact support.");
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const paystackComponentProps = {
    email: userEmail,
    amount: amountInCents,
    publicKey,
    text: "Confirm Deposit",
    onSuccess: handlePaystackSuccess,
    onClose: () => alert("Transaction cancelled"),
  };

  const isValidAmount = parseFloat(amount) >= 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-navy-800 w-full max-w-md rounded-2xl border border-gold-400/20 shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-navy-900 p-6 flex justify-between items-center border-b border-white/5">
          <h3 className="font-serif text-xl text-gold-400">Add Capital</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
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

          {/* Payment Method - Fixed to Paystack */}
          <div>
            <label className="block text-gray-400 text-sm mb-3">Payment Method</label>
            <div className="grid grid-cols-1">
              <div className="p-4 rounded-lg border-2 border-gold-400 bg-gold-400/10 flex items-center gap-4">
                <CreditCard className="text-gold-400" size={24} />
                <div>
                  <p className="text-sm font-medium text-gold-400">Card / Bank Transfer</p>
                  <p className="text-xs text-gray-500">Secured by Paystack</p>
                </div>
              </div>
            </div>
          </div>

          {/* Amount Input */}
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
                disabled={processing}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Minimum deposit: $3.00</p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2">
            {processing ? (
              <button disabled className="w-full bg-gray-700 text-gray-500 font-bold py-4 rounded-lg flex justify-center items-center gap-2 cursor-not-allowed">
                <Loader2 className="animate-spin" size={20} />
                Processing...
              </button>
            ) : isValidAmount ? (
              <div className="w-full bg-gold-400 hover:bg-gold-500 text-navy-900 font-bold py-4 rounded-lg transition-colors flex justify-center cursor-pointer">
                <PaystackButton {...paystackComponentProps} className="w-full h-full" />
              </div>
            ) : (
              <button disabled className="w-full bg-gray-700 text-gray-500 font-bold py-4 rounded-lg cursor-not-allowed">
                Enter Amount ($3.00+)
              </button>
            )}
          </div>

          {/* Security Label */}
          <div className="flex justify-center items-center gap-2 text-gray-500 text-xs">
            <ShieldCheck size={14} />
            <span>Encrypted Institutional-Grade Transaction</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
