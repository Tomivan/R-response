'use client';

import { useState } from 'react';
import Sidebar from '../components/sidebar/sidebar';
import Topbar from '../components/topbar/topbar';
import MonthlyKPIs from '../components/analytics/monthlyKPIs/monthlyKPIs';
import IncidentsByDepartment from '../components/analytics/charts/incidentByDepartment';
import TopIncidentTypes from '../components/analytics/charts/topIncidentTypes';
import StatusBreakdown from '../components/analytics/charts/statusBreakdown';
import ResolutionRateByDepartment from '../components/analytics/charts/resolutionRate';
import styles from './analytics.module.css';

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <Topbar onMenuToggle={toggleSidebar} />
      
      <main className={`${styles.main} ${!sidebarOpen ? styles.fullWidth : ''}`}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Analytics Dashboard</h1>
            <p className={styles.subtitle}>
              Real-time insights and performance metrics for incident management.
            </p>
          </div>

          <MonthlyKPIs />

          <div className={styles.chartsGrid}>
            <div className={styles.chartCard}>
              <IncidentsByDepartment />
            </div>
            <div className={styles.chartCard}>
              <TopIncidentTypes />
            </div>
            <div className={styles.chartCard}>
              <StatusBreakdown />
            </div>
            <div className={styles.chartCard}>
              <ResolutionRateByDepartment />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}