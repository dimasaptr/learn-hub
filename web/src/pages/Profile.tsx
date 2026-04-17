import React, { useState } from 'react';
import { useAuthStore } from '../store/auth.store';
import api from '../shared/api/api';

const Profile = () => {
  const { user, login } = useAuthStore();
  
  // Name Update State
  const [name, setName] = useState(user?.name || '');
  const [nameMsg, setNameMsg] = useState('');
  
  // Password Update State
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });
  const [passMsg, setPassMsg] = useState('');

  // Rewards State
  const [rewards, setRewards] = useState<{ totalPoints: number; coupons: any[] } | null>(null);

  React.useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await api.get('/users/rewards');
        if (response.data.status === 'success') {
          setRewards(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch rewards');
      }
    };
    fetchRewards();
  }, []);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameMsg('');
    try {
      const response = await api.patch('/users/profile', { name });
      if (response.data.status === 'success') {
        setNameMsg('✅ Name updated successfully');
        // Update global Zustand store
        const currentToken = localStorage.getItem('token') || '';
        login({ ...user!, name }, currentToken);
      }
    } catch (err: any) {
      setNameMsg('❌ ' + (err.response?.data?.message || 'Failed to update name'));
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg('');
    try {
      const response = await api.patch('/users/change-password', passwordData);
      if (response.data.status === 'success') {
        setPassMsg('✅ Password changed successfully');
        setPasswordData({ oldPassword: '', newPassword: '' });
      }
    } catch (err: any) {
      setPassMsg('❌ ' + (err.response?.data?.message || 'Failed to change password'));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h1 className="text-3xl font-bold">Profile Management</h1>
          <p className="text-slate-400 mt-1">Manage your account settings</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Update Info Section */}
          <section className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Personal Info</h2>
            {nameMsg && <p className="text-sm mb-4 bg-slate-900 p-2 rounded">{nameMsg}</p>}
            
            <form onSubmit={handleUpdateName} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Email</label>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-500 cursor-not-allowed" 
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" 
                />
              </div>
              <button 
                type="submit" 
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
              >
                Save Changes
              </button>
            </form>
          </section>

          {/* Change Password Section */}
          <section className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-red-400">Security</h2>
            {passMsg && <p className="text-sm mb-4 bg-slate-900 p-2 rounded">{passMsg}</p>}
            
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Current Password</label>
                <input 
                  type="password" 
                  required
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white" 
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">New Password</label>
                <input 
                  type="password" 
                  required
                  minLength={6}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white" 
                />
              </div>
              <button 
                type="submit" 
                className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
              >
                Change Password
              </button>
            </form>
          </section>
        </div>

        {/* Rewards Section */}
        <section className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <svg className="w-40 h-40 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="text-yellow-400">✨</span> My Referral Rewards
              </h2>
              <p className="text-slate-400">Points & Coupons from your referral activity</p>
            </div>
            
            <div className="bg-blue-600/20 px-6 py-4 rounded-2xl border border-blue-500/30">
              <span className="text-sm font-medium text-blue-300 block mb-1 uppercase tracking-wider">Total Points</span>
              <span className="text-4xl font-black text-white">{rewards?.totalPoints.toLocaleString()} <span className="text-xl font-normal text-blue-400">pts</span></span>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-slate-300">Active Coupons</h3>
            {rewards?.coupons && rewards.coupons.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rewards.coupons.map((coupon, idx) => (
                  <div key={idx} className="bg-slate-900/80 p-4 rounded-xl border border-dashed border-slate-700 flex justify-between items-center group hover:border-blue-500 transition-colors">
                    <div>
                      <code className="text-lg font-bold text-yellow-400 tracking-widest">{coupon.code}</code>
                      <p className="text-xs text-slate-500 mt-1 italic">
                        Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="bg-yellow-400/10 text-yellow-400 text-xs font-bold px-2 py-1 rounded">15% OFF</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 text-center">
                <p className="text-slate-500">No active coupons available. Invite friends to get rewards!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
