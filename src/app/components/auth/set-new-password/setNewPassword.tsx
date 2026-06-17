'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import NewPassword from '../../../../../public/images/new-password.svg';
import styles from './set-new-password.module.css';

export default function SetNewPassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = (pwd: string): string => {
    if (!pwd) return '';
    const hasLetters = /[a-zA-Z]/.test(pwd);
    const hasNumbers = /\d/.test(pwd);
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    const isLongEnough = pwd.length >= 8;

    if (isLongEnough && hasLetters && hasNumbers && hasSymbols) {
      return 'Strong';
    } else if (isLongEnough && (hasLetters || hasNumbers) && (hasLetters || hasNumbers)) {
      return 'Medium';
    } else {
      return 'Weak';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password update logic here
    console.log('Password updated successfully');
    router.push('/login');
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Image src={NewPassword} alt="set new password icon" className={styles.icon} width={50} height={50} />
        <div className={styles.header}>
          <h1 className={styles.title}>Set a new password</h1>
          <p className={styles.subtitle}>
            Your new password must be at least 8 characters and include a mix of letters, numbers, and symbols.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>New Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="input"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {password && (
              <div className={styles.securityLevel}>
                <span className={styles.securityLabel}>Security Level</span>
                <span className={`${styles.securityValue} ${
                  passwordStrength === 'Strong' ? styles.strong :
                  passwordStrength === 'Medium' ? styles.medium :
                  styles.weak
                }`}>
                  {passwordStrength}
                </span>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Confirm New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="input"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="button-primary">
            Update Password
          </button>
        </form>

        <div className={styles.footer}>
          <button 
            className={styles.backLink}
            onClick={() => router.push('/login')}
          >
            ← Back to sign in
          </button>
        </div>
      </div>
    </div>
  );
}