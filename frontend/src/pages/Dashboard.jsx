import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  return (
    <DashboardLayout>
      {/* 1. Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Wallet Balance (Safe) */}
        <div className="bg-navy-800 p-6 rounded-xl border border-gray-800 relative overflow-hidden group hover:border-gold-400/30 transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gold-400/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
            <p className="text-gray-400 text-sm font-sans uppercase tracking-wider mb-1">Wallet Balance (Safe)</p>
            <h3 className="text-3xl font-serif text-white">$1,250.00</h3>
        </div>

        {/* Trading Balance (Active) */}
        <div className="bg-navy-800 p-6 rounded-xl border border-gold-400/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gold-400/10 rounded-full -mr-10 -mt-10 animate-pulse"></div>
            <p className="text-gold-400 text-sm font-sans uppercase tracking-wider mb-1">Active Trading Capital</p>
            <h3 className="text-3xl font-serif text-gold-400">$5,000.00</h3>
        </div>

        {/* Total Profit */}
        <div className="bg-navy-800 p-6 rounded-xl border border-gray-800 relative overflow-hidden">
            <p className="text-gray-400 text-sm font-sans uppercase tracking-wider mb-1">Total Net Profit</p>
            <h3 className="text-3xl font-serif text-green-400">+$340.50</h3>
            <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded mt-2 inline-block">+12.4% This Month</span>
        </div>
      </div>

      {/* 2. Gold Gradient Performance Chart */}
      <div className="bg-navy-800 p-6 rounded-xl border border-gray-800 mb-8">
        <h3 className="font-serif text-lg text-white mb-6">Portfolio Performance</h3>
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis dataKey="name" stroke="#6b7280" tickLine={false} axisLine={false} />
                    <YAxis stroke="#6b7280" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#0A0F1E', borderColor: '#D4AF37', borderRadius: '8px' }}
                        itemStyle={{ color: '#D4AF37' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorGold)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Agent Intelligence Log (Transparency) */}
      <div className="bg-navy-800 p-6 rounded-xl border border-gray-800">
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-white">Agent Intelligence Console</h3>
            <span className="flex items-center gap-2 text-xs text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Live Processing
            </span>
        </div>
        <div className="bg-navy-900 rounded-lg p-4 font-mono text-sm text-gray-400 space-y-2 max-h-40 overflow-y-auto">
            <p>[14:30:05] <span className="text-blue-400">ANALYSIS:</span> BTC/USDT Price $42,150. Trend is Neutral.</p>
            <p>[14:31:00] <span className="text-yellow-400">WAITING:</span> RSI is 45. No clear entry signal.</p>
            <p>[14:32:00] <span className="text-green-400">CHECK:</span> Global Pool Sync Complete. Balance Verified.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
