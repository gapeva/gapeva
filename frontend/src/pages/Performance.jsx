import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Performance = () => {
  // --- Simulated Live Data State ---
  const [btcPrice, setBtcPrice] = useState(48230.50);
  const [activeBots, setActiveBots] = useState(1240);
  const [totalVolume, setTotalVolume] = useState(14502000);

  // Effect to simulate "Live" ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setBtcPrice(prev => prev + (Math.random() - 0.5) * 50);
      setTotalVolume(prev => prev + Math.random() * 500);
      if (Math.random() > 0.8) setActiveBots(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-yellow-500 selection:text-slate-900">
      
      {/* --- Navigation (Consistent with Landing) --- */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            GAPEVA
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
            <Link to="/support" className="hover:text-yellow-400 transition-colors">Support</Link>
            <Link to="/login" className="px-5 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 rounded-full font-bold transition-all">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* --- Header Section --- */}
      <header className="pt-32 pb-12 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Global <span className="text-yellow-400">Trading Performance</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Real-time metrics from our high-frequency trading engines. Transparency is our core value.
        </p>
      </header>

      {/* --- Live Stats Grid --- */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat Card 1 */}
          <div className="bg-slate-800/50 p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
            <div className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">Total Volume (24h)</div>
            <div className="text-3xl font-bold text-white">
              ${totalVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-green-400 text-sm mt-2 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              +12.4% vs yesterday
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-slate-800/50 p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
            <div className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">Active Bot Instances</div>
            <div className="text-3xl font-bold text-yellow-400">{activeBots.toLocaleString()}</div>
            <div className="text-slate-400 text-sm mt-2">Running distributed strategies</div>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-slate-800/50 p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
            <div className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">Live BTC Index</div>
            <div className="text-3xl font-bold text-white">
              ${btcPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-yellow-400 text-sm mt-2 animate-pulse">
              ● Live Market Feed
            </div>
          </div>
        </div>
      </section>

      {/* --- Performance Chart Section --- */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="bg-slate-800 p-8 rounded-3xl border border-white/5 shadow-2xl">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white">Cumulative Returns</h3>
              <p className="text-slate-400">Average strategy performance over last 30 days</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-green-400">+24.8%</div>
              <div className="text-slate-500 text-sm">Net APY (Annualized)</div>
            </div>
          </div>

          {/* CSS-only Chart (No external library needed) */}
          <div className="relative h-64 w-full flex items-end gap-2 md:gap-4 overflow-hidden">
            {/* Bars */}
            {[35, 42, 45, 40, 55, 60, 58, 65, 70, 75, 72, 80, 85, 90, 88, 95].map((height, i) => (
              <div key={i} className="flex-1 group relative">
                <div 
                  className="w-full bg-gradient-to-t from-yellow-600/20 to-yellow-500 rounded-t-sm transition-all duration-500 hover:bg-yellow-400"
                  style={{ height: `${height}%` }}
                ></div>
                 {/* Tooltip on hover */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Return: {height / 10}%
                </div>
              </div>
            ))}
          </div>
          {/* X-Axis Labels */}
          <div className="flex justify-between text-slate-500 text-sm mt-4 px-2">
            <span>Day 1</span>
            <span>Day 15</span>
            <span>Day 30</span>
          </div>
        </div>
      </section>

      {/* --- Call to Action --- */}
      <section className="py-20 bg-yellow-500 text-slate-900 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to join the winners?</h2>
          <p className="text-xl font-medium mb-8 opacity-90">Start your automated trading journey today with transparent performance.</p>
          <Link to="/login" className="inline-block bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-slate-950 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} Gapeva Trading. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm font-medium text-slate-400">
             <Link to="/terms" className="hover:text-yellow-400">Terms</Link>
             <Link to="/privacy" className="hover:text-yellow-400">Privacy</Link>
             <Link to="/support" className="hover:text-yellow-400">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Performance;
