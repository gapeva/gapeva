import React, { useState, useEffect } from 'react';
import { mpesaService } from '../services/api';
import { X, CreditCard, ShieldCheck, Loader2, CheckCircle2, ChevronRight } from 'lucide-react';

const DepositModal = ({ isOpen, onClose, userEmail, userPhone, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState('input'); // 'input', 'waiting', 'success'

  useEffect(() => {
    if (!isOpen) {
      setAmount('');
      setPhoneNumber(userPhone || '');
      setProcessing(false);
      setStep('input');
    } else {
      if (userPhone) setPhoneNumber(userPhone);
    }
  }, [isOpen, userPhone]);

  if (!isOpen) return null;

  const handleMpesaDeposit = async () => {
    setProcessing(true);
    try {
      const response = await mpesaService.initiateStkPush({
        phone_number: phoneNumber,
        amount: parseFloat(amount)
      });

      if (response.data.status === 'success') {
        setStep('waiting');
        // In a real app, we would poll an endpoint or use WebSockets to detect success.
        // For now, we'll let the user wait or click "Done" after they pay.
      } else {
        const msg = response.data.message || "Failed to initiate M-Pesa request";
        const detail = response.data.detail?.errorMessage || "";
        alert(`${msg} ${detail ? `(${detail})` : ""}`);
        setProcessing(false);
      }

    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.detail || "Connection Error: Failed to reach the server";
      alert(msg);
      setProcessing(false);
    }
  };

  const handleDone = () => {
    onSuccess();
    onClose();
  };

  const isValidAmount = parseFloat(amount) >= 1;
  const isValidPhone = phoneNumber && (phoneNumber.length >= 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-navy-900 w-full max-w-md rounded-3xl border border-gold-400/20 shadow-[0_0_50px_rgba(212,175,55,0.1)] overflow-hidden">

        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b border-white/5">
          <h3 className="font-serif text-xl gold-gradient-text">Elite Capital Inflow</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8">
          {step === 'input' && (
            <div className="space-y-6">
              <div className="bg-gold-400/5 p-4 rounded-2xl flex items-start gap-3 border border-gold-400/10">
                <ShieldCheck className="text-gold-400 shrink-0" size={20} />
                <p className="text-xs text-gray-400 leading-relaxed">
                  Initiating a secure M-Pesa Express gateway. Your capital remains encrypted throughout the process.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-2">Safaricom Number</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-5 text-white focus:border-gold-400/50 focus:outline-none transition-all placeholder:text-gray-700 font-medium"
                    placeholder="2547XXXXXXXX"
                    disabled={processing}
                  />
                </div>

                <div>
                  <label className="block text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-2">Capital Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-5 top-4.5 text-gold-400 font-serif">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-10 pr-5 text-white focus:border-gold-400/50 focus:outline-none transition-all placeholder:text-gray-700 font-serif text-lg"
                      placeholder="100.00"
                      disabled={processing}
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={!isValidAmount || !isValidPhone || processing}
                onClick={handleMpesaDeposit}
                className={`w-full py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${isValidAmount && isValidPhone && !processing
                  ? 'bg-gold-400 text-navy-900 shadow-[0_10px_20px_rgba(212,175,55,0.2)] hover:scale-[1.02]'
                  : 'bg-white/5 text-gray-600 cursor-not-allowed'
                  }`}
              >
                {processing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Establishing Secure Link...</span>
                  </>
                ) : (
                  <>
                    <span>Authorize Transaction</span>
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            </div>
          )}

          {step === 'waiting' && (
            <div className="py-8 text-center space-y-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full border-4 border-gold-400/20 border-t-gold-400 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <CreditCard className="text-gold-400" size={32} />
                </div>
              </div>
              <div>
                <h4 className="text-white text-lg font-serif mb-2">Check Your Mobile Device</h4>
                <p className="text-gray-400 text-sm max-w-[250px] mx-auto leading-relaxed">
                  Enter your M-Pesa PIN on the prompt to authorize the <strong>${amount}</strong> deposit.
                </p>
              </div>
              <button
                onClick={handleDone}
                className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all font-medium border border-white/5"
              >
                I've Authorized the Payment
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="py-8 text-center space-y-6">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                <CheckCircle2 className="text-green-500" size={40} />
              </div>
              <div>
                <h4 className="text-white text-lg font-serif mb-2">Capital Secured</h4>
                <p className="text-gray-400 text-sm">
                  Your deposit has been successfully synchronized with the protocol ledger.
                </p>
              </div>
              <button
                onClick={handleDone}
                className="w-full py-4 bg-gold-400 text-navy-900 rounded-2xl font-bold"
              >
                Return to Observation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositModal;