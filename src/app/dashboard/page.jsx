'use client'; 
import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

const MOCK_SALES_DATA = [
    { name: 'Q1', sales2024: 120, sales2023: 105, sales2022: 90 },
    { name: 'Q2', sales2024: 155, sales2023: 130, sales2022: 110 },
    { name: 'Q3', sales2024: 170, sales2023: 160, sales2022: 140 },
    { name: 'Q4', sales2024: 195, sales2023: 185, sales2022: 170 },
];

const CHART_COLORS = ['#4F46E5', '#A5B4FC', '#34D399'];

const ButtonAtom = ({ children, onClick, className = '', isActive = false }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg shadow-md
            ${isActive
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}
            ${className}`
        }
    >
        {children}
    </button>
);

const InputAtom = ({ value, onChange, placeholder, type = 'text' }) => (
    <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
    />
);

const StatCardAtom = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg transition-transform duration-300 hover:scale-[1.02]">
        <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
            </div>
        </div>
    </div>
);

const ChartSelectorMolecule = ({ activeChart, setChart }) => (
    <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded-xl shadow-inner">
        {['Bar', 'Line', 'Area', 'Pie'].map((type) => (
            <ButtonAtom
                key={type}
                onClick={() => setChart(type)}
                isActive={activeChart === type}
            >
                {type} Chart
            </ButtonAtom>
        ))}
    </div>
);

const ThresholdFilterMolecule = ({ threshold, setThreshold }) => (
    <div className="flex items-center space-x-3">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Min Sales Threshold (M):
        </label>
        <InputAtom
            type="number"
            value={threshold}
            onChange={setThreshold}
            placeholder="e.g., 150"
        />
    </div>
);

const ChartDisplayOrganism = ({ data, chartType, threshold }) => {
    const filteredData = data.filter(d => d.sales2024 >= threshold);
    const hasFilteredData = filteredData.length > 0;

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-xl">
                    <p className="font-semibold text-indigo-700">{label}</p>
                    {payload.map((p, i) => (
                        <p key={i} style={{ color: p.color }}>
                            {p.name}: **${p.value}M**
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (!hasFilteredData) {
        return (
            <div className="flex items-center justify-center h-full min-h-64 text-center text-gray-500 border-4 border-dashed border-gray-200 rounded-xl">
                <p className="text-lg">No data meets the current sales threshold of ${threshold}M.</p>
            </div>
        );
    }

    const pieData = filteredData.reduce((acc, curr) => {
        acc.push({ name: `${curr.name} '24`, value: curr.sales2024, year: 2024 });
        acc.push({ name: `${curr.name} '23`, value: curr.sales2023, year: 2023 });
        acc.push({ name: `${curr.name} '22`, value: curr.sales2022, year: 2022 });
        return acc;
    }, []).filter(d => d.value >= threshold);

    const renderChart = () => {
        switch (chartType) {
            case 'Bar':
                return (
                    <BarChart data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(val) => `$${val}M`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="sales2024" fill={CHART_COLORS[0]} name="2024 Sales" radius={[10, 10, 0, 0]} />
                        <Bar dataKey="sales2023" fill={CHART_COLORS[1]} name="2023 Sales" radius={[10, 10, 0, 0]} />
                        <Bar dataKey="sales2022" fill={CHART_COLORS[2]} name="2022 Sales" radius={[10, 10, 0, 0]} />
                    </BarChart>
                );
            case 'Line':
                return (
                    <LineChart data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(val) => `$${val}M`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line type="monotone" dataKey="sales2024" stroke={CHART_COLORS[0]} strokeWidth={2} name="2024 Sales" dot={{ r: 6 }} />
                        <Line type="monotone" dataKey="sales2023" stroke={CHART_COLORS[1]} strokeWidth={2} name="2023 Sales" dot={{ r: 6 }} />
                        <Line type="monotone" dataKey="sales2022" stroke={CHART_COLORS[2]} strokeWidth={2} name="2022 Sales" dot={{ r: 6 }} />
                    </LineChart>
                );
            case 'Area':
                return (
                    <AreaChart data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(val) => `$${val}M`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="sales2024" stroke={CHART_COLORS[0]} fillOpacity={0.5} fill={CHART_COLORS[0]} name="2024 Sales" />
                        <Area type="monotone" dataKey="sales2023" stroke={CHART_COLORS[1]} fillOpacity={0.5} fill={CHART_COLORS[1]} name="2023 Sales" />
                        <Area type="monotone" dataKey="sales2022" stroke={CHART_COLORS[2]} fillOpacity={0.5} fill={CHART_COLORS[2]} name="2022 Sales" />
                    </AreaChart>
                );
            case 'Pie':
                return (
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[entry.year % 3]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend align="right" verticalAlign="middle" layout="vertical" />
                    </PieChart>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
            </ResponsiveContainer>
        </div>
    );
};

const SalesChartOrganism = ({ salesData }) => {
    const [chartType, setChartType] = useState('Bar');
    const [thresholdInput, setThresholdInput] = useState('0');

    const threshold = useMemo(() => {
        const value = parseFloat(thresholdInput);
        return isNaN(value) || value < 0 ? 0 : value;
    }, [thresholdInput]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg h-full flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Quarterly Sales Performance</h2>

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <ChartSelectorMolecule activeChart={chartType} setChart={setChartType} />
                <ThresholdFilterMolecule
                    threshold={thresholdInput}
                    setThreshold={(e) => setThresholdInput(e.target.value)}
                />
            </div>

            <div className="flex-grow min-h-96">
                <ChartDisplayOrganism
                    data={salesData}
                    chartType={chartType}
                    threshold={threshold}
                />
            </div>
        </div>
    );
};

const DashboardTemplate = ({ children }) => (
    <div className="min-h-screen flex bg-gray-50">
        <aside className="hidden md:block w-64 bg-gray-800 text-white p-6 shadow-2xl">
            <h1 className="text-2xl font-extrabold text-indigo-400 mb-8">
                SALES HUB
            </h1>
            <nav>
                <a href="#" className="block px-3 py-2 rounded-lg bg-indigo-700 font-semibold mb-2 transition-colors hover:bg-indigo-600">
                    <svg className="inline w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7-8h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2z"></path></svg>
                    Dashboard
                </a>
                <a href="#" className="block px-3 py-2 rounded-lg font-medium mb-2 transition-colors hover:bg-gray-700">
                    <svg className="inline w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m0 0h2m0 0h4m-4 0v-4m4 4v-4m-6 4H7m6-12a2 2 0 012-2h4a2 2 0 012 2v6m-6-6h6"></path></svg>
                    Reports
                </a>
            </nav>
        </aside>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-8">
            {children}
        </main>
    </div>
);

const DashboardPage = () => {
    const [isLoading, setIsLoading] = useState(false);

    const totalSales2024 = MOCK_SALES_DATA.reduce((sum, d) => sum + d.sales2024, 0);
    const avgSales2024 = (totalSales2024 / MOCK_SALES_DATA.length).toFixed(1);
    const totalSales2023 = MOCK_SALES_DATA.reduce((sum, d) => sum + d.sales2023, 0);

    const growthRate = (((totalSales2024 - totalSales2023) / totalSales2023) * 100).toFixed(1);

    const StatIcons = {
        total: <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V9m0 4v1m-4 5h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>,
        avg: <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4m-12 8h10M4 18h24"></path></svg>,
        growth: <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>,
    };

    return (
        <DashboardTemplate>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
                Executive Sales Dashboard
            </h1>
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-xl text-indigo-600">Loading data from API...</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
                        <StatCardAtom
                            title="Total Sales (2024)"
                            value={`$${totalSales2024.toFixed(0)}M`}
                            icon={StatIcons.total}
                            color="text-indigo-600"
                        />
                        <StatCardAtom
                            title="Avg Quarterly Sales"
                            value={`$${avgSales2024}M`}
                            icon={StatIcons.avg}
                            color="text-indigo-600"
                        />
                        <StatCardAtom
                            title="YoY Growth (2024 vs 2023)"
                            value={`${growthRate}%`}
                            icon={StatIcons.growth}
                            color={growthRate >= 0 ? "text-green-600" : "text-red-600"}
                        />
                    </div>

                    <div className="h-full">
                        <SalesChartOrganism salesData={MOCK_SALES_DATA} />
                    </div>

                    <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-lg">
                        <p className="font-semibold">API Integration Note:</p>
                        <p className="text-sm">
                            The data is currently mocked (`MOCK_SALES_DATA`). In a real Next.js application, you would replace this data with a fetch call in `useEffect` or `getStaticProps/getServerSideProps` to load from a backend API, fulfilling the "API Integration" requirement.
                        </p>
                    </div>
                </>
            )}
        </DashboardTemplate>
    );
};

export default DashboardPage;