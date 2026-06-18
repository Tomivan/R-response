'use client';

import { useState } from 'react';
import styles from './sidebar.module.css';

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
  const [activeItem, setActiveItem] = useState('Dashboard');

  const menuItems = [
    { label: 'Dashboard', icon: '📊' },
    { label: 'Map View', icon: '🗺️' },
    { label: 'Dispatch', icon: '📡' },
    { label: 'Analytics', icon: '📈' },
    { label: 'Audit Logs', icon: '📋' },
  ];

  return (
    <>
      <div className={`${styles.sidebar} ${!isOpen ? styles.collapsed : ''}`}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🏛️</span>
            <span className={styles.logoText}>City Sentinel</span>
          </div>
          <div className={styles.department}>
            <span className={styles.deptName}>Department of Safety</span>
            <span className={styles.deptSub}>Incident Command</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={`${styles.navItem} ${activeItem === item.label ? styles.active : ''}`}
              onClick={() => setActiveItem(item.label)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.divider} />

        <button className={styles.reportBtn}>
          <span className={styles.reportIcon}>➕</span>
          <span className={styles.reportLabel}>Report New Incident</span>
        </button>

        <div className={styles.footer}>
          <div className={styles.systemStatus}>
            <span className={styles.statusDot}></span>
            <span className={styles.statusLabel}>System Status</span>
          </div>
          <button className={styles.logoutBtn}>
            <span className={styles.logoutIcon}>🚪</span>
            <span className={styles.logoutLabel}>Logout</span>
          </button>
        </div>
      </div>

      {onToggle && (
        <button className={styles.toggleBtn} onClick={onToggle}>
          {isOpen ? '◀' : '▶'}
        </button>
      )}
    </>
  );
}