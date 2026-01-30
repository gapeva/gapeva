import React, { useState } from 'react';
import { walletService } from '../services/api';
import { X, ArrowRightLeft } from 'lucide-react';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-navy-800 w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="bg-navy-900 p-6 flex justify-between items-center border-b border-white/5">
                    <h3 className="font-serif text-xl text-white">Manage Capital</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className="flex gap-2 bg-navy-900 p-1 rounded-lg">
                        <button
                            onClick={() => setDirection('to_trading')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${direction === 'to_trading' ? 'bg-gold-400 text-navy-900' : 'text-gray-400 hover:text-white'}`}
                        >
                            To Trading
                        </button>
                        <button
                            onClick={() => setDirection('to_wallet')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${direction === 'to_wallet' ? 'bg-gold-400 text-navy-900' : 'text-gray-400 hover:text-white'}`}
                        >
                            To Wallet
                        </button>
                    </div>

                    <div className="bg-blue-900/20 p-4 rounded-lg flex items-start gap-3 border border-blue-500/20">
                        <ArrowRightLeft className="text-blue-400 shrink-0" size={24} />
                        <p className="text-sm text-blue-200">
                            {direction === 'to_trading'
                                ? "Move funds from Safe Wallet to Trading Bot. Capital is at risk."
                                : "Move profits/capital from Trading Bot to Safe Wallet."}
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
                        <p className="text-xs text-gray-500 mt-2">Available to move: ${maxBalance}</p>
                    </div>

                    <button
                        onClick={handleTransfer}
                        disabled={loading}
                        className="w-full bg-white hover:bg-gray-200 text-navy-900 font-bold py-4 rounded-lg transition-colors flex justify-center cursor-pointer disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Confirm Transfer"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AllocationModal;
