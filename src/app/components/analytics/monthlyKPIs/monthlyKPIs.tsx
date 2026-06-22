'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useIncidentStore } from '../../../../../store/incidentStore';
import Incident from '../../../../../public/images/incident.svg';
import Resolution from '../../../../../public/images/resolution.svg';
import styles from './monthlyKPIs.module.css';

interface KPI {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
}

const iconMap = {
  Incident: Incident,
  Resolution: Resolution,
};

const kpis: KPI[] = [
  { label: 'Total Incidents', value: '0', change: '+0%', trend: 'up', icon: 'Incident' },
  { label: 'Active Incidents', value: '0', change: '-0%', trend: 'down', icon: 'Incident' },
  { label: 'Resolved Incidents', value: '0', change: '+0%', trend: 'up', icon: 'Incident' },
  { label: 'Resolution Rate', value: '0%', change: '+0%', trend: 'up', icon: 'Resolution' },
];

export default function MonthlyKPIs() {
  const { incidents, isLoading } = useIncidentStore();
  const [kpiData, setKpiData] = useState(kpis);
  const [previousMonthData, setPreviousMonthData] = useState({
    total: 0,
    active: 0,
    resolved: 0,
    resolutionRate: 0,
  });

  // Calculate KPIs from incidents data
  useEffect(() => {
    if (incidents.length === 0) {
      // Use static data or show loading state
      return;
    }

    // Calculate current month metrics
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Filter incidents for current month
    const currentMonthIncidents = incidents.filter(incident => {
      if (!incident.createdAt) return false;
      const incidentDate = new Date(incident.createdAt);
      return incidentDate.getMonth() === currentMonth && 
             incidentDate.getFullYear() === currentYear;
    });

    // Filter incidents for previous month
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const previousMonthIncidents = incidents.filter(incident => {
      if (!incident.createdAt) return false;
      const incidentDate = new Date(incident.createdAt);
      return incidentDate.getMonth() === previousMonth && 
             incidentDate.getFullYear() === previousYear;
    });

    // Calculate current metrics
    const total = currentMonthIncidents.length;
    const active = currentMonthIncidents.filter(
      i => i.status === 'Open' || i.status === 'In-Progress'
    ).length;
    const resolved = currentMonthIncidents.filter(
      i => i.status === 'Resolved'
    ).length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    // Calculate previous month metrics
    const prevTotal = previousMonthIncidents.length;
    const prevResolved = previousMonthIncidents.filter(
      i => i.status === 'Resolved'
    ).length;
    const prevResolutionRate = prevTotal > 0 ? Math.round((prevResolved / prevTotal) * 100) : 0;

    // Calculate changes
    const totalChange = prevTotal > 0 ? Math.round(((total - prevTotal) / prevTotal) * 100) : 0;
    const resolvedChange = prevTotal > 0 ? Math.round(((resolved - prevResolved) / prevTotal) * 100) : 0;
    const resolutionChange = prevResolutionRate > 0 ? Math.round(resolutionRate - prevResolutionRate) : 0;

    // Update KPI data
    setKpiData([
      { 
        label: 'Total Incidents', 
        value: total.toString(), 
        change: `${totalChange >= 0 ? '+' : ''}${totalChange}%`, 
        trend: totalChange >= 0 ? 'up' : 'down', 
        icon: 'Incident' 
      },
      { 
        label: 'Active Incidents', 
        value: active.toString(), 
        change: `${totalChange >= 0 ? '+' : ''}${totalChange}%`, 
        trend: totalChange >= 0 ? 'up' : 'down', 
        icon: 'Incident' 
      },
      { 
        label: 'Resolved Incidents', 
        value: resolved.toString(), 
        change: `${resolvedChange >= 0 ? '+' : ''}${resolvedChange}%`, 
        trend: resolvedChange >= 0 ? 'up' : 'down', 
        icon: 'Incident' 
      },
      { 
        label: 'Resolution Rate', 
        value: `${resolutionRate}%`, 
        change: `${resolutionChange >= 0 ? '+' : ''}${resolutionChange}%`, 
        trend: resolutionChange >= 0 ? 'up' : 'down', 
        icon: 'Resolution' 
      },
    ]);

    // Store previous month data for reference
    setPreviousMonthData({
      total: prevTotal,
      active: previousMonthIncidents.filter(
        i => i.status === 'Open' || i.status === 'In-Progress'
      ).length,
      resolved: prevResolved,
      resolutionRate: prevResolutionRate,
    });

  }, [incidents]);

  return (
    <div className={styles.kpiGrid}>
      {kpiData.map((kpi) => (
        <div key={kpi.label} className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>{kpi.label}</span>
            <Image 
              src={iconMap[kpi.icon as keyof typeof iconMap]} 
              alt={kpi.label} 
              width={40} 
              height={40} 
              className={styles.kpiIcon} 
            />
          </div>
          <div className={styles.kpiValueWrapper}>
            {isLoading ? (
              <span className={styles.kpiValue}>Loading...</span>
            ) : (
              <>
                <span className={styles.kpiValue}>{kpi.value}</span>
                {kpi.change && (
                  <span className={`${styles.kpiChange} ${kpi.trend === 'up' ? styles.trendUp : kpi.trend === 'down' ? styles.trendDown : ''}`}>
                    {kpi.change}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}