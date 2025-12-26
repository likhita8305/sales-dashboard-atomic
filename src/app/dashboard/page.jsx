'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Users, 
  ShoppingBag, Activity, LayoutDashboard, FileText, 
  Settings, Menu, X, Download, Search, Bell
} from 'lucide-react';

// --- DATA ---
const MOCK_SALES_DATA = [
    { name: 'Jan', sales: 4000, revenue: 2400 },
    { name: 'Feb', sales: 3000, revenue: 1398 },
    { name: 'Mar', sales: 5000, revenue: 9800 },
    { name: 'Apr', sales: 2780, revenue: 3908 },
    { name: 'May', sales: 1890, revenue: 4800 },
    { name: 'Jun', sales: 2390, revenue: 3800 },
    { name: 'Jul', sales: 3490, revenue: 4300 },
];

const RECENT_TRANSACTIONS = [
    { id: '#1204', customer: "Alice Johnson", amount: "$1,200", status: "Completed", date: "2 mins ago", email: "alice@example.com" },
    { id: '#1205', customer: "Bob Smith", amount: "$850", status: "Pending", date: "15 mins ago", email: "bob@example.com" },
    { id: '#1206', customer: "Charlie Brown", amount: "$2,400", status: "Completed", date: "1 hour ago", email: "char@example.com" },
    { id: '#1207', customer: "Diana Prince", amount: "$300", status: "Cancelled", date: "3 hours ago", email: "diana@example.com" },
    { id: '#1208', customer: "Evan Wright", amount: "$1,100", status: "Completed", date: "5 hours ago", email: "evan@example.com" },
    { id: '#1209', customer: "Fiona Gallagher", amount: "$450", status: "Pending", date: "6 hours ago", email: "fiona@example.com" },
];

const RADIAL_DATA = [
  { name: 'Direct', uv: 31.47, fill: '#6366f1' },
  { name: 'Social', uv: 26.69, fill: '#10b981' },
  { name: 'Ads', uv: 15.69, fill: '#f59e0b' },
  { name: 'Referral', uv: 8.22, fill: '#3b82f6' },
];

// --- COMPONENTS ---

