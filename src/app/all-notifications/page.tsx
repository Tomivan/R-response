'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/sidebar/sidebar';
import Topbar from '../components/topbar/topbar';
import { useAuthStore } from '../../../store/authStore';
import { notificationService } from '../../../firebase/services/notificationService';
import styles from './all-notifications.module.css';

interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: string;
  sentBy: string;
  sentByUid?: string;
  recipients?: Array<{ uid: string; email: string; name: string }>;
  recipientCount?: number;
  status?: string;
  readBy: string[];
  createdAt: string;
}

export default function AllNotificationsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        let fetchedNotifications: NotificationData[] = [];
        
        if (isAdmin) {
          const result = await notificationService.getAdminNotifications(user?.uid || '');
          fetchedNotifications = result.map((notif: any) => ({
            id: notif.id || '',
            title: notif.title || 'New Notification',
            message: notif.message || notif.description || '',
            type: notif.type || 'system',
            sentBy: notif.sentBy || 'System',
            sentByUid: notif.sentByUid || '',
            recipients: notif.recipients || [],
            recipientCount: notif.recipientCount || 0,
            status: notif.status || 'sent',
            readBy: notif.readBy || [],
            createdAt: notif.createdAt || new Date().toISOString(),
          }));
        } else {
          const result = await notificationService.getUserNotifications(user?.uid || '');
          fetchedNotifications = result.map((notif: any) => ({
            id: notif.id || '',
            title: notif.title || 'New Notification',
            message: notif.message || notif.description || '',
            type: notif.type || 'system',
            sentBy: notif.sentBy || 'System',
            sentByUid: notif.sentByUid || '',
            recipients: notif.recipients || [],
            recipientCount: notif.recipientCount || 0,
            status: notif.status || 'sent',
            readBy: notif.readBy || [],
            createdAt: notif.createdAt || new Date().toISOString(),
          }));
        }
        
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [isAuthenticated, router, user?.uid, isAdmin]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId, user?.uid || '');
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, readBy: [...notif.readBy, user?.uid || ''] }
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  return (
    <div className={styles.dashboard}>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <Topbar onMenuToggle={toggleSidebar} />
      
      <main className={`${styles.main} ${!sidebarOpen ? styles.fullWidth : ''}`}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>All Notifications</h1>
            <p className={styles.subtitle}>
              View all your notifications and updates.
            </p>
          </div>

          <div className={styles.filterBar}>
            <button
              className={`${styles.filterBtn} ${filter === 'all' ? styles.filterActive : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`${styles.filterBtn} ${filter === 'incident' ? styles.filterActive : ''}`}
              onClick={() => setFilter('incident')}
            >
              Incidents
            </button>
            <button
              className={`${styles.filterBtn} ${filter === 'general' ? styles.filterActive : ''}`}
              onClick={() => setFilter('general')}
            >
              General
            </button>
            <button
              className={`${styles.filterBtn} ${filter === 'system' ? styles.filterActive : ''}`}
              onClick={() => setFilter('system')}
            >
              System
            </button>
          </div>

          {isLoading ? (
            <div className={styles.loadingState}>Loading notifications...</div>
          ) : filteredNotifications.length === 0 ? (
            <div className={styles.emptyState}>No notifications found</div>
          ) : (
            <div className={styles.notificationsList}>
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`${styles.notificationCard} ${
                    !notification.readBy.includes(user?.uid || '') ? styles.unread : ''
                  }`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className={styles.notificationHeader}>
                    <span className={styles.notificationType}>{notification.type}</span>
                    <span className={styles.notificationTime}>
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <h3 className={styles.notificationTitle}>{notification.title}</h3>
                  <p className={styles.notificationMessage}>{notification.message}</p>
                  <div className={styles.notificationFooter}>
                    <span className={styles.notificationSender}>From: {notification.sentBy}</span>
                    {!notification.readBy.includes(user?.uid || '') && (
                      <span className={styles.unreadBadge}>Unread</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}