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
  { department: 'EMS Unit 4', rate: 96.7 },
  { department: 'Fire Rescue', rate: 92.7 },
  { department: 'Police Dept', rate: 92.6 },
  { department: 'Public Works', rate: 89.9 },
  { department: 'Security', rate: 89.5 },
];

export default function ResolutionRateByDepartment() {
  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Resolution Rate by Department</h3>
      <p className={styles.chartSubtitle}>Percentage of incidents resolved per department</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="department" stroke="var(--color-text-muted)" fontSize={11} />
          <YAxis stroke="var(--color-text-muted)" fontSize={11} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              color: 'var(--color-text)',
            }}
            formatter={(value) => [`${value}%`, 'Resolution Rate']}
          />
          <Bar dataKey="rate" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}