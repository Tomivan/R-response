'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FormData } from './SignupFlow';
import { useAuthStore } from '../../../../store/authStore';
import { authService } from '../../../../firebase/services/authService';
import showAlert from '../../../../utils/alert';
import styles from './signup.module.css';

interface VerificationStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  onVerify: () => void;
}

export default function VerificationStep({
  formData,
  updateFormData,
  onVerify,
}: VerificationStepProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(58);
  const [canResend, setCanResend] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Auto-submit when all digits are filled
  useEffect(() => {
    const allFilled = formData.verificationCode.every(digit => digit !== '');
    if (allFilled && formData.verificationCode.length === 6) {
      handleVerify();
    }
  }, [formData.verificationCode]);

  const handleCodeChange = (idx: number, value: string) => {
    const newCode = [...formData.verificationCode];
    newCode[idx] = value.replace(/\D/g, '');
    updateFormData({ verificationCode: newCode });

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

  const handleVerify = async () => {
    setError('');
    setIsLoading(true);
    setVerificationStatus('verifying');

    try {
      const code = formData.verificationCode.join('');
      
      if (code.length !== 6) {
        const errorMsg = 'Please enter the complete 6-digit verification code.';
        setError(errorMsg);
        showAlert.error(errorMsg);
        setVerificationStatus('error');
        setIsLoading(false);
        return;
      }

      if (!user?.uid) {
        const errorMsg = 'User not found. Please restart the signup process.';
        setError(errorMsg);
        showAlert.error(errorMsg);
        setVerificationStatus('error');
        setIsLoading(false);
        return;
      }

      const isValid = await authService.verifyCode(user.uid, code);

      if (isValid) {
        setVerificationStatus('success');
        showAlert.success('✅ Account verified successfully! Welcome aboard! 🎉');
        onVerify();
        router.push('/success');
      } else {
        const errorMsg = 'Invalid verification code. Please try again.';
        setError(errorMsg);
        showAlert.error(errorMsg);
        setVerificationStatus('error');
        // Clear the code input
        updateFormData({ verificationCode: ['', '', '', '', '', ''] });
        // Focus the first input
        const firstInput = document.querySelector(`.${styles.codeDigit}:nth-child(1)`) as HTMLInputElement;
        if (firstInput) firstInput.focus();
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      const errorMsg = 'Failed to verify code. Please try again.';
      setError(errorMsg);
      showAlert.error(errorMsg);
      setVerificationStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    try {
      setIsLoading(true);
      setError('');
      
      if (!user?.email) {
        const errorMsg = 'User email not found. Please restart the signup process.';
        setError(errorMsg);
        showAlert.error(errorMsg);
        setIsLoading(false);
        return;
      }

      // Resend verification code
      await authService.sendVerificationCode(user.email);
      
      // Reset countdown
      setCountdown(58);
      setCanResend(false);
      setVerificationStatus('idle');
      
      // Clear the code input
      updateFormData({ verificationCode: ['', '', '', '', '', ''] });
      
      showAlert.success('📧 New verification code sent to your email!');
      
    } catch (error) {
      console.error('Error resending code:', error);
      const errorMsg = 'Failed to resend verification code. Please try again.';
      setError(errorMsg);
      showAlert.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Mask email for display
  const maskEmail = (email: string) => {
    if (!email) return 'j***@citygov.org';
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) return email;
    const maskedLocal = localPart[0] + '***' + localPart[localPart.length - 1];
    return `${maskedLocal}@${domain}`;
  };

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepHeader}>
        <h1 className={styles.stepTitle}>Verify Your Account</h1>
        <p className={styles.stepSubtitle}>
          Enter the 6-digit code sent to your email <strong>{maskEmail(user?.email || '')}</strong> to complete your registration.
        </p>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>⚠️</span>
          {error}
        </div>
      )}

      {verificationStatus === 'success' && (
        <div className={styles.successMessage}>
          <span className={styles.successIcon}>✅</span>
          Verification successful! Redirecting...
        </div>
      )}

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Verification Code</label>
        <div className={styles.codeInputs}>
          {formData.verificationCode.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              className={`input ${styles.codeDigit} ${verificationStatus === 'error' ? styles.codeError : ''} ${verificationStatus === 'success' ? styles.codeSuccess : ''}`}
              value={digit}
              onChange={(e) => handleCodeChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              disabled={isLoading || verificationStatus === 'success'}
              autoFocus={idx === 0}
            />
          ))}
        </div>
      </div>

      <button 
        className="button-primary" 
        onClick={handleVerify}
        disabled={isLoading || verificationStatus === 'success' || formData.verificationCode.some(d => d === '')}
      >
        {isLoading ? 'Verifying...' : 'Verify & Continue'}
      </button>

      <div className={styles.resendRow}>
        <span className={styles.resendText}>
          Didn't receive a code? 
          {canResend ? (
            <button 
              className={styles.resendLink}
              onClick={handleResendCode}
              disabled={isLoading}
            >
              Resend Code
            </button>
          ) : (
            <span className={styles.resendCountdown}>
              Resend in {countdown}s
            </span>
          )}
        </span>
      </div>
    </div>
  );
}