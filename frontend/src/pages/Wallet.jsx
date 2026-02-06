import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DepositModal from '../components/DepositModal';
import WithdrawModal from '../components/WithdrawModal';
import { Wallet, ArrowDownCircle, ArrowUpCircle, History, CreditCard } from 'lucide-react';

const WalletPage = () => {
    const [activeTab, setActiveTab] = useState('deposit');
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

    // Mock wallet data (replace with actual hook or context later)
    const walletBalance = 0.00;

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto">
                <div className="mb-10 flex items-end justify-between">
                    <div>
                        <h1 className="text-4xl font-serif text-white mb-3 tracking-tight">Financial Hub</h1>
                        <p className="text-gray-500 font-sans tracking-wide">Manage your institutional capital and liquidity streams.</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Total Liquidity</p>
                        <h2 className="text-3xl font-serif text-gold-400">${walletBalance.toFixed(2)}</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Actions Card */}
                    <div className="lg:col-span-2 glass-card rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>

                        <div className="flex gap-6 mb-8 relative z-10">
                            <button
                                onClick={() => setActiveTab('deposit')}
                                className={`flex-1 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 border ${activeTab === 'deposit'
                                        ? 'bg-gold-400 text-navy-900 border-gold-400 shadow-lg scale-[1.02]'
                                        : 'bg-navy-900/40 text-gray-500 border-gray-800 hover:border-gold-400/30 hover:text-white'
                                    }`}
                            >
                                Deposit Assets
                            </button>
                            <button
                                onClick={() => setActiveTab('withdraw')}
                                className={`flex-1 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 border ${activeTab === 'withdraw'
                                        ? 'bg-gold-400 text-navy-900 border-gold-400 shadow-lg scale-[1.02]'
                                        : 'bg-navy-900/40 text-gray-500 border-gray-800 hover:border-gold-400/30 hover:text-white'
                                    }`}
                            >
                                Withdraw Funds
                            </button>
                        </div>

                        <div className="relative z-10 min-h-[400px]">
                            {activeTab === 'deposit' ? (
                                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                            <ArrowDownCircle size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl text-white font-serif">Inbound Liquidity</h3>
                                            <p className="text-xs text-gray-500 uppercase tracking-widest">Select funding method</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div
                                            onClick={() => setIsDepositModalOpen(true)}
                                            className="group cursor-pointer p-6 rounded-2xl bg-navy-900/60 border border-gray-800 hover:border-gold-400/50 hover:bg-navy-800 transition-all duration-300"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <CreditCard className="text-gray-400 group-hover:text-gold-400 transition-colors" size={24} />
                                                <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-1 rounded">INSTANT</span>
                                            </div>
                                            <h4 className="text-lg text-white font-serif mb-1">M-Pesa Express</h4>
                                            <p className="text-xs text-gray-500 leading-relaxed">Direct mobile money integration. Zero processing fees for institutional tiers.</p>
                                        </div>

                                        <div className="p-6 rounded-2xl bg-navy-900/20 border border-gray-800/50 opacity-60 cursor-not-allowed">
                                            <div className="flex justify-between items-start mb-4">
                                                <Wallet className="text-gray-600" size={24} />
                                                <span className="bg-gray-800 text-gray-500 text-[10px] font-bold px-2 py-1 rounded">SOON</span>
                                            </div>
                                            <h4 className="text-lg text-gray-400 font-serif mb-1">Crypto Transfer</h4>
                                            <p className="text-xs text-gray-600 leading-relaxed">USDT / BTC Direct Deposit via Layer-2 Networks.</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                            <ArrowUpCircle size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl text-white font-serif">Outbound Transfer</h3>
                                            <p className="text-xs text-gray-500 uppercase tracking-widest">Select destination wallet</p>
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-navy-900/60 border border-gray-800 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Available to Withdraw</p>
                                            <p className="text-2xl text-white font-serif">${walletBalance.toFixed(2)}</p>
                                        </div>
                                        <button
                                            onClick={() => setIsWithdrawModalOpen(true)}
                                            className="bg-gold-400 text-navy-900 px-6 py-2 rounded-lg font-bold text-sm hover:bg-white transition-colors"
                                        >
                                            Initiate Transfer
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Transaction History Sidebar (Mock) */}
                    <div className="glass-card rounded-3xl p-6">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                            <History size={18} className="text-gold-400" />
                            <h3 className="text-lg text-white font-serif">Ledger History</h3>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 text-xs">
                                            <ArrowDownCircle size={14} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-white font-bold">Deposit</p>
                                            <p className="text-[10px] text-gray-500">Oct 24, 14:30</p>
                                        </div>
                                    </div>
                                    <span className="text-green-400 font-mono text-xs">+$500.00</span>
                                </div>
                            ))}
                            <div className="text-center pt-4">
                                <button className="text-xs text-gold-400 hover:text-white transition-colors uppercase tracking-widest">View Full Ledger</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Integration with Original Modals */}
                <DepositModal
                    isOpen={isDepositModalOpen}
                    onClose={() => setIsDepositModalOpen(false)}
                // Pass props as needed, or fetch inside modal
                />

                <WithdrawModal
                    isOpen={isWithdrawModalOpen}
                    onClose={() => setIsWithdrawModalOpen(false)}
                    maxBalance={walletBalance}
                />
            </div>
        </DashboardLayout>
    );
};

export default WalletPage;
