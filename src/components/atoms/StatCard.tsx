import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  isUp: boolean;
  icon: LucideIcon;
}

export default function StatCard({
  title,
  value,
  change,
  isUp,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between">
        <div className="p-3 rounded-xl bg-indigo-50">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>

        <span
          className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full ${
            isUp
              ? "text-emerald-600 bg-emerald-50"
              : "text-rose-600 bg-rose-50"
          }`}
        >
          {isUp ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {change}%
        </span>
      </div>

      <p className="mt-4 text-sm text-slate-500">{title}</p>

    
      <p className="mt-1 text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}
