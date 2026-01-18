'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import {
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingBag,
  Activity,
  LayoutDashboard,
  FileText,
  Menu,
  Download,
  Settings,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

// --- Types ---
interface SalesData {
  name: string;
  sales: number;
  revenue: number;
}

interface Transaction {
  id: string;
  customer: string;
  amount: string;
  status: string;
  date: string;
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isUp: boolean;
  icon: LucideIcon;
  color: string;
}

// --- Mock Data ---
const SALES_DATA: Record<number, SalesData[]> = {
  2022: [
    { name: 'Jan', sales: 4000, revenue: 2400 },
    { name: 'Feb', sales: 3000, revenue: 1398 },
    { name: 'Mar', sales: 5000, revenue: 9800 },
    { name: 'Apr', sales: 2780, revenue: 3908 },
    { name: 'May', sales: 1890, revenue: 4800 },
    { name: 'Jun', sales: 2390, revenue: 3800 },
    { name: 'Jul', sales: 3490, revenue: 4300 },
  ],
  2023: [
    { name: 'Jan', sales: 4200, revenue: 2600 },
    { name: 'Feb', sales: 3100, revenue: 1500 },
    { name: 'Mar', sales: 5200, revenue: 10000 },
    { name: 'Apr', sales: 2900, revenue: 4100 },
    { name: 'May', sales: 2000, revenue: 5000 },
    { name: 'Jun', sales: 2500, revenue: 3900 },
    { name: 'Jul', sales: 3600, revenue: 4500 },
  ],
  2024: [
    { name: 'Jan', sales: 4500, revenue: 2800 },
    { name: 'Feb', sales: 3200, revenue: 1700 },
    { name: 'Mar', sales: 5500, revenue: 10200 },
    { name: 'Apr', sales: 3000, revenue: 4200 },
    { name: 'May', sales: 2100, revenue: 5200 },
    { name: 'Jun', sales: 2600, revenue: 4000 },
    { name: 'Jul', sales: 3700, revenue: 4600 },
  ],
};

const RECENT_TRANSACTIONS: Transaction[] = [
  { id: '#1204', customer: 'Alice Johnson', amount: '$1,200', status: 'Completed', date: '2 mins ago' },
  { id: '#1205', customer: 'Bob Smith', amount: '$850', status: 'Pending', date: '15 mins ago' },
  { id: '#1206', customer: 'Charlie Brown', amount: '$2,400', status: 'Completed', date: '1 hour ago' },
  { id: '#1207', customer: 'Diana Prince', amount: '$300', status: 'Cancelled', date: '3 hours ago' },
];

const RADIAL_DATA = [
  { name: 'Direct', uv: 31.47, fill: '#6366f1' },
  { name: 'Social', uv: 26.69, fill: '#10b981' },
  { name: 'Ads', uv: 15.69, fill: '#f59e0b' },
  { name: 'Referral', uv: 8.22, fill: '#3b82f6' },
];

