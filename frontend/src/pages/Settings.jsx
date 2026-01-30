import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { User, Bell, Shield, Palette, Save, Loader2 } from 'lucide-react';

const Settings = () => {
    const [userData, setUserData] = useState({
        full_name: '',
        email: '',
        phone: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        // Load user info from localStorage (as done in Dashboard)
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUserData({
            full_name: storedUser.full_name || 'Institution User',
            email: storedUser.email || 'user@gapeva.io',
            phone: storedUser.phone || '+1 --- --- ----'
        });
        setLoading(false);
    }, []);

    const handleSave = () => {
        setSaving(true);
        // Simulate API call
        setTimeout(() => {
            setSaving(false);
            alert('Settings updated successfully');
        }, 1500);
    };

    const tabs = [
        { id: 'profile', label: 'Profile Settings', icon: User },
        { id: 'security', label: 'Security & Privacy', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'appearance', label: 'Appearance', icon: Palette },
    ];

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-4xl font-serif text-white mb-3 tracking-tight">System Configuration</h1>
                    <p className="text-gray-500 font-sans tracking-wide">Manage your institutional presence and security parameters on the Gapeva Protocol.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Tabs Sidebar */}
                    <div className="lg:w-72 space-y-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-500 group relative overflow-hidden ${activeTab === tab.id
                                            ? 'bg-gold-400 text-navy-900 font-bold gold-glow shadow-lg'
                                            : 'text-gray-500 hover:text-white hover:bg-gold-400/5'
                                        }`}
                                >
                                    <Icon size={18} className={`${activeTab === tab.id ? 'text-navy-900' : 'group-hover:text-gold-400 transition-colors'}`} />
                                    <span className="text-sm uppercase tracking-widest font-semibold">{tab.label}</span>
                                    {activeTab === tab.id && <div className="absolute right-0 top-0 h-full w-1 bg-navy-900/20"></div>}
                                </button>
                            );
                        })}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 glass-card rounded-3xl overflow-hidden border-gold-400/10 shadow-2xl relative">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Settings className="w-32 h-32" />
                        </div>

                        <div className="p-10 relative z-10">
                            {activeTab === 'profile' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="flex items-center gap-6 mb-10">
                                        <div className="relative group">
                                            <div className="absolute -inset-1 bg-gradient-to-tr from-gold-400 to-transparent rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
                                            <div className="w-24 h-24 rounded-2xl bg-navy-900 border border-gold-400/30 flex items-center justify-center text-4xl font-serif text-gold-400 relative">
                                                {userData.full_name.charAt(0)}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-serif text-white tracking-tight">{userData.full_name}</h3>
                                            <p className="text-xs text-gold-400/60 uppercase tracking-[0.2em] font-bold mt-1">Authorized Institutional Operator</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Identity Descriptor</label>
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    value={userData.full_name}
                                                    readOnly
                                                    className="w-full bg-navy-900/50 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white/50 focus:outline-none focus:border-gold-400 cursor-not-allowed italic"
                                                />
                                                <div className="absolute right-3 top-3.5"><Shield size={14} className="text-gray-700" /></div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Encrypted Communication</label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    value={userData.email}
                                                    readOnly
                                                    className="w-full bg-navy-900/50 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white/50 focus:outline-none focus:border-gold-400 cursor-not-allowed italic"
                                                />
                                                <div className="absolute right-3 top-3.5"><Shield size={14} className="text-gray-700" /></div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Secure Contact Vector</label>
                                            <div className="relative">
                                                <input
                                                    type="tel"
                                                    value={userData.phone}
                                                    readOnly
                                                    className="w-full bg-navy-900/50 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white/50 focus:outline-none focus:border-gold-400 cursor-not-allowed italic"
                                                />
                                                <div className="absolute right-3 top-3.5"><Shield size={14} className="text-gray-700" /></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-gold-400/5 border border-gold-400/20 text-[10px] text-gray-500 italic max-w-sm">
                                        * Note: Profile modifications require level 3 clearance from the Protocol Governance Committee.
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="border-b border-white/5 pb-4 mb-6">
                                        <h3 className="text-xl font-serif text-white tracking-tight">Security Protocol</h3>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Multi-Layer Cryptographic Shields</p>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-orange-500/5 border border-orange-500/20 flex gap-6">
                                        <div className="bg-orange-500/20 p-3 rounded-xl h-fit">
                                            <Shield className="text-orange-400" size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-orange-200 font-bold mb-2">Institutional Two-Factor Activation</p>
                                            <p className="text-xs text-orange-200/60 leading-relaxed max-w-lg">
                                                Gapeva Protocol mandates hardware-based MFA for all capital reallocations and high-frequency strategy deployments. Ensure your YubiKey or Mobile Authenticator is synced.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <button className="w-fit flex items-center gap-3 px-8 py-3 bg-navy-900 border border-gold-400/20 text-gold-400 rounded-xl text-sm font-bold hover:bg-gold-400 hover:text-navy-900 transition-all duration-500 gold-glow">
                                            Change Cryptographic Password
                                        </button>
                                        <button className="w-fit text-xs text-gray-500 hover:text-white transition-colors px-1">
                                            Review Node Access Logs
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="border-b border-white/5 pb-4">
                                        <h3 className="text-xl font-serif text-white tracking-tight">Transmission Filters</h3>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Intelligence Relay Parameters</p>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            { title: "Neural Execution Alerts", desc: "Push notification upon sub-second trade entry/exit.", active: true },
                                            { title: "Alpha Yield Recaps", desc: "Weekly cryptographic performance summaries via secure relay.", active: false },
                                            { title: "Protocol Governance Updates", desc: "Critical system parity and node maintenance notifications.", active: true }
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-6 rounded-2xl bg-navy-900/40 border border-gray-800 hover:border-gold-400/20 transition-all duration-300">
                                                <div>
                                                    <p className="text-sm text-white font-bold mb-1 tracking-wide">{item.title}</p>
                                                    <p className="text-xs text-gray-500">{item.desc}</p>
                                                </div>
                                                <button className={`w-14 h-7 rounded-full relative transition-all duration-500 ${item.active ? 'bg-gold-400 shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-navy-800 border border-gray-700'}`}>
                                                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-500 ${item.active ? 'right-1 scale-110 shadow-lg' : 'left-1 bg-gray-600'}`}></div>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'appearance' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="border-b border-white/5 pb-4">
                                        <h3 className="text-xl font-serif text-white tracking-tight">Visual Interface</h3>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Institutional Aesthetic Selection</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div className="p-6 rounded-2xl border-2 border-gold-400 bg-navy-900/60 shadow-2xl relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-2"><Shield className="text-gold-400" size={12} /></div>
                                            <div className="h-24 bg-navy-900 rounded-xl border border-gold-400/20 mb-4 flex items-center justify-center relative overflow-hidden">
                                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-gold-400/5 to-transparent"></div>
                                                <span className="text-gold-400 text-xs font-serif italic tracking-[0.2em] font-bold">SENTINEL DARK</span>
                                            </div>
                                            <p className="text-center text-[10px] font-bold text-gold-400 uppercase tracking-widest">Protocol Standard</p>
                                        </div>
                                        <div className="p-6 rounded-2xl border border-gray-800 bg-white/5 opacity-40 cursor-not-allowed grayscale relative overflow-hidden">
                                            <div className="h-24 bg-white rounded-xl mb-4 flex items-center justify-center">
                                                <span className="text-gray-800 text-[10px] font-serif italic tracking-[0.2em] font-bold">LEGACY LIGHT</span>
                                            </div>
                                            <p className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">Locked / Restricted</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Action */}
                        <div className="px-10 py-6 bg-navy-900/60 border-t border-white/5 flex justify-end items-center gap-6">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest italic">Encrypted Application Path: 256-bit AES</span>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-3 bg-gold-400 hover:bg-gold-500 text-navy-900 font-bold px-8 py-3 rounded-xl transition-all duration-300 transform active:scale-95 shadow-xl gold-glow"
                            >
                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                <span className="uppercase tracking-widest text-xs">{saving ? 'Synchronizing...' : 'Apply Parameters'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
