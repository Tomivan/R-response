'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/sidebar/sidebar';
import Topbar from '../../components/topbar/topbar';
import { adminService } from '../../../../firebase/services/adminService';
import showAlert from '../../../../utils/alert';
import styles from './new.module.css';

export default function AddNewAdminPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    status: 'Active',
    department: '',
    employeeId: '',
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate form
      if (!formData.fullName.trim()) {
        setError('Please enter the admin\'s full name.');
        setIsLoading(false);
        return;
      }

      if (!formData.email.trim()) {
        setError('Please enter an email address.');
        setIsLoading(false);
        return;
      }

      if (!formData.password) {
        setError('Please enter a password.');
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long.');
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        setIsLoading(false);
        return;
      }

      // Create admin in Firebase
      await adminService.createAdmin(
        formData.email,
        formData.password,
        formData.fullName,
        'admin',
        formData.department || '',
        formData.phone || ''
      );

      showAlert.success('Admin created successfully!');
      router.push('/admins');
      
    } catch (error: any) {
      console.error('Error creating admin:', error);

      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Please use a different email.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address format.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Use at least 8 characters with numbers and symbols.');
          break;
        default:
          setError('Failed to create admin account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
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

            {error && (
              <div className={styles.errorMessage}>
                <span className={styles.errorIcon}>⚠️</span>
                {error}
              </div>
            )}

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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Account Credentials</h2>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>PASSWORD</label>
                    <input
                      type="password"
                      className="input"
                      placeholder="Min 8 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>CONFIRM PASSWORD</label>
                    <input
                      type="password"
                      className="input"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>DEPARTMENT</label>
                  <select
                    className="input"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    disabled={isLoading}
                  >
                    <option value="">Select Department</option>
                    <option value="Fire Department">Fire Department</option>
                    <option value="Security Department">Security Department</option>
                    <option value="Health Centre">Health Centre</option>
                    <option value="Sanitation">Sanitation</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Water Management">Water Management</option>
                    <option value="Code of Conduct">Code of Conduct</option>
                    <option value="IT">IT</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>STATUS</label>
                  <div className={styles.statusOptions}>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="status"
                        value="Active"
                        checked={formData.status === 'Active'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        disabled={isLoading}
                      />
                      Active
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="status"
                        value="Inactive"
                        checked={formData.status === 'Inactive'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        disabled={isLoading}
                      />
                      Inactive
                    </label>
                  </div>
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
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}