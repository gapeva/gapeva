import React, { useState } from 'react';
import { walletService } from '../services/api';
import { X, ArrowDownCircle } from 'lucide-react';

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
            alert(res.data.message); // Show "Funds will arrive in 24h"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-navy-800 w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="bg-navy-900 p-6 flex justify-between items-center border-b border-white/5">
                    <h3 className="font-serif text-xl text-white">Withdraw Funds</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className="bg-yellow-900/20 p-4 rounded-lg flex items-start gap-3 border border-yellow-500/20">
                        <ArrowDownCircle className="text-yellow-400 shrink-0" size={24} />
                        <p className="text-sm text-yellow-200">
                            Withdrawal requests are processed within 24 hours. A 35% performance/service fee applies to all withdrawals as per terms.
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
                                placeholder="0.00"
                            />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>Available: ${maxBalance}</span>
                        </div>
                    </div>

                    {/* Fee Breakdown */}
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-400">
                            <span>Requested:</span>
                            <span>${amount || "0.00"}</span>
                        </div>
                        <div className="flex justify-between text-red-400">
                            <span>Fee (35%):</span>
                            <span>-${fee}</span>
                        </div>
                        <div className="border-t border-gray-700 pt-2 flex justify-between text-white font-bold">
                            <span>You Receive:</span>
                            <span>${net}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleWithdraw}
                        disabled={loading}
                        className="w-full bg-gold-400 hover:bg-gold-500 text-navy-900 font-bold py-4 rounded-lg transition-colors flex justify-center cursor-pointer disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Confirm Withdrawal"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WithdrawModal;
