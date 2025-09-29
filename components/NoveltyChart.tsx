
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { NoveltySummary } from '../types';

interface NoveltyChartProps {
  data: NoveltySummary;
}

const NoveltyChart: React.FC<NoveltyChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Sequence Type', Known: data.known, Novel: data.novel },
  ];

  return (
     <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
            <BarChart
                data={chartData}
                margin={{
                    top: 20, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Known" fill="#2ecc71" />
                <Bar dataKey="Novel" fill="#e74c3c" />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default NoveltyChart;
