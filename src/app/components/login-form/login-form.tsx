'use client';

import styles from './login-form.module.css';
import { useState } from 'react';
import  Logo  from '../../../../public/images/rccg-logo.svg';
import Message from '../../../../public/images/messages.svg';
import Eye from '../../../../public/images/eye.svg';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

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

        <form className={styles.form}>
          <div className={styles.field}>
            <label>Email Address</label>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                placeholder="name@citygov.org"
                className="input"
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
              />
              <span
                className={styles.icon}
                onClick={() => setShowPassword(!showPassword)}
              >
                <Image src={Eye} alt="Toggle Password Visibility" />
              </span>
            </div>
          </div>

          <button type="submit" className="button-primary">
            Login →
          </button>
        </form>

        <div className={styles.footer}>
          Don’t have an account? <Link href="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}