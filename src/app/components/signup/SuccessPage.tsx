import styles from './signup.module.css';

export default function SuccessPage() {
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
          Welcome to the Redemption City Incident Management System. Your account is being reviewed by the administration. You will receive an email notification once your credentials have been verified for system access.
        </p>

        <div className={styles.statusGrid}>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>SYSTEM NODE</span>
            <span className={styles.statusValue}>REDEMPTION-IMS-01</span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>STATUS</span>
            <span className={`${styles.statusValue} ${styles.statusPending}`}>PENDING REVIEW</span>
          </div>
        </div>

        <div className={styles.actionRow}>
          <button className={`button-primary ${styles.primaryBtn}`}>
            Go to Dashboard →
          </button>
          <button className={`button-secondary ${styles.secondaryBtn}`}>
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}