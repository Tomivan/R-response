'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import styles from './Chart.module.css';

const data = [
  { type: 'Structure Fire', count: 156 },
  { type: 'Traffic Collision', count: 134 },
  { type: 'Medical Assistance', count: 112 },
  { type: 'Gas Leak', count: 89 },
  { type: 'Security Alert', count: 67 },
  { type: 'Public Works', count: 45 },
];

const COLORS = ['#dc2626', '#f59e0b', '#3b82f6', '#22c55e', '#8b5cf6', '#ec4899'];

const renderCustomBar = (props: any) => {
  const { x, y, width, height, index } = props;
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={COLORS[index % COLORS.length]}
      rx={4}
      ry={4}
    />
  );
};

export default function TopIncidentTypes() {
  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Top Incident Types</h3>
      <p className={styles.chartSubtitle}>Most frequently reported incident categories</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart 
          data={data} 
          margin={{ top: 10, right: 10, left: 0, bottom: 5 }} 
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis type="number" stroke="var(--color-text-muted)" fontSize={11} />
          <YAxis 
            type="category" 
            dataKey="type" 
            stroke="var(--color-text-muted)" 
            fontSize={11} 
            width={100} 
          />
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              color: 'var(--color-text)',
            }}
          />
          <Bar 
            dataKey="count" 
            shape={renderCustomBar}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}