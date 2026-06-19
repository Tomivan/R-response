'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/sidebar/sidebar';
import Topbar from '../components/topbar/topbar';
import styles from './admins.module.css';

interface User {
  id: string;
  name: string;
  contact: string;
  role: string;
  status: 'Active' | 'Inactive';
}

const users: User[] = [
  {
    id: '1',
    name: 'Elias Thorne',
    contact: 'e.thorne@redemption.city',
    role: 'SUPER ADMIN',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Sarah Jenkins',
    contact: 's.jenkins@redemption.city',
    role: 'DISPATCHER',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Marcus Vane',
    contact: 'm.vane@redemption.city',
    role: 'FIELD RESPONDER',
    status: 'Inactive',
  },
];

export default function UsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
                <button className={styles.addUserBtn} onClick={() => router.push('/admins/new')}>
                    <span className={styles.addIcon}>+</span>
                    Add New Admin
                </button>
            </div>

            <div className={styles.tableSection}>
              <div className={styles.tableHeader}>
                <h2 className={styles.tableTitle}>Users</h2>
                <span className={styles.tableSubtitle}>Roles & Permissions</span>
              </div>

              <div className={styles.tableWrapper}>
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
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className={styles.userName}>{user.name}</td>
                        <td className={styles.userContact}>{user.contact}</td>
                        <td>
                          <span className={styles.roleBadge}>{user.role}</span>
                        </td>
                        <td>
                          <span className={`${styles.statusBadge} ${
                            user.status === 'Active' ? styles.statusActive : styles.statusInactive
                          }`}>
                            <span className={styles.statusDot}></span>
                            {user.status}
                          </span>
                        </td>
                        <td>
                          <button className={styles.actionBtn}>⋯</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.tableFooter}>
                <span className={styles.footerText}>Showing 3 of 124 Personnel</span>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
}