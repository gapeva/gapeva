import React, { useState } from 'react';
import { ArrowLeft, Send, Mail, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Support = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, subject, message } = formData;
    
    // Construct the mailto link to open the user's email client
    const mailtoLink = `mailto:gapevadotpro@gmail.com?subject=[Support] ${encodeURIComponent(subject)}&body=Name: ${encodeURIComponent(name)}%0D%0A%0D%0A${encodeURIComponent(message)}`;
    
    window.location.href = mailtoLink;
  };

  return (
    <div className="min-h-screen bg-navy-900 text-white font-sans p-6">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gold-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Home
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl text-white mb-4">Contact Support</h1>
          <p className="text-gray-400">We are here to help you 24/7. Send us a direct message.</p>
        </div>

        <div className="bg-navy-800 border border-gold-400/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gold-400 text-xs uppercase tracking-wider mb-2">Your Name</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-navy-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:outline-none"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-gold-400 text-xs uppercase tracking-wider mb-2">Subject</label>
              <select 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full bg-navy-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:outline-none"
              >
                <option value="">Select a topic...</option>
                <option value="Deposit Issue">Deposit Issue</option>
                <option value="Withdrawal Inquiry">Withdrawal Inquiry</option>
                <option value="Account Verification">Account Verification</option>
                <option value="General Inquiry">General Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-gold-400 text-xs uppercase tracking-wider mb-2">Message</label>
              <textarea 
                required
                rows="5"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-navy-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:outline-none"
                placeholder="Describe your issue..."
              ></textarea>
            </div>

            <button type="submit" className="w-full bg-gold-400 hover:bg-gold-500 text-navy-900 font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all">
              <Send size={20} />
              Send Message
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row gap-6 justify-center text-center">
            <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail size={16} className="text-gold-400" />
                gapevadotpro@gmail.com
            </div>
            <div className="flex items-center gap-3 text-gray-400 text-sm">
                <MessageSquare size={16} className="text-gold-400" />
                Live Chat (Coming Soon)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
