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
      </div>
    </div>
  );
};

export default Profile;
