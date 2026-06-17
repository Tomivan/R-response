import { useState } from 'react';
import { FormData } from './SignupFlow';
import Image from 'next/image';
import Eye from '../../../../public/images/eye.svg';
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
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={styles.stepContent}>
      <div className={styles.stepHeader}>
        <h1 className={styles.stepTitle}>Create your account</h1>
        <p className={styles.stepSubtitle}>Join the city management infrastructure system.</p>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Full Name</label>
        <input
          type="text"
          className="input"
          placeholder="Enter your full legal name"
          value={formData.fullName}
          onChange={(e) => updateFormData({ fullName: e.target.value })}
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
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Password</label>
        <div className={styles.inputWrapper}>
          <input
            type="password"
            className="input"
            placeholder="********"
            value={formData.password}
            onChange={(e) => updateFormData({ password: e.target.value })}
          />
          <span
            className={styles.icon}
            onClick={() => setShowPassword(!showPassword)}
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
            type="password"
            className="input"
            placeholder="********"
            value={formData.confirmPassword}
            onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
          />
          <span
            className={styles.icon}
            onClick={() => setShowPassword(!showPassword)}
          >
            <Image src={Eye} alt="Toggle Password Visibility" />
          </span>
        </div>
      </div>

      <button className="button-primary" onClick={onNext}>
        Continue →
      </button>

      <div className={styles.loginLink}>
        Already have an account? <a href="/login">Log in</a>
      </div>
    </div>
  );
}