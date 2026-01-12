import React, { useState } from 'react';
import { authService } from '../services/api'; // Import the connection to the backend

const Login = () => {
  // 1. State Variables: To store what the user types
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: ''
  });
  const [error, setError] = useState('');

  // 2. Helper Function: Update state when user types
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 3. Main Logic: What happens when they click the button
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the page from reloading
    setError(''); // Clear previous errors

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const response = await authService.login({
          email: formData.email,
          password: formData.password
        });
        
        // Save the "Access Key" (Token) so the user stays logged in
        localStorage.setItem('access_token', response.data.access_token);
        
        alert("Login Successful! Welcome back.");
        // In the next phase, we will redirect them to the Dashboard here.
        
      } else {
        // --- SIGNUP LOGIC ---
        await authService.signup({
            email: formData.email,
            password: formData.password,
            full_name: formData.full_name,
            phone: formData.phone
        });
        
        alert("Account Created Successfully! Please Sign In.");
        setIsLogin(true); // Switch back to login view
      }
    } catch (err) {
      // Improved Error Handling
      console.error("Signup/Login Error:", err);
      
      let message = "An error occurred. Please try again.";
      
      // Check if the error detail is a simple string or an array (FastAPI validation)
      if (err.response?.data?.detail) {
          const detail = err.response.data.detail;
          if (typeof detail === 'string') {
              message = detail;
          } else if (Array.isArray(detail)) {
              // If it's an array (e.g. password too short), grab the first message
              message = detail[0].msg || "Invalid input data";
          }
      } else if (err.message === "Network Error") {
          message = "Cannot connect to server. Please check your internet connection.";
      }
      
      setError(message);
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900 p-4">
      <div className="w-full max-w-md bg-navy-800 border border-gold-400/20 rounded-xl shadow-2xl p-8 backdrop-blur-sm">
        
        {/* Header */}
        <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
                <img src="/logo.png" alt="Gapeva" className="h-16 w-auto animate-fade-in" />
            </div>
            <h2 className="text-3xl font-serif text-gold-400 mb-2">
            {isLogin ? 'Welcome Back' : 'Join the Elite'}
            </h2>
            <p className="text-gray-400 font-sans text-sm">
            {isLogin ? 'Access your quantitative portfolio' : 'Start your automated wealth journey'}
            </p>
        </div>

        {/* Error Message Display */}
        {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded text-red-200 text-sm text-center">
                {error}
            </div>
        )}

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
            <>
                <div>
                <label className="block text-gold-400 text-xs uppercase tracking-wider mb-2">Full Name</label>
                <input 
                    name="full_name"
                    type="text" 
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full bg-navy-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:outline-none transition-colors" 
                    placeholder="John Doe" 
                />
                </div>
                <div>
                <label className="block text-gold-400 text-xs uppercase tracking-wider mb-2">Phone Number</label>
                <input 
                    name="phone"
                    type="tel" 
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-navy-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:outline-none transition-colors" 
                    placeholder="+1 234 567 8900" 
                />
                </div>
            </>
            )}

            <div>
            <label className="block text-gold-400 text-xs uppercase tracking-wider mb-2">Email Address</label>
            <input 
                name="email"
                type="email" 
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-navy-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:outline-none transition-colors" 
                placeholder="investor@example.com" 
            />
            </div>

            <div>
            <label className="block text-gold-400 text-xs uppercase tracking-wider mb-2">Password</label>
            <input 
                name="password"
                type="password" 
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-navy-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:outline-none transition-colors" 
                placeholder="••••••••" 
            />
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-gold-400 to-gold-500 text-navy-900 font-bold py-4 rounded-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all duration-300">
            {isLogin ? 'Secure Sign In' : 'Create Account'}
            </button>
        </form>

        {/* Toggle between Login and Signup */}
        <div className="mt-6 text-center">
            <button 
            onClick={() => {
                setIsLogin(!isLogin);
                setError(''); // Clear errors when switching
            }}
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
