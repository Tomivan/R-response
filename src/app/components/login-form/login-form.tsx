'use client';

import styles from './login-form.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../../../public/images/rccg-logo.svg';
import Message from '../../../../public/images/messages.svg';
import Eye from '../../../../public/images/eye.svg';
import { useAuthStore } from '../../../../store/authStore';
import { authService } from '../../../../firebase/services/authService';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { setUser, setLoading } = useAuthStore();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Please enter both email and password.');
        setIsLoading(false);
        setLoading(false);
        return;
      }

      const user = await authService.login(email, password);
      const role = await authService.getUserRole(user.uid);

      setUser({
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        role: role,
      });

      router.push('/dashboard');
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address format.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        default:
          setError('Failed to login. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Image src={Logo} alt="RCCG Logo" className={styles.logo} height={60} width={60} />
        <h1>R-Response</h1>
        <p>Redemption City Incident Management System</p>
      </div>

      <div className={styles.card}>
        <h2>Welcome back</h2>
        <p className={styles.subtitle}>Enter your credentials to access the portal.</p>

        {error && (
          <div className={styles.errorMessage}>
            <span className={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Email Address</label>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                placeholder="name@citygov.org"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
              <span className={styles.icon}>
                <Image src={Message} alt="Email Icon" />
              </span>
            </div>
          </div>

          <div className={styles.field}>
            <div className={styles.passwordHeader}>
              <label>Password</label>
              <Link href="/reset-password" className={styles.forgot}>
                Forgot password?
              </Link>
            </div>

            <div className={styles.inputWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <span
                className={styles.icon}
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer' }}
              >
                <Image src={Eye} alt="Toggle Password Visibility" />
              </span>
            </div>
          </div>

          <button 
            type="submit" 
            className="button-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login →'}
          </button>
        </form>

        <div className={styles.footer}>
          Don't have an account? <Link href="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}