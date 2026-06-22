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

interface DepartmentRate {
  department: string;
  rate: number;
}

export default function ResolutionRateByDepartment() {
  const { incidents, isLoading } = useIncidentStore();
  const [chartData, setChartData] = useState<DepartmentRate[]>([]);

  useEffect(() => {
    if (incidents.length === 0) {
      setChartData([]);
      return;
    }

    // Group incidents by department and calculate resolution rate
    const departmentMap = new Map<string, { total: number; resolved: number }>();

    incidents.forEach((incident) => {
      const dept = incident.department || 'Unknown';
      const existing = departmentMap.get(dept);
      
      if (existing) {
        existing.total += 1;
        if (incident.status === 'Resolved') {
          existing.resolved += 1;
        }
      } else {
        departmentMap.set(dept, {
          total: 1,
          resolved: incident.status === 'Resolved' ? 1 : 0,
        });
      }
    });

    // Calculate resolution rate for each department
    const calculatedData = Array.from(departmentMap.entries())
      .map(([department, data]) => ({
        department,
        rate: data.total > 0 ? Math.round((data.resolved / data.total) * 100) : 0,
      }))
      .sort((a, b) => b.rate - a.rate);

    setChartData(calculatedData);
  }, [incidents]);

  if (isLoading) {
    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>Resolution Rate by Department</h3>
        <p className={styles.chartSubtitle}>Percentage of incidents resolved per department</p>
        <div className={styles.loadingState}>Loading chart data...</div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>Resolution Rate by Department</h3>
        <p className={styles.chartSubtitle}>Percentage of incidents resolved per department</p>
        <div className={styles.emptyState}>No incident data available</div>
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Resolution Rate by Department</h3>
      <p className={styles.chartSubtitle}>Percentage of incidents resolved per department</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="department" 
            stroke="var(--color-text-muted)" 
            fontSize={11}
            tick={{ fill: 'var(--color-text-muted)' }}
          />
          <YAxis 
            stroke="var(--color-text-muted)" 
            fontSize={11} 
            domain={[0, 100]}
            tick={{ fill: 'var(--color-text-muted)' }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              color: 'var(--color-text)',
            }}
            formatter={(value: any) => [`${value}%`, 'Resolution Rate']}
          />
          <Bar 
            dataKey="rate" 
            fill="var(--color-success)" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}