const StatCard = ({ title, value, change, isUp, icon: Icon, color }) => (
  <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <span className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {isUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
        {change}%
      </span>
    </div>
    <div className="mt-5">
      <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">{title}</h3>
      <p className="text-3xl font-black text-slate-800 mt-1 tracking-tight">{value}</p>
    </div>
  </div>
);

const TransactionTable = ({ limit }) => {
    const data = limit ? RECENT_TRANSACTIONS.slice(0, limit) : RECENT_TRANSACTIONS;
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
                    <tr>
                        <th className="px-8 py-5">Client</th>
                        <th className="px-8 py-5">Status</th>
                        <th className="px-8 py-5">Amount</th>
                        <th className="px-8 py-5">Activity</th>
                        <th className="px-8 py-5 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                    {data.map((tx, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-all group">
                            <td className="px-8 py-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-white transition-colors">
                                        {tx.customer.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-800">{tx.customer}</p>
                                        <p className="text-xs font-bold text-slate-400 lowercase">{tx.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <div className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm ${
                                    tx.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                                    tx.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                                }`}>
                                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                        tx.status === 'Completed' ? 'bg-emerald-500' :
                                        tx.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'
                                    }`} />
                                    {tx.status}
                                </div>
                            </td>
                            <td className="px-8 py-6 font-black text-slate-900">{tx.amount}</td>
                            <td className="px-8 py-6 text-slate-400 font-bold text-xs italic">{tx.date}</td>
                            <td className="px-8 py-6 text-right">
                                <button className="p-2 hover:bg-white rounded-xl text-slate-300 hover:text-indigo-600 transition-all border border-transparent hover:border-slate-200 shadow-none hover:shadow-sm">
                                    <Settings className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- VIEWS (These change based on Sidebar click) ---

const OverviewView = ({ setActiveTab }) => (
    <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-indigo-600 font-black text-xs uppercase tracking-[0.2em] mb-1">Performance Overview</p>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
            </div>
            <div className="flex items-center bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 w-fit">
              <button className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-800">12 Months</button>
              <button className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800">30 Days</button>
            </div>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard title="Annual Revenue" value="$842,231" change="24.5" isUp icon={DollarSign} color="bg-indigo-500" />
            <StatCard title="Active Clients" value="1,842" change="12.2" isUp icon={Users} color="bg-emerald-500" />
            <StatCard title="Monthly Sales" value="842" change="2.1" isDown icon={ShoppingBag} color="bg-orange-500" />
            <StatCard title="Conversion" value="64.2%" change="4.8" isUp icon={Activity} color="bg-blue-500" />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">Revenue Dynamics</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MOCK_SALES_DATA}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} dy={15} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                            <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '20px' }} />
                            <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col">
                <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Acquisition</h3>
                <div className="flex-1 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" barSize={12} data={RADIAL_DATA}>
                            <RadialBar minAngle={15} background clockWise dataKey="uv" cornerRadius={10} />
                        </RadialBarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>

        <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
                    <p className="text-sm font-medium text-slate-400">Latest 4 transactions</p>
                </div>
                <button onClick={() => setActiveTab('cust')} className="px-6 py-2.5 bg-indigo-50 text-indigo-600 font-black text-sm rounded-2xl hover:bg-indigo-100 transition-colors">View All Logs</button>
            </div>
            <TransactionTable limit={4} />
        </section>
    </div>
);

const AnalyticsView = () => (
    <div className="space-y-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Deep Analytics</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
                 <h3 className="text-lg font-bold mb-4">Detailed Revenue Trend</h3>
                 <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MOCK_SALES_DATA}>
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} fill="url(#colorSales)" />
                        </AreaChart>
                    </ResponsiveContainer>
                 </div>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
                 <h3 className="text-lg font-bold mb-4">Traffic Sources</h3>
                 <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={20} data={RADIAL_DATA}>
                            <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background clockWise dataKey="uv" />
                            <Tooltip />
                        </RadialBarChart>
                    </ResponsiveContainer>
                 </div>
            </div>
        </div>
    </div>
);

const CustomersView = () => (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Customer Database</h1>
            <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700">Add New Customer</button>
        </div>
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
            <TransactionTable />
        </div>
    </div>
);

const ReportsView = () => (
    <div className="h-[600px] flex flex-col items-center justify-center space-y-6 text-center">
        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center">
            <FileText className="w-10 h-10 text-indigo-500" />
        </div>
        <div>
            <h2 className="text-3xl font-black text-slate-900">Reports Center</h2>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">Select a date range and category to generate detailed PDF reports of your sales and customer acquisition metrics.</p>
        </div>
        <button className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all active:scale-95">
            Download Monthly Report
        </button>
    </div>
);

// --- MAIN LAYOUT ---

const Sidebar = ({ isOpen, toggle, activeTab, setActiveTab }) => (
  <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-slate-300 transform transition-transform duration-500 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
    <div className="h-full flex flex-col p-8">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/40">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter italic">ATOMIC<span className="text-indigo-400">BI</span></span>
        </div>
        <button onClick={toggle} className="md:hidden p-2 hover:bg-slate-800 rounded-xl">
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        {[
          { id: 'dash', icon: LayoutDashboard, label: 'Overview' },
          { id: 'sales', icon: ShoppingBag, label: 'Analytics' },
          { id: 'cust', icon: Users, label: 'Customers' },
          { id: 'inv', icon: FileText, label: 'Reporting' },
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => { setActiveTab(item.id); toggle(); }}
            className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
              activeTab === item.id 
                ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/20' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`} />
            <span className="font-bold tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto bg-slate-800/50 rounded-3xl p-5 border border-slate-700/50">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-lg shadow-md">L</div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
          </div>
          <div>
            <p className="text-sm font-black text-white">Likhita</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  </aside>
);

export default function Dashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dash');
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const renderContent = () => {
    switch(activeTab) {
      case 'sales': return <AnalyticsView />;
      case 'cust': return <CustomersView />;
      case 'inv': return <ReportsView />;
      default: return <OverviewView setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 antialiased">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggle={() => setSidebarOpen(false)} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <div className="md:ml-72 transition-all duration-500">
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors">
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            <div className="relative hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-12 pr-6 py-3 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 w-64 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
             <button className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl relative transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
                <div className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></div>
             </button>
             <button className="flex items-center space-x-3 px-6 py-3 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95">
                <Download className="w-4 h-4" />
                <span className="text-sm font-bold tracking-tight">Report</span>
             </button>
          </div>
        </header>

        <main className="p-8 max-w-[1600px] mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}