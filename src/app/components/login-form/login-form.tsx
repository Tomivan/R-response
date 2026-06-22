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
import showAlert from '../../../../utils/alert';

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
        const errorMsg = 'Please enter both email and password.';
        setError(errorMsg);
        showAlert.error(errorMsg);
        setIsLoading(false);
        setLoading(false);
        return;
      }

      const user = await authService.login(email, password);
      const role = await authService.getUserRole(user.uid);

      const userRole = role === 'admin' ? 'admin' : 'user';

      setUser({
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        role: userRole,
      });

      showAlert.success(`Welcome back, ${user.displayName || 'User'}! 🎉`);
      
      // Redirect to dashboard based on role
      if (userRole === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMsg = 'Failed to login. Please check your credentials.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMsg = 'No account found with this email address.';
          break;
        case 'auth/wrong-password':
          errorMsg = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-email':
          errorMsg = 'Invalid email address format.';
          break;
        case 'auth/too-many-requests':
          errorMsg = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/user-disabled':
          errorMsg = 'This account has been disabled. Please contact support.';
          break;
        default:
          errorMsg = 'Failed to login. Please check your credentials.';
      }
      
      setError(errorMsg);
      showAlert.error(errorMsg);
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