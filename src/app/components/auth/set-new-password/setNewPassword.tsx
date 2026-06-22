'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import NewPassword from '../../../../../public/images/new-password.svg';
import { authService } from '../../../../../firebase/services/authService';
import showAlert from '../../../../../utils/alert';
import styles from './set-new-password.module.css';

export default function SetNewPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [oobCode, setOobCode] = useState('');

  // Extract the oobCode from URL parameters
  useEffect(() => {
    const code = searchParams.get('oobCode');
    if (code) {
      setOobCode(code);
    } else {
      // If no code, redirect to reset password page
      showAlert.warning('Invalid reset link. Please request a new one.');
      router.push('/reset-password');
    }
  }, [router, searchParams]);

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

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate password
      if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        showAlert.error('Password must be at least 8 characters long.');
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        showAlert.error('Passwords do not match.');
        setIsLoading(false);
        return;
      }

      // Validate oobCode
      if (!oobCode) {
        setError('Invalid reset link. Please request a new one.');
        showAlert.error('Invalid reset link. Please request a new one.');
        setIsLoading(false);
        return;
      }

      // Confirm the password reset with Firebase
      await authService.confirmPasswordReset(oobCode, password);
      
      setSuccess(true);
      showAlert.success('Password reset successfully! 🎉 Redirecting to login...');

      setTimeout(() => {
        router.push('/login');
      }, 3000);
      
    } catch (error: any) {
      console.error('Password reset error:', error);

      let errorMessage = 'Failed to reset password. Please try again.';
      
      switch (error.code) {
        case 'auth/expired-action-code':
          errorMessage = 'The reset link has expired. Please request a new one.';
          break;
        case 'auth/invalid-action-code':
          errorMessage = 'Invalid reset link. Please request a new one.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled. Please contact support.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'User not found. Please request a new reset link.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Use at least 8 characters with numbers and symbols.';
          break;
        default:
          errorMessage = 'Failed to reset password. Please try again.';
      }
      
      setError(errorMessage);
      showAlert.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
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

        {error && (
          <div className={styles.errorMessage}>
            <span className={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div className={styles.successMessage}>
            <span className={styles.successIcon}>✅</span>
            Password reset successfully! Redirecting to login...
          </div>
        )}

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
                disabled={isLoading || success || !oobCode}
                required
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading || success}
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
              disabled={isLoading || success || !oobCode}
              required
            />
          </div>

          <button 
            type="submit" 
            className="button-primary"
            disabled={isLoading || success || !oobCode}
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        <div className={styles.footer}>
          <button 
            className={styles.backLink}
            onClick={() => router.push('/login')}
            disabled={isLoading}
          >
            ← Back to sign in
          </button>
        </div>
      </div>
    </div>
  );
}