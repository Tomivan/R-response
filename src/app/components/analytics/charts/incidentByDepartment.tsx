'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import styles from './Chart.module.css';

const data = [
  { department: 'Fire Rescue', incidents: 384, resolved: 356 },
  { department: 'Police Dept', incidents: 312, resolved: 289 },
  { department: 'EMS Unit 4', incidents: 276, resolved: 267 },
  { department: 'Public Works', incidents: 198, resolved: 178 },
  { department: 'Security', incidents: 114, resolved: 102 },
];

export default function IncidentsByDepartment() {
  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Incidents by Department</h3>
      <p className={styles.chartSubtitle}>Total vs Resolved incidents per department</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="department" stroke="var(--color-text-muted)" fontSize={11} />
          <YAxis stroke="var(--color-text-muted)" fontSize={11} />
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              color: 'var(--color-text)',
            }}
          />
          <Legend />
          <Bar dataKey="incidents" fill="var(--color-primary)" name="Total Incidents" radius={[4, 4, 0, 0]} />
          <Bar dataKey="resolved" fill="var(--color-success)" name="Resolved" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}