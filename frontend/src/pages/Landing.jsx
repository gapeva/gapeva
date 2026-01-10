import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Shield, TrendingUp, Cpu, ChevronDown, Instagram, X as XIcon, Lock, Wallet, ArrowDown } from 'lucide-react';

// --- CUSTOM COMPONENTS ---

// TikTok Icon
const TikTokIcon = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

// FAQ Item
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="border border-white/5 rounded-lg bg-navy-800/30 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-medium text-gray-200">{question}</span>
        <ChevronDown className={`text-gold-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-6 pb-4 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
          {answer}
        </div>
      )}
    </div>
  );
};

// --- NEW VISUALIZER COMPONENT ---
const SystemVisualizer = () => {
    return (
        <div className="py-12 w-full max-w-5xl mx-auto">
            <h3 className="text-center font-serif text-2xl text-white mb-10">Inside the Protocol: The Flow of Wealth</h3>
            
            {/* Desktop View: Horizontal Flow */}
            <div className="hidden md:flex justify-between items-center gap-4 relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-navy-800 via-gold-400/50 to-navy-800 -z-10"></div>

                {/* Step 1: User */}
                <div className="flex flex-col items-center gap-4 text-center group">
                    <div className="w-20 h-20 bg-navy-800 border-2 border-gold-400/30 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform bg-navy-900 z-10">
                        <Wallet className="text-gold-400" size={32} />
                    </div>
                    <div>
                        <h4 className="font-bold text-white">1. Deposit</h4>
                        <p className="text-xs text-gray-400 max-w-[120px]">You deposit USD via Card (Paystack)</p>
                    </div>
                </div>

                {/* Arrow */}
                <div className="text-gold-400 animate-pulse">
                    <ArrowRight size={24} />
                </div>

                {/* Step 2: Safe Wallet */}
                <div className="flex flex-col items-center gap-4 text-center group">
                    <div className="w-20 h-20 bg-navy-800 border-2 border-green-500/30 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform bg-navy-900 z-10">
                        <Lock className="text-green-400" size={32} />
                    </div>
                    <div>
                        <h4 className="font-bold text-white">2. Secure</h4>
                        <p className="text-xs text-gray-400 max-w-[120px]">Funds sit in your Safe Wallet</p>
                    </div>
                </div>

                {/* Arrow */}
                <div className="text-gold-400 animate-pulse">
                    <ArrowRight size={24} />
                </div>

                {/* Step 3: The Brain */}
                <div className="flex flex-col items-center gap-4 text-center group">
                    <div className="w-24 h-24 bg-navy-800 border-4 border-gold-400 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)] bg-navy-900 z-10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gold-400/10 animate-pulse"></div>
                        <Cpu className="text-gold-400 relative z-10" size={40} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gold-400">3. AI Agent</h4>
                        <p className="text-xs text-gray-400 max-w-[140px]">Allocated capital is traded 24/7 (EMA/RSI)</p>
                    </div>
                </div>

                 {/* Arrow */}
                 <div className="text-gold-400 animate-pulse">
                    <ArrowRight size={24} />
                </div>

                {/* Step 4: Profit */}
                <div className="flex flex-col items-center gap-4 text-center group">
                    <div className="w-20 h-20 bg-navy-800 border-2 border-green-500/30 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform bg-navy-900 z-10">
                        <TrendingUp className="text-green-400" size={32} />
                    </div>
                    <div>
                        <h4 className="font-bold text-white">4. Growth</h4>
                        <p className="text-xs text-gray-400 max-w-[120px]">Profits return to your Dashboard</p>
                    </div>
                </div>
            </div>

            {/* Mobile View: Vertical Flow */}
            <div className="md:hidden flex flex-col items-center gap-8">
                {/* Step 1 */}
                <div className="flex items-center gap-4 w-full bg-navy-800 p-4 rounded-xl border border-white/5">
                    <Wallet className="text-gold-400 shrink-0" size={24} />
                    <div>
                        <h4 className="font-bold text-white text-sm">1. You Deposit Funds</h4>
                        <p className="text-xs text-gray-400">Secure transaction via Paystack</p>
                    </div>
                </div>
                <ArrowDown className="text-gold-400/50" size={20} />
                
                {/* Step 2 */}
                <div className="flex items-center gap-4 w-full bg-navy-800 p-4 rounded-xl border border-white/5">
                    <Lock className="text-green-400 shrink-0" size={24} />
                    <div>
                        <h4 className="font-bold text-white text-sm">2. Safe Wallet Storage</h4>
                        <p className="text-xs text-gray-400">Funds are held safely until you act</p>
                    </div>
                </div>
                <ArrowDown className="text-gold-400/50" size={20} />

                {/* Step 3 */}
                <div className="flex items-center gap-4 w-full bg-navy-900 p-6 rounded-xl border border-gold-400 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                    <Cpu className="text-gold-400 shrink-0 animate-pulse" size={32} />
                    <div>
                        <h4 className="font-bold text-gold-400 text-lg">3. The AI Trades</h4>
                        <p className="text-xs text-gray-300">Bot executes strategy. Panic Switch protects downside.</p>
                    </div>
                </div>
                <ArrowDown className="text-gold-400/50" size={20} />

                {/* Step 4 */}
                <div className="flex items-center gap-4 w-full bg-navy-800 p-4 rounded-xl border border-white/5">
                    <TrendingUp className="text-green-400 shrink-0" size={24} />
                    <div>
                        <h4 className="font-bold text-white text-sm">4. Profit & Withdraw</h4>
                        <p className="text-xs text-gray-400">Compounded gains available 24/7</p>
                    </div>
                </div>
            </div>

            <div className="text-center mt-12">
                <p className="text-gray-400 text-sm max-w-2xl mx-auto italic">
                    "We have stripped away the complexity of charts, candles, and exchanges. You simply see your wealth grow."
                </p>
            </div>
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---
const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-navy-900 text-white font-sans selection:bg-gold-400 selection:text-navy-900 flex flex-col">
      
      {/* 1. HEADER */}
      <nav className="fixed w-full z-50 bg-navy-900/80 backdrop-blur-md border-b border-white/5">
        <div className="w-full px-4 md:px-8 h-24 flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href = '/'}>
            <img src="/logo.png" alt="Gapeva" className="h-14 w-auto object-contain" />
            <span className="font-serif text-3xl text-gold-400 tracking-wide font-bold hidden sm:block">GAPEVA</span>
          </div>
          
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
            <a href="#how-it-works" className="hover:text-gold-400 transition-colors">How it Works</a>
            {/* <Link to="/performance" className="hover:text-gold-400 transition-colors">Performance</Link> */}
            <a href="#faq" className="hover:text-gold-400 transition-colors">FAQ</a>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('/login')} className="text-white hover:text-gold-400 font-medium px-4 py-2 transition-colors">
              Sign In
            </button>
            <button onClick={() => navigate('/login')} className="bg-gold-400 hover:bg-gold-500 text-navy-900 font-bold px-6 py-2 rounded-full transition-all hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="pt-48 pb-20 px-6 flex-grow">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-400 text-sm font-medium mb-8 animate-fade-in">
            The Elite Quantitative Protocol
          </div>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-tight">
            Wealth Preservation <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-yellow-200">
              Automated.
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Institutional-grade algorithmic trading available to everyone. 
            Our AI Agent protects your downside while capturing the market's upside.
            <br/><span className="text-gold-400">Zero Management Fees.</span>
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button onClick={() => navigate('/login')} className="group bg-gold-400 hover:bg-gold-500 text-navy-900 text-lg font-bold px-8 py-4 rounded-full transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] flex items-center gap-2">
              Start Your Journey
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => window.scrollTo(0, 1000)} className="px-8 py-4 rounded-full border border-gray-700 text-gray-300 hover:border-gold-400 hover:text-gold-400 transition-all">
              View Strategy
            </button>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (Updated with Visualizer) */}
      <section id="how-it-works" className="py-24 bg-navy-800/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-white mb-4">The Quantitative Edge</h2>
            <p className="text-gray-400">Powered by math, not emotion.</p>
          </div>

          {/* NEW VISUALIZER INSERTED HERE */}
          <div className="mb-24">
             <SystemVisualizer />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-navy-900 p-8 rounded-2xl border border-white/5 hover:border-gold-400/30 transition-all group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <Cpu size={24} />
              </div>
              <h3 className="font-serif text-xl text-white mb-3">AI-Driven Logic</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Our bot analyzes EMA 200/50 trends and RSI momentum 24/7. It executes trades with millisecond precision that humans cannot match.
              </p>
            </div>

            <div className="bg-navy-900 p-8 rounded-2xl border border-white/5 hover:border-gold-400/30 transition-all group">
              <div className="w-12 h-12 bg-gold-400/10 rounded-xl flex items-center justify-center text-gold-400 mb-6 group-hover:scale-110 transition-transform">
                <Shield size={24} />
              </div>
              <h3 className="font-serif text-xl text-white mb-3">Zero-Loss Protection</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The "Panic Switch" protocol instantly liquidates assets to stablecoins if the market drops 5% in 24 hours. Your principal is sacred.
              </p>
            </div>

            <div className="bg-navy-900 p-8 rounded-2xl border border-white/5 hover:border-gold-400/30 transition-all group">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp size={24} />
              </div>
              <h3 className="font-serif text-xl text-white mb-3">Compounding Growth</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Profits are automatically reinvested. We only make money when you do—charging a performance fee only on pure profit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ SECTION */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-4xl text-center text-white mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <FAQItem 
              question="What is the minimum deposit?" 
              answer="To maintain institutional efficiency, the minimum deposit is strictly $3.00 USD."
            />
            <FAQItem 
              question="How are fees calculated?" 
              answer="We charge a 3% deposit fee and a 35% performance fee on WITHDRAWN profits only. We never touch your principal investment."
            />
            <FAQItem 
              question="Is my money safe?" 
              answer="Yes. We use a Dual-Balance system. Your 'Wallet Balance' is held in stable fiat/USDC, while only the 'Trading Balance' is exposed to the algorithm."
            />
             <FAQItem 
              question="Can I withdraw anytime?" 
              answer="Yes. Withdrawals are processed within 24 hours. The performance fee is automatically deducted at the time of withdrawal."
            />
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-navy-900 border-t border-white/5 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
            
            {/* Footer Logo Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img src="/logo.png" alt="Gapeva" className="h-12 w-auto object-contain" />
                <span className="font-serif text-2xl text-gold-400 tracking-wide font-bold">GAPEVA</span>
              </div>
              <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                The elite algorithmic trading protocol. Automated wealth preservation and growth for the modern investor.
              </p>
            </div>

            {/* Links */}
            <div className="flex gap-16">
              <div>
                <h4 className="text-white font-bold mb-4">Company</h4>
                <div className="flex flex-col gap-3 text-sm text-gray-400">
                  <a href="#how-it-works" className="hover:text-gold-400 transition-colors">How it Works</a>
                  {/* <Link to="/performance" className="hover:text-gold-400 transition-colors">Performance</Link> */}
                  <Link to="/support" className="hover:text-gold-400 transition-colors">Contact Support</Link>
                </div>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Legal</h4>
                <div className="flex flex-col gap-3 text-sm text-gray-400">
                  <Link to="/terms" className="hover:text-gold-400 transition-colors">Terms of Service</Link>
                  <Link to="/privacy" className="hover:text-gold-400 transition-colors">Privacy Policy</Link>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div>
              <h4 className="text-white font-bold mb-4">Connect</h4>
              <div className="flex gap-4 mb-4">
                <a href="https://twitter.com/gapevadotcom" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center text-gray-400 hover:bg-gold-400 hover:text-navy-900 transition-all">
                  <XIcon size={20} />
                </a>
                <a href="https://instagram.com/gapevadotcom" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center text-gray-400 hover:bg-gold-400 hover:text-navy-900 transition-all">
                  <Instagram size={20} />
                </a>
                <a href="https://tiktok.com/@gapevadotcom" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center text-gray-400 hover:bg-gold-400 hover:text-navy-900 transition-all">
                  <TikTokIcon size={20} />
                </a>
              </div>
              <p className="text-gold-400 text-sm font-medium">@gapevadotcom</p>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 text-center md:text-left text-gray-600 text-sm flex flex-col md:flex-row justify-between items-center">
            <p>© 2026 Gapeva Protocol. All Rights Reserved.</p>
            <p>Made with ⭐ for the Elite.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
