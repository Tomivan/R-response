'use client';

import { useState, useEffect } from 'react';
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
import { useIncidentStore } from '../../../../../store/incidentStore';
import styles from './Chart.module.css';

interface DepartmentData {
  department: string;
  incidents: number;
  resolved: number;
}

export default function IncidentsByDepartment() {
  const { incidents, isLoading } = useIncidentStore();
  const [chartData, setChartData] = useState<DepartmentData[]>([]);

  useEffect(() => {
    if (incidents.length === 0) {
      setChartData([]);
      return;
    }

    // Group incidents by department
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

    const sortedData = Array.from(departmentMap.entries())
      .map(([department, data]) => ({
        department,
        incidents: data.total,
        resolved: data.resolved,
      }))
      .sort((a, b) => b.incidents - a.incidents);

    setChartData(sortedData);
  }, [incidents]);

  if (isLoading) {
    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>Incidents by Department</h3>
        <p className={styles.chartSubtitle}>Total vs Resolved incidents per department</p>
        <div className={styles.loadingState}>Loading chart data...</div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>Incidents by Department</h3>
        <p className={styles.chartSubtitle}>Total vs Resolved incidents per department</p>
        <div className={styles.emptyState}>No incident data available</div>
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Incidents by Department</h3>
      <p className={styles.chartSubtitle}>Total vs Resolved incidents per department</p>
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
            tick={{ fill: 'var(--color-text-muted)' }}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              color: 'var(--color-text)',
            }}
            formatter={(value: any) => [value, '']}
          />
          <Legend />
          <Bar 
            dataKey="incidents" 
            fill="var(--color-primary)" 
            name="Total Incidents" 
            radius={[4, 4, 0, 0]} 
          />
          <Bar 
            dataKey="resolved" 
            fill="var(--color-success)" 
            name="Resolved" 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}