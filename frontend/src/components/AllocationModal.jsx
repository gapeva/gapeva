import React, { useState } from 'react';
import { walletService } from '../services/api';
import { X, ArrowRightLeft, ShieldCheck, ChevronRight, Loader2 } from 'lucide-react';

const AllocationModal = ({ isOpen, onClose, onSuccess, maxBalance }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [direction, setDirection] = useState('to_trading'); // 'to_trading' or 'to_wallet'

    if (!isOpen) return null;

    const handleTransfer = async () => {
        if (!amount || isNaN(amount) || amount <= 0) return alert("Enter a valid amount");

        setLoading(true);
        try {
            if (direction === 'to_trading') {
                await walletService.allocate({ amount: parseFloat(amount) });
            } else {
                await walletService.deallocate({ amount: parseFloat(amount) });
            }
            onSuccess();
            onClose();
            setAmount('');
        } catch (error) {
            console.error(error);
            alert("Transfer failed: " + (error.response?.data?.detail || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="bg-navy-900 w-full max-w-md rounded-3xl border border-gold-400/20 shadow-[0_0_50px_rgba(212,175,55,0.1)] overflow-hidden">

                {/* Header */}
                <div className="p-6 flex justify-between items-center border-b border-white/5">
                    <h3 className="font-serif text-xl gold-gradient-text italic">Capital Deployment</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-8">
                    {/* Direction Toggle */}
                    <div className="flex gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5 shadow-inner">
                        <button
                            onClick={() => setDirection('to_trading')}
                            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${direction === 'to_trading' ? 'bg-gold-400 text-navy-900 shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Deploy to AI
                        </button>
                        <button
                            onClick={() => setDirection('to_wallet')}
                            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${direction === 'to_wallet' ? 'bg-gold-400 text-navy-900 shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Recall to Safe
                        </button>
                    </div>

                    <div className="bg-gold-400/5 p-4 rounded-2xl flex items-start gap-3 border border-gold-400/10">
                        <ShieldCheck className="text-gold-400 shrink-0" size={20} />
                        <p className="text-[10px] text-gray-400 leading-relaxed uppercase tracking-wider">
                            {direction === 'to_trading'
                                ? "Authorizing deployment of liquid capital to active trading neural networks. Capital is at risk."
                                : "Requesting immediate recall of active capital to institutional-grade safe reserve."}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="block text-gray-500 text-[10px] uppercase tracking-widest font-bold">Allocation Amount</label>
                            <span className="text-[10px] text-gray-600">Limit: ${maxBalance.toLocaleString()}</span>
                        </div>
                        <div className="relative">
                            <span className="absolute left-5 top-4.5 text-gold-400 font-serif">$</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-10 pr-5 text-white focus:border-gold-400/50 focus:outline-none transition-all placeholder:text-gray-800 font-serif text-xl"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleTransfer}
                        disabled={loading || !amount || parseFloat(amount) <= 0}
                        className={`w-full py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${!loading && amount && parseFloat(amount) > 0
                                ? 'bg-white text-navy-900 shadow-xl hover:scale-[1.02]'
                                : 'bg-white/5 text-gray-600 cursor-not-allowed'
                            }`}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <span>Execute {direction === 'to_trading' ? 'Deployment' : 'Recall'}</span>
                                <ChevronRight size={18} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AllocationModal;
