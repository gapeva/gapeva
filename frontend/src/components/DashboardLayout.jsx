import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Wallet, TrendingUp, LogOut, Settings } from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const NavItem = ({ icon: Icon, label, active }) => (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${active ? 'bg-gold-400/10 text-gold-400 border-l-2 border-gold-400' : 'text-gray-400 hover:text-white hover:bg-navy-800'}`}>
      <Icon size={20} />
      <span className="font-sans text-sm font-medium">{label}</span>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-navy-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-navy-900 border-r border-gold-400/10 hidden md:flex flex-col p-6">
        {/* Logo */}
        <div className="mb-10 flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span className="font-serif text-2xl text-gold-400 tracking-wide">GAPEVA</span>
        </div>

        {/* Navigation */}
        <div className="space-y-2 flex-1">
            <NavItem icon={LayoutDashboard} label="Overview" active />
            <NavItem icon={Wallet} label="Deposit / Withdraw" />
            <NavItem icon={TrendingUp} label="Live Trading" />
            <NavItem icon={Settings} label="Settings" />
        </div>

        {/* Logout */}
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-400 transition-colors">
            <LogOut size={20} />
            <span className="font-sans text-sm">Sign Out</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="h-20 border-b border-gold-400/10 flex items-center justify-between px-8 bg-navy-900/50 backdrop-blur-md sticky top-0 z-10">
            <h2 className="font-serif text-xl text-white">Portfolio Overview</h2>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-400/20 border border-gold-400 flex items-center justify-center text-gold-400 font-serif">
                    JD
                </div>
            </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
            {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
