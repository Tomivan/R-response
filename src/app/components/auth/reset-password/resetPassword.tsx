'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Reset from '../../../../../public/images/reset.svg';
import Image from 'next/image';
import { authService } from '../../../../../firebase/services/authService';
import showAlert from '../../../../../utils/alert';
import styles from './reset-password.module.css';

export default function ResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email || !email.includes('@')) {
        setError('Please enter a valid email address.');
        setIsLoading(false);
        return;
      }

      await authService.resetPassword(email);
      
      setSuccess(true);
      setEmail('');
      showAlert.success('Password reset link sent! 📧 Please check your email.');
      
      // Redirect to login after 5 seconds
      setTimeout(() => {
        router.push('/login');
      }, 5000);
      
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address format.');
          break;
        case 'auth/too-many-requests':
          setError('Too many requests. Please try again later.');
          break;
        default:
          setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Image src={Reset} alt="Reset Password" className={styles.icon} width={50} height={50}/>
          <h1 className={styles.title}>Reset your password</h1>
          <p className={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password.
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
            Password reset link sent! Please check your email. Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email Address</label>
            <input
              type="email"
              className="input"
              placeholder="name@smartcity.gov"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || success}
              required
            />
          </div>

          <button 
            type="submit" 
            className="button-primary"
            disabled={isLoading || success}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            {success ? (
              'Check your email for the reset link.'
            ) : (
              'Didn\'t receive a link? Check spam or try again.'
            )}
          </p>
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