// --- Components ---
const StatCard: React.FC<StatCardProps> = ({ title, value, change, isUp, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm">
    <div className="flex justify-between items-center">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
        <Icon className={`${color.replace('bg-', 'text-')} w-6 h-6`} />
      </div>
      <span className={`text-xs font-bold px-3 py-1 rounded-full ${isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {isUp ? <TrendingUp className="w-3 h-3 inline" /> : <TrendingDown className="w-3 h-3 inline" />}
        {change}%
      </span>
    </div>
    <h3 className="mt-4 text-sm text-slate-400">{title}</h3>
    <p className="text-3xl font-black">{value}</p>
  </div>
);

const TransactionTable: React.FC<{ limit?: number }> = ({ limit }) => {
  const data = limit ? RECENT_TRANSACTIONS.slice(0, limit) : RECENT_TRANSACTIONS;
  return (
    <table className="w-full text-left">
      <tbody>
        {data.map(tx => (
          <tr key={tx.id} className="border-b">
            <td className="p-4 font-bold">{tx.customer}</td>
            <td className="p-4">{tx.status}</td>
            <td className="p-4">{tx.amount}</td>
            <td className="p-4">{tx.date}</td>
            <td className="p-4"><Settings className="w-4 h-4" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// --- Views ---
interface OverviewProps { switchView: (tab: string) => void; data: SalesData[]; chartType: 'line' | 'bar' | 'pie'; }

const OverviewView: React.FC<OverviewProps> = ({ switchView, data, chartType }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-4 gap-6">
      <StatCard title="Annual Revenue" value="$842,231" change="24.5" isUp icon={DollarSign} color="bg-indigo-500" />
      <StatCard title="Active Clients" value="1,842" change="12.2" isUp icon={Users} color="bg-emerald-500" />
      <StatCard title="Monthly Sales" value="842" change="2.1" isUp={false} icon={ShoppingBag} color="bg-orange-500" />
      <StatCard title="Conversion" value="64.2%" change="4.8" isUp icon={Activity} color="bg-blue-500" />
    </div>

    <div className="h-[300px] bg-white rounded-3xl p-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="#c7d2fe" />
        </AreaChart>
      </ResponsiveContainer>
    </div>

    <button onClick={() => switchView('customers')} className="px-6 py-3 bg-indigo-600 text-white rounded-xl">
      View Customers
    </button>
  </div>
);

const AnalyticsView = () => (
  <div className="h-[350px] bg-white rounded-3xl p-6">
    <ResponsiveContainer width="100%" height="100%">
      <RadialBarChart innerRadius="20%" outerRadius="90%" data={RADIAL_DATA}>
        <RadialBar dataKey="uv" />
        <Tooltip />
      </RadialBarChart>
    </ResponsiveContainer>
  </div>
);

const CustomersView = () => (
  <div className="bg-white rounded-3xl p-6">
    <TransactionTable />
  </div>
);

const ReportsView = () => (
  <div className="flex flex-col items-center justify-center h-[400px]">
    <FileText className="w-12 h-12 text-indigo-500" />
    <h2 className="text-2xl font-bold mt-4">Reports Center</h2>
  </div>
);

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, toggle }) => (
  <aside className={`fixed left-0 top-0 h-full w-64 bg-slate-900 text-white ${isOpen ? 'block' : 'hidden'} md:block`}>
    <nav className="p-6 space-y-4">
      {[
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'analytics', label: 'Analytics', icon: ShoppingBag },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'reports', label: 'Reports', icon: FileText },
      ].map(item => (
        <button
          key={item.id}
          onClick={() => { setActiveTab(item.id); toggle(); }}
          className={`flex items-center space-x-3 w-full p-3 rounded-xl ${activeTab === item.id ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}
        >
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  </aside>
);

// --- Main Dashboard ---
export default function Dashboard() {
  const [view, setView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Controls
  const [year, setYear] = useState(2024);
  const [minSales, setMinSales] = useState(0);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
  const [filteredData, setFilteredData] = useState<SalesData[]>(SALES_DATA[year]);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    setFilteredData(SALES_DATA[year].filter(item => item.sales >= minSales));
  }, [year, minSales]);

  if (!mounted) return null;

  const renderView = () => {
    switch (view) {
      case 'analytics': return <AnalyticsView />;
      case 'customers': return <CustomersView />;
      case 'reports': return <ReportsView />;
      default: return <OverviewView switchView={setView} data={filteredData} chartType={chartType} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar activeTab={view} setActiveTab={setView} isOpen={sidebarOpen} toggle={() => setSidebarOpen(false)} />

      <div className="md:ml-64">
        <header className="flex justify-between p-6 bg-white items-center gap-4 flex-wrap">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden">
            <Menu />
          </button>

          {/* Controls */}
          <div className="flex gap-4 items-center">
            <select value={year} onChange={e => setYear(Number(e.target.value))} className="p-2 rounded-lg border">
              {[2022, 2023, 2024].map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            <input
              type="number"
              value={minSales}
              onChange={e => setMinSales(Number(e.target.value))}
              placeholder="Min Sales"
              className="p-2 rounded-lg border"
            />

            {['line', 'bar', 'pie'].map(type => (
              <button
                key={type}
                onClick={() => setChartType(type as any)}
                className={`px-4 py-2 rounded-lg ${chartType === type ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
              >
                {type.toUpperCase()}
              </button>
            ))}

            <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </header>

        <main className="p-8">{renderView()}</main>
      </div>
    </div>
  );
}
