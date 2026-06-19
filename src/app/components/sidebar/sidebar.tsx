'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Dashboard from '../../../../public/images/dashboard.svg';
import Analytics from '../../../../public/images/analytics.svg';
import Admin from '../../../../public/images/admins.svg';
import Bell from '../../../../public/images/notification.svg';
import styles from './sidebar.module.css';

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Dashboard', icon: Dashboard, href: '/dashboard' },
    { label: 'Analytics', icon: Analytics, href: '/analytics' },
    { label: 'Admins', icon: Admin, href: '/admins' },
    { label: 'Notifications', icon: Bell, href: '/notifications' }
  ];

  return (
    <>
      <div className={`${styles.sidebar} ${!isOpen ? styles.collapsed : ''}`}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoText}>R-Response</span>
          </Link>
        </div>

        <nav className={styles.nav}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname?.startsWith(item.href));
            
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                <span className={styles.navIcon}>
                  <Image 
                    src={item.icon} 
                    alt={item.label} 
                    width={20} 
                    height={20} 
                  />
                </span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.footer}>
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