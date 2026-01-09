import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, TrendingUp, Cpu, ChevronDown, Instagram, X as XIcon } from 'lucide-react';

// Custom TikTok Icon (Since Lucide doesn't have it)
const TikTokIcon = ({ size = 24, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-navy-900 text-white font-sans selection:bg-gold-400 selection:text-navy-900 flex flex-col">
      
      {/* 1. HEADER - UPDATED FOR LOGO SIZE/POSITION */}
      <nav className="fixed w-full z-50 bg-navy-900/80 backdrop-blur-md border-b border-white/5">
        {/* Removed max-w-7xl to allow full width, reduced px to 4 for extreme left */}
        <div className="w-full px-4 md:px-8 h-24 flex items-center justify-between">
          
          {/* Logo Section - Increased Size */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href = '/'}>
            <img src="/logo.png" alt="Gapeva" className="h-14 w-auto object-contain" />
            <span className="font-serif text-3xl text-gold-400 tracking-wide font-bold hidden sm:block">GAPEVA</span>
          </div>
          
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
            <a href="#how-it-works" className="hover:text-gold-400 transition-colors">How it Works</a>
            <a href="#performance" className="hover:text-gold-400 transition-colors">Performance</a>
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

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-navy-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-white mb-4">The Quantitative Edge</h2>
            <p className="text-gray-400">Powered by math, not emotion.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-navy-900 p-8 rounded-2xl border border-white/5 hover:border-gold-400/30 transition-all">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                <Cpu size={24} />
              </div>
              <h3 className="font-serif text-xl text-white mb-3">AI-Driven Logic</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Our bot analyzes EMA 200/50 trends and RSI momentum 24/7. It executes trades with millisecond precision that humans cannot match.
              </p>
            </div>
            <div className="bg-navy-900 p-8 rounded-2xl border border-white/5 hover:border-gold-400/30 transition-all">
              <div className="w-12 h-12 bg-gold-400/10 rounded-xl flex items-center justify-center text-gold-400 mb-6">
                <Shield size={24} />
              </div>
              <h3 className="font-serif text-xl text-white mb-3">Zero-Loss Protection</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The "Panic Switch" protocol instantly liquidates assets to stablecoins if the market drops 5% in 24 hours. Your principal is sacred.
              </p>
            </div>
            <div className="bg-navy-900 p-8 rounded-2xl border border-white/5 hover:border-gold-400/30 transition-all">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 mb-6">
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

      {/* 4. FAQ */}
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

      {/* 5. FOOTER - UPDATED WITH SOCIALS & LINKS */}
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
                  <a href="#performance" className="hover:text-gold-400 transition-colors">Performance</a>
                  <a href="/support" className="hover:text-gold-400 transition-colors">Contact Support</a>
                </div>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Legal</h4>
                <div className="flex flex-col gap-3 text-sm text-gray-400">
                  <a href="/terms" className="hover:text-gold-400 transition-colors">Terms of Service</a>
                  <a href="/privacy" className="hover:text-gold-400 transition-colors">Privacy Policy</a>
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

export default Landing;
