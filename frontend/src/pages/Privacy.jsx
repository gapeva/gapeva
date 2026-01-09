import React, { useEffect } from 'react';
import { ArrowLeft, Lock, Eye, Database, Server } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
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
            <h1 className="font-serif text-4xl md:text-5xl text-gold-400 mb-4">Privacy Policy</h1>
            <p className="text-gray-400">Last Updated: January 1, 2026</p>
            <p className="text-gray-400">Commitment to Data Sovereignty</p>
        </div>

        {/* Content */}
        <div className="space-y-12 text-gray-300 leading-relaxed">
            
            <section>
                <h3 className="text-2xl font-serif text-white mb-4 flex items-center gap-3">
                    <Lock className="text-gold-400" size={24} /> 
                    1. Our Security Commitment
                </h3>
                <p className="mb-4">
                    At Gapeva, we treat your privacy with the same rigor as your financial assets. We understand that in the world of decentralized finance and algorithmic trading, trust is the currency of greatest value. 
                </p>
                <p>
                    This Privacy Policy outlines exactly how we collect, use, encrypt, and protect your personal information. We pledge to never sell your personal data to third-party advertisers. Your data exists solely to facilitate your financial growth.
                </p>
            </section>

            <section>
                <h3 className="text-2xl font-serif text-white mb-4 flex items-center gap-3">
                    <Database className="text-gold-400" size={24} /> 
                    2. Information We Collect
                </h3>
                <p className="mb-4">We collect the minimum amount of data necessary to comply with financial regulations (KYC/AML) and ensure account security.</p>
                
                <div className="space-y-4 mt-6">
                    <div className="flex gap-4">
                        <div className="w-1 bg-gold-400 rounded-full"></div>
                        <div>
                            <strong className="text-white block">Identity Data</strong>
                            <span className="text-sm text-gray-400">Full Legal Name, Email Address, and Phone Number. This allows us to verify you are a real person and recover your account if access is lost.</span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-1 bg-gold-400 rounded-full"></div>
                        <div>
                            <strong className="text-white block">Financial Transaction Data</strong>
                            <span className="text-sm text-gray-400">Deposit history, withdrawal requests, and wallet balance changes. We do NOT store your full Credit Card numbers; these are tokenized securely by our payment partner, Paystack.</span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-1 bg-gold-400 rounded-full"></div>
                        <div>
                            <strong className="text-white block">Technical Data</strong>
                            <span className="text-sm text-gray-400">IP address, browser type, and login timestamps. This helps our security systems detect and block unauthorized access attempts from suspicious locations.</span>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-2xl font-serif text-white mb-4 flex items-center gap-3">
                    <Server className="text-gold-400" size={24} /> 
                    3. How We Use Your Data
                </h3>
                <ul className="list-disc pl-6 space-y-3 text-gray-400">
                    <li><strong>Service Execution:</strong> To create your unique "Dual-Balance" wallet ledger and execute trades proportional to your pool share.</li>
                    <li><strong>Security Verification:</strong> To send One-Time Passwords (OTPs) or confirmation emails when you request a withdrawal.</li>
                    <li><strong>Legal Compliance:</strong> To maintain records required by financial authorities to prevent money laundering and fraud.</li>
                    <li><strong>Platform Improvement:</strong> To analyze system performance and optimize the trading algorithm based on aggregate pool behavior.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-2xl font-serif text-white mb-4">4. Data Storage & Encryption</h3>
                <p className="mb-4">
                    We employ "Bank-Grade" security measures to protect your information:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-400">
                    <li><strong>Password Hashing:</strong> We use Argon2 hashing algorithms. This means even our own engineers cannot see your password.</li>
                    <li><strong>Transmission Security:</strong> All data transmitted between your browser and our servers is encrypted using TLS 1.3 (Transport Layer Security).</li>
                    <li><strong>Database Isolation:</strong> Your financial data is stored in a secure PostgreSQL environment hosted on Digital Ocean, isolated from public internet access.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-2xl font-serif text-white mb-4 flex items-center gap-3">
                    <Eye className="text-gold-400" size={24} /> 
                    5. Third-Party Data Sharing
                </h3>
                <p className="mb-4">
                    We only share data with essential infrastructure partners required to operate the service:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-navy-800 p-4 rounded border border-white/5">
                        <strong className="text-white">Paystack</strong>
                        <p className="text-xs text-gray-400 mt-1">Payment Processor. They process your card details securely.</p>
                    </div>
                    <div className="bg-navy-800 p-4 rounded border border-white/5">
                        <strong className="text-white">Binance</strong>
                        <p className="text-xs text-gray-400 mt-1">Exchange Partner. They execute the aggregated trades. (Anonymized data only).</p>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-2xl font-serif text-white mb-4">6. Your Rights</h3>
                <p>
                    You have the right to request a copy of all personal data we hold about you. You also have the "Right to be Forgotten"—requesting the deletion of your account and data, provided you have no active funds or pending legal obligations. To exercise these rights, please visit our Support page.
                </p>
            </section>

        </div>
        
        <div className="mt-20 border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
            &copy; 2026 Gapeva Protocol. Privacy is a right, not a privilege.
        </div>
      </div>
    </div>
  );
};

export default Privacy;
