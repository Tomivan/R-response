'use client';

import { useState } from 'react';
import Image from 'next/image';
import Verify from '../../../../../public/images/verify.svg';
import styles from './reset-verification.module.css';

export default function ResetVerification() {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);

  const handleCodeChange = (idx: number, value: string) => {
    const newCode = [...verificationCode];
    newCode[idx] = value.replace(/\D/g, '');
    setVerificationCode(newCode);

    // Auto-advance to next input
    if (value && idx < 5) {
      const next = document.querySelector(`.${styles.codeDigit}:nth-child(${idx + 2})`) as HTMLInputElement;
      if (next) next.focus();
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && idx > 0) {
      const prev = document.querySelector(`.${styles.codeDigit}:nth-child(${idx})`) as HTMLInputElement;
      if (prev) prev.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle verification logic here
    console.log('Verifying code:', verificationCode.join(''));
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Image src={Verify} alt="Verification Icon" className={styles.icon} width={50} height={50}/>
        <div className={styles.header}>
          <h1 className={styles.title}>Verify Your Identity</h1>
          <p className={styles.subtitle}>
            We sent a 6-digit code to your email. Please enter it below.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Verification Code</label>
            <div className={styles.codeInputs}>
              {verificationCode.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  className={`input ${styles.codeDigit}`}
                  value={digit}
                  onChange={(e) => handleCodeChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  autoFocus={idx === 0}
                />
              ))}
            </div>
          </div>

          <button type="submit" className="button-primary">
            Verify Code
          </button>
        </form>

        <div className={styles.footer}>
          <p>Didn't receive a code? <button className={styles.resendBtn}>Resend code</button></p>
        </div>
      </div>
    </div>
  );
}