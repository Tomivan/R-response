'use client';

import { useState } from 'react';
import Sidebar from '../components/sidebar/sidebar';
import Topbar from '../components/topbar/topbar';
import styles from './notification.module.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  selected: boolean;
}

const users: User[] = [
  { id: '1', name: 'Elias Thorne', email: 'e.thorne@redemption.city', role: 'Field Responder', selected: false },
  { id: '2', name: 'Sarah Jenkins', email: 's.jenkins@redemption.city', role: 'Dispatcher', selected: false },
  { id: '3', name: 'Marcus Vane', email: 'm.vane@redemption.city', role: 'Field Responder', selected: false },
  { id: '4', name: 'James Wilson', email: 'j.wilson@redemption.city', role: 'Analyst', selected: false },
  { id: '5', name: 'Maria Garcia', email: 'm.garcia@redemption.city', role: 'Field Responder', selected: false },
  { id: '6', name: 'David Chen', email: 'd.chen@redemption.city', role: 'Dispatcher', selected: false },
];

export default function NotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [recipients, setRecipients] = useState<User[]>(users);
  const [notificationType, setNotificationType] = useState('general');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('normal');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedUsers = recipients.filter(user => user.selected);
    console.log('Sending notification:', {
      type: notificationType,
      title,
      message,
      priority,
      recipients: selectedUsers,
    });
    alert(`Notification sent to ${selectedUsers.length} user(s)!`);
    // Reset form
    setTitle('');
    setMessage('');
    setRecipients(prev => prev.map(user => ({ ...user, selected: false })));
  };

  const selectedCount = recipients.filter(u => u.selected).length;

  return (
    <div className={styles.dashboard}>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <Topbar onMenuToggle={toggleSidebar} />
      
      <main className={`${styles.main} ${!sidebarOpen ? styles.fullWidth : ''}`}>
        <div className={styles.container}>
            <div className={styles.header}>
              <h1 className={styles.title}>Send Notification</h1>
              <p className={styles.subtitle}>
                Broadcast alerts, updates, and announcements to non-admin users.
              </p>
            </div>

            <div className={styles.card}>
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
                            required
                        />
                        </div>
                    </section>

                    <div className={styles.actions}>
                        <button type="button" className={`button-secondary ${styles.cancelBtn}`}>
                        Cancel
                        </button>
                        <button 
                        type="submit" 
                        className={`button-primary ${styles.submitBtn}`}
                        >
                        Send Notification {selectedCount > 0 && `(${selectedCount})`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </main>
    </div>
  );
}