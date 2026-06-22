'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useIncidentStore } from '../../../../../store/incidentStore';
import styles from './Chart.module.css';

interface StatusData {
  status: string;
  count: number;
  color: string;
}

const COLORS = {
  Open: '#dc2626',
  'In-Progress': '#f59e0b',
  Resolved: '#22c55e',
  Closed: '#94a3b8',
};

const statusOrder = ['Open', 'In-Progress', 'Resolved', 'Closed'];

export default function StatusBreakdown() {
  const { incidents, isLoading } = useIncidentStore();
  const [chartData, setChartData] = useState<StatusData[]>([]);

  useEffect(() => {
    if (incidents.length === 0) {
      setChartData([]);
      return;
    }

    // Count incidents by status
    const statusMap = new Map<string, number>();

    incidents.forEach((incident) => {
      const status = incident.status || 'Open';
      const existing = statusMap.get(status) || 0;
      statusMap.set(status, existing + 1);
    });

    // Convert to array and sort by status order
    const sortedData = statusOrder
      .filter((s) => statusMap.has(s))
      .map((status) => ({
        status,
        count: statusMap.get(status) || 0,
        color: COLORS[status as keyof typeof COLORS] || '#94a3b8',
      }));

    setChartData(sortedData);
  }, [incidents]);

  if (isLoading) {
    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>Status Breakdown</h3>
        <p className={styles.chartSubtitle}>Current incident status distribution</p>
        <div className={styles.loadingState}>Loading chart data...</div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>Status Breakdown</h3>
        <p className={styles.chartSubtitle}>Current incident status distribution</p>
        <div className={styles.emptyState}>No incident data available</div>
      </div>
    );
  }

  // Custom bar renderer for colors
  const renderCustomBar = (props: any) => {
    const { x, y, width, height, index } = props;
    const colors = ['#dc2626', '#f59e0b', '#22c55e', '#94a3b8'];
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={colors[index % colors.length]}
        rx={4}
        ry={4}
      />
    );
  };

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Status Breakdown</h3>
      <p className={styles.chartSubtitle}>Current incident status distribution</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="status" 
            stroke="var(--color-text-muted)" 
            fontSize={11}
            tick={{ fill: 'var(--color-text-muted)' }}
          />
          <YAxis 
            stroke="var(--color-text-muted)" 
            fontSize={11}
            tick={{ fill: 'var(--color-text-muted)' }}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              color: 'var(--color-text)',
            }}
            formatter={(value: any) => [value, 'Incidents']}
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