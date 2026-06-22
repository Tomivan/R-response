'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/sidebar/sidebar';
import Topbar from '../components/topbar/topbar';
import { useAuthStore } from '../../../store/authStore';
import { notificationService } from '../../../firebase/services/notificationService';
import { userService } from '../../../firebase/services/userService';
import showAlert from '../../../utils/alert';
import styles from './notification.module.css';

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [notificationType, setNotificationType] = useState('general');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('normal');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userService.getAllUsers();
        setAllUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        showAlert.error('Failed to load users. Please refresh the page.');
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (!title.trim()) {
        const errorMsg = 'Please enter a notification title.';
        setError(errorMsg);
        showAlert.error(errorMsg);
        setIsLoading(false);
        return;
      }

      if (!message.trim()) {
        const errorMsg = 'Please enter a notification message.';
        setError(errorMsg);
        showAlert.error(errorMsg);
        setIsLoading(false);
        return;
      }

      const notificationData = {
        type: notificationType,
        priority: priority,
        title: title.trim(),
        message: message.trim(),
        sentBy: user?.displayName || user?.email || 'System',
        sentByUid: user?.uid || '',
        recipients: allUsers.map(u => ({ 
          uid: u.uid, 
          email: u.email, 
          name: u.displayName || u.name || 'User' 
        })),
        recipientCount: allUsers.length,
        status: 'sent' as const, 
        readBy: [],
        createdAt: new Date().toISOString(),
      };

      await notificationService.sendNotification(notificationData);

      const successMsg = `✅ Notification sent!`;
      setSuccess(successMsg);
      showAlert.success(successMsg);
      setTitle('');
      setMessage('');

      setTimeout(() => setSuccess(''), 5000);
      
    } catch (error: any) {
      console.error('Error sending notification:', error);
      const errorMsg = 'Failed to send notification. Please try again.';
      setError(errorMsg);
      showAlert.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <Topbar onMenuToggle={toggleSidebar} />
      
      <main className={`${styles.main} ${!sidebarOpen ? styles.fullWidth : ''}`}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Send Notification</h1>
            <p className={styles.subtitle}>
              Broadcast alerts, updates, and announcements to all users.
            </p>
          </div>

          <div className={styles.card}>
            {error && (
              <div className={styles.errorMessage}>
                <span className={styles.errorIcon}>⚠️</span>
                {error}
              </div>
            )}

            {success && (
              <div className={styles.successMessage}>
                <span className={styles.successIcon}>✅</span>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Notification Details</h2>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>NOTIFICATION TYPE</label>
                    <select
                      className="input"
                      value={notificationType}
                      onChange={(e) => setNotificationType(e.target.value)}
                      disabled={isLoading}
                    >
                      <option value="general">General Announcement</option>
                      <option value="alert">Emergency Alert</option>
                      <option value="update">System Update</option>
                      <option value="maintenance">Maintenance Notice</option>
                      <option value="training">Training Reminder</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>PRIORITY</label>
                    <select
                      className="input"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      disabled={isLoading}
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>TITLE</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Enter notification title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>MESSAGE</label>
                  <textarea
                    className={`input ${styles.textarea}`}
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className={styles.recipientInfo}>
                  <span className={styles.recipientLabel}>📨 Will be sent to:</span>
                  <span className={styles.recipientCount}>
                    {allUsers.length} user{allUsers.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </section>

              <div className={styles.actions}>
                <button 
                  type="button" 
                  className={`button-secondary ${styles.cancelBtn}`}
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={`button-primary ${styles.submitBtn}`}
                  disabled={isLoading || allUsers.length === 0}
                >
                  {isLoading ? 'Sending...' : `Send Notification (${allUsers.length})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}