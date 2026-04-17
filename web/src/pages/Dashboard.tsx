import React from 'react';
import { useAuthStore } from '../store/auth.store';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12 bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-slate-400 mt-1">Welcome back, {user?.name}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/50 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <h3 className="text-lg text-slate-400 mb-2">Your Role</h3>
            <p className="text-2xl font-semibold text-blue-400">{user?.role}</p>
            {user?.role === 'ORGANIZER' && (
              <button 
                onClick={() => navigate('/organizer/dashboard')}
                className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-bold"
              >
                Go to Management Dashboard →
              </button>
            )}
          </div>
          
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <h3 className="text-lg text-slate-400 mb-2">Referral Code</h3>
            <p className="text-2xl font-mono text-green-400">
              {user?.referralCode || 'Not Generated'}
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <h3 className="text-lg text-slate-400 mb-2">Available Points</h3>
            <p className="text-2xl font-semibold text-purple-400">0 Points</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
