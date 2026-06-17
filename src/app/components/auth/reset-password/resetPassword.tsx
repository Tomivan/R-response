'use client';

import { useState } from 'react';
import Reset from '../../../../../public/images/reset.svg';
import Image from 'next/image';
import styles from './reset-password.module.css';

export default function ResetPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Reset password for:', email);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Image src={Reset} alt="Reset Password" className={styles.icon} width={50} height={50}/>
          <h1 className={styles.title}>Reset your password</h1>
          <p className={styles.subtitle}>
            Enter your email address and we'll send you a 6-digit code to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email Address</label>
            <input
              type="email"
              className="input"
              placeholder="name@smartcity.gov"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="button-primary">
            Send Reset Code
          </button>
        </form>

        <div className={styles.footer}>
          <p>Didn't receive a code? Check spam or try again.</p>
        </div>
      </div>
    </div>
  );
}