'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../../store/authStore';
import { authService } from '../../../../firebase/services/authService';
import styles from './signup.module.css';

export default function SuccessPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Fetch user data from Firestore
    const fetchUserData = async () => {
      try {
        if (user?.uid) {
          const data = await authService.getUserData(user.uid);
          setUserData(data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, router, user?.uid]);

  const handleGoToDashboard = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.loadingState}>Loading account details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <svg 
            className={styles.successIcon} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>

        <h1 className={styles.title}>Account Created Successfully</h1>
        
        <p className={styles.message}>
          Welcome to the Redemption City Incident Management System, <strong>{user?.displayName || user?.email || 'User'}</strong>.
          Your account is being reviewed by the administration. You will receive an email notification once 
          your credentials have been verified for system access.
        </p>

        <div className={styles.statusGrid}>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>SYSTEM NODE</span>
            <span className={styles.statusValue}>REDEMPTION-IMS-01</span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>STATUS</span>
            <span className={`${styles.statusValue} ${styles.statusPending}`}>
              {userData?.status || 'PENDING REVIEW'}
            </span>
          </div>
          {userData?.role && (
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>ROLE</span>
              <span className={styles.statusValue}>{userData.role.toUpperCase()}</span>
            </div>
          )}
          {userData?.department && (
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>DEPARTMENT</span>
              <span className={styles.statusValue}>{userData.department}</span>
            </div>
          )}
        </div>

        <div className={styles.actionRow}>
          <button 
            className={`button-primary ${styles.primaryBtn}`}
            onClick={handleGoToDashboard}
          >
            Go to Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}