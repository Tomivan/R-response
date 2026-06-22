'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '../../../../store/authStore';
import { notificationService } from '../../../../firebase/services/notificationService';
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
  type: 'incident' | 'assignment' | 'system' | 'general' | 'alert' | 'update' | 'maintenance' | 'training';
  read: boolean;
  createdAt?: string;
  sentBy?: string;
}

interface TopbarProps {
  onMenuToggle?: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'incident' | 'assignment' | 'system' | 'general'>('all');
  const [notificationList, setNotificationList] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === 'admin';

  // Fetch notifications from Firebase
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isAuthenticated || !user?.uid) return;
      
      try {
        setIsLoading(true);
        let fetchedNotifications = [];
        
        if (isAdmin) {
          // Admin gets incident notifications only
          const adminNotifications = await notificationService.getAdminNotifications(user.uid);
          fetchedNotifications = adminNotifications;
        } else {
          // Regular users get all notifications
          const userNotifications = await notificationService.getUserNotifications(user.uid);
          fetchedNotifications = userNotifications;
        }
        
        // Format notifications for display
        const formattedNotifications = fetchedNotifications.slice(0, 3).map((notif: any) => ({
          id: notif.id || '',
          title: notif.title || 'New Notification',
          description: notif.message || notif.description || '',
          time: notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : 'Just now',
          type: notif.type || 'system',
          read: (notif.readBy || []).includes(user.uid),
          createdAt: notif.createdAt,
          sentBy: notif.sentBy,
        }));
        
        setNotificationList(formattedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [isAuthenticated, user?.uid, isAdmin]);

  // Listen for real-time notification updates
  useEffect(() => {
    if (!isAuthenticated || !user?.uid) return;

    const unsubscribe = notificationService.listenForNotifications(
      user.uid,
      isAdmin,
      (newNotifications) => {
        const formatted = newNotifications.slice(0, 3).map((notif: any) => ({
          id: notif.id || '',
          title: notif.title || 'New Notification',
          description: notif.message || notif.description || '',
          time: notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : 'Just now',
          type: notif.type || 'system',
          read: (notif.readBy || []).includes(user.uid),
          createdAt: notif.createdAt,
          sentBy: notif.sentBy,
        }));
        setNotificationList(formatted);
      }
    );

    return () => unsubscribe();
  }, [isAuthenticated, user?.uid, isAdmin]);

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Mark all as read in Firebase
      for (const notification of notificationList) {
        if (!notification.read) {
          await notificationService.markAsRead(notification.id, user?.uid || '');
        }
      }
      
      setNotificationList(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id, user?.uid || '');
      setNotificationList(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
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

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

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
                {unreadCount > 0 && (
                  <button 
                    className={styles.markAllRead}
                    onClick={handleMarkAllAsRead}
                  >
                    Mark all as read
                  </button>
                )}
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
                <button
                  className={`${styles.filterTab} ${activeFilter === 'general' ? styles.activeFilter : ''}`}
                  onClick={() => setActiveFilter('general')}
                >
                  General
                </button>
              </div>

              <div className={styles.notificationList}>
                {isLoading ? (
                  <div className={styles.emptyState}>Loading notifications...</div>
                ) : filteredNotifications.length === 0 ? (
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
                <button 
                  className={styles.viewAllBtn}
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    router.push('/all-notifications');
                  }}
                >
                  View All Notifications
                </button>
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
          <span className={styles.userName}>{user?.displayName || 'User'}</span>
        </button>
      </div>
    </header>
  );
}