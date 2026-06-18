'use client';

import { useState } from 'react';
import Image from 'next/image';
import Search from '../../../../public/images/search.svg';
import Bell from '../../../../public/images/notification.svg';
import HelpCircle from '../../../../public/images/faq.svg';
import Settings from '../../../../public/images/settings.svg';
import User from '../../../../public/images/user.svg';
import styles from './topbar.module.css';

interface TopbarProps {
  onMenuToggle?: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuToggle}>
          ☰
        </button>
      </div>

      <div className={styles.center}>
        <div className={styles.search}>
          <Image src={Search} alt="Search" className={styles.searchIcon} />
          <input
            type="text"
            className={`input ${styles.searchInput}`}
            placeholder="Search incidents, assets, or zones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.right}>
        <button className={styles.iconBtn} aria-label="Notifications">
          <Image src={Bell} alt="Notifications" className={styles.bellIcon} />
          <span className={styles.notificationBadge}>3</span>
        </button>
        <button className={styles.iconBtn} aria-label="Help">
          <Image src={HelpCircle} alt="Help" className={styles.helpIcon} />
        </button>
        <button className={styles.iconBtn} aria-label="Settings">
          <Image src={Settings} alt="Settings" className={styles.settingsIcon} />
        </button>
        <button className={styles.userBtn}>
          <Image src={User} alt="User" className={styles.userIcon} />
          <span className={styles.userName}>Admin</span>
        </button>
      </div>
    </header>
  );
}