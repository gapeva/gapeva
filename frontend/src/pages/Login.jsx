import React, { useState } from 'react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900 p-4">
      <div className="w-full max-w-md bg-navy-800 border border-gold-400/20 rounded-xl shadow-2xl p-8 backdrop-blur-sm">
        
        {/* Header */}
        <div className="text-center mb-8">
            {/* Logo Placeholder */}
            <div className="text-4xl mb-2">⭐</div> 
            <h2 className="text-3xl font-serif text-gold-400 mb-2">
            {isLogin ? 'Welcome Back' : 'Join the Elite'}
            </h2>
            <p className="text-gray-400 font-sans text-sm">
            {isLogin ? 'Access your quantitative portfolio' : 'Start your automated wealth journey'}
            </p>
        </div>

        {/* Form */}
        <form className="space-y-6">
            {!isLogin && (
            <>
                <div>
                <label className="block text-gold-400 text-xs uppercase tracking-wider mb-2">Full Name</label>
                <input type="text" className="w-full bg-navy-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:outline-none transition-colors" placeholder="John Doe" />
                </div>
                <div>
                <label className="block text-gold-400 text-xs uppercase tracking-wider mb-2">Phone Number</label>
                <input type="tel" className="w-full bg-navy-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:outline-none transition-colors" placeholder="+1 234 567 8900" />
                </div>
            </>
            )}

            <div>
            <label className="block text-gold-400 text-xs uppercase tracking-wider mb-2">Email Address</label>
            <input type="email" className="w-full bg-navy-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:outline-none transition-colors" placeholder="investor@example.com" />
            </div>

            <div>
            <label className="block text-gold-400 text-xs uppercase tracking-wider mb-2">Password</label>
            <input type="password" className="w-full bg-navy-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:outline-none transition-colors" placeholder="••••••••" />
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-gold-400 to-gold-500 text-navy-900 font-bold py-4 rounded-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all duration-300">
            {isLogin ? 'Secure Sign In' : 'Create Account'}
            </button>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center">
            <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-400 hover:text-gold-400 text-sm font-sans transition-colors"
            >
            {isLogin ? "Don't have an account? Apply here" : 'Already a member? Sign in'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
