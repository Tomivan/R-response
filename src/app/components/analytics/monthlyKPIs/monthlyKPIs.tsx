import Image from 'next/image';
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
  { label: 'Total Incidents', value: '1,284', change: '+12%', trend: 'up', icon: 'Incident' },
  { label: 'Active Incidents', value: '42', change: '-8%', trend: 'down', icon: 'Incident' },
  { label: 'Resolved Incidents', value: '1,242', change: '+15%', trend: 'up', icon: 'Incident' },
  { label: 'Resolution Rate', value: '96.7%', change: '+2.3%', trend: 'up', icon: 'Resolution' },
];

export default function MonthlyKPIs() {
  return (
    <div className={styles.kpiGrid}>
      {kpis.map((kpi) => (
        <div key={kpi.label} className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>{kpi.label}</span>
            <Image src={iconMap[kpi.icon as keyof typeof iconMap]}  alt={kpi.label} width={40} height={40} className={styles.kpiIcon} />
          </div>
          <div className={styles.kpiValueWrapper}>
            <span className={styles.kpiValue}>{kpi.value}</span>
            {kpi.change && (
              <span className={`${styles.kpiChange} ${kpi.trend === 'up' ? styles.trendUp : kpi.trend === 'down' ? styles.trendDown : ''}`}>
                {kpi.change}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}