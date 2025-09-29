import React from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import type { TaxonomyNode } from '../types';

interface TaxonomyTreemapProps {
  data: TaxonomyNode[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
        <p className="font-semibold">{`${data.name}: ${data.value} sequences`}</p>
      </div>
    );
  }
  return null;
};

const COLORS = ['#8889DD', '#9597E4', '#8DC77B', '#A5D297', '#E2CF45', '#F8C12D'];

const CustomizedContent: React.FC<any> = ({ root, depth, x, y, width, height, index, colors, name }) => {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: depth < 2 ? colors[index % colors.length] : 'none',
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {depth === 1 && width > 50 && height > 25 ? (
        <text x={x + width / 2} y={y + height / 2 + 7} textAnchor="middle" fill="#fff" fontSize={14}>
          {name}
        </text>
      ) : null}
    </g>
  );
};


const TaxonomyTreemap: React.FC<TaxonomyTreemapProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500">No distribution data available.</div>;
  }
  return (
    <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
             <Treemap
                // FIX: Cast data to `any` to satisfy recharts' type which expects an index signature.
                // The TaxonomyNode type is structurally compatible for runtime, this resolves the compile-time type mismatch.
                data={data as any}
                dataKey="value"
                stroke="#fff"
                fill="#8884d8"
                content={<CustomizedContent colors={COLORS} />}
                aspectRatio={4 / 3}
            >
                <Tooltip content={<CustomTooltip />} />
            </Treemap>
        </ResponsiveContainer>
    </div>
  );
};

export default TaxonomyTreemap;
