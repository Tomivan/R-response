'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/sidebar/sidebar';
import Topbar from '../../components/topbar/topbar'
import styles from './new.module.css';

export default function AddNewAdminPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    status: 'Active',
    department: '',
    employeeId: '',
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New admin created:', formData);
    alert('Admin created successfully!');
    router.push('/admins');
  };

  const handleCancel = () => {
    router.push('/admins');
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <Topbar onMenuToggle={toggleSidebar} />
      
      <main className={`${styles.main} ${!sidebarOpen ? styles.fullWidth : ''}`}>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.header}>
              <h1 className={styles.title}>Add New Admin</h1>
              <p className={styles.subtitle}>
                Create a new administrator account with appropriate role and permissions.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Personal Information</h2>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>FULL NAME</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Enter full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>EMPLOYEE ID</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g., RS-0000-EC"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>EMAIL ADDRESS</label>
                    <input
                      type="email"
                      className="input"
                      placeholder="name@redemption.city"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>PHONE NUMBER</label>
                    <input
                      type="tel"
                      className="input"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </section>

              <div className={styles.actions}>
                <button 
                  type="button" 
                  className={`button-secondary ${styles.cancelBtn}`}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button type="submit" className={`button-primary ${styles.submitBtn}`}>
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}