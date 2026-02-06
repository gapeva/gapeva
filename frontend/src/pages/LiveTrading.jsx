import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { TrendingUp, Activity, BarChart2, Clock, DollarSign, Wallet } from 'lucide-react';

const LiveTrading = () => {
    // Mock Data for Order Book
    const asks = [
        { price: 42150.50, amount: 0.542, total: 22845 },
        { price: 42148.00, amount: 1.200, total: 50577 },
        { price: 42145.25, amount: 0.150, total: 6321 },
    ];
    const bids = [
        { price: 42140.00, amount: 0.400, total: 16856 },
        { price: 42138.50, amount: 2.500, total: 105346 },
        { price: 42135.75, amount: 1.100, total: 46349 },
    ];

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
                {/* Top Info Bar */}
                <div className="flex gap-4 min-h-[80px]">
                    <div className="flex-1 glass-card p-4 rounded-xl flex items-center justify-between border-l-4 border-gold-400">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-2xl font-serif text-white tracking-tight">BTC/USDT</h2>
                                <span className="bg-green-500/10 text-green-500 text-[10px] px-2 rounded font-bold">+2.45%</span>
                            </div>
                            <p className="text-gold-400 font-mono text-lg">$42,142.30</p>
                        </div>
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] text-gray-500 uppercase">24h Volume</p>
                            <p className="text-white font-mono text-sm">1.2B USDT</p>
                        </div>
                    </div>

                    {[
                        { label: 'High', val: '43,200', color: 'text-gray-300' },
                        { label: 'Low', val: '41,800', color: 'text-gray-300' },
                        { label: 'Funding', val: '0.01%', color: 'text-gold-400' }
                    ].map((s, i) => (
                        <div key={i} className="glass-card p-4 rounded-xl min-w-[120px] flex flex-col justify-center">
                            <p className="text-[10px] text-gray-500 uppercase mb-1">{s.label}</p>
                            <p className={`font-mono text-sm ${s.color}`}>{s.val}</p>
                        </div>
                    ))}
                </div>

                <div className="flex-1 grid grid-cols-12 gap-4">
                    {/* Chart Area (Main) */}
                    <div className="col-span-12 lg:col-span-8 glass-card rounded-xl p-4 relative overflow-hidden flex items-center justify-center bg-black/40">
                        {/* Placeholder for TradingView Chart */}
                        <div className="text-center">
                            <Activity size={48} className="text-gold-400/20 mx-auto mb-4 animate-pulse" />
                            <h3 className="text-gray-500 font-serif tracking-widest uppercase">Market Data Stream</h3>
                            <p className="text-[10px] text-gray-600">Initializing WebSockets...</p>
                        </div>
                        {/* Visual Fills */}
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-gold-400/50 to-transparent"></div>
                    </div>

                    {/* Order Book & Trade Panel */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
                        {/* Order Book */}
                        <div className="flex-1 glass-card rounded-xl p-4 overflow-hidden">
                            <div className="flex justify-between mb-2 text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                                <span>Price (USDT)</span>
                                <span>Amount (BTC)</span>
                            </div>
                            <div className="space-y-1 font-mono text-xs">
                                {asks.map((o, i) => (
                                    <div key={i} className="flex justify-between relative group cursor-pointer hover:bg-white/5 p-1 rounded">
                                        <span className="text-red-400">{o.price.toFixed(2)}</span>
                                        <span className="text-gray-400">{o.amount.toFixed(3)}</span>
                                        <div className="absolute inset-y-0 right-0 bg-red-500/10" style={{ width: `${Math.random() * 40}%` }}></div>
                                    </div>
                                ))}
                                <div className="py-2 text-center text-xl font-bold text-white border-y border-white/5 my-2">
                                    42,142.30
                                </div>
                                {bids.map((o, i) => (
                                    <div key={i} className="flex justify-between relative group cursor-pointer hover:bg-white/5 p-1 rounded">
                                        <span className="text-green-400">{o.price.toFixed(2)}</span>
                                        <span className="text-gray-400">{o.amount.toFixed(3)}</span>
                                        <div className="absolute inset-y-0 right-0 bg-green-500/10" style={{ width: `${Math.random() * 40}%` }}></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Trade Actions */}
                        <div className="glass-card rounded-xl p-4">
                            <div className="flex gap-2 mb-4 bg-black/20 p-1 rounded-lg">
                                <button className="flex-1 bg-green-500 text-white py-2 rounded text-xs font-bold uppercase hover:bg-green-400 transition-colors">Long</button>
                                <button className="flex-1 text-gray-400 hover:text-white py-2 rounded text-xs font-bold uppercase transition-colors">Short</button>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div>
                                    <label className="text-[10px] text-gray-500 uppercase font-bold">Size (USDT)</label>
                                    <div className="flex items-center bg-black/30 border border-gray-700 rounded-lg px-3 py-2 mt-1 focus-within:border-gold-400 transition-colors">
                                        <DollarSign size={14} className="text-gray-500" />
                                        <input type="text" className="bg-transparent border-none text-white text-sm w-full outline-none text-right font-mono" placeholder="0.00" />
                                    </div>
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-500">
                                    <span>Available</span>
                                    <span className="text-white font-mono">15,420.00 USDT</span>
                                </div>
                            </div>

                            <button className="w-full bg-gold-400 text-navy-900 py-3 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-white transition-all shadow-lg gold-glow">
                                Open Position
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default LiveTrading;
