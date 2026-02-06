import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import AllocationModal from '../components/AllocationModal';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowRightLeft } from 'lucide-react';
import { walletService } from '../services/api';

// Mock Data for the chart (Will be replaced by API data later)
const data = [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 4200 },
    { name: 'Wed', value: 4100 },
    { name: 'Thu', value: 4500 },
    { name: 'Fri', value: 4800 },
    { name: 'Sat', value: 4700 },
    { name: 'Sun', value: 5100 },
];

const Dashboard = () => {
    // State
    const [isAllocModalOpen, setIsAllocModalOpen] = useState(false);

    const [walletBalance, setWalletBalance] = useState(0.00);
    const [tradingBalance, setTradingBalance] = useState(0.00);
    const [userEmail, setUserEmail] = useState('');
    const [userPhone, setUserPhone] = useState('');

    const fetchWallet = async () => {
        try {
            const res = await walletService.getWallets(); // Current endpoint returns list or single?
            // backend get_wallet returns the Wallet object directly based on new code
            // Checking api.js: getWallets calls GET /api/v1/wallets/
            // My new backend code changed GET / to return the wallet object.
            // If api.js points to /, then res.data is the wallet.
            if (res.data) {
                setWalletBalance(parseFloat(res.data.wallet_balance));
                setTradingBalance(parseFloat(res.data.trading_balance));
            }
        } catch (e) {
            console.error("Failed to fetch wallet", e);
        }
    };

    useEffect(() => {
        fetchWallet();

        // Get user info from localStorage (set during login)
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData.email) {
            setUserEmail(userData.email);
            setUserPhone(userData.phone || '');
        }
    }, []);

    return (
        <DashboardLayout>
            {/* 1. Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">

                {/* Wallet Balance (Safe) */}
                <div className="glass-card p-8 rounded-2xl relative overflow-hidden group hover:border-gold-400/40 transition-all duration-500 gold-glow">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125 duration-700"></div>

                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-gold-400/60 text-[10px] font-sans uppercase tracking-[0.2em] mb-2 font-bold">Liquid Reserve (Safe)</p>
                            <h3 className="text-4xl font-serif text-white tracking-tight">
                                ${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 relative z-10">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Verify via Protocol Ledger</p>
                    </div>
                </div>

                {/* Trading Balance (Active) */}
                <div
                    onClick={() => setIsAllocModalOpen(true)}
                    className="glass-card p-8 rounded-2xl border-gold-400/30 relative overflow-hidden cursor-pointer group hover:bg-navy-800/60 transition-all duration-500 gold-glow"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 rounded-full -mr-16 -mt-16 animate-pulse"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-gold-400 text-[10px] font-sans uppercase tracking-[0.2em] mb-2 font-bold">Active Deployment</p>
                            <h3 className="text-4xl font-serif gold-gradient-text tracking-tight">
                                ${tradingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </h3>
                        </div>
                        <div className="bg-gold-400/10 p-2.5 rounded-xl text-gold-400 border border-gold-400/20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                            <ArrowRightLeft size={20} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 relative z-10">
                        <span className="text-[10px] text-gold-400 font-bold uppercase tracking-widest">+ Manage Allocation Strategy</span>
                    </div>
                </div>

                {/* Total Profit */}
                <div className="glass-card p-8 rounded-2xl relative overflow-hidden group hover:border-green-400/40 transition-all duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/5 rounded-full -mr-16 -mt-16"></div>
                    <p className="text-gray-500 text-[10px] font-sans uppercase tracking-[0.2em] mb-2 font-bold">Protocol Yield (Net)</p>
                    <h3 className="text-4xl font-serif text-green-400 tracking-tight">+$0.00</h3>
                    <div className="flex items-center gap-2 mt-4">
                        <span className="text-[10px] text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 font-bold uppercase tracking-wider">Market Analysis Pending</span>
                    </div>
                </div>
            </div>

            {/* 2. Gold Gradient Performance Chart */}
            <div className="glass-card p-8 rounded-3xl mb-10 relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="font-serif text-xl text-white tracking-tight">Strategy Alpha Performance</h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">7-Day Aggregated Intelligence</p>
                    </div>
                    <div className="flex gap-2">
                        {['1D', '1W', '1M', 'ALL'].map(t => (
                            <button key={t} className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${t === '1W' ? 'bg-gold-400 text-navy-900' : 'text-gray-500 hover:text-white'}`}>{t}</button>
                        ))}
                    </div>
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.05)" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="#374151"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 10, fontWeight: 600, fill: '#6b7280' }}
                            />
                            <YAxis
                                stroke="#374151"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 10, fontWeight: 600, fill: '#6b7280' }}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0A0F1E', borderColor: 'rgba(212,175,55,0.3)', borderRadius: '12px', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                                itemStyle={{ color: '#D4AF37', fontWeight: 700 }}
                                cursor={{ stroke: '#D4AF37', strokeWidth: 1, strokeDasharray: '3 3' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#D4AF37"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorGold)"
                                animationDuration={2000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 3. Agent Intelligence Log (Transparency) */}
            <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-400/30 to-transparent"></div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="font-serif text-xl text-white tracking-tight">Neural Execution Console</h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Real-Time Protocol Logic</p>
                    </div>
                    <span className="flex items-center gap-2 text-[10px] font-bold text-green-400 px-3 py-1 bg-green-400/10 rounded-full border border-green-400/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                        SYNCHRONIZED
                    </span>
                </div>
                <div className="bg-black/40 rounded-2xl p-6 font-mono text-[11px] text-gray-400 space-y-3 max-h-48 overflow-y-auto border border-white/5 shadow-inner">
                    <p className="flex gap-4"><span className="text-gray-600">[14:30:05]</span> <span className="text-blue-400/80 font-bold">ANALYSIS:</span> <span className="text-gray-300">BTC/USDT liquidity depth scanned at $42,150. Trend coefficient: Neutral (0.52).</span></p>
                    <p className="flex gap-4"><span className="text-gray-600">[14:31:00]</span> <span className="text-yellow-400/80 font-bold">WAITING:</span> <span className="text-gray-300">RSI convergence detected at 45.3. Volatility threshold not met for entry.</span></p>
                    <p className="flex gap-4"><span className="text-gray-600">[14:32:00]</span> <span className="text-green-400/80 font-bold">STATUS:</span> <span className="text-gray-300">Global Pool synchronization complete. Smart Contract audit: Valid.</span></p>
                    <p className="flex gap-4"><span className="text-gray-600">[14:32:45]</span> <span className="text-gold-400/80 font-bold">OPTIMIZE:</span> <span className="text-gray-300">Recalibrating slippage parameters for next epoch.</span></p>
                </div>
            </div>

            {/* Modals */}
            <AllocationModal
                isOpen={isAllocModalOpen}
                onClose={() => setIsAllocModalOpen(false)}
                onSuccess={fetchWallet}
                maxBalance={walletBalance} // Simplified: passing wallet balance. In modal we can handle switching max.
            />

        </DashboardLayout>
    );
};

export default Dashboard;
