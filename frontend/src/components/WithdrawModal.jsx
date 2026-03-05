import React, { useState } from 'react';
import { walletService } from '../services/api';
import { X, ArrowDownCircle, ShieldCheck, ChevronRight, Loader2 } from 'lucide-react';

const WithdrawModal = ({ isOpen, onClose, onSuccess, maxBalance }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleWithdraw = async () => {
        if (!amount || isNaN(amount) || amount <= 0) return alert("Enter a valid amount");
        if (parseFloat(amount) > maxBalance) return alert("Insufficient funds");

        setLoading(true);
        try {
            const res = await walletService.withdraw({ amount: parseFloat(amount) });
            alert(res.data.message);
            onSuccess();
            onClose();
            setAmount('');
        } catch (error) {
            console.error(error);
            alert("Withdrawal failed: " + (error.response?.data?.detail || error.message));
        } finally {
            setLoading(false);
        }
    };

    const fee = amount ? (parseFloat(amount) * 0.35).toFixed(2) : "0.00";
    const net = amount ? (parseFloat(amount) - parseFloat(fee)).toFixed(2) : "0.00";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="bg-navy-900 w-full max-w-md rounded-3xl border border-gold-400/20 shadow-[0_0_50px_rgba(212,175,55,0.1)] overflow-hidden">

                {/* Header */}
                <div className="p-6 flex justify-between items-center border-b border-white/5">
                    <h3 className="font-serif text-xl gold-gradient-text italic">Capital Retrieval</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-8">
                    <div className="bg-gold-400/5 p-4 rounded-2xl flex items-start gap-3 border border-gold-400/10">
                        <ArrowDownCircle className="text-gold-400 shrink-0" size={20} />
                        <p className="text-[10px] text-gray-400 leading-relaxed uppercase tracking-wider">
                            Retrieval requests are processed via institutional batching within 24 hours. A 35% performance/service fee applies to all external transfers.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="block text-gray-500 text-[10px] uppercase tracking-widest font-bold">Withdrawal Amount</label>
                            <span className="text-[10px] text-gray-600">Available: ${maxBalance.toLocaleString()}</span>
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

                    {/* Fee Breakdown */}
                    <div className="bg-black/20 rounded-2xl p-6 space-y-4 border border-white/5 shadow-inner">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Gross Requested</span>
                            <span className="text-sm font-serif text-white">${amount || "0.00"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Performance Fee (35%)</span>
                            <span className="text-sm font-serif text-red-500/80">-${fee}</span>
                        </div>
                        <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                            <span className="text-[10px] text-gold-400 uppercase tracking-widest font-bold">Net Settlement</span>
                            <span className="text-lg font-serif text-gold-400">${net}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleWithdraw}
                        disabled={loading || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxBalance}
                        className={`w-full py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${!loading && amount && parseFloat(amount) > 0 && parseFloat(amount) <= maxBalance
                                ? 'bg-gold-400 text-navy-900 shadow-xl hover:scale-[1.02]'
                                : 'bg-white/5 text-gray-600 cursor-not-allowed'
                            }`}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <span>Initiate Withdrawal</span>
                                <ChevronRight size={18} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WithdrawModal;
