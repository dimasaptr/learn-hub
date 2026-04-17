import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import api from '../../shared/api/api';
import { useAuthStore } from '../../store/auth.store';

interface StatSummary {
  totalEvents: number;
  totalIncome: number;
  totalTicketsSold: number;
}

interface ChartItem {
  date: string;
  income: number;
}

const OrganizerDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<StatSummary | null>(null);
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/statistics');
        if (response.data.status === 'success') {
          setStats(response.data.data.summary);
          setChartData(response.data.data.chartData);
        }
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xl animate-pulse">
        Loading Report...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">Organizer Dashboard</h1>
            <p className="text-slate-400 mt-2 text-lg">Real-time statistics for your events</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700/50 flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
            <span className="text-sm font-medium text-slate-300">Live Statistics Agent</span>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/5 p-8 rounded-3xl border border-blue-500/20 shadow-2xl backdrop-blur-sm">
            <h3 className="text-slate-400 font-medium mb-1">Total Revenue</h3>
            <p className="text-4xl font-black text-white">
              Rp {stats?.totalIncome.toLocaleString('id-ID')}
            </p>
            <div className="mt-4 inline-flex items-center text-blue-400 text-sm font-bold bg-blue-400/10 px-3 py-1 rounded-full">
              ↑ 12.5% this month
            </div>
          </div>

          <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 shadow-xl">
            <h3 className="text-slate-400 font-medium mb-1">Tickets Sold</h3>
            <p className="text-4xl font-black text-white">{stats?.totalTicketsSold}</p>
            <p className="mt-4 text-slate-500 text-sm italic">Across all active events</p>
          </div>

          <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 shadow-xl">
            <h3 className="text-slate-400 font-medium mb-1">Managed Events</h3>
            <p className="text-4xl font-black text-white">{stats?.totalEvents}</p>
            <p className="mt-4 text-slate-500 text-sm italic">Total created by you</p>
          </div>
        </div>

        {/* Chart Section */}
        <section className="bg-slate-800/30 p-8 rounded-[2rem] border border-slate-700/50 shadow-2xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold">Revenue Graph</h2>
              <p className="text-slate-500 text-sm mt-1">Daily income visualization</p>
            </div>
          </div>
          
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `Rp ${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '16px', 
                    border: '1px solid #334155',
                    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#3b82f6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

      </div>
    </div>
  );
};

export default OrganizerDashboard;
