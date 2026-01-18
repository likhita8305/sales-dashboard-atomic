'use client';

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import StatCard from '../atoms/StatCard';
import TransactionTable from '../molecules/TransactionTable';

/* ======================
   TYPES
====================== */

export type ChartType = 'line' | 'bar' | 'pie';

/**
 * IMPORTANT:
 * Recharts requires an index signature
 * This fixes: ChartDataInput[] type error
 */
export interface SalesData {
  name: string;
  sales: number;
  revenue: number;
  [key: string]: string | number;
}

interface Transaction {
  id: number;
  customer: string;
  amount: number;
}

interface OverviewViewProps {
  data: SalesData[];
  chartType: ChartType;
}

/* ======================
   COMPONENT
====================== */

export default function OverviewView({
  data,
  chartType,
}: OverviewViewProps) {
  const transactions: Transaction[] = [
    { id: 1, customer: 'Alice', amount: 1200 },
    { id: 2, customer: 'Bob', amount: 900 },
    { id: 3, customer: 'Charlie', amount: 1500 },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <h1 className="text-2xl font-bold">Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Sales" value="$45,000" />
        <StatCard title="Orders" value="1,200" />
        <StatCard title="Customers" value="320" />
      </div>

      {/* Chart Section */}
      <div className="h-[300px] bg-white rounded-2xl p-6 shadow">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' && (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                fill="#c7d2fe"
              />
            </AreaChart>
          )}

          {chartType === 'bar' && (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#6366f1" />
            </BarChart>
          )}

          {chartType === 'pie' && (
            <PieChart>
              <Pie
                data={data}
                dataKey="revenue"
                nameKey="name"
                outerRadius={100}
                fill="#6366f1"
                label
              />
              <Tooltip />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-2xl p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">
          Recent Transactions
        </h2>
        <TransactionTable data={transactions} />
      </div>
    </div>
  );
}
