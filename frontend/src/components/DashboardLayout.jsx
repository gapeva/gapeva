import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Wallet, TrendingUp, LogOut, Settings, Menu, X } from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const currentPath = window.location.pathname;

  const NavItem = ({ icon: Icon, label, path }) => {
    const isActive = currentPath === path;
    return (
      <div
        onClick={() => navigate(path)}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-500 group relative ${isActive
            ? 'bg-gold-400 text-navy-900 font-bold gold-glow'
            : 'text-gray-400 hover:text-white hover:bg-gold-400/5 hover:border-r-2 hover:border-gold-400/50'
          }`}
      >
        <Icon size={18} className={`${isActive ? 'text-navy-900' : 'group-hover:text-gold-400 transition-colors'}`} />
        <span className="font-sans text-sm tracking-wide">{label}</span>
      </div>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-6 bg-navy-900/50 backdrop-blur-md border-r border-gold-400/5">
      <div className="mb-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-gold-400/20 rounded-lg blur-sm"></div>
            <img src="/logo.png" alt="Gapeva" className="h-10 w-auto relative rounded-lg border border-gold-400/20" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl gold-gradient-text tracking-widest font-bold">GAPEVA</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Institutional Protocol</span>
          </div>
        </div>
        <button className="md:hidden text-gray-500 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
          <X size={20} />
        </button>
      </div>

      <div className="space-y-3 flex-1">
        <NavItem icon={LayoutDashboard} label="OVERVIEW" path="/dashboard" />
        <NavItem icon={Wallet} label="DEPOSIT / WITHDRAW" path="/dashboard" />
        <NavItem icon={TrendingUp} label="LIVE TRADING" path="/dashboard" />
        <NavItem icon={Settings} label="SETTINGS" path="/settings" />
      </div>

      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-400 transition-all duration-300 group">
        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-sans text-xs uppercase tracking-widest font-semibold">Terminate Session</span>
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#0A0F1E] text-white font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-72 h-screen sticky top-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar (Overlay) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-300" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-72 h-full bg-navy-900 shadow-2xl animate-in slide-in-from-left duration-500" onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="h-20 premium-blur flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <button className="md:hidden text-gold-400 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="flex flex-col">
              <p className="text-[10px] text-gold-400/60 uppercase tracking-widest mb-1 italic">Node: Global Sentinel</p>
              <h2 className="font-serif text-2xl text-white tracking-tight">Institutional Terminal</h2>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-white font-medium">Alpha Tier Account</span>
              <span className="text-[10px] text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                Encrypted Connection
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-gold-400/5 border border-gold-400/20 flex items-center justify-center text-gold-400 font-serif italic shadow-inner hover:border-gold-400/50 transition-colors cursor-pointer group">
              <span className="group-hover:scale-110 transition-transform">GA</span>
            </div>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
