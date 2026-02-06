import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { User, Bell, Shield, Palette, Save, Loader2, Lock } from 'lucide-react';
import { userService } from '../services/api';

const Settings = () => {
    const [userData, setUserData] = useState({
        full_name: '',
        email: '',
        phone: ''
    });
    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            setLoading(true);
            const response = await userService.getProfile();
            setUserData({
                full_name: response.data.full_name || '',
                email: response.data.email || '',
                phone: response.data.phone || ''
            });
            setError(null);
        } catch (err) {
            console.error("Failed to load profile:", err);
            setError("Failed to load user profile. Please try refreshing.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        setError(null);
        setSuccessMsg('');

        try {
            await userService.updateProfile({
                full_name: userData.full_name,
                phone: userData.phone
            });

            // Update local storage user if present to keep consistency
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({
                ...storedUser,
                full_name: userData.full_name,
                phone: userData.phone
            }));

            setSuccessMsg('Profile updated successfully');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            console.error("Failed to update profile:", err);
            setError("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg('');

        if (passwordData.new_password !== passwordData.confirm_password) {
            setError("New passwords do not match");
            return;
        }

        if (passwordData.new_password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setPasswordSaving(true);
        try {
            await userService.updatePassword({
                old_password: passwordData.old_password,
                new_password: passwordData.new_password
            });
            setSuccessMsg("Password changed successfully");
            setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
            setShowPasswordForm(false);
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            console.error("Password update failed:", err);
            // Try to get specific error message from backend
            const msg = err.response?.data?.detail || "Failed to update password. Check your old password.";
            setError(msg);
        } finally {
            setPasswordSaving(false);
        }
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

                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="animate-spin text-gold-400" size={32} />
                            </div>
                        ) : (
                            <div className="p-10 relative z-10">
                                {error && (
                                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}
                                {successMsg && (
                                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
                                        {successMsg}
                                    </div>
                                )}

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
                                                        name="full_name"
                                                        value={userData.full_name}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-navy-900/50 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-400 transition-colors"
                                                    />
                                                    <div className="absolute right-3 top-3.5"><User size={14} className="text-gray-700" /></div>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Encrypted Communication</label>
                                                <div className="relative">
                                                    <input
                                                        type="email"
                                                        name="email"
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
                                                        name="phone"
                                                        value={userData.phone}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-navy-900/50 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-400 transition-colors"
                                                    />
                                                    <div className="absolute right-3 top-3.5"><Shield size={14} className="text-gray-700" /></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer Action for Profile */}
                                        <div className="pt-6 flex justify-end">
                                            <button
                                                onClick={handleSaveProfile}
                                                disabled={saving}
                                                className="flex items-center gap-3 bg-gold-400 hover:bg-gold-500 text-navy-900 font-bold px-8 py-3 rounded-xl transition-all duration-300 transform active:scale-95 shadow-xl gold-glow disabled:opacity-50"
                                            >
                                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                                <span className="uppercase tracking-widest text-xs">{saving ? 'Synchronizing...' : 'Apply Parameters'}</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'security' && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                        <div className="border-b border-white/5 pb-4 mb-6">
                                            <h3 className="text-xl font-serif text-white tracking-tight">Security Protocol</h3>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Multi-Layer Cryptographic Shields</p>
                                        </div>

                                        {!showPasswordForm ? (
                                            <>
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
                                                    <button
                                                        onClick={() => setShowPasswordForm(true)}
                                                        className="w-fit flex items-center gap-3 px-8 py-3 bg-navy-900 border border-gold-400/20 text-gold-400 rounded-xl text-sm font-bold hover:bg-gold-400 hover:text-navy-900 transition-all duration-500 gold-glow">
                                                        Change Cryptographic Password
                                                    </button>
                                                    <button className="w-fit text-xs text-gray-500 hover:text-white transition-colors px-1">
                                                        Review Node Access Logs
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="p-8 rounded-2xl bg-navy-900/40 border border-white/5 space-y-4">
                                                <h4 className="text-lg text-white font-serif">Update Access Credentials</h4>

                                                <div className="space-y-4 max-w-md">
                                                    <div>
                                                        <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1 block">Current Password</label>
                                                        <div className="relative">
                                                            <input
                                                                type="password"
                                                                value={passwordData.old_password}
                                                                onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                                                                className="w-full bg-navy-900/50 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-400"
                                                            />
                                                            <Lock size={14} className="absolute right-3 top-3.5 text-gray-600" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1 block">New Password</label>
                                                        <div className="relative">
                                                            <input
                                                                type="password"
                                                                value={passwordData.new_password}
                                                                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                                                className="w-full bg-navy-900/50 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-400"
                                                            />
                                                            <Lock size={14} className="absolute right-3 top-3.5 text-gray-600" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1 block">Confirm New Password</label>
                                                        <div className="relative">
                                                            <input
                                                                type="password"
                                                                value={passwordData.confirm_password}
                                                                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                                                className="w-full bg-navy-900/50 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-400"
                                                            />
                                                            <Lock size={14} className="absolute right-3 top-3.5 text-gray-600" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-4 pt-4">
                                                    <button
                                                        onClick={handlePasswordChange}
                                                        disabled={passwordSaving}
                                                        className="px-6 py-2 bg-gold-400 text-navy-900 rounded-xl font-bold text-sm hover:bg-gold-500 transition-colors disabled:opacity-50">
                                                        {passwordSaving ? 'Updating...' : 'Update Password'}
                                                    </button>
                                                    <button
                                                        onClick={() => setShowPasswordForm(false)}
                                                        className="px-6 py-2 border border-gray-700 text-gray-400 rounded-xl text-sm hover:text-white hover:border-white transition-colors">
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
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
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
