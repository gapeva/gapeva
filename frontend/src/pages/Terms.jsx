import React, { useEffect } from 'react';
import { ArrowLeft, ShieldAlert, Scale, ScrollText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();
  
  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-navy-900 text-white font-sans">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-navy-900/90 backdrop-blur-md border-b border-white/5 px-6 h-20 flex items-center">
         <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gold-400 hover:text-white transition-colors font-medium">
            <ArrowLeft size={20} /> Back to Home
         </button>
      </nav>

      <div className="pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 border-b border-white/10 pb-8">
            <h1 className="font-serif text-4xl md:text-5xl text-gold-400 mb-4">Terms of Service</h1>
            <p className="text-gray-400">Effective Date: January 1, 2026</p>
            <p className="text-gray-400">Version: 2.1 (Institutional Grade)</p>
        </div>

        {/* Content */}
        <div className="space-y-12 text-gray-300 leading-relaxed">
            
            <section>
                <h3 className="text-2xl font-serif text-white mb-4 flex items-center gap-3">
                    <ScrollText className="text-gold-400" size={24} /> 
                    1. Introduction & Acceptance
                </h3>
                <p className="mb-4">
                    Welcome to the Gapeva Protocol ("Gapeva," "we," "us," or "our"). By accessing our website, creating an account, or depositing funds into the Gapeva Algorithmic Trading Protocol, you ("User" or "Investor") agree to be bound legally by these Terms of Service.
                </p>
                <p>
                    Gapeva is an automated wealth preservation and growth tool that utilizes quantitative analysis to execute trades in the cryptocurrency markets. If you do not agree to these terms, you must strictly refrain from using our services. These terms constitute a binding legal agreement between you and Gapeva.
                </p>
            </section>

            <section className="bg-navy-800/50 p-6 rounded-xl border border-gold-400/20">
                <h3 className="text-2xl font-serif text-gold-400 mb-4 flex items-center gap-3">
                    <ShieldAlert className="text-gold-400" size={24} /> 
                    2. Risk Disclosure Statement
                </h3>
                <p className="mb-4 font-medium text-white">
                    Trading cryptocurrencies involves a significant level of risk and may not be suitable for all investors.
                </p>
                <p className="mb-4 text-sm">
                    <strong>2.1 Volatility:</strong> The digital asset markets are highly volatile. While Gapeva employs a "Zero-Loss" architectural goal via our Panic Switch mechanism, market conditions such as "Flash Crashes" or exchange outages can result in slippage or temporary loss of value.
                </p>
                <p className="mb-4 text-sm">
                    <strong>2.2 Algorithmic Execution:</strong> Our Quantitative Agent operates on pre-programmed logic (EMA 200/50 Trends and RSI Momentum). While backtested extensively, past performance is never a guarantee of future results. The bot is designed to preserve capital first and grow it second.
                </p>
                <p className="text-sm">
                    <strong>2.3 No Financial Advice:</strong> Gapeva is a technology platform, not a registered financial advisor or bank. You are solely responsible for your investment decisions.
                </p>
            </section>

            <section>
                <h3 className="text-2xl font-serif text-white mb-4">3. The "Panic Switch" Mechanism</h3>
                <p className="mb-4">
                    To protect User capital, Gapeva enforces a strict risk management protocol known as the "Panic Switch."
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-400">
                    <li><strong>Trigger Condition:</strong> If the total portfolio value drops by 5% or more within a rolling 24-hour period.</li>
                    <li><strong>Execution:</strong> The system immediately liquidates all open positions into stablecoins (USDC/USDT).</li>
                    <li><strong>Cooldown:</strong> Trading is automatically suspended for a minimum of 24 hours to allow market volatility to stabilize.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-2xl font-serif text-white mb-4">4. Fees & Profit Sharing</h3>
                <p className="mb-4">
                    Gapeva operates on a "Performance-First" model. We believe we should only make money when you make money.
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-navy-800 p-4 rounded-lg">
                        <h4 className="text-white font-bold mb-2">Deposit Fee (3%)</h4>
                        <p className="text-sm text-gray-400">Applied once upon deposit to cover payment gateway (Paystack) processing charges and initial allocation gas fees.</p>
                    </div>
                    <div className="bg-navy-800 p-4 rounded-lg border border-gold-400/30">
                        <h4 className="text-gold-400 font-bold mb-2">Performance Fee (35%)</h4>
                        <p className="text-sm text-gray-400">Applied <strong>ONLY on Profits</strong> at the time of withdrawal. We calculate the difference between your principal and your withdrawal amount. We never tax your initial capital.</p>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-2xl font-serif text-white mb-4">5. Deposits & Withdrawals</h3>
                <p className="mb-4">
                    <strong>5.1 Minimums:</strong> To ensure algorithmic efficiency, the minimum deposit is strictly <strong>$3.00 USD</strong>. Deposits below this amount may be rejected by the payment processor.
                </p>
                <p className="mb-4">
                    <strong>5.2 Withdrawal Processing:</strong> Users may request withdrawals at any time. Due to the need to unbind capital from active trading positions, withdrawals are processed within <strong>24 hours</strong>.
                </p>
                <p>
                    <strong>5.3 Dual-Balance System:</strong> Funds in your "Wallet Balance" are held in stable fiat/USDC and are not exposed to market risk. Only funds you manually transfer to "Trading Balance" are utilized by the bot.
                </p>
            </section>

            <section>
                <h3 className="text-2xl font-serif text-white mb-4 flex items-center gap-3">
                    <Scale className="text-gold-400" size={24} /> 
                    6. Limitation of Liability
                </h3>
                <p>
                    To the maximum extent permitted by law, Gapeva shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your access to or use of or inability to access or use the services; (b) any conduct or content of any third party on the services; or (c) unauthorized access, use, or alteration of your transmissions or content.
                </p>
            </section>

        </div>
        
        <div className="mt-20 border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
            &copy; 2026 Gapeva Protocol. All legal rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Terms;
