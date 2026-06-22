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

interface IncidentTypeData {
  type: string;
  count: number;
}

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
  const { incidents, isLoading } = useIncidentStore();
  const [chartData, setChartData] = useState<IncidentTypeData[]>([]);

  useEffect(() => {
    if (incidents.length === 0) {
      setChartData([]);
      return;
    }

    // Count incidents by type
    const typeMap = new Map<string, number>();

    incidents.forEach((incident) => {
      const type = incident.type || 'Unknown';
      const existing = typeMap.get(type) || 0;
      typeMap.set(type, existing + 1);
    });

    // Convert to array, sort by count descending, and take top 6
    const sortedData = Array.from(typeMap.entries())
      .map(([type, count]) => ({
        type,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    setChartData(sortedData);
  }, [incidents]);

  if (isLoading) {
    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>Top Incident Types</h3>
        <p className={styles.chartSubtitle}>Most frequently reported incident categories</p>
        <div className={styles.loadingState}>Loading chart data...</div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>Top Incident Types</h3>
        <p className={styles.chartSubtitle}>Most frequently reported incident categories</p>
        <div className={styles.emptyState}>No incident data available</div>
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Top Incident Types</h3>
      <p className={styles.chartSubtitle}>Most frequently reported incident categories</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart 
          data={chartData} 
          margin={{ top: 10, right: 10, left: 0, bottom: 5 }} 
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            type="number" 
            stroke="var(--color-text-muted)" 
            fontSize={11}
            tick={{ fill: 'var(--color-text-muted)' }}
          />
          <YAxis 
            type="category" 
            dataKey="type" 
            stroke="var(--color-text-muted)" 
            fontSize={11} 
            width={120}
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