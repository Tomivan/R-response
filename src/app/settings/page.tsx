'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/providers/ThemeProvider';
import Sidebar from '../components/sidebar/sidebar';
import Topbar from '../components/topbar/topbar';
import styles from './settings.module.css';

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    fullName: 'Alexander Sterling',
    department: 'Emergency Dispatch',
    email: 'a.sterling@cityhall.gov',
    employeeId: 'RS-7729-EC',
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSaveProfile = () => {
    console.log('Profile saved:', formData);
    alert('Profile changes saved successfully!');
  };

  const handleResetPassword = () => {
    router.push('/reset-password');
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <Topbar onMenuToggle={toggleSidebar} />
      
      <main className={`${styles.main} ${!sidebarOpen ? styles.fullWidth : ''}`}>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.header}>
              <h1 className={styles.title}>System Settings</h1>
              <p className={styles.subtitle}>
                Manage your account preferences, notifications, and global system configurations.
              </p>
            </div>

            <div className={styles.tabsContainer}>
              <button
                className={`${styles.tab} ${activeTab === 'profile' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile Settings
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'theme' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('theme')}
              >
                Theme Settings
              </button>
            </div>

            {activeTab === 'profile' && (
              <div className={styles.tabContent}>
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Profile Settings</h2>
                  <div className={styles.sectionLinks}>
                    <span className={styles.sectionLink}>Notifications</span>
                    <span className={styles.sectionLink}>Theme Settings</span>
                    <span className={styles.sectionLink}>System Preferences</span>
                  </div>

                  <div className={styles.profileLayout}>
                    <div className={styles.avatarSection}>
                      <div className={styles.avatarPlaceholder}>
                        <span className={styles.avatarText}>AS</span>
                      </div>
                      <span className={styles.avatarLabel}>PUBLIC AVATAR</span>
                    </div>

                    <div className={styles.profileFields}>
                      <div className={styles.fieldRow}>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>Full Name</label>
                          <input
                            type="text"
                            className="input"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          />
                        </div>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>Department</label>
                          <input
                            type="text"
                            className="input"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className={styles.fieldRow}>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>Email Address</label>
                          <input
                            type="email"
                            className="input"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>Employee ID</label>
                          <input
                            type="text"
                            className="input"
                            value={formData.employeeId}
                            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.notificationPref}>
                    <h3 className={styles.prefTitle}>Notification Preference</h3>
                    <div className={styles.prefOptions}>
                      <label className={styles.checkboxLabel}>
                        <input type="checkbox" defaultChecked /> Email Notifications
                      </label>
                      <label className={styles.checkboxLabel}>
                        <input type="checkbox" defaultChecked /> In-App Alerts
                      </label>
                      <label className={styles.checkboxLabel}>
                        <input type="checkbox" /> SMS Alerts
                      </label>
                    </div>
                  </div>

                  <div className={styles.actions}>
                    <button 
                      className={`button-primary ${styles.saveBtn}`}
                      onClick={handleSaveProfile}
                    >
                      Save Profile Changes
                    </button>
                    <button 
                      className={`button-secondary ${styles.resetBtn}`}
                      onClick={handleResetPassword}
                    >
                      Reset Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'theme' && (
              <div className={styles.tabContent}>
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Theme Settings</h2>
                  <p className={styles.themeSubtitle}>
                    Select your preferred interface visual mode for optimal visibility.
                  </p>

                  <div className={styles.themeOptions}>
                    <div 
                      className={`${styles.themeCard} ${theme === 'light' ? styles.themeActive : ''}`}
                      onClick={() => setTheme('light')}
                    >
                      <div className={styles.themePreview}>
                        <div className={styles.lightPreview}>
                          <div className={styles.previewHeader}></div>
                          <div className={styles.previewContent}>
                            <div className={styles.previewLine}></div>
                            <div className={styles.previewLine}></div>
                            <div className={styles.previewLine}></div>
                          </div>
                        </div>
                      </div>
                      <div className={styles.themeInfo}>
                        <span className={styles.themeName}>Light Protocol</span>
                        {theme === 'light' && (
                          <span className={styles.themeActiveBadge}>ACTIVE THEME</span>
                        )}
                      </div>
                    </div>

                    <div 
                      className={`${styles.themeCard} ${theme === 'dark' ? styles.themeActive : ''}`}
                      onClick={() => setTheme('dark')}
                    >
                      <div className={styles.themePreview}>
                        <div className={styles.darkPreview}>
                          <div className={styles.previewHeaderDark}></div>
                          <div className={styles.previewContentDark}>
                            <div className={styles.previewLineDark}></div>
                            <div className={styles.previewLineDark}></div>
                            <div className={styles.previewLineDark}></div>
                          </div>
                        </div>
                      </div>
                      <div className={styles.themeInfo}>
                        <span className={styles.themeName}>Dark Protocol</span>
                        {theme === 'dark' && (
                          <span className={styles.themeActiveBadge}>ACTIVE THEME</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}