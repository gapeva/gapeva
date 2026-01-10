import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Performance = () => {
  // --- Live Chart Engine State ---
  const [dataPoints, setDataPoints] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(48230.50);
  const [activeBots, setActiveBots] = useState(1240);
  const [totalVolume, setTotalVolume] = useState(14502000);
  const maxPoints = 40; // How many points to show on the chart

  // Initialize data with a trend
  useEffect(() => {
    const initialData = [];
    let price = 48000;
    for (let i = 0; i < maxPoints; i++) {
      price = price + (Math.random() - 0.45) * 50; // Slight upward bias
      initialData.push(price);
    }
    setDataPoints(initialData);
    setCurrentPrice(price);
  }, []);

  // Live Ticker Effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Update Price with random volatility
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.45) * 35;
        const newPrice = prev + change;
        
        // Update Chart Data
        setDataPoints(prevData => {
          const newData = [...prevData.slice(1), newPrice];
          return newData;
        });
        return newPrice;
      });

      // Simulate Volume & Bot changes
      setTotalVolume(prev => prev + Math.random() * 1200);
      if (Math.random() > 0.7) setActiveBots(prev => prev + (Math.random() > 0.5 ? 1 : -1));

    }, 1500); // Update every 1.5 seconds for "Live" feel
    return () => clearInterval(interval);
  }, []);

  // --- Chart Helper: Generate SVG Path ---
  const getSvgPath = (data, width, height) => {
    if (data.length === 0) return "";
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    
    // Calculate coordinates
    const points = data.map((d, i) => {
      const x = (i / (maxPoints - 1)) * width;
      const y = height - ((d - min) / range) * (height * 0.8) - (height * 0.1); // Add padding
      return `${x},${y}`;
    });

    // Create smooth Bezier curve
    let d = `M ${points[0]}`;
    for (let i = 1; i < points.length; i++) {
        const [x0, y0] = points[i - 1].split(',');
        const [x1, y1] = points[i].split(',');
        const cX = (parseFloat(x0) + parseFloat(x1)) / 2;
        d += ` C ${cX},${y0} ${cX},${y1} ${x1},${y1}`;
    }
    return { path: d, lastPoint: points[points.length - 1] };
  };

  const chartHeight = 300;
  const chartWidth = 1000; // SVG viewBox width
  const { path: linePath, lastPoint } = getSvgPath(dataPoints, chartWidth, chartHeight);
  const areaPath = `${linePath} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-yellow-500 selection:text-slate-900 overflow-x-hidden">
      
      {/* --- Navigation (Updated with Performance Link) --- */}
      <nav className="fixed top-0 w-full bg-slate-950/90 backdrop-blur-md z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent tracking-tight">
            GAPEVA
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/performance" className="text-yellow-400">Performance</Link>
            <Link to="/support" className="hover:text-white transition-colors">Support</Link>
          </div>

          <div className="flex items-center gap-4">
             <Link to="/login" className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-medium transition-all text-sm backdrop-blur-sm">
              Client Login
            </Link>
          </div>
        </div>
      </nav>

      {/* --- Header Section --- */}
      <header className="pt-40 pb-16 px-6 text-center">
        <div className="inline-block mb-4 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-400 text-xs font-bold tracking-widest uppercase">
          Live Market Data
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white">
          Institutional <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700">Grade Results</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
          Proprietary algorithms executing high-frequency strategies. <br className="hidden md:block"/>
          We deliver alpha through superior technology.
        </p>
      </header>

      {/* --- The "BlackRock Style" Chart Section --- */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="bg-slate-900 border border-white/5 rounded-3xl p-1 shadow-2xl overflow-hidden relative group">
          
          {/* Chart Header */}
          <div className="absolute top-8 left-8 z-10">
            <h3 className="text-white text-xl font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Strategy Performance
            </h3>
            <div className="text-3xl font-bold text-white mt-1">
              ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-sm font-normal text-green-400 ml-3 bg-green-400/10 px-2 py-1 rounded">+2.4% (24h)</span>
            </div>
          </div>

          {/* Timeframe Selectors (Visual Only) */}
          <div className="absolute top-8 right-8 z-10 flex gap-2">
            {['1H', '1D', '1W', '1M', 'YTD'].map((tf, i) => (
              <button key={tf} className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${i === 1 ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}>
                {tf}
              </button>
            ))}
          </div>

          {/* SVG Chart */}
          <div className="relative w-full h-[400px] md:h-[500px] bg-gradient-to-b from-slate-900 to-slate-950">
             {/* Grid Lines */}
             <div className="absolute inset-0 w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '100% 100px' }}></div>

             <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none" className="w-full h-full block">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EAB308" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#EAB308" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Area Fill */}
                <path d={areaPath} fill="url(#chartGradient)" className="transition-all duration-300 ease-linear" />
                
                {/* Line Stroke */}
                <path d={linePath} fill="none" stroke="#EAB308" strokeWidth="3" className="transition-all duration-300 ease-linear" />

                {/* Pulsing Dot at the end */}
                {lastPoint && (
                  <g transform={`translate(${lastPoint})`}>
                    <circle r="6" fill="#EAB308" />
                    <circle r="12" fill="#EAB308" opacity="0.3">
                      <animate attributeName="r" from="6" to="20" dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  </g>
                )}
             </svg>
          </div>

          {/* Stats Footer within Chart Card */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5 border-t border-white/5 bg-white/[0.02]">
            <div className="p-6 text-center">
               <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Total Volume</div>
               <div className="text-white font-bold">${(totalVolume/1000000).toFixed(2)}M</div>
            </div>
            <div className="p-6 text-center">
               <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Active Instances</div>
               <div className="text-white font-bold">{activeBots.toLocaleString()}</div>
            </div>
            <div className="p-6 text-center">
               <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Avg. APY</div>
               <div className="text-green-400 font-bold">24.8%</div>
            </div>
            <div className="p-6 text-center">
               <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Status</div>
               <div className="text-white font-bold flex items-center justify-center gap-2">
                 <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer (Standard) --- */}
      <footer className="bg-slate-950 py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-500 text-sm">
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
