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
  { status: 'Open', count: 42 },
  { status: 'In-Progress', count: 28 },
  { status: 'Resolved', count: 1242 },
];

const COLORS = ['#dc2626', '#f59e0b', '#22c55e'];

// Custom shape with individual colors
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

export default function StatusBreakdown() {
  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Status Breakdown</h3>
      <p className={styles.chartSubtitle}>Current incident status distribution</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="status" stroke="var(--color-text-muted)" fontSize={11} />
          <YAxis stroke="var(--color-text-muted)" fontSize={11} />
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