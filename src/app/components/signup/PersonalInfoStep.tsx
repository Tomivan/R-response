'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormData } from './SignupFlow';
import Image from 'next/image';
import Eye from '../../../../public/images/eye.svg';
import { useAuthStore } from '../../../../store/authStore';
import { authService } from '../../../../firebase/services/authService';
import showAlert from '../../../../utils/alert';
import styles from './signup.module.css';
import '../../globals.css';

interface PersonalInfoStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  onNext: () => void;
}

export default function PersonalInfoStep({
  formData,
  updateFormData,
  onNext,
}: PersonalInfoStepProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, setLoading } = useAuthStore();

  const handleContinue = async (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      const errorMsg = 'Passwords do not match.';
      setError(errorMsg);
      showAlert.error(errorMsg);
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      const errorMsg = 'Password must be at least 8 characters long.';
      setError(errorMsg);
      showAlert.error(errorMsg);
      return;
    }

    // Validate email
    if (!formData.email || !formData.email.includes('@')) {
      const errorMsg = 'Please enter a valid email address.';
      setError(errorMsg);
      showAlert.error(errorMsg);
      return;
    }

    // Validate name
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      const errorMsg = 'Please enter your full name.';
      setError(errorMsg);
      showAlert.error(errorMsg);
      return;
    }

    setIsLoading(true);
    setLoading(true);

    try {
      const userCredential = await authService.register(
        formData.email,
        formData.password,
        formData.fullName
      );

      await authService.saveUserData(userCredential.uid, {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || '',
        role: 'user',
        status: 'Active',
        createdAt: new Date().toISOString(),
      });

      // Update Zustand store
      setUser({
        uid: userCredential.uid,
        email: userCredential.email || '',
        displayName: formData.fullName,
        phoneNumber: formData.phone,
        role: 'user',
      });

      showAlert.success('Account created successfully! 🎉 Please verify your email.');
      onNext();
      
    } catch (error: any) {
      console.error('Registration error:', error);

      let errorMsg = 'Failed to create account. Please try again.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMsg = 'This email is already registered. Please login instead.';
          break;
        case 'auth/invalid-email':
          errorMsg = 'Invalid email address format.';
          break;
        case 'auth/weak-password':
          errorMsg = 'Password is too weak. Use at least 8 characters with numbers and symbols.';
          break;
        case 'auth/operation-not-allowed':
          errorMsg = 'Email/password accounts are not enabled. Please contact support.';
          break;
        default:
          errorMsg = 'Failed to create account. Please try again.';
      }
      
      setError(errorMsg);
      showAlert.error(errorMsg);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepHeader}>
        <h1 className={styles.stepTitle}>Create your account</h1>
        <p className={styles.stepSubtitle}>Join the city management infrastructure system.</p>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>⚠️</span>
          {error}
        </div>
      )}

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Full Name</label>
        <input
          type="text"
          className="input"
          placeholder="Enter your full legal name"
          value={formData.fullName}
          onChange={(e) => updateFormData({ fullName: e.target.value })}
          disabled={isLoading}
          required
        />
      </div>

      <div className="flex">
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Email Address</label>
          <input
            type="email"
            className="input"
            placeholder="work@citygov.org"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            disabled={isLoading}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Phone Number</label>
          <input
            type="tel"
            className="input"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={(e) => updateFormData({ phone: e.target.value })}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Password</label>
        <div className={styles.inputWrapper}>
          <input
            type={showPassword ? 'text' : 'password'}
            className="input"
            placeholder="********"
            value={formData.password}
            onChange={(e) => updateFormData({ password: e.target.value })}
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
        <p className={styles.formHint}>Minimum 8 characters with numbers and symbols.</p>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Confirm Password</label>
        <div className={styles.inputWrapper}>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            className="input"
            placeholder="********"
            value={formData.confirmPassword}
            onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
            disabled={isLoading}
            required
          />
          <span
            className={styles.icon}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{ cursor: 'pointer' }}
          >
            <Image src={Eye} alt="Toggle Password Visibility" />
          </span>
        </div>
      </div>

      <button 
        className="button-primary" 
        onClick={handleContinue}
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Continue →'}
      </button>

      <div className={styles.loginLink}>
        Already have an account? <a href="/login">Log in</a>
      </div>
    </div>
  );
}