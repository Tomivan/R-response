'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Search from '../../../../public/images/search.svg';
import Bell from '../../../../public/images/notification.svg';
import HelpCircle from '../../../../public/images/faq.svg';
import Settings from '../../../../public/images/settings.svg';
import User from '../../../../public/images/user.svg';
import styles from './topbar.module.css';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'incident' | 'assignment' | 'system';
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: '1',
    title: 'New Incident: Structural Fire',
    description: 'Reported at 14:42 Riverside Dr. Unit 14 and 1B dispatched to the scene. Smoke reported on 4th floor.',
    time: '2h ago',
    type: 'incident',
    read: false,
  },
  {
    id: '2',
    title: 'Task Assigned: Unit 4B',
    description: 'Officer Miller has been assigned to support perimeter security at the West Gate evacuation point.',
    time: '15h ago',
    type: 'assignment',
    read: false,
  },
  {
    id: '3',
    title: 'System Backup Complete',
    description: 'Nightly database synchronization and log backups finished successfully. 12:40B archived.',
    time: '1h ago',
    type: 'system',
    read: false,
  },
  {
    id: '4',
    title: 'New Incident Report Available',
    description: 'Incident ARC-8542-1 Summary is now ready for review and supervisor approval.',
    time: '4h ago',
    type: 'incident',
    read: true,
  },
  {
    id: '5',
    title: 'Dispatch Delay: Zone 3',
    description: 'Critical resource shortage in Northern District. Rerouting secondary units from Midtown station.',
    time: '3h ago',
    type: 'system',
    read: true,
  },
];

interface TopbarProps {
  onMenuToggle?: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'incident' | 'assignment' | 'system'>('all');
  const [notificationList, setNotificationList] = useState(notifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const handleMarkAllAsRead = () => {
    setNotificationList(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleMarkAsRead = (id: string) => {
    setNotificationList(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const filteredNotifications = notificationList.filter(notification => {
    if (activeFilter === 'all') return true;
    return notification.type === activeFilter;
  });

  const unreadCount = notificationList.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <div className={styles.notificationWrapper} ref={dropdownRef}>
          <button 
            className={styles.iconBtn} 
            aria-label="Notifications"
            onClick={toggleNotifications}
          >
            <Image src={Bell} alt="Notifications" className={styles.bellIcon} />
            {unreadCount > 0 && (
              <span className={styles.notificationBadge}>{unreadCount}</span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className={styles.notificationDropdown}>
              <div className={styles.dropdownHeader}>
                <div>
                  <span className={styles.dropdownTitle}>Notifications</span>
                  <span className={styles.unreadCount}>{unreadCount} unread updates</span>
                </div>
                <button 
                  className={styles.markAllRead}
                  onClick={handleMarkAllAsRead}
                >
                  Mark all as read
                </button>
              </div>

              <div className={styles.filterTabs}>
                <button
                  className={`${styles.filterTab} ${activeFilter === 'all' ? styles.activeFilter : ''}`}
                  onClick={() => setActiveFilter('all')}
                >
                  All
                </button>
                <button
                  className={`${styles.filterTab} ${activeFilter === 'incident' ? styles.activeFilter : ''}`}
                  onClick={() => setActiveFilter('incident')}
                >
                  Incidents
                </button>
                <button
                  className={`${styles.filterTab} ${activeFilter === 'assignment' ? styles.activeFilter : ''}`}
                  onClick={() => setActiveFilter('assignment')}
                >
                  Assignments
                </button>
                <button
                  className={`${styles.filterTab} ${activeFilter === 'system' ? styles.activeFilter : ''}`}
                  onClick={() => setActiveFilter('system')}
                >
                  System
                </button>
              </div>

              <div className={styles.notificationList}>
                {filteredNotifications.length === 0 ? (
                  <div className={styles.emptyState}>No notifications</div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className={styles.notificationContent}>
                        <h4 className={styles.notificationTitle}>{notification.title}</h4>
                        <p className={styles.notificationDescription}>{notification.description}</p>
                        <span className={styles.notificationTime}>{notification.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className={styles.dropdownFooter}>
                <button className={styles.viewAllBtn}>View All History</button>
              </div>
            </div>
          )}
        </div>

        <button 
            className={styles.iconBtn} 
            aria-label="Help"
            onClick={() => router.push('/help')}
        >
        <Image src={HelpCircle} alt="Help" className={styles.helpIcon} width={30} height={30} />
        </button>
        <button 
            className={styles.iconBtn} 
            aria-label="Settings"
            onClick={() => router.push('/settings')}
        >
            <Image src={Settings} alt="Settings" className={styles.settingsIcon} width={30} height={30} />
        </button>
        <button className={styles.userBtn}>
          <Image src={User} alt="User" className={styles.userIcon} width={30} height={30} />
          <span className={styles.userName}>Admin</span>
        </button>
      </div>
    </header>
  );
}