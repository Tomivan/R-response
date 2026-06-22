'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/sidebar/sidebar';
import Topbar from '../components/topbar/topbar';
import { useAuthStore } from '../../../store/authStore';
import { adminService } from '../../../firebase/services/adminService';
import showAlert from '../../../utils/alert';
import styles from './admins.module.css';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: 'Active' | 'Inactive';
  department?: string;
  employeeId?: string;
  createdAt?: string;
  uid: string;
}

export default function AdminsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Fetch admins from Firebase
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setIsLoading(true);
        const fetchedAdmins = await adminService.getAdmins();
        setAdmins(fetchedAdmins);
      } catch (error) {
        console.error('Error fetching admins:', error);
        setError('Failed to load admins. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  // Update admin status
  const handleStatusToggle = async (adminId: string, currentStatus: 'Active' | 'Inactive') => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      await adminService.updateAdminStatus(adminId, newStatus);
      
      // Update local state
      setAdmins(admins.map(admin => 
        admin.id === adminId ? { ...admin, status: newStatus } : admin
      ));
    } catch (error) {
      console.error('Error updating admin status:', error);
      showAlert.error('Failed to update admin status. Please try again.');
    }
  };

  // Delete admin
  const handleDeleteAdmin = async (adminId: string, adminName: string) => {
    if (!confirm(`Are you sure you want to remove ${adminName} as an admin?`)) {
      return;
    }

    try {
      await adminService.deleteAdmin(adminId);
      setAdmins(admins.filter(admin => admin.id !== adminId));
    } catch (error) {
      console.error('Error deleting admin:', error);
      showAlert.error('Failed to remove admin. Please try again.');
    }
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <Topbar onMenuToggle={toggleSidebar} />
      
      <main className={`${styles.main} ${!sidebarOpen ? styles.fullWidth : ''}`}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Admin Management</h1>
            <p className={styles.subtitle}>
              Maintain system integrity by managing personnel access and permission protocols.
            </p>
          </div>

          <div className={styles.flexEnd}>
            <button 
              className={styles.addUserBtn} 
              onClick={() => router.push('/admins/new')}
            >
              <span className={styles.addIcon}>+</span>
              Add New Admin
            </button>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <span className={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          )}

          <div className={styles.tableSection}>
            <div className={styles.tableHeader}>
              <h2 className={styles.tableTitle}>Users</h2>
              <span className={styles.tableSubtitle}>Roles & Permissions</span>
            </div>

            <div className={styles.tableWrapper}>
              {isLoading ? (
                <div className={styles.loadingState}>Loading admins...</div>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>USER IDENTITY</th>
                      <th>CONTACT</th>
                      <th>PRIMARY ROLE</th>
                      <th>STATUS</th>
                      <th>ADMINISTRATIVE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.length === 0 ? (
                      <tr>
                        <td colSpan={5} className={styles.emptyState}>
                          No admins found. Add your first admin.
                        </td>
                      </tr>
                    ) : (
                      admins.map((admin) => (
                        <tr key={admin.id}>
                          <td className={styles.userName}>{admin.name}</td>
                          <td className={styles.userContact}>{admin.email}</td>
                          <td>
                            <span className={styles.roleBadge}>{admin.role}</span>
                          </td>
                          <td>
                            <span className={`${styles.statusBadge} ${
                              admin.status === 'Active' ? styles.statusActive : styles.statusInactive
                            }`}>
                              <span className={styles.statusDot}></span>
                              {admin.status}
                            </span>
                          </td>
                          <td>
                            <div className={styles.actionDropdown}>
                              <button 
                                className={styles.actionBtn}
                                onClick={() => handleStatusToggle(admin.id, admin.status)}
                              >
                                {admin.status === 'Active' ? '🔴 Deactivate' : '🟢 Activate'}
                              </button>
                              <button 
                                className={styles.actionBtn}
                                onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                              >
                                🗑️ Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>

            <div className={styles.tableFooter}>
              <span className={styles.footerText}>
                Showing {admins.length} of {admins.length} Admin{admins.